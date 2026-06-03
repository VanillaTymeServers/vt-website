import User from "~/server/models/user";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.id) {
    setResponseStatus(event, 400)
    return {
        error: "An error occurred",
        description: "Missing id in query",
    };
  }
  const user = await User.findOne({ id: query.id, tempExpiresAt: { $exists: true } });
  if (!user) {
    setResponseStatus(event, 404)
    return {
      error: 'An error occurred',
      description: 'Expired or invalid link'
    }
  }
  return {
    id: user.id,
    username: user.username,
  }
})
