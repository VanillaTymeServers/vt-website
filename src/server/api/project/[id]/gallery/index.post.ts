import { authenticateUser } from "~/server/utils/auth";
import Project from "~/server/models/project";
import { s3Client, S3_BUCKET } from "~/server/utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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

    const allowedExtensions = [
        "png",
        "jpg",
        "jpeg",
        "bmp",
        "gif",
        "webp",
    ];

    const query = getQuery(event);
    const extRaw = query.ext;
    const ext =
        typeof extRaw === "string"
            ? extRaw
            : Array.isArray(extRaw)
              ? extRaw[0]
              : undefined;

    if (!ext || !allowedExtensions.includes(ext)) {
        setResponseStatus(event, 400);
        return {
            error: "Invalid extension",
            description: `Allowed extensions: ${allowedExtensions.join(", ")}`,
        };
    }

    const featuredRaw = query.featured;

    if (
        typeof featuredRaw !== "string" ||
        !["true", "false"].includes(featuredRaw)
    ) {
        setResponseStatus(event, 400);
        return {
            error: "Missing or invalid 'featured'",
            description:
                "`featured` is required and must be either 'true' or 'false'.",
        };
    }

    const featured = featuredRaw === "true";

    const title = typeof query.title === "string" ? query.title : "";
    const description =
        typeof query.description === "string" ? query.description : "";
    const ordering =
        typeof query.ordering === "string" ? parseInt(query.ordering) : 0;

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
            error: "Empty body",
            description: "No image was provided.",
        };
    }

    let fullBuffer: Buffer;
    let thumbBuffer: Buffer;
    try {
        fullBuffer = await sharp(buf).webp({ quality: 90 }).toBuffer();
        thumbBuffer = await sharp(buf)
            .resize({ width: 350 }) // fit inside 350px width, maintain aspect
            .webp({ quality: 90 })
            .toBuffer();
    } catch (err) {
        console.error("Image conversion failed:", err);
        setResponseStatus(event, 400);
        return {
            error: "Image conversion failed",
            description: "The provided image could not be processed.",
        };
    }
    const baseKey = `data/${project.id}/images/${randomUUID().replace(/-/g, "")}`;
    const fullKey = `${baseKey}.webp`;
    const resizedKey = `${baseKey}_350.webp`;

    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: fullKey,
                Body: fullBuffer,
                ContentType: "image/webp",
                CacheControl: "public, max-age=31536000",
                ContentEncoding: "identity",
            }),
        );

        await s3Client.send(
            new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: resizedKey,
                Body: thumbBuffer,
                ContentType: "image/webp",
                CacheControl: "public, max-age=31536000",
                ContentEncoding: "identity",
            }),
        );

        const galleryItem = {
            url: `https://cdn.vanillatyme.com/${resizedKey}`,
            raw_url: `https://cdn.vanillatyme.com/${fullKey}`,
            featured,
            title,
            description,
            created: new Date(),
            ordering,
        };

        project.gallery.push(galleryItem);
        await project.save();

        return { success: true, image: galleryItem };
    } catch (err: any) {
        console.error("S3 upload failed:", err?.message || err);
        setResponseStatus(event, 500);
        return {
            error: "Upload failed",
            description: err?.message || "Could not upload image to S3.",
        };
    }
});
