import Project from '~/server/models/project'
import User from '~/server/models/user'
import Team from '~/server/models/team'
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const project = await Project.findOne({ $or: [{ id }, { slug: id }] }).lean()
  if (!project) {
    setResponseStatus(event, 404)
    return {
      error: 'An error occurred',
      description: 'Project not found'
    }
  }
  const teamDocs = await Team.find({ team_id: project.team, accepted: true }).lean()

  const teamMemberIds = teamDocs.map((team) => team.user)

  const teamMembers = await User.find({ id: { $in: teamMemberIds } }, {password: 0}).lean()

  const teamMemberMap = new Map(teamMembers.map((user) => [user.id, user]));
  const enhancedTeamDocs = teamDocs.map((teamDoc) => ({
      ...teamDoc,
      user: teamMemberMap.get(teamDoc.user) || null, // Replace user ID with user object, fallback to null
  }));

  return enhancedTeamDocs;

})
