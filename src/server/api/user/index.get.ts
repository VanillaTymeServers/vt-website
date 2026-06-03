import { verifyAuthToken } from "~/server/auth/authService";
import User from "~/server/models/user";

export default defineEventHandler(async (event) => {
    const authToken = getHeader(event, "Authorization");
    // console.log(`[Nuxt API] Received Auth Token: ${authToken}`);
    if (!authToken) {
        setResponseStatus(event, 401);
        return {
            error: "Unauthorized",
            description: "Unauthorized: Missing Authorization token",
        };
    }
    try {
        const userData = await verifyAuthToken(authToken);

        if (!userData) {
            setResponseStatus(event, 401);
            return { error: "Unauthorized: Invalid token" };
        }

        if (userData.error === "TokenExpired") {
            setResponseStatus(event, 401);
            return { error: "Unauthorized: Token expired" };
        }

        if (userData.error === "SessionInvalid") {
            setResponseStatus(event, 401);
            return { error: "Unauthorized: Session invalid" };
        }

        // console.log(`[Nuxt API] Authenticated User ID: ${userData.id}`);

        const user = await User.findOne({id: userData.id});
        if (!user) {
            setResponseStatus(event, 404);
            return { error: "User not found" };
        }

        // console.log(`[Nuxt API] Returning user:`, user);
        return user;
    } catch (error) {
        // console.error(`[Nuxt API] Authentication error:`, error);
        setResponseStatus(event, 500);
        return { error: "Internal server error" };
    }
});
