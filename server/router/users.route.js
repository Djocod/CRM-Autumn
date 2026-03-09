import { Router } from "express";
import {
  handleGetUser,
  handleGetAllUser,
  handleGetUserById,
  handlePatchBuyProducts,
  handlePatchViewProducts,
} from "../controller/users.controller.js";
const router = Router();

// Read
router.get("/", handleGetAllUser);
router.get("/search/:lastname", handleGetUser);
router.get("/:id", handleGetUserById);

// PATCH
router.patch("/:productId/purchase", handlePatchBuyProducts);
router.patch("/:productId/viewed", handlePatchViewProducts);

export default router;
