import mongoose from "mongoose";

const minecraftEntitySchema = new mongoose.Schema(
    {
        label: { type: String, required: true },
        name: { type: String, required: true },
        icon: { type: Buffer, required: true },
        uploader: { type: String, required: true },
    }
);

const MinecraftEntity =
    mongoose.models.MinecraftEntity ||
    mongoose.model("MinecraftEntity", minecraftEntitySchema, "minecraft_entities");

export default MinecraftEntity;
