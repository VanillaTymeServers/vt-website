import MinecraftEntity from "~/server/models/minecraft_entities";
export default defineEventHandler(async (event) => {
  const entities = await MinecraftEntity.find({}, { _id: 0, __v: 0 }).lean();
  const encodedEntities = entities.map((entity) => ({
      ...entity,
      icon: entity.icon.toString("base64"),
  }));
  if (!entities) {
      setResponseStatus(event, 404);
      return {
          error: "An error occurred",
          description: "Entities not found",
      };
  }
  return encodedEntities;
})
