import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  unit: "kg" | "lb" | "pack" | "each";
  category: string;
  subcategory?: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ["kg", "lb", "pack", "each"], required: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model<IProduct>("Product", productSchema);