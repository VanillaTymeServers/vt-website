import Inventory from "~/server/models/inventory";
import MinecraftItem from "~/server/models/minecraft_item";
import Project from "~/server/models/project";

export default defineEventHandler(async (event) => {
    const user = await authenticateUser(event);
    if (!user) {
        setResponseStatus(event, 401);
        return {
            error: "Unauthorized",
            description: "Missing Authorization token",
        };
    }

    const itemId = getRouterParam(event, "id");
    if (!itemId) {
        setResponseStatus(event, 400);
        return {
            error: "Bad Request",
            description: "Missing item id in request parameters",
        };
    }

    const inventoryItem = await Inventory.findOne({ id: itemId });
    if (!inventoryItem) {
        setResponseStatus(event, 404);
        return {
            error: "Not Found",
            description: "The specified inventory item does not exist.",
        };
    }

    const shop = await Project.findOne({ id: inventoryItem.shop_id }).lean();
    if (!shop) {
        setResponseStatus(event, 404);
        return {
            error: "Not Found",
            description: "The shop associated with this item does not exist.",
        };
    }

    const userTeam = user.teams?.find(
        (team: { team_id: string }) => team.team_id === shop.team,
    );
    if (!userTeam) {
        setResponseStatus(event, 403);
        return {
            error: "Forbidden",
            description:
                "You do not have permission to edit this inventory item.",
        };
    }
    if (!userTeam.permissions.EDIT_ITEMS) {
        setResponseStatus(event, 403);
        return {
            error: "Forbidden",
            description: "You do not have permission to edit inventory items.",
        };
    }
    const { product, price, note, body, status, availability } =
        await readBody(event);

    if (product) {
        if (typeof product.item !== "undefined") {
            const mcItem = await MinecraftItem.findOne({
                name: product.item,
            }).lean();
            if (!mcItem) {
                setResponseStatus(event, 400);
                return {
                    error: "Invalid item",
                    description: "The specified product item does not exist.",
                };
            }
            inventoryItem.product.item = product.item;
        }

        if (typeof product.custom_name !== "undefined") {
            inventoryItem.product.custom_name = product.custom_name || null;
        }

        if (typeof product.amount !== "undefined") {
            if (!Number.isInteger(product.amount) || product.amount < 1) {
                setResponseStatus(event, 400);
                return {
                    error: "Invalid amount",
                    description: "Product amount must be a positive integer.",
                };
            }
            inventoryItem.product.amount = product.amount;
        }
    }

    if (price) {
        if (typeof price.currency !== "undefined") {
            const mcItem = await MinecraftItem.findOne({
                name: price.currency,
            }).lean();
            if (!mcItem) {
                setResponseStatus(event, 400);
                return {
                    error: "Invalid currency",
                    description: "The specified currency item does not exist.",
                };
            }
            inventoryItem.price.currency = price.currency;
        }

        if (typeof price.currency_custom_name !== "undefined") {
            inventoryItem.price.currency_custom_name =
                price.currency_custom_name || null;
        }

        if (typeof price.amount !== "undefined") {
            if (typeof price.amount !== "number" || price.amount < 0) {
                setResponseStatus(event, 400);
                return {
                    error: "Invalid amount",
                    description: "Price amount must be a non-negative number.",
                };
            }
            inventoryItem.price.amount = price.amount;
        }
    }

    if (typeof note !== "undefined") {
        inventoryItem.note = note;
    }
    if (typeof body !== "undefined") {
        inventoryItem.body = body;
    }
    const VALID_STATUSES = ["active", "draft", "archived", "unlisted"];
    const VALID_AVAILABILITIES = [
        "in_stock",
        "out_of_stock",
        "discontinued",
        "limited_stock",
    ];

    if (typeof status !== "undefined") {
        if (!VALID_STATUSES.includes(status)) {
            setResponseStatus(event, 400);
            return {
                error: "Invalid status",
                description: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
            };
        }
        inventoryItem.status = status;
    }

    if (typeof availability !== "undefined") {
        if (!VALID_AVAILABILITIES.includes(availability)) {
            setResponseStatus(event, 400);
            return {
                error: "Invalid availability",
                description: `Availability must be one of: ${VALID_AVAILABILITIES.join(", ")}`,
            };
        }
        inventoryItem.availability = availability;
    }

    inventoryItem.updated = new Date();
    await inventoryItem.save();

    setResponseStatus(event, 200);
    return { success: true };
});
