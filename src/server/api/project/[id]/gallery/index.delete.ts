import { authenticateUser } from "~/server/utils/auth";
import Project from "~/server/models/project";
import { s3Client, S3_BUCKET } from "~/server/utils/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

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
            description: "A valid image URL is required.",
        };
    }

    // Extract both S3 keys
    const parsed = new URL(url);
    const resizedKey = decodeURIComponent(parsed.pathname.slice(1)); // removes leading slash
    const rawKey = resizedKey.replace(/_350\.webp$/, ".webp");

    try {
        // Delete both _350 and raw image
        await Promise.all([
            s3Client.send(
                new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: resizedKey }),
            ),
            s3Client.send(
                new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: rawKey }),
            ),
        ]);
    } catch (err) {
        console.error("S3 deletion error:", err);
        setResponseStatus(event, 500);
        return {
            error: "Failed to delete image from S3",
            description: err?.message || "S3 error occurred.",
        };
    }

    // Remove from project.gallery
    const index = project.gallery.findIndex((img) => img.url === url);
    if (index === -1) {
        setResponseStatus(event, 404);
        return {
            error: "Not Found",
            description: "No matching image found in gallery.",
        };
    }

    project.gallery.splice(index, 1);
    await project.save();

    setResponseStatus(event, 204);
    return null;
});
