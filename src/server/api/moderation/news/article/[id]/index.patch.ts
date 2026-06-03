import News from "~/server/models/news"
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
  const body = await readBody<{
      title?: string;
      subtitle?: string;
      body?: string;
      slug?: string;
      
  }>(event);

  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.subtitle !== undefined) update.subtitle = body.subtitle;
  if (body.body !== undefined) update.body = body.body;
  if (body.slug !== undefined) update.slug = body.slug;
  update.updated = new Date();

  const article = await News.findOneAndUpdate(
      { id },
      { $set: update },
      { new: true },
  ).lean();

  if (!article) {
      setResponseStatus(event, 404);
      return {
          error: "Not Found",
          description: "Article not found",
      };
  }
  return article
})
