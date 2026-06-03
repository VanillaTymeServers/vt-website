import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  uuid: { type: String, required: true, unique: true },
  discord: { type: String, required: true, unique: true },
  avatar_url: { type: String, required: true },
  bio: { type: String, default: null },
  created: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: [
      "member",
      "supporter",
      "supporter-+",
      "supporter-++",
      "supporter-+++",
      "moderator",
      "admin",
      "developer",
    ],
    required: true,
  },
  password: { type: String, default: null },
  status: {
    type: String,
    enum: ["active", "suspended", "banned", "no-password"],
    required: true,
    default: "no-password",
  },
  tempExpiresAt: { type: Date, default: null },
});

userSchema.index({ tempExpiresAt: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;