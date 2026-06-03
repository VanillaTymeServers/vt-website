import Inventory from "~/server/models/inventory";
import Project from "~/server/models/project";
import MinecraftItem from "~/server/models/minecraft_item";
export default defineEventHandler(async (event) => {
  const user = await authenticateUser(event);
  const itemId = getRouterParam(event, "id");
  if (!itemId) {
    setResponseStatus(event, 400);
    return {
      error: "Bad Request",
      description: "Missing item id in request parameters",
    };
  }
  const inventoryItem = await Inventory.findOne({ id: itemId }).lean() as any;
  if (!inventoryItem) {
    setResponseStatus(event, 404);
    return {
      error: "Item not found",
      description: "The specified inventory item does not exist.",
    };
  }
  const itemNames = [inventoryItem.product.item, inventoryItem.price.currency];
  const minecraftItems = await MinecraftItem.find({ name: { $in: itemNames } })
    .select("name label icon")
    .lean();

  const itemLookup = Object.fromEntries(
    minecraftItems.map((item) => [
      item.name,
      { label: item.label, icon: item.icon },
    ]),
  );

  const hydratedItem = {
    ...inventoryItem,
    product: {
      ...inventoryItem.product,
      item: {
        id: inventoryItem.product.item,
        label: itemLookup[inventoryItem.product.item]?.label || "Unknown Item",
        icon: itemLookup[inventoryItem.product.item]?.icon || null,
      },
    },
    price: {
      ...inventoryItem.price,
      currency: {
        id: inventoryItem.price.currency,
        label:
          itemLookup[inventoryItem.price.currency]?.label ||
          "Unknown Currency",
        icon: itemLookup[inventoryItem.price.currency]?.icon || null,
      },
    },
  };
  const shop = await Project.findOne({ id: inventoryItem.shop_id }).lean();
  if (!shop) {
    setResponseStatus(event, 404);
    return {
      error: "Shop not found",
      description: "The shop associated with this item does not exist.",
    };
  }
  if (inventoryItem.status === "draft") {
    if (!user) {
      setResponseStatus(event, 401);
      return {
        error: "Unauthorized",
        description: "Missing Authorization token",
      };
    }

    const isTeamMember = user.teams?.some(
      (team: { team_id: string }) => team.team_id === shop.team,
    );

    if (!isTeamMember) {
      setResponseStatus(event, 403);
      return {
        error: "Forbidden",
        description: "You do not have access to this inventory item.",
      };
    }
  }

  return hydratedItem;
});
