import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true, index: { expires: 604800 } },
    },
    { timestamps: true },
);

const Session =
    mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
