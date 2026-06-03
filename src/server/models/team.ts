import mongoose, { Schema, Document } from "mongoose";

interface ProjectPermissions {
    EDIT_DETAILS?: boolean;
    EDIT_BODY?: boolean;
    MANAGE_INVITES?: boolean;
    REMOVE_MEMBER?: boolean;
    EDIT_MEMBER?: boolean;
    DELETE_PROJECT?: boolean;
    VIEW_ANALYTICS?: boolean;
    CREATE_ITEMS?: boolean;
    EDIT_ITEMS?: boolean;
    DELETE_ITEMS?: boolean;
}

// Define the TeamMember interface
export interface TeamDocument extends Document {
    role: string;
    team_id: string;
    user: string;
    permissions?: ProjectPermissions;
    accepted: boolean;
    ordering: number;
    is_owner?: boolean;
}

// Mongoose Schema
const TeamSchema = new Schema<TeamDocument>(
    {
        role: { type: String, required: true },
        team_id: { type: String, required: true},
        user: { type: String, required: true },
        permissions: { type: Object, default: null },
        accepted: { type: Boolean, default: false },
        ordering: { type: Number, default: 0 },
        is_owner: { type: Boolean, default: false },
    }
);

// Create and export the model
const Team =
    mongoose.models.Team ||
    mongoose.model<TeamDocument>("Team", TeamSchema);

export default Team;
