import Project from "~/server/models/project";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let count = Number(query.count);

  if (!count || isNaN(count) || count <= 0) {
    setResponseStatus(event, 400);
    return {
      error: "Invalid count parameter",
      description: "Count must be a positive integer.",
    };
  }
  count = Math.min(count, 100);

  const pipeline = [
    { $match: { status: { $in: ["approved", "archived"] } } },
    { $sample: { size: count } },
  ];

  const projects = await Project.aggregate(pipeline)

  return projects
});