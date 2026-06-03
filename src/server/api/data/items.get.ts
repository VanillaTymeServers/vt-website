import MinecraftItem from "~/server/models/minecraft_item"
export default defineEventHandler(async (event) => {
  const items = await MinecraftItem.find({}, { _id: 0, __v: 0 }).lean();
  const encodedItems = items.map((item) => ({
      ...item,
      icon: item.icon.toString("base64"),
  }));
  if (!items) {
    setResponseStatus(event, 404)
    return {
      error: "An error occurred",
      description: "Items not found",
    }
  }
  return encodedItems;
})
