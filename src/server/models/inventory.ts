import mongoose, { Document, Schema } from "mongoose";

enum Badges {
    New = "new",
    Sale = "sale",
    Hot = "hot",
    Bestseller = "bestseller",
    Limited = "limited",
    Popular = "popular",
    Trending = "trending",
    Exclusive = "exclusive",
    Featured = "featured",
    Discount = "discount",
    Clearance = "clearance",
    Free = "free",
    Gift = "gift",
    Custom = "custom",
}

enum Status {
    Active = "active",
    Draft = "draft",
    Archived = "archived",
    Unlisted = "unlisted",
}
enum Availability {
    InStock = "in_stock",
    OutOfStock = "out_of_stock",
    Discontinued = "discontinued",
    LimitedStock = "limited_stock",
}

interface InventoryPrice {
    currency: string;
    currency_custom_name: string;
    amount: number;
}
interface InventoryItem {
    item: string;
    custom_name: string;
    amount: number;
}
interface InventorySale {
    enabled: boolean;
    amount: number;
}
const InventoryPriceSchema = new Schema<InventoryPrice>(
    {
        currency: { type: String, required: true },
        currency_custom_name: { type: String, default: null },
        amount: { type: Number, required: true },
    },
    { _id: false },
);

const InventoryItemSchema = new Schema<InventoryItem>(
    {
        item: { type: String, required: true },
        custom_name: { type: String, default: null },
        amount: { type: Number, required: true },
    },
    { _id: false },
);

const InventorySaleSchema = new Schema<InventorySale>(
    {
        enabled: { type: Boolean, default: false },
        amount: { type: Number, default: null },
    },
    { _id: false },
);

const InventorySchema = new Schema({
    id: { type: String, required: true, unique: true },
    shop_id: { type: String, required: true },
    product: { type: InventoryItemSchema, required: true },
    price: { type: InventoryPriceSchema, required: true },
    note: { type: String, default: "" },
    body: { type: String, default: "" },
    created: { type: Date, required: true, default: Date.now },
    updated: { type: Date, required: true, default: Date.now },
    published: { type: Date, default: Date.now },
    badges: { type: [String], default: [], enum: Object.values(Badges) },
    sale: { type: InventorySaleSchema, default: () => ({}) },
    popular: { type: Boolean, default: false },
    limited: { type: Boolean, default: false },
    status: { type: String, default: Status.Draft, enum: Object.values(Status) },
    availability: { type: String, default: Availability.InStock, enum: Object.values(Availability) },
});

const Inventory =
    mongoose.models.Inventory ||
    mongoose.model("Inventory", InventorySchema, "inventories");

export default Inventory;