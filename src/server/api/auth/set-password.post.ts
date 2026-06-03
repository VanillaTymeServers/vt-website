import bcrypt from "bcryptjs";
import User from "~/server/models/user";
import jwt from "jsonwebtoken";
import Session from "~/server/models/session";
import { JWT_SECRET, HCAPTCHA_SECRET } from "~/server/utils/secrets";

// Password Validation Function
const isPasswordStrong = (password: string) => {
    const lengthRequirement = password.length >= 8;
    const uppercaseRequirement = /[A-Z]/.test(password);
    const lowercaseRequirement = /[a-z]/.test(password);
    const numberRequirement = /\d/.test(password);
    const specialCharRequirement = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        lengthRequirement &&
        uppercaseRequirement &&
        lowercaseRequirement &&
        numberRequirement &&
        specialCharRequirement
    );
};

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

const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000;
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body) {
        setResponseStatus(event, 400);
        return {
            error: "An error occurred",
            description: "Invalid request body.",
        };
    }
    const { id, password, challenge } = body;

    if (!id || !password || !challenge) {
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
    if (!isPasswordStrong(password)) {
        setResponseStatus(event, 400);
        return {
            error: "An error occurred",
            description:
                "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.",
        };
    }
    try {
        const user = await User.findOne({
            id,
        });
        if (!user || user.password) {
            setResponseStatus(event, 404);
            return {
                error: "An error occurred",
                description: "User not found or password already set.",
            };
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        await User.updateOne(
            { id },
            {
                $set: { password: hashedPassword, status: "active" },
                $unset: { tempExpiresAt: "" },
            },
        );

        const token = `vta_${jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" },
        )}`;

        const newSession = new Session({
            id: user.id,
            token,
            expiresAt: new Date(Date.now() + SESSION_EXPIRY),
        });

        await newSession.save();
        const redirectUrl = `/auth/welcome?authToken=${token}&new_account=true`;
        setResponseStatus(event, 200);
        return {
            session: token,
            user: {
                id: user.id,
                username: user.username,
                uuid: user.uuid,
                discord: user.discord,
            },
            expires_at: newSession.expiresAt,
            redirect: redirectUrl,
        };
    } catch (err: any) {
        setResponseStatus(event, 500);
        return {
            error: "An error occurred",
            description: err.data ? err.data.description : err,
        };
    }
});
