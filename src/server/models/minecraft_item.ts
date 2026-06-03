import mongoose from "mongoose";

const minecraftItemSchema = new mongoose.Schema(
    {
        label: { type: String, required: true },
        name: { type: String, required: true },
        icon: { type: Buffer, required: true },
        uploader: { type: String, required: true },
    }
);

const MinecraftItem =
    mongoose.models.MinecraftItem ||
    mongoose.model("MinecraftItem", minecraftItemSchema, "minecraft_items");

export default MinecraftItem;
