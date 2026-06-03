import User from "~/server/models/user";
import Team from "~/server/models/team";
import Project from "~/server/models/project";
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    const user = await User.findOne({
        $or: [{ id }, { username: id }],
    });
    if (!user) {
        setResponseStatus(event, 404);
        return {
            error: "An error occurred",
            description: "User not found",
        };
    }
    const teams = await Team.find({ user: user.id });
    if (teams.length < 0) {
        return [];
    }
    const teamIds = teams.map((team) => team.team_id);

    const projects = await Project.find({ team: { $in: teamIds } });

    return projects;
});
