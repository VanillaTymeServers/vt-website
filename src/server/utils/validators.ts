import state from "~/generated/state.json";
import { StallColor } from "../models/project";
export function validateUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function validateSlug(slug: string): boolean {
    const slugRegex = /^[a-zA-Z0-9-_]{3,64}$/;
    return slugRegex.test(slug);
}

export function validateTitle(title: string): boolean {
    return (
        typeof title === "string" && title.length >= 3 && title.length <= 2048
    );
}

export function validateDescription(description: string): boolean {
    return (
        typeof description === "string" &&
        description.length >= 3 &&
        description.length <= 256
    );
}

export function validateCategoryIds({
    categories,
    maxLength,
    label = "Categories",
}: {
    categories: unknown;
    maxLength?: number;
    label?: string;
}): {
    valid: boolean;
    message?: string;
} {
    if (!Array.isArray(categories)) {
        return {
            valid: false,
            message: `${label} must be an array.`,
        };
    }

    if (typeof maxLength === "number" && categories.length > maxLength) {
        return {
            valid: false,
            message: `You can select up to ${maxLength} ${label.toLowerCase()}.`,
        };
    }

    const validCategoryIds = new Set(
        state.categories
            .filter((cat) => cat.project_type === "shop")
            .map((cat) => cat.name),
    );

    for (const id of categories) {
        if (typeof id !== "string") {
            return {
                valid: false,
                message: `${label} ID "${id}" is not a string.`,
            };
        }
        if (!validCategoryIds.has(id)) {
            return {
                valid: false,
                message: `${label} ID "${id}" is invalid or not a shop category.`,
            };
        }
    }

    return { valid: true };
}
export function validateStallColor(color: unknown): color is StallColor {
    return (
        typeof color === "string" &&
        Object.values(StallColor).includes(color as StallColor)
    );
}

export interface Coordinates {
    x: number;
    z: number;
}

export function validateCoordinates(coords: unknown): coords is Coordinates {
    if (
        typeof coords !== "object" ||
        coords === null ||
        Array.isArray(coords)
    ) {
        return false;
    }

    const { x, z } = coords as Record<string, unknown>;

    return (
        typeof x === "number" &&
        isFinite(x) &&
        typeof z === "number" &&
        isFinite(z)
    );
}

export function validateVisibility(value: unknown): {
    valid: boolean;
    message?: string;
} {
    const allowedStatuses = ["approved", "archived", "unlisted", "private"];

    if (typeof value !== "string") {
        return {
            valid: false,
            message: "status and requested_status must be a string.",
        };
    }

    if (!allowedStatuses.includes(value)) {
        return {
            valid: false,
            message: `"${value}" is not a valid status.`,
        };
    }

    return { valid: true };
}
