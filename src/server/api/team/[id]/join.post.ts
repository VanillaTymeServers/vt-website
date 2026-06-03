
import Team from "~/server/models/team";
import User from "~/server/models/user";

export default defineEventHandler(async (event) => {
  const user = await authenticateUser(event);
  if (!user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
      description: "Missing Authorization token",
    };
  }
  const teamId = getRouterParam(event, "id");
  const team = await Team.findOne({
    team_id: teamId,
    user: user.id,
  })
  if (!team) {
    setResponseStatus(event, 404);
    return {
      error: "Team not found",
      description:
        "The specified team does not exist or you were not invited to join that team.",
    };
  }
  if (team.accepted) {
    setResponseStatus(event, 400);
    return {
      error: "Bad Request",
      description: "You have already joined this team.",
    };
  }
  team.accepted = true;
  await team.save();
  return {
    message: "Successfully joined the team."
  }
})