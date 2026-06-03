import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import Session from "~/server/models/session";
import { JWT_SECRET } from "~/server/utils/secrets";

interface AuthResult {
    id?: string;
    username?: string;
    error?: string;
}

export async function verifyAuthToken(token: string): Promise<AuthResult> {
    try {
        const tokenWithPrefix = token.replace(/^Bearer\s/, "");
        let parsedToken = token.replace(/^Bearer\s/, "");

        if (!parsedToken.startsWith("vta_")) {
            return { error: "InvalidToken" };
        }
        parsedToken = parsedToken.substring(4);

        const decoded = jwt.verify(parsedToken, JWT_SECRET, {
            ignoreExpiration: false,
        }) as JwtPayload;
        if (!decoded.id) {
            return { error: "InvalidToken" };
        }

        const session = await Session.findOne({ token: tokenWithPrefix });

        if (!session) {
            return { error: "SessionInvalid" };
        }

        if (session.expiresAt < new Date()) {
            return { error: "SessionExpired" };
        }

        return { id: decoded.id, username: decoded.username };
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return { error: "TokenExpired" };
        }

        return { error: "InvalidToken" };
    }
}
