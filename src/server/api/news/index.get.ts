import News from "~/server/models/news";

export default defineEventHandler(async (event) => {
    const now = new Date();

    const articles = await News.find({
        published: { $lte: now },
        draft: { $ne: true },
        archived: { $ne: true },
    })
        .sort({ published: -1 })
        .lean();
    return articles;
});
