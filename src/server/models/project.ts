import mongoose, { Schema, Document, Model } from "mongoose";

// Define ID types as strings
type ShopId = string;
type TeamId = string;
type OrganizationId = string;
type ThreadId = string;

// Define ShopStatus enum
enum ShopStatus {
    Approved = "approved",
    Archived = "archived",
    Rejected = "rejected",
    Draft = "draft",
    Unlisted = "unlisted",
    Processing = "processing",
    Withheld = "withheld",
    Scheduled = "scheduled",
    Private = "private",
    Unknown = "unknown",
}

export enum StallColor {
    Pink = "pink",
    Green = "green",
    White = "white",
    Blue = "blue",
    Lime = "lime",
    LightBlue = "light_blue",
    Cyan = "cyan",
    Purple = "purple",
    Magenta = "magenta",
    LightGray = "light_gray",
    Brown = "brown",
    Orange = "orange",
    Yellow = "yellow",
    Gray = "gray",
    Black = "black",
    Red = "red",
}

// Define ModeratorMessage schema
const ModeratorMessageSchema = new Schema({
    message: { type: String },
    body: { type: String },
    created_at: { type: Date },
});

// Define GalleryItem schema
const GalleryItemSchema = new Schema({
    url: { type: String, required: true },
    raw_url: { type: String, required: true },
    featured: { type: Boolean, default: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    created: { type: Date, default: Date.now },
    ordering: { type: Number, required: true },
});

const CoordinatesSchema = new Schema({
    x: { type: Number, default: null },
    z: { type: Number, default: null },
})

// Define Shop schema
interface Shop extends Document {
    id: ShopId;
    slug?: string;
    project_type: string;
    stall: boolean;
    team: TeamId;
    organization?: OrganizationId;
    title: string;
    description: string;
    body: string;
    published: Date;
    updated: Date;
    approved?: Date;
    queued?: Date;
    status: ShopStatus;
    requested_status?: ShopStatus;
    moderator_message?: {
        message: string;
        body: string;
        created_at: Date;
    };
    followers: number;
    categories: string[];
    additional_categories: string[];
    icon_url?: string;
    gallery: {
        url: string;
        raw_url: string;
        featured: boolean;
        title?: string;
        description?: string;
        created: Date;
        ordering: number;
    }[];
    color?: number;
    stall_color?: string;
    coordinates?: {
        x: number;
        z: number;
    };
    // thread_id: ThreadId;
}

const ShopSchema = new Schema<Shop>({
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    project_type: { type: String, default: "shop" },
    stall: { type: Boolean, default: true },
    team: { type: String, required: true },
    organization: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String, required: true },
    body: { type: String, default: "" },
    published: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    approved: { type: Date, default: null },
    queued: { type: Date, required: false },
    status: {
        type: String,
        enum: Object.values(ShopStatus),
        default: ShopStatus.Draft,
    },
    requested_status: {
        type: String,
        enum: Object.values(ShopStatus),
        default: ShopStatus.Approved,
    },
    moderator_message: {
        type: ModeratorMessageSchema,
    },
    followers: { type: Number, default: 0 },
    categories: { type: [String], default: [] },
    additional_categories: { type: [String], default: [] },
    icon_url: { type: String, default: "" },
    gallery: { type: [GalleryItemSchema], default: [] },
    color: { type: Number, required: false },
    stall_color: { type: String, enum: Object.values(StallColor), default: null },
    coordinates: { type: CoordinatesSchema },
    // thread_id: { type: String, required: true },
});

ShopSchema.index({ title: "text", description: "text" });

// Create and export the Shop model
const Project: Model<Shop> =
    mongoose.models.Project || mongoose.model<Shop>("Project", ShopSchema);

export default Project;
