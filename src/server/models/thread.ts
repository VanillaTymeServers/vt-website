import mongoose, { Schema, Document, Model } from "mongoose";

// Define ID types
type ThreadId = string;
type ThreadMessageId = string;
type ProjectId = string;
type ReportId = string;
type UserId = string;
type ImageId = string;

// Define ProjectStatus enum
enum ProjectStatus {
    Draft = "draft",
    Published = "published",
    Archived = "archived",
}

// Define ThreadType enum
enum ThreadType {
    Report = "report",
    Project = "project",
    DirectMessage = "direct_message",
}

// Define MessageBody schema
const MessageBodySchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            enum: [
                "text",
                "status_change",
                "thread_closure",
                "thread_reopen",
                "deleted",
            ],
        },
        body: { type: String, required: false },
        private: { type: Boolean, default: false },
        replying_to: { type: String, required: false },
        associated_images: { type: [String], required: false },
        new_status: {
            type: String,
            enum: Object.values(ProjectStatus),
            required: false,
        },
        old_status: {
            type: String,
            enum: Object.values(ProjectStatus),
            required: false,
        },
    },
    { _id: false, discriminatorKey: "type" },
);

// Define ThreadMessage schema
interface ThreadMessage {
    id: ThreadMessageId;
    author_id?: UserId;
    body: any;
    created: Date;
}

const ThreadMessageSchema = new Schema<ThreadMessage>({
    id: { type: String, required: true, unique: true },
    author_id: { type: String, required: false },
    body: { type: MessageBodySchema, required: true },
    created: { type: Date, required: true, default: Date.now },
});

// Define Thread schema
interface Thread extends Document {
    id: ThreadId;
    type: ThreadType;
    project_id?: ProjectId;
    report_id?: ReportId;
    messages: ThreadMessage[];
    members: UserId[];
}

const ThreadSchema = new Schema<Thread>({
    id: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(ThreadType), required: true },
    project_id: { type: String, required: false },
    report_id: { type: String, required: false },
    messages: { type: [ThreadMessageSchema], required: true },
    members: { type: [String], required: true }, // Storing only user IDs
});

// Create and export the Thread model
const Thread: Model<Thread> =
    mongoose.models.Thread || mongoose.model<Thread>("Thread", ThreadSchema);

export default Thread;
