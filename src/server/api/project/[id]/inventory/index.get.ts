import MinecraftItem from "~/server/models/minecraft_item";
import Project from "~/server/models/project";
import Inventory from "~/server/models/inventory";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");

    // Find the shop based on id or slug
    const shop = await Project.findOne({ $or: [{ id }, { slug: id }] }).lean();
    if (!shop) {
        setResponseStatus(event, 404);
        return {
            error: "An error occurred",
            description: "Shop not found",
        };
    }

    // Get all inventory items for the shop
    const inventoryItems = await Inventory.find({ shop_id: shop.id }).lean();

    if (!inventoryItems.length) {
        return [];
    }

    // Extract both item IDs and price currency IDs
    const itemNames = inventoryItems.map((item) => item.product.item);
    const currencyNames = inventoryItems.map((item) => item.price.currency);
    const allNames = [...new Set([...itemNames, ...currencyNames])];

    // Find matching Minecraft items based on `name`
    const minecraftItems = await MinecraftItem.find({ name: { $in: allNames } })
        .select("name label icon")
        .lean();

    // Create a lookup table for item details
    const itemLookup = Object.fromEntries(
        minecraftItems.map((item) => [
            item.name,
            { label: item.label, icon: item.icon },
        ]),
    );

    // Map inventory items with item and currency details
    const inventoryWithDetails = inventoryItems.map((inventoryItem) => ({
        ...inventoryItem,
        product: {
            ...inventoryItem.product,
            item: {
                id: inventoryItem.product.item,
                label:
                    itemLookup[inventoryItem.product.item]?.label ||
                    "Unknown Item",
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
    }));

    return inventoryWithDetails;
});
