import User from "~/server/models/user";

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    const user = await User.findOne(
        {
            $or: [
                { id },
                {
                    username: {
                        $regex: new RegExp(
                            "^" + escapeRegex(id?.toLowerCase() ?? "") + "$",
                            "i",
                        ),
                    },
                },
            ],
        },
        { password: 0, _id: 0 },
    );
    if (!user) {
        setResponseStatus(event, 404);
        return {
            error: "An error occurred",
            description: "User not found",
        };
    }
    return user;
});
