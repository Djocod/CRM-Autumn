import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB successfull"))
  .catch((err) => console.error("Error connection :", err.message));

app.get("/products", async (req, res) => {
  try {
    const response = await axios.get(
      "https://app.retailed.io/api/usage | jq .",
      {
        params: { query: "shoes" },
        headers: {
          "x-api-key": process.env.RETAILED_TOKEN,
        },
      },
    );
    res.json(response.data);
    console.log(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("Hell world!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running n http://localhost:${port}`);
});
