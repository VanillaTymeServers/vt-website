import mongoose, { Schema, model, models } from "mongoose";

const categorySchema = new Schema({
    "icon": { type: String, required: true },
    "name": { type: String, required: true },
    "project_type": { type: String, required: true, enum: ["shop"]},
    "header": { type: String, required: true },
})

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema, "categories");

export default Category;