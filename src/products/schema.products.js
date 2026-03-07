import mongoose from "mongoose";
const { Schema, model } = mongoose;
const productSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["sacs", "chaussures", "accessoires", "vetements"],
    },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "EUR" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String },
    image: { type: String },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);
const Product = model("Poduct", productSchema);
export default Product;
