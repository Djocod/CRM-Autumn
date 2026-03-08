import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./router/users.route.js";
import productRoutes from "./router/products.route.js";
import cors from "cors";
// http://localhost:8000/api/users
// http://localhost:8000/api/users/search/Smith
// http://localhost:8000/api/product
// http://localhost:8000/api/product/search?brand=Gucci
// http://localhost:8000/api/product/:productId/viewed
// http://localhost:8000/api/product/:productId/purchase
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB successfull"))
  .catch((err) => console.error("Error connection :", err.message));

app.get("/", (req, res) => {
  res.send("Hell world!");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
