import News from "~/server/models/news";
import User from "~/server/models/user";

export default defineEventHandler(async (event) => {
    try {
        const now = new Date();
        const slug = getRouterParam(event, "slug");

        // 1. Get the article
        const article = await News.findOne({
            slug,
            published: { $lte: now },
        })
            .sort({ published: -1 })
            .lean();

        if (!article) {
            setResponseStatus(event, 404);
            return {
                error: "An error occurred",
                description: "Article not found",
            };
        }

        // 2. Hydrate authors (IDs -> full user objects)
        const ids = (article.authors ?? []) as string[];
        let users: any[] = [];

        if (ids.length > 0) {
            users = await User.find({ id: { $in: ids } })
                .select({ id: 1, username: 1, avatar_url: 1, uuid: 1 })
                .lean();

            // Preserve original order
            users.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
        }

        // 3. Replace authors with hydrated users
        return { ...article, authors: users };
    } catch (err) {
        setResponseStatus(event, 500);
        return {
            error: "Internal Server Error",
            description: "An error occurred",
        };
    }
});
