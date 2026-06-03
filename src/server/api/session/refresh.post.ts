import { verifyAuthToken } from "~/server/auth/authService";
import { refreshSession } from "~/server/auth/sessionService";

export default defineEventHandler(async (event) => {
    const authToken = getHeader(event, "Authorization");

    // console.log(`[Nuxt API] Received Auth Token for refresh: ${authToken}`);

    if (!authToken) {
        setResponseStatus(event, 401);
        return { error: "Unauthorized: Missing token" };
    }

    // Verify the existing token
    const userData = await verifyAuthToken(authToken);

    // Ensure `userData.id` exists and is a string
    if (!userData || userData.error || !userData.id) {
        setResponseStatus(event, 401);
        return { error: "Unauthorized: Invalid or expired token" };
    }

    try {
        // Refresh the session and generate a new token
        const newSession = await refreshSession(String(userData.id), authToken);

        if (!newSession) {
            setResponseStatus(event, 401);
            return { error: "Unauthorized: Session refresh failed" };
        }

        // console.log(`[Nuxt API] New session created for user: ${userData.id}`);
        return newSession;
    } catch (error) {
        // console.error(`[Nuxt API] Error refreshing session:`, error);
        setResponseStatus(event, 500);
        return { error: "Internal server error" };
    }
});
