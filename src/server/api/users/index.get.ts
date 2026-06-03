import User from "~/server/models/user";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const idsParam = query.ids as string | undefined;
    if (!idsParam) {
      setResponseStatus(event, 400);
      return { error: "Bad Request", description: "Missing ids parameter" };
    }
    let ids: string[];
    try {
      ids = JSON.parse(idsParam);

    } catch {
      setResponseStatus(event, 400);
      return { error: "Bad Request", description: "Invalid ids parameter" };
    }

    const users = await User.find({ id: { $in: ids } }).lean();
    return users;
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: "Internal Server Error", description: "An error occurred" };
  }
})
