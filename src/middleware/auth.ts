const whitelistedParams = ["flow", "error"];

export default defineNuxtRouteMiddleware(async (to, from) => {
    const config = useRuntimeConfig();
    const auth = await useAuth();

    if (auth.value.user) return;

    const extractedParams: Record<string, string> = {};

    for (const param of whitelistedParams) {
        const val = to.query[param];
        if (typeof val === "string") {
            extractedParams[param] = val;
        }
    }

    const { path, query } = to;
    const queryWithoutWhitelisted: Record<string, string> = {};

    for (const [key, value] of Object.entries(query)) {
        if (!whitelistedParams.includes(key) && typeof value === "string") {
            queryWithoutWhitelisted[key] = value;
        }
    }

    const searchParams = new URLSearchParams(queryWithoutWhitelisted).toString();

    return await navigateTo(
        {
            path: "/auth/sign-in",
            query: {
                redirect: `${path}${searchParams ? "?" + searchParams : ""}`,
                ...extractedParams,
            },
        },
        { replace: true },
    );
});
