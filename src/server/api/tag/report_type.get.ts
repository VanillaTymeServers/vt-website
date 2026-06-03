import ReportType from "~/server/models/report_type";
export default defineEventHandler(async (event) => {
    const reportTypes = await ReportType.find({});
    return reportTypes;
});
