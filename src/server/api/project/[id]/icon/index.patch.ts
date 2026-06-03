import { authenticateUser } from "~/server/utils/auth";
import Project from "~/server/models/project";
import { s3Client, S3_BUCKET } from "~/server/utils/s3Client";
import { PutObjectCommand, DeleteObjectCommand, S3 } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { buffer } from "node:stream/consumers";
import sharp from "sharp";

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

    const allowedExtensions = ["png", "jpg", "jpeg", "bmp", "gif", "webp"];

    const extRaw = getQuery(event).ext;
    const ext =
        typeof extRaw === "string"
            ? extRaw
            : Array.isArray(extRaw)
              ? extRaw[0]
              : undefined;
    if (!ext || !allowedExtensions.includes(ext)) {
        setResponseStatus(event, 400);
        return {
            error: "Invalid image extension",
            description: `Allowed extensions are: ${allowedExtensions.join(", ")}`,
        };
    }

    if (project.icon_url && project.icon_url !== "") {
        try {
            const url = new URL(project.icon_url);
            const oldKey = decodeURIComponent(url.pathname).slice(1);

            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: oldKey,
                }),
            );
        } catch (error) {
            console.error("Failed to delete old icon:", error);
        }
    }
    const webStream = getRequestWebStream(event);
    const buf = await buffer(webStream);

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (buf.length > MAX_SIZE) {
        setResponseStatus(event, 413);
        return {
            error: "File too large",
            description: "Image must be under 5 MB.",
        };
    }
    if (!buf || buf.length === 0) {
        setResponseStatus(event, 400);
        return {
            error: "Invalid request body",
            description: "Expected raw binary image data.",
        };
    }
    // Convert to WebP
    const webpBuffer = await sharp(buf).webp({ quality: 90 }).toBuffer();

    const newKey = `data/${project.id}/icon/${randomUUID().replace(/-/g, "")}.webp`;

    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: newKey,
                Body: webpBuffer,
                ContentType: "image/webp",
                CacheControl: "public, max-age=31536000",
                ContentEncoding: "identity",
            }),
        );

        project.icon_url = `https://cdn.vanillatyme.com/${newKey}`;

        // Compute dominant color from the already-processed buffer
        try {
            const { data } = await sharp(webpBuffer)
                .resize(32, 32, { fit: "inside" })
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true });

            const colorCount: Record<string, number> = {};
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                if (a < 128) continue;
                const key = `${r},${g},${b}`;
                colorCount[key] = (colorCount[key] || 0) + 1;
            }

            const mostFrequent = Object.entries(colorCount).sort(
                (a, b) => b[1] - a[1],
            )[0];
            if (mostFrequent) {
                const [r, g, b] = mostFrequent[0].split(",").map(Number);
                project.color = (r << 16) | (g << 8) | b;
            }
        } catch (err) {
            console.error("Failed to compute icon color:", err);
        }

        await project.save();

        return {
            icon_url: project.icon_url,
            color: project.color ?? null,
        };
    } catch (error) {
        console.error("Failed to upload new icon:", error);
        setResponseStatus(event, 500);
        return {
            error: "Internal Server Error",
            description: "Failed to upload the new icon.",
        };
    }
});
