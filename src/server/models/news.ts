import mongoose, { Schema, Document, Model } from "mongoose";

export interface NewsType {
    id: string;
    slug: string;
    title: string;
    summary: string;
    thumbnail: string;
    body: string;
    published: Date;
    updated: Date;
    authors: string[];
    draft?: boolean;
    archived?: boolean;
}

const NewsSchema = new Schema<NewsType>({
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: false, unique: true },
    title: { type: String, required: false, default: "Untitled Article" },
    summary: { type: String, required: false },
    thumbnail: { type: String, required: false },
    body: { type: String, required: false },
    published: { type: Date, required: false },
    updated: { type: Date, default: Date.now },
    authors: { type: [String], required: true },
    draft: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
});

const News: Model<NewsType> =
    mongoose.models.News ||
    mongoose.model<NewsType>("News", NewsSchema, "news");

export default News;
