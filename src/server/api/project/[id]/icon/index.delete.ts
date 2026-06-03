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
            error: "Shop not found",
            description: "The specified shop does not exist.",
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

    if (project.icon_url && project.icon_url !== "") {
        try {
            const url = new URL(project.icon_url)
            const oldKey = decodeURIComponent(url.pathname.slice(1));

            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: oldKey,
                })
            )
            project.icon_url = "";
            project.color = undefined;
            await project.save();
            setResponseStatus(event, 204);
            return {
                icon_url: project.icon_url
            }
        } catch (error) {
            console.error("Error deleting old icon:", error);
            setResponseStatus(event, 500);
            return {
                error: "Internal Server Error",
                description: "Failed to delete the shop icon.",
            };
        }
    }
})