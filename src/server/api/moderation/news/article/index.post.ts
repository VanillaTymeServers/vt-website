import News from "~/server/models/news";
import { isStaff } from "~/helpers/users";
import { generateArticleId } from "~/server/utils/id-generator";
export default defineEventHandler(async (event) => {
    const user = await authenticateUser(event, true);
    if (!user || !isStaff(user)) {
        setResponseStatus(event, 401);
        return {
            error: "Unauthorized",
            description: "Missing or invalid Authorization token",
        };
    }
  try {
    const articleId = await generateArticleId();
    const newArticle = new News({
      id: articleId,
      authors: [user.id],
      draft: true,
    })
    await newArticle.save();
    setResponseStatus(event, 200);
    return {
      message: "New article created",
      articleId: articleId,
    };
  } catch (error: any) {
    setResponseStatus(event, 500);
    return {
      error: "An error occurred",
      description: error.message,
    }
  }
});
