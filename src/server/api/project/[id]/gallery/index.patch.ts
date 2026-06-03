import { authenticateUser } from "~/server/utils/auth";
import Project from "~/server/models/project";

export default defineEventHandler(async (event) => {
    const user = await authenticateUser(event);
    if (!user) {
        setResponseStatus(event, 401);
        return {
            error: "Unauthorized",
            description: "Missing Authorization token",
        };
    }

    const projectId = getRouterParam(event, "id");

    const project = await Project.findOne({
        $or: [{ id: projectId }, { slug: projectId }],
    });

    if (!project) {
        setResponseStatus(event, 404);
        return {
            error: "Not Found",
            description: "The specified project does not exist.",
        };
    }

    const isUserInProject = user.teams.some(
        (team) =>
            team.team_id === project.team &&
            team.permissions.EDIT_DETAILS === true,
    );

    if (!isUserInProject) {
        setResponseStatus(event, 403);
        return {
            error: "Forbidden",
            description: "You do not have permission to edit this shop.",
        };
    }

    const query = getQuery(event);
    const url = typeof query.url === "string" ? query.url : null;

    if (!url || !url.startsWith("https://cdn.vanillatyme.com/")) {
        setResponseStatus(event, 400);
        return {
            error: "Invalid or missing 'url'",
            description: "A valid image URL is required to find the image.",
        };
    }

    const galleryImage = project.gallery.find((img) => img.url === url);

    if (!galleryImage) {
        setResponseStatus(event, 404);
        return {
            error: "Image not found",
            description: "No matching image found in gallery.",
        };
    }

    // Optional fields to patch
    if ("featured" in query) {
        galleryImage.featured = query.featured === "true";
    }

    if ("title" in query && typeof query.title === "string") {
        galleryImage.title = query.title;
    }

    if ("description" in query && typeof query.description === "string") {
        galleryImage.description = query.description;
    }

    if (
        "ordering" in query &&
        typeof query.ordering === "string" &&
        !isNaN(parseInt(query.ordering))
    ) {
        galleryImage.ordering = parseInt(query.ordering);
    }

    await project.save();

    return {
        success: true,
        image: galleryImage,
    };
});
