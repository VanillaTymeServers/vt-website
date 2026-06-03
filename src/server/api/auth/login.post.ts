import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "~/server/models/user";
import Session from "~/server/models/session";
import { JWT_SECRET, HCAPTCHA_SECRET } from "~/server/utils/secrets";

const verifyCaptcha = async (token: string): Promise<boolean> => {
    try {
        const response = await fetch("https://hcaptcha.com/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: HCAPTCHA_SECRET,
                response: token,
            }),
        });
        const data = await response.json();
        return data.success;
    } catch {
        return false;
    }
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body) {
        setResponseStatus(event, 400);
        return {
            error: "An error occurred",
            description: "Invalid request body.",
        };
    }
    const { username, password, challenge } = body;

    if (!username || !password || !challenge) {
        setResponseStatus(event, 400);
        return {
            error: "An error occurred",
            description: "Missing required fields",
        };
    }
    const isValidCaptcha = await verifyCaptcha(challenge);
    if (!isValidCaptcha) {
        setResponseStatus(event, 400);
        return {
            error: "An error occurred",
            description: "CAPTCHA verification failed",
        };
    }

    try {
        let user = await User.findOne({ username });

        if (!user || !user.password) {
            setResponseStatus(event, 401);
            return {
                error: "An error occurred",
                description: "Invalid username or password",
            };
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            setResponseStatus(event, 401);
            return {
                error: "An error occurred",
                description: "Invalid username or password",
            };
        }
        const token = `vta_${jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" },
        )}`;
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const session = new Session({
            id: user.id,
            token,
            expiresAt,
        });
        await session.save();
        setResponseStatus(event, 200);
        return {
            session: token,
            expires_at: expiresAt.toISOString(),
            user: {
                id: user.id,
            },
        };
    } catch (err: any) {
        setResponseStatus(event, 500);
        return { error: "Server error", description: err.message };
    }
});
