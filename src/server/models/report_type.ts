import mongoose, { Schema, model, models } from "mongoose";

const reportTypeSchema = new Schema({
    type: { type: String, required: true },
});

const ReportType =
    mongoose.models.ReportType ||
    mongoose.model("ReportType", reportTypeSchema, "report_types");

export default ReportType;
