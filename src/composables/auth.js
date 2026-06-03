function normalizeAuthToken(value) {
    if (typeof value === 'string') {
        return value
    }
    return ''
}

export const useAuth = async (oldToken = null) => {
    // console.log("[useAuth] Called with oldToken:", oldToken);

    const auth = useState("auth", () => ({
        user: null,
        token: "",
        headers: {},
    }));

    // console.log("[useAuth] Current auth state:", auth.value);

    if (!auth.value.user || oldToken) {
        // console.log("[useAuth] Reinitializing auth...");
        auth.value = await initAuth(oldToken);
        // console.log("[useAuth] New auth state after initAuth:", auth.value);
    }

    return auth;
};

export const initAuth = async (oldToken = null) => {
    // console.log("[initAuth] Called with oldToken:", oldToken);

    const auth = {
        user: null,
        token: "",
    };

    if (oldToken === "none") {
        // console.log(
        //     "[initAuth] No authentication needed (oldToken is 'none').",
        // );
        return auth;
    }

    const route = useRoute();
    const authCookie = useCookie("auth-token", {
        maxAge: 60 * 60 * 24 * 365 * 10,
        sameSite: "lax",
        secure: true,
        httpOnly: false,
        path: "/",
    });

    // console.log("[initAuth] Current auth-token cookie:", authCookie.value);

    if (oldToken) {
        // console.log("[initAuth] Setting auth-token cookie from oldToken...");
        const normalized = normalizeAuthToken(oldToken);
        if (normalized) {
            authCookie.value = normalized;
        }
    }

    const oauthCode = normalizeAuthToken(route.query.code);
    if (oauthCode && !route.fullPath.includes("new_account=true")) {
        // console.log(
        //     "[initAuth] Setting auth-token from route query.code:",
        //     route.query.code,
        // );
        authCookie.value = oauthCode;
    }

    if (
        route.fullPath.includes("new_account=true") &&
        route.path !== "/auth/welcome"
    ) {
        // console.log("[initAuth] Redirecting to auth welcome page...");
        const redirect = route.path.startsWith("/auth/")
            ? null
            : route.fullPath;
        await navigateTo(
            `/auth/welcome?authToken=${route.query.code}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`,
        );
    }

    const tokenStr = normalizeAuthToken(authCookie.value);

    if (authCookie.value != null && tokenStr === '') {
        authCookie.value = null
    } else if (tokenStr) {
        auth.token = tokenStr;
        // console.log("[initAuth] Auth token from cookie:", auth.token);

        if (!auth.token || !auth.token.startsWith("vta_")) {
            // console.log(
            //     "[initAuth] Invalid token format, returning empty auth.",
            // );
            return auth;
        }

        try {
            // console.log("[initAuth] Fetching user data with auth token...");
            auth.user = await useBaseFetch(
                "user",
                {
                    headers: {
                        Authorization: auth.token,
                    },
                },
                true,
            );
            // console.log("[initAuth] User fetched successfully:", auth.user);
        } catch (error) {

        }
    }

    if (!auth.user && auth.token && typeof auth.token === "string") {
        try {
            // console.log("[initAuth] Refreshing session...");
            const session = await useBaseFetch(
                "session/refresh",
                {
                    method: "POST",
                    headers: {
                        Authorization: auth.token,
                    },
                },
                true,
            );

            // console.log("[initAuth] New session received:", session);
            auth.token = normalizeAuthToken(session.session);
            if (auth.token) {
                authCookie.value = auth.token;
                // console.log(
                //     "[initAuth] Fetching user again after session refresh...",
                // );
                auth.user = await useBaseFetch(
                    "user",
                    {
                        headers: {
                            Authorization: auth.token,
                        },
                    },
                    true,
                );
            } else {
                authCookie.value = null;
                auth.token = "";
            }

        } catch (error) {
            // console.error("[initAuth] Session refresh failed:", error);
            authCookie.value = null;
        }
    }

    // console.log("[initAuth] Final auth object:", auth);
    return auth;
};

export const getSignInRedirectPath = (route) => {
    const fullPath = route.fullPath
    if (fullPath === '/auth' || fullPath.startsWith('/auth/')) {
        return '/dashboard'
    }
    return fullPath
}

export const getSignInRouteObj = (route, redirectOverride) => ({
    path: '/auth/sign-in',
    query: {
        redirect: redirectOverride ?? getSignInRedirectPath(route),
    },
})

export const getAuthUrl = (provider, redirect = "") => {
    // console.log(
    //     "[getAuthUrl] Called with provider:",
    //     provider,
    //     "and redirect:",
    //     redirect,
    // );

    const config = useRuntimeConfig();
    const route = useNativeRoute();

    if (redirect === "") {
        redirect = route.path;
    }

    let fullURL;
    if (route.query.launcher) {
        fullURL = `https://launcher-files.modrinth.com`;
    } else {
        fullURL = `${config.public.siteUrl}${encodeURIComponent(redirect)}`;
    }

    // console.log("[getAuthUrl] Full URL:", fullURL);

    return `${config.public.apiBaseUrl}auth/init?provider=${provider}&url=${encodeURIComponent(fullURL)}`;
};

export const removeAuthProvider = async (provider) => {
    // console.log("[removeAuthProvider] Removing provider:", provider);

    startLoading();
    const auth = await useAuth();
    // console.log("[removeAuthProvider] Current auth state:", auth.value);

    await useBaseFetch("auth/provider", {
        method: "DELETE",
        body: {
            provider,
        },
    });

    // console.log(
    //     "[removeAuthProvider] Provider removed successfully, refreshing auth...",
    // );
    await useAuth(auth.value.token);
    stopLoading();
};
