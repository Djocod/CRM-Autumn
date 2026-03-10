import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/schema.products.js";
import { readFile } from "fs/promises";

dotenv.config();

const products = JSON.parse(await readFile("./jsonFile/products.json"));

await mongoose.connect(process.env.MONGO_URI);

// await Product.deleteMany({});
// await Product.insertMany(products);
for (const product of products) {
  await Product.findOneAndUpdate(
    { ref: product.ref },
    { $set: product },
    { upsert: true, new: true },
  );
}

console.log("Produits importés!");
await mongoose.disconnect();
