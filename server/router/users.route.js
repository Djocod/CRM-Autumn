import { Router } from "express";
import {
  handleGetUser,
  handleGetAllUser,
  handleGetUserById,
  handlePatchBuyProducts,
  handlePatchViewProducts,
  handleDeletePurchaseProducts,
  handleDeleteViewProducts,
} from "../controller/users.controller.js";
const router = Router();

// Read
router.get("/", handleGetAllUser);
router.get("/search/:lastname", handleGetUser);
router.get("/:id", handleGetUserById);

// PATCH
router.patch("/:sessionType/:productId/purchase", handlePatchBuyProducts);
router.patch("/:productId/viewed", handlePatchViewProducts);

// DELETE
router.delete(
  "/:sessionType/:productId/purchase",
  handleDeletePurchaseProducts,
);
router.delete("/:productId/viewed", handleDeleteViewProducts);

export default router;
