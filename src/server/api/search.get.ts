import { defineEventHandler, getQuery } from "h3";
import Project from "~/server/models/project";
import Team from "~/server/models/team";
import User from "~/server/models/user";

const ALLOWED_FACET_KEYS = new Set(["project_type", "categories", "stall"]);

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Extract pagination parameters
    const offset = query.offset ? parseInt(query.offset as string, 10) : 0;
    const limit = query.limit ? parseInt(query.limit as string, 10) : 20; // Default limit: 20

    // Extract status filter (default: only "approved" and "archived")
    const allowedStatuses = ["approved", "archived"];
    const statusFilter = query.status
        ? query.status
              .toString()
              .split(",")
              .filter((status) => allowedStatuses.includes(status))
        : allowedStatuses;

    // Extract and parse 'facets' from query parameters
    let facets: Record<string, any> = {};

    if (query.facets) {
        try {
            const facetArray = JSON.parse(query.facets as string);
            for (const facetGroup of facetArray) {
                for (const facet of facetGroup) {
                    const { key, operator, value } = parseFacet(facet);
                    if (!ALLOWED_FACET_KEYS.has(key)) continue;
                    if (operator === "!=") {
                        if (facets[key]?.$nin) {
                            facets[key].$nin.push(value);
                        } else {
                            facets[key] = { $nin: [value] };
                        }
                    } else if (operator === "=") {
                        if (facets[key]?.$in) {
                            facets[key].$in.push(value);
                        } else if (facets[key] !== undefined) {
                            facets[key] = { $in: [facets[key], value] };
                        } else {
                            facets[key] = value;
                        }
                    }
                }
            }
        } catch (error) {
            console.error("[search/facets]", error);
            return {
                success: false,
                message: "Invalid facets format",
            };
        }
    }

    // Handle full-text search via `query`
    if (query.query) {
        const searchText = escapeRegex(query.query.toString().slice(0, 200));
        facets["$or"] = [
            { title: { $regex: searchText, $options: "i" } },
            { description: { $regex: searchText, $options: "i" } },
    ];
    }

    try {
        // Build MongoDB query
        const filterQuery: any = { status: { $in: statusFilter }, ...facets };
        // Fetch from MongoDB
        const total_hits = await Project.countDocuments(filterQuery);
        const projects = await Project.find(filterQuery)
            .skip(offset)
            .limit(limit)
            .lean();

        // Get all team IDs from the projects
        const teamIds = projects.map((project) => project.team);

        // Fetch the owner (`user` where `is_owner: true`) for each team
        const teamOwners = await Team.find(
            { team_id: { $in: teamIds }, is_owner: true },
            { team_id: 1, user: 1 }, // Only fetch the team_id and user fields
        ).lean();

        // Create a lookup for team owners (team_id -> user ID)
        const ownerMap: Record<string, string> = {};
        teamOwners.forEach((owner) => {
            ownerMap[owner.team_id] = owner.user; // user is the ID field in User model
        });

        // Get unique user IDs from teamOwners to fetch usernames
        const userIds = [...new Set(teamOwners.map((owner) => owner.user))];

        // Fetch usernames for those user IDs using `id`, not `_id`
        const users = await User.find(
            { id: { $in: userIds } }, // Query by `id`, not `_id`
            { id: 1, username: 1 },
        ).lean();

        // Create a lookup for usernames (user ID -> username)
        const usernameMap: Record<string, string> = {};
        users.forEach((user) => {
            usernameMap[user.id] = user.username; // Use `id`, not `_id`
        });

        // Enhance projects with the `author` field (set to username)
        const enhancedProjects = projects.map((project) => {
            const author = usernameMap[ownerMap[project.team]] || null;

            const featuredImage = Array.isArray(project.gallery)
                ? project.gallery.find((img) => img.featured && img.url)
                : null;

            return {
                ...project,
                author,
                featured_gallery: featuredImage?.url ?? null,
                color: project.color ?? null,
            };
        });

        return {
            hits: enhancedProjects,
            offset,
            limit,
            total_hits,
        };
    } catch (error) {
        console.error("[search]", error);
        return {
            success: false,
            message: "Error fetching search results",
        };
    }
});

/**
 * Parses a facet into key, operator, and value.
 * - Converts `"stall!=true"` → `{ key: "stall", operator: "!=", value: "true" }`
 * - Converts `"categories:redstone"` → `{ key: "categories", operator: "=", value: "redstone" }`
 */
function parseFacet(facet: string): {
    key: string;
    operator: string;
    value: string;
} {
    const match = facet.match(/^(.*?)(!=|:)(.*)$/);
    if (match) {
        return {
            key: match[1], // Keep the key as it is
            operator: match[2] === ":" ? "=" : "!=",
            value: match[3],
        };
    }
    return { key: facet, operator: "=", value: "" };
}
