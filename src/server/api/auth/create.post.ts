import User from "~/server/models/user";
import { generateUserId } from "~/server/utils/id-generator";
import { isInternalCaller } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    if (!isInternalCaller(event)) {
        setResponseStatus(event, 401);
        return { error: "Unauthorized", description: "Internal callers only." };
    }

    const config = useRuntimeConfig();
    const body = await readBody(event);
    if (!body) {
        setResponseStatus(event, 400);
        return {
            error: "An error occurred",
            description: "Invalid request body.",
        };
    }

    const { uuid, username, discord, role } = body;

    if (!uuid || !username || !discord || !role) {
        setResponseStatus(event, 400);
        return {
            error: "An error occurred",
            description: "Missing required fields",
        };
    }

    if (
        typeof uuid !== "string" ||
        typeof username !== "string" ||
        typeof discord !== "string" ||
        typeof role !== "string" ||
        username.length < 3 ||
        username.length > 32
    ) {
        setResponseStatus(event, 400);
        return {
            error: "An error occurred",
            description: "Invalid field types or length",
        };
    }
    const VALID_ROLES = [
        "member",
        "supporter",
        "supporter-+",
        "supporter-++",
        "supporter-+++",
        "moderator",
        "admin",
        "developer",
    ];
    if (!VALID_ROLES.includes(role)) {
        setResponseStatus(event, 400);
        return { error: "An error occurred", description: "Invalid role" };
    }
    const existingUser = await User.findOne({ uuid });
    if (existingUser) {
        setResponseStatus(event, 400);
        return {
            error: "An error occurred",
            description: "User already exists",
        };
    }

    const userId = await generateUserId();
    const tempExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const newUser = new User({
        id: userId,
        username,
        uuid,
        discord,
        role,
        avatar_url: `https://minotar.net/helm/${uuid}.png`,
        tempExpiresAt,
    });
    await newUser.save();

    const tempLink = `${config.public.siteUrl}/auth/set-password/${userId}`;
    setResponseStatus(event, 200);
    return {
        message: "User created. Please create a password.",
        tempLink,
    };
});
