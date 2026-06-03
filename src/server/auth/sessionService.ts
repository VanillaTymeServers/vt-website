import jwt from "jsonwebtoken";
import Session from "~/server/models/session";
import { JWT_SECRET } from "~/server/utils/secrets";
const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function refreshSession(userId: string, oldToken: string) {
    try {
        // Find the existing session in MongoDB
        const session = await Session.findOne({ token: oldToken });

        if (!session) {
            console.log(
                `[SessionService] No session found for token: ${oldToken}`,
            );
            return null;
        }

        if (session.expiresAt < new Date()) {
            console.log(`[SessionService] Session expired for user: ${userId}`);
            return null;
        }

        // Generate a new token
        const newToken = `vta_${jwt.sign({ id: userId }, JWT_SECRET, {
            expiresIn: "7d",
        })}`;

        // Remove old session
        await Session.deleteOne({ token: oldToken });

        // Create a new session
        const newSession = await Session.create({
            id: userId,
            token: newToken,
            expiresAt: new Date(Date.now() + SESSION_EXPIRY),
        });

        return {
            session: newSession.token,
            user: {
                id: userId,
            },
            expires_at: newSession.expiresAt,
        };
    } catch (error) {
        console.error(`[SessionService] Error refreshing session:`, error);
        return null;
    }
}
