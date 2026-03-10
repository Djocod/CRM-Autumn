import mongoose from "mongoose";
const { Schema, model } = mongoose;
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "EUR",
      uppercase: true,
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    ref: {
      type: String,
      trim: true,
      unique: true,
    },

    sizes: [
      {
        type: String,
        trim: true,
      },
    ],

    colors: [
      {
        name: { type: String, trim: true },
        hex: { type: String, trim: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);
const Product = model("Product", productSchema);
export default Product;
