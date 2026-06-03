import { authenticateUser } from "~/server/utils/auth";
import Project from "~/server/models/project";
import { validateSlug } from "~/server/utils/validators";
import { generateProjectId, generateTeamId } from "../../utils/id-generator";
import Team from "../../models/team";

export default defineEventHandler(async (event) => {
    const user = await authenticateUser(event);
    if (!user) {
        setResponseStatus(event, 401);
        return {
            error: "Unauthorized",
            description: "Missing Authorization token",
        };
    }

    // ✅ Read multipart form data
    const formData = await readMultipartFormData(event);
    if (!formData) {
        setResponseStatus(event, 400);
        return { error: "Bad Request", description: "Form data is missing." };
    }

    // ✅ Extract `data` field
    const dataField = formData
        .find((field) => field.name === "data")
        ?.data?.toString();
    if (!dataField) {
        setResponseStatus(event, 400);
        return { error: "Bad Request", description: "Missing 'data' field." };
    }

    // ✅ Parse JSON `data`
    let data;
    try {
        data = JSON.parse(dataField);
    } catch (error) {
        setResponseStatus(event, 400);
        return {
            error: "Bad Request",
            description: "Invalid JSON format in 'data' field.",
        };
    }


    // ✅ Extract project properties
    const {
        title,
        slug,
        description,
        body = "",
        categories = [],
        team_member,
        shop_type = "stall",
        requested_status,
    } = data;

    if (typeof title !== "string") {
        setResponseStatus(event, 400);
        return { error: "Bad Request", description: "Title must be a string." };
    } else if (title.length < 3 || title.length > 64) {
        setResponseStatus(event, 400);
        return {
            error: "Bad Request",
            description: `Title must be between 3 and 64 characters. (Current length: ${title.length})`,
        };
    }

    if (typeof description !== "string") {
        setResponseStatus(event, 400);
        return {
            error: "Bad Request",
            description: "Description must be a string.",
        };
    } else if (description.length < 3 || description.length > 256) {
        setResponseStatus(event, 400);
        return {
            error: "Bad Request",
            description: `Description must be between 3 and 256 characters. (Current length: ${description.length})`,
        };
    }

    if (slug && !validateSlug(slug)) {
        setResponseStatus(event, 400);
        return {
            error: "Bad Request",
            description:
                "Slug must be a URL-safe string between 3 and 64 characters.",
        };
    }
    const checkSlug = await Project.findOne({ slug });
    if (checkSlug) {
        setResponseStatus(event, 409);
        return {
            error: "An error occurred",
            description: "Slug is already taken!",
        };
    }

    try {
        const teamId = await generateTeamId();
        const newTeam = new Team({
            role: "Owner",
            team_id: teamId,
            user: team_member.user_id,
            permissions: {
                EDIT_BODY: true,
                MANAGE_INVITES: true,
                REMOVE_MEMBER: true,
                EDIT_MEMBER: true,
                DELETE_PROJECT: true,
                VIEW_ANALYTICS: true,
            },
            accepted: true,
            ordering: 0,
            is_owner: true,
        });
        await newTeam.save();
        const id = await generateProjectId();
        const newProject = new Project({
            id,
            team: teamId,
            project_type: "shop",
            stall: true,
            title,
            description,
            status: "draft",
            requested_status,
            slug,
            body: " ",
            categories: categories || [],
            additional_categories: [],
        });
        await newProject.save();
        setResponseStatus(event, 200);
        return newProject;
    } catch (error: any) {
        console.error("[project/create]", error);
        setResponseStatus(event, 500);
        return {
            error: "An error occurred",
            description: "An internal error occurred.",
        };
    }
});
