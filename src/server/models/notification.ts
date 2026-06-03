import mongoose, { Schema, Document, Model } from "mongoose";

// Define ID types as strings since MongoDB uses ObjectId or custom strings
type NotificationId = string;
type UserId = string;
type ProjectId = string;
type VersionId = string;
type TeamId = string;
type OrganizationId = string;
type ThreadId = string;
type ThreadMessageId = string;
type ReportId = string;

// Define the ProjectStatus enum (modify based on actual values)
enum ProjectStatus {
    Draft = "draft",
    Published = "published",
    Archived = "archived",
}

// Define the NotificationAction schema
interface NotificationAction {
    title: string;
    action_route: [string, string]; // HTTP Method and Route
}

const NotificationActionSchema = new Schema<NotificationAction>({
    title: { type: String, required: true },
    action_route: { type: [String], required: true },
});

// Define the NotificationBody schema with discriminators for different types
const NotificationBodySchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            enum: [
                "project_update",
                "team_invite",
                "organization_invite",
                "status_change",
                "moderator_message",
                "unknown",
            ],
        },
        project_id: { type: String, required: false },
        version_id: { type: String, required: false },
        team_id: { type: String, required: false },
        organization_id: { type: String, required: false },
        invited_by: { type: String, required: false },
        role: { type: String, required: false },
        old_status: {
            type: String,
            enum: Object.values(ProjectStatus),
            required: false,
        },
        new_status: {
            type: String,
            enum: Object.values(ProjectStatus),
            required: false,
        },
        thread_id: { type: String, required: false },
        message_id: { type: String, required: false },
        report_id: { type: String, required: false },
        actions: { type: [NotificationActionSchema], required: false },
    },
    { _id: false, discriminatorKey: "type" },
);

// Define the Notification schema
interface Notification extends Document {
    id: NotificationId;
    user_id: UserId;
    read: boolean;
    created: Date;
    body: any; // Using any since the body structure varies based on type
}

const NotificationSchema = new Schema<Notification>({
    id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    read: { type: Boolean, required: true, default: false },
    created: { type: Date, required: true, default: Date.now },
    body: { type: NotificationBodySchema, required: true },
});

const Notification: Model<Notification> =
    mongoose.models.Notification ||
    mongoose.model<Notification>("Notification", NotificationSchema);

export default Notification;
