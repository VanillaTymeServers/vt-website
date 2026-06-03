import Session from "~/server/models/session";
import { authenticateUser } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    const user = await authenticateUser(event);
    if (!user) {
        setResponseStatus(event, 401);
        return { error: "Unauthorized" };
    }

    const token = getRouterParam(event, "token");
    if (!token) {
        setResponseStatus(event, 400);
        return { error: "Missing token." };
    }

    const session = await Session.findOne({ token });

    if (!session) {
        setResponseStatus(event, 404);
        return { error: "Session not found." };
    }

    // Ensure the session belongs to the requesting user
    if (session.id !== user.id) {
        setResponseStatus(event, 403);
        return { error: "Forbidden" };
    }

    await Session.deleteOne({ token });

    setResponseStatus(event, 200);
    return { message: "Logged out successfully." };
});
