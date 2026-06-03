// Centralizes secret loading so missing env vars fail loudly at startup
function required(name: string): string {
    const v = process.env[name];
    if (!v || v.length < 16) {
        throw new Error(
            `Environment variable ${name} is required and must be at least 16 chars`,
        );
    }
    return v;
}

export const JWT_SECRET = required("JWT_SECRET");
export const HCAPTCHA_SECRET = required("HCAPTCHA_SECRET");
export const INTERNAL_API_KEY = required("INTERNAL_API_KEY");

export const INTERNAL_ALLOWED_IPS: string[] = (
    process.env.INTERNAL_ALLOWED_IPS ?? ""
)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);