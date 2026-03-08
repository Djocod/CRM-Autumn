import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/schema.products";
import { readFile } from "fs/promises";

dotenv.config();

const products = JSON.parse(await readFile("./jsonFile/products.json"));

await mongoose.connect(process.env.MONGO_URI);

await Product.deleteMany({});
await Product.insertMany(products);

console.log("Produits importés!");
await mongoose.disconnect();
