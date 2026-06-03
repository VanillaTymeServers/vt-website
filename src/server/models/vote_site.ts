import mongoose, { Schema, model, models } from "mongoose";

const voteSiteSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        label: { type: String, required: true },
        url: { type: String, required: true },
    }
);

const VoteSite = mongoose.models.VoteSite || mongoose.model("VoteSite", voteSiteSchema, "vote_sites");

export default VoteSite;
