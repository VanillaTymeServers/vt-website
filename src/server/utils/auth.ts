import { H3Event, createError } from "h3";
import { INTERNAL_API_KEY, INTERNAL_ALLOWED_IPS } from "~/server/utils/secrets";
import Session from "~/server/models/session";
import User from "~/server/models/user";
import Team from "~/server/models/team";
import { isStaff } from "~/helpers/users";

export async function authenticateUser(event: H3Event, requireStaff = false) {
    const authHeader = event.node.req.headers.authorization;
    if (!authHeader) {
        return false;
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token.startsWith("vta_")) {
        return false;
    }

    const session = await Session.findOne({ token });

    if (!session || session.expiresAt < new Date()) {
        return false;
    }

    const user = await User.findOne(
        { id: session.id },
        { __v: 0, password: 0, _id: 0 },
    );
    if (!user || user.status !== "active") {
        return false;
    }
    if (requireStaff && !isStaff(user)) {
        return false;
    }
    const teams = await Team.find(
        { user: user.id, accepted: true },
        { _id: 0, __v: 0, user: 0 },
    );

    return { ...user.toObject(), teams };
}

export function isInternalCaller(event: H3Event): boolean {
    const provided = event.node.req.headers["x-internal-api-key"];
    if (typeof provided !== "string" || provided.length === 0) return false;
    if (!timingSafeEqualString(provided, INTERNAL_API_KEY)) return false;

    if (INTERNAL_ALLOWED_IPS.length > 0) {
        const ip = getRequestIP(event, { xForwardedFor: false });
        if (!ip || !INTERNAL_ALLOWED_IPS.includes(ip)) return false;
    }

    return true;
}

function timingSafeEqualString(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
}
