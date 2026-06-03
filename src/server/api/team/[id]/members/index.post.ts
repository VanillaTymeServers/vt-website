import Project from "~/server/models/project";
import Team from "~/server/models/team";
import User from "~/server/models/user";
import Notification from "~/server/models/notification";

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
        accepted: true,
    });

    if (!team) {
        setResponseStatus(event, 404);
        return {
            error: "Team not found",
            description:
                "The specified team does not exist or you do not have access.",
        };
    }
    if (!team.permissions.EDIT_MEMBER) {
        setResponseStatus(event, 403);
        return {
            error: "Forbidden",
            description: "You do not have permission to edit team members.",
        };
    }
    const reqBody = await readBody(event);
    const { user_id } = reqBody;

    if (!user_id) {
        setResponseStatus(event, 400);
        return {
            error: "Bad Request",
            description: "Missing user_id in request body",
        };
    }
    const newTeamMember = await User.findOne(
        { id: user_id },
        { _id: 0, __v: 0, password: 0 },
    );

    if (!newTeamMember) {
        setResponseStatus(event, 404);
        return {
            error: "User not found",
            description: "The specified user does not exist.",
        };
    }
    const teamMembers = await Team.find(
        { team_id: teamId },
        { _id: 0, __v: 0 },
    );
    if (
        teamMembers.some(
            (member) => member.user_id === newTeamMember.id && !member.accepted,
        )
    ) {
        setResponseStatus(event, 400);
        return {
            error: "Bad Request",
            description:
                "User has already been invited to this team but has not accepted yet.",
        };
    }
    if (teamMembers.some((member) => member.user_id === newTeamMember.id)) {
        setResponseStatus(event, 400);
        return {
            error: "Bad Request",
            description: "User is already a member of this team.",
        };
    }
    const newMember = await Team.create({
        role: "Member",
        team_id: teamId,
        user: newTeamMember.id,
        permissions: {
            EDIT_DETAILS: false,
            EDIT_BODY: false,
            MANAGE_INVITES: false,
            REMOVE_MEMBER: false,
            EDIT_MEMBER: false,
            DELETE_PROJECT: false,
            VIEW_ANALYTICS: false,
            CREATE_ITEMS: false,
            EDIT_ITEMS: false,
            DELETE_ITEMS: false,
        },
        accepted: false,
        ordering: 0,
        is_owner: false,
    });
    if (!newMember) {
        setResponseStatus(event, 500);
        return {
            error: "Internal Server Error",
            description: "Failed to add new team member",
        };
    }
    newMember.save();
    const project = await Project.findOne({ team: teamId });
    const notifId = await generateNotificationId();
    const newNotification = await Notification.create({
        id: notifId,
        user_id: newTeamMember.id,
        read: false,
        created: new Date(),
        body: {
            type: "team_invite",
            project_id: project ? project.id : null,
            team_id: teamId,
            invited_by: user.id,
            role: "Member",
        },
        type: "team_invite",
        title: "You have been invited to join a team!",
        text: "An invite has been sent for you to be a Member of a team",
        link: `/shop/${project?.id}`,
        actions: [
            {
                title: "Accept",
                action_route: ["POST", `team/${teamId}/join`],
            },
            {
                title: "Deny",
                action_route: [
                    "DELETE",
                    `team/${teamId}/members/${newTeamMember.id}`,
                ],
            },
        ],
    });
    if (!newNotification) {
        setResponseStatus(event, 500);
        return {
            error: "Internal Server Error",
            description: "Failed to create notification for new team member",
        };
    }
    newNotification.save();
    return {
        success: true,
        message: "New team member added successfully",
    };
});
