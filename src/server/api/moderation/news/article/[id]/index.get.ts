import News from "~/server/models/news";
import User from "~/server/models/user";
import { isStaff } from "~/helpers/users";
export default defineEventHandler(async (event) => {
  const user = await authenticateUser(event, true);

  if (!user || !isStaff(user)) {
      setResponseStatus(event, 401);
      return {
          error: "Unauthorized",
          description: "Missing or invalid Authorization token",
      };
  }
  const id = getRouterParam(event, "id");
  if (!id) {
    setResponseStatus(event, 400);
    return {
      error: "Bad Request",
      description: "Missing article id",
    }
  }
  const article = await News.findOne({ id }).lean();
  if (!article) {
      setResponseStatus(event, 404);
      return {
          error: "Not Found",
          description: "Article not found",
      };
  }

    // Hydrate authors (IDs -> user objects)
    const ids = (article.authors ?? []) as string[];
    let users: any[] = [];

    if (ids.length > 0) {
      users = await User.find({ id: { $in: ids } })
        .select({ _id: 0, id: 1, username: 1, avatar_url: 1, uuid: 1 })
        .lean();

      // Preserve original order
      users.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    }
    return { ...article, authors: users };
})
