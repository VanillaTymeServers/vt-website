// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from "vite-svg-loader";
import { resolve, basename, relative } from "pathe";
import { promises as fs } from "fs";
import Category from "./src/server/models/category";
import ReportType from "./src/server/models/report_type";
import Project from "./src/server/models/project";
import User from "./src/server/models/user";
import Team from "./src/server/models/team";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    debug: false,
    srcDir: "src/",
    css: ["~/assets/styles/tailwind.css", "~/assets/styles/omorphia.scss"],
    modules: ["nuxt-mongoose", "@scalar/nuxt", "nuxt-tiptap-editor", "nuxt-color-picker"],
    tiptap: { prefix: "tiptap" },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    nitro: {
        experimental: {
            openAPI: true,
        },
    },
    typescript: {
        shim: false,
        strict: true,
        typeCheck: false,
        tsConfig: {
            compilerOptions: {
                moduleResolution: "bundler",
                allowImportingTsExtensions: true,
            },
        },
    },
    vite: {
        define: {
            global: {},
        },
        esbuild: {
            define: {
                global: "globalThis",
            },
        },
        cacheDir: "node_modules/.vite/apps/vanillatyme",
        resolve: {
            dedupe: ["vue"],
        },
        plugins: [
            svgLoader({
                svgoConfig: {
                    plugins: [
                        {
                            name: "preset-default",
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                },
                            },
                        },
                    ],
                },
            }),
        ],
    },
    hooks: {
        async "build:before"() {
            // 30 minutes
            const TTL = 30 * 60 * 1000;

            let state: {
                lastGenerated?: string;
                apiUrl?: string;
                categories?: any[];
                reportTypes?: any[];
                homePageProjects?: any[];
                homePageSearch?: any[];
                homePageNotifs?: any[];
                errors?: number[];
            } = {};
            try {
                state = JSON.parse(
                    await fs.readFile("./src/generated/state.json", "utf-8"),
                );
            } catch {
                await fs.mkdir("./src/generated", { recursive: true });
            }

            const API_URL = process.env.API_URL ?? "http://localhost:3000/api/";
            console.log(API_URL);

            if (
                // Skip regeneration if within TTL...
                state.lastGenerated &&
                new Date(state.lastGenerated).getTime() + TTL >
                    new Date().getTime() &&
                // ...but only if the API URL is the same
                state.apiUrl === API_URL
            ) {
                return;
            }

            state.lastGenerated = new Date().toISOString();
            state.apiUrl = API_URL;

            const headers = {
                headers: {
                    "user-agent": "VanillaTyme generator",
                },
            };

            const caughtErrorCodes = new Set<number>();

            function handleFetchError(err: any, defaultValue: any) {
                const status = err?.status ?? err?.response?.status ?? 500;
                console.error("Error generating state:", err.message || err);
                caughtErrorCodes.add(status);
                return defaultValue;
            }

            const [
                categories,
                reportTypes,
                homePageProjects,
                homePageSearch,
                homePageNotifs,
            ] = await Promise.all([
                Category.find({}).catch((err) => handleFetchError(err, [])),
                ReportType.find({}).catch((err) => handleFetchError(err, [])),
                Project.aggregate([
                    {
                        $match: {
                            status: { $in: ["approved", "archived"] },
                        },
                    },
                    { $sample: { size: 60 } },
                ]).catch((err) => handleFetchError(err, [])),
                (async () => {
                    const queryText = "leave";
                    const limit = 3;

                    try {
                        const filterQuery = {
                            $text: { $search: queryText },
                            status: { $in: ["approved", "archived"] },
                        };

                        const projects = await Project.find(filterQuery, {
                            score: { $meta: "textScore" },
                        })
                            .sort({ score: { $meta: "textScore" } })
                            .limit(limit)
                            .lean();

                        const teamIds = projects.map((p) => p.team);

                        const teamOwners = await Team.find(
                            { team_id: { $in: teamIds }, is_owner: true },
                            { team_id: 1, user: 1 },
                        ).lean();

                        const ownerMap = Object.fromEntries(
                            teamOwners.map((o) => [o.team_id, o.user]),
                        );

                        const userIds = [
                            ...new Set(teamOwners.map((o) => o.user)),
                        ];
                        const users = await User.find(
                            { id: { $in: userIds } },
                            { id: 1, username: 1 },
                        ).lean();

                        const usernameMap = Object.fromEntries(
                            users.map((u) => [u.id, u.username]),
                        );

                        const enhanced = await Promise.all(
                            projects.map(async (project) => {
                                const author =
                                    usernameMap[ownerMap[project.team]] || null;

                                const featuredImage = Array.isArray(
                                    project.gallery,
                                )
                                    ? project.gallery.find(
                                          (img) => img.featured && img.url,
                                      )
                                    : null;

                                return {
                                    ...project,
                                    author,
                                    featured_gallery:
                                        featuredImage?.url ?? null,
                                };
                            }),
                        );

                        return enhanced;
                    } catch (err) {
                        return handleFetchError(err, []);
                    }
                })(),
                (async () => {
                    const limit = 3;

                    try {
                        const filterQuery = {
                            status: { $in: ["approved", "archived"] },
                        };

                        const sort = { updated: -1 };

                        const projects = await Project.find(filterQuery)
                            .sort(sort)
                            .limit(limit)
                            .lean();

                        const teamIds = projects.map((p) => p.team);

                        const teamOwners = await Team.find(
                            { team_id: { $in: teamIds }, is_owner: true },
                            { team_id: 1, user: 1 },
                        ).lean();

                        const ownerMap = Object.fromEntries(
                            teamOwners.map((o) => [o.team_id, o.user]),
                        );

                        const userIds = [
                            ...new Set(teamOwners.map((o) => o.user)),
                        ];
                        const users = await User.find(
                            { id: { $in: userIds } },
                            { id: 1, username: 1 },
                        ).lean();

                        const usernameMap = Object.fromEntries(
                            users.map((u) => [u.id, u.username]),
                        );

                        const enhanced = await Promise.all(
                            projects.map(async (project) => {
                                const author =
                                    usernameMap[ownerMap[project.team]] || null;

                                const featuredImage = Array.isArray(
                                    project.gallery,
                                )
                                    ? project.gallery.find(
                                          (img) => img.featured && img.url,
                                      )
                                    : null;

                                return {
                                    ...project,
                                    author,
                                    featured_gallery:
                                        featuredImage?.url ?? null,
                                };
                            }),
                        );

                        return enhanced;
                    } catch (err) {
                        return handleFetchError(err, []);
                    }
                })(),
            ]);

            state.categories = categories;
            state.reportTypes = reportTypes;
            state.homePageProjects = homePageProjects;
            state.homePageSearch = homePageSearch;
            state.homePageNotifs = homePageNotifs;

            
            await fs.writeFile(
                "./src/generated/state.json",
                JSON.stringify(state),
            );

            console.log("Tags generated!");
        },
        "pages:extend"(routes) {
            routes.splice(
                routes.findIndex((x) => x.name === "search-searchProjectType"),
                1,
            );

            const types = ["shops"];

            types.forEach((type) =>
                routes.push({
                    name: `search-${type}`,
                    path: `/${type}`,
                    file: resolve(
                        __dirname,
                        "src/pages/search/[searchProjectType].vue",
                    ),
                    children: [],
                }),
            );
        },
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: "/api/",
            siteUrl: getDomain(),
            production: isProduction(),
            featureFlagOverrides: getFeatureFlagOverrides(),
        },
    },
    imports: {
        dirs: ["src/services"],
    },
});

function isProduction() {
    return process.env.NODE_ENV === "production";
}

function getFeatureFlagOverrides() {
    return JSON.parse(process.env.FLAG_OVERRIDES ?? "{}");
}

function getDomain() {
    if (process.env.NODE_ENV === "production") {
        if (process.env.SITE_URL) {
            return process.env.SITE_URL;
        }
        // @ts-ignore
        else {
            return "https://vanillatymeservers.com";
        }
    } else {
        const port = process.env.PORT || 3000;
        return `http://localhost:${port}`;
    }
}