import Project from "~/server/models/project"
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const project = await Project.findOne({
    $or: [{ id }, { slug: id }]
  })
  if (!project) { 
    setResponseStatus(event, 404)
    return {
      error: 'An error occurred',
      description: 'Shop not found'
    }
  }
  return project
})
