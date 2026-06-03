import Project from "~/server/models/project";
import Team from "~/server/models/team";
import User from "~/server/models/user";
import Notification from "~/server/models/notification";
import Inventory from "~/server/models/inventory";
import { generateItemId } from "~/server/utils/id-generator";
export default defineEventHandler(async (event) => {
    const user = await authenticateUser(event);
    if (!user) {
        setResponseStatus(event, 401);
        return {
            error: "Unauthorized",
            description: "Missing Authorization token",
        };
    }
    const projectId = getRouterParam(event, "id");
    const project = await Project.findOne({ id: projectId }).lean();
    if (!project) {
        setResponseStatus(event, 404);
        return {
            error: "Project not found",
            description: "The specified project does not exist.",
        };
    }
    const team = await Team.findOne({
        team_id: project.team,
        user: user.id,
        accepted: true,
    });
    if (!team.permissions.CREATE_ITEMS) {
        setResponseStatus(event, 403);
        return {
            error: "Forbidden",
            description: "You do not have permission to create items.",
        };
    }
    const reqBody = await readBody(event);
    try {
        const itemId = await generateItemId();
        const newItem = new Inventory({
            id: itemId,
            shop_id: project.id,
            product: {
                item: "minecraft:dirt",
                custom_name: null,
                amount: 1,
            },
            price: {
                currency: "minecraft:diamond",
                amount: 1,
            }
        })
        await newItem.save();
        setResponseStatus(event, 200);
        return {
            message: "New item created",
            itemId: itemId,
        };
    } catch (error: any) {
        setResponseStatus(event, 500);
        return {
            error: "An error occurred",
            description: error.message,
        }
    }
});
