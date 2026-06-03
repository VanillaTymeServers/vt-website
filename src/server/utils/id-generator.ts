import { randomBytes } from "crypto";
import User from "~/server/models/user";
import Team from "~/server/models/team";
import Project from "~/server/models/project";
import Notification from "~/server/models/notification";
import News from "~/server/models/news";
import Inventory from "../models/inventory";

export const generateUserId = async (): Promise<string> => {
    let randomId: string | PromiseLike<string>;
    do {
        randomId = randomBytes(8)
            .toString("base64")
            .replace(/[/+=]/g, "")
            .slice(0, 8);
    } while (await User.exists({ id: randomId }));

    return randomId;
};

export const generateTeamId = async (): Promise<string> => {
    let randomTeamId: string | PromiseLike<string>;
    do {
        randomTeamId = randomBytes(8)
            .toString("base64")
            .replace(/[/+=]/g, "")
            .slice(0, 8);
    } while (await Team.exists({ id: randomTeamId }));

    return randomTeamId;
};
export const generateProjectId = async (): Promise<string> => {
    let randomProjectId: string | PromiseLike<string>;
    do {
        randomProjectId = randomBytes(8)
            .toString("base64")
            .replace(/[/+=]/g, "")
            .slice(0, 8);
    } while (await Project.exists({ id: randomProjectId }));

    return randomProjectId;
};
export const generateNotificationId = async (): Promise<string> => {
    let randomNotificationId: string | PromiseLike<string>;
    do {
        randomNotificationId = randomBytes(10)
            .toString("base64")
            .replace(/[/+=]/g, "")
            .slice(0, 10);
    } while (await Notification.exists({ id: randomNotificationId }));

    return randomNotificationId;
};
export const generateArticleId = async (): Promise<string> => {
    let randomArticleId: string | PromiseLike<string>;
    do {
        randomArticleId = randomBytes(10)
            .toString("base64")
            .replace(/[/+=]/g, "")
            .slice(0, 10);
    } while (await News.exists({ id: randomArticleId }));

    return randomArticleId;
};

export const generateItemId = async (): Promise<string> => {
    let randomItemId: string | PromiseLike<string>;
    do {
        randomItemId = randomBytes(10)
            .toString("base64")
            .replace(/[/+=]/g, "")
            .slice(0, 10);
    } while (await Inventory.exists({ id: randomItemId }));

    return randomItemId;
};