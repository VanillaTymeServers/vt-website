import News from "~/server/models/news";
import { isStaff } from "~/helpers/users";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const user = await authenticateUser(event, true);

  const { } = query;
  if (!user || !isStaff(user)) {
      setResponseStatus(event, 401);
      return {
          error: "Unauthorized",
          description: "Missing or invalid Authorization token",
      };
  }
  const articles = await News.find().lean();

  return articles;
})
