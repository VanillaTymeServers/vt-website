import Project from "~/server/models/project";
import { isStaff } from "~/helpers/users";
import {
    validateCategoryIds,
    validateCoordinates,
    validateDescription,
    validateTitle,
    validateVisibility,
} from "~/server/utils/validators";

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

    const project = await Project.findOne({
        $or: [{ id: projectId }, { slug: projectId }],
    });

    if (!project) {
        setResponseStatus(event, 404);
        return {
            error: "Shop not found",
            description: "The specified shop does not exist.",
        };
    }

    const reqBody = await readBody(event);
    const {
        slug,
        title,
        description,
        categories,
        body,
        status,
        requested_status,
        additional_categories,
        stall,
        stall_color,
        coordinates,
    } = reqBody;

    const userTeam = user.teams.find((team) => team.team_id === project.team);
    if (!userTeam) {
        setResponseStatus(event, 401);
        return {
            error: "Unauthorized",
            description: "You do not have permission to edit this shop.",
        };
    }

    if (body && userTeam.permissions.EDIT_BODY === false) {
        setResponseStatus(event, 401);
        return {
            error: "Unauthorized",
            description: "You do not have permission to edit the shop body.",
        };
    }

    const isEditingDetails =
        slug ||
        title ||
        description ||
        categories ||
        status ||
        requested_status ||
        additional_categories ||
        stall ||
        stall_color ||
        coordinates;

    if (isEditingDetails && userTeam.permissions.EDIT_DETAILS === false) {
        setResponseStatus(event, 401);
        return {
            error: "Unauthorized",
            description: "You do not have permission to edit the shop details.",
        };
    }

    let existingSlug = null;
    if (slug && slug !== project.slug) {
        existingSlug = await Project.findOne({ slug });

        if (!validateSlug(slug)) {
            setResponseStatus(event, 400);
            return {
                error: "An error occurred",
                description:
                    "Slug must be a URL-safe string between 3 and 64 characters.",
            };
        }

        if (existingSlug) {
            setResponseStatus(event, 409);
            return {
                error: "An error occurred",
                description: "Slug is already taken!",
            };
        }

        project.slug = slug;
    }

    if (typeof title !== "undefined") {
        if (!validateTitle(title)) {
            setResponseStatus(event, 400);
            return {
                error: "An error occurred",
                description:
                    "Title must be a string between 3 and 2048 characters.",
            };
        }

        project.title = title;
    }

    if (typeof description !== "undefined") {
        if (!validateDescription(description)) {
            setResponseStatus(event, 400);
            return {
                error: "An error occurred",
                description:
                    "Description must be a string between 3 and 256 characters.",
            };
        }

        project.description = description;
    }
    if (typeof body !== "undefined") {
        project.body = body;
    }

    // 🔁 Cleaned up category handling
    const categoryResult = handleCategoryUpdate({
        categories,
        additional_categories,
        existingCategories: project.categories,
        existingAdditionalCategories: project.additional_categories,
        strict: true,
    });

    if (!categoryResult.success) {
        setResponseStatus(event, 400);
        return {
            error: categoryResult.error,
            description: categoryResult.description,
        };
    }

    project.categories = categoryResult.categories!;
    project.additional_categories = categoryResult.additional_categories!;

    if (typeof stall !== "undefined") {
        if (typeof stall !== "boolean") {
            setResponseStatus(event, 400);
            return {
                error: "An error occurred",
                description: "Stall must be a boolean value.",
            };
        }

        project.stall = stall;
    }

    if (typeof coordinates !== "undefined") {
        if (!validateCoordinates(coordinates)) {
            setResponseStatus(event, 400);
            return {
                error: "Invalid coordinates",
                description:
                    "`coordinates` must be an object with numeric `x` and `z` properties.",
            };
        }

        project.coordinates = coordinates;
    }
    if (typeof stall_color !== "undefined") {
        if (!validateStallColor(stall_color)) {
            setResponseStatus(event, 400);
            return {
                error: "An error occurred",
                description:
                    "Stall color must be a string and one of the predefined colors.",
            };
        }
    }

    if (typeof requested_status !== "undefined") {
        const check = validateVisibility(requested_status);
        if (!check.valid) {
            setResponseStatus(event, 400);
            return {
                error: "Invalid requested status",
                description: check.message,
            };
        }
        project.requested_status = requested_status;
    }

    if (typeof status !== "undefined") {
        if (!isStaff(user)) {
            setResponseStatus(event, 403);
            return {
                error: "Forbidden",
                description: "Only staff can change project status directly.",
            };
        }
        const check = validateVisibility(status);
        if (!check.valid) {
            setResponseStatus(event, 400);
            return {
                error: "Invalid status",
                description: check.message,
            };
        }
        project.status = status;
    }

    return await project.save().then((savedProject) => {
        setResponseStatus(event, 200);
        return {
            success: true,
            project: savedProject,
        };
    });
});

function handleCategoryUpdate({
    categories,
    additional_categories,
    existingCategories,
    existingAdditionalCategories,
    strict = true,
}: {
    categories?: unknown;
    additional_categories?: unknown;
    existingCategories: string[];
    existingAdditionalCategories: string[];
    strict?: boolean;
}):
    | {
          success: true;
          categories?: string[];
          additional_categories?: string[];
      }
    | {
          success: false;
          error: string;
          description: string;
      } {
    let validatedCategories: string[] | undefined = undefined;
    let validatedAdditional: string[] | undefined = undefined;

    if (categories && Array.isArray(categories) && categories.length > 0) {
        const check = validateCategoryIds({
            categories,
            maxLength: 3,
            label: "Categories",
        });
        if (!check.valid) {
            return {
                success: false,
                error: "Invalid categories",
                description: check.message!,
            };
        }
        validatedCategories = [...new Set(categories as string[])];
    }

    if (
        additional_categories &&
        Array.isArray(additional_categories) &&
        additional_categories.length > 0
    ) {
        const check = validateCategoryIds({
            categories: additional_categories,
            label: "Additional categories",
        });
        if (!check.valid) {
            return {
                success: false,
                error: "Invalid additional categories",
                description: check.message!,
            };
        }
        validatedAdditional = [...new Set(additional_categories as string[])];
    }

    if (validatedCategories && validatedAdditional) {
        const overlap = validatedCategories.filter((id) =>
            validatedAdditional!.includes(id),
        );
        if (overlap.length > 0) {
            if (strict) {
                return {
                    success: false,
                    error: "Category conflict",
                    description: `You cannot include the same category in both main and additional categories: ${overlap.join(", ")}`,
                };
            } else {
                validatedCategories = validatedCategories.filter(
                    (id) => !validatedAdditional!.includes(id),
                );
                validatedAdditional = validatedAdditional.filter(
                    (id) => !validatedCategories!.includes(id),
                );
            }
        }
    }

    if (validatedCategories && !validatedAdditional) {
        validatedAdditional = existingAdditionalCategories.filter(
            (id) => !validatedCategories!.includes(id),
        );
    }

    if (!validatedCategories && validatedAdditional) {
        validatedCategories = existingCategories.filter(
            (id) => !validatedAdditional!.includes(id),
        );
    }

    return {
        success: true,
        categories: validatedCategories ?? existingCategories,
        additional_categories:
            validatedAdditional ?? existingAdditionalCategories,
    };
}