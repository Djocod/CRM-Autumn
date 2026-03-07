import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./users/route.users.js";
import productRoutes from "./products/route.products.js";

dotenv.config();

const app = express();
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running n http://localhost:${port}`);
});
