import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
router.get("/product", async (req, res) => {
  try {
    const response = await axios.get(
      "https://app.retailed.io/api/v1/scraper/goat/search",
      {
        params: {
          query: "jordan+1",
        },
        headers: {
          "x-api-key": process.env.RETAILED_TOKEN,
        },
      },
    );
    return res.json(response.data);
  } catch (err) {
    console.error("Status:", err.response?.status);
    console.error("Retailed error:", err.response?.data);
    res.status(500).json({
      error: err.message,
      detail: err.response?.data,
    });
  }
});
export default router;
