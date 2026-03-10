import { Router } from "express";
import {
  handleGetUser,
  handleGetAllUser,
  handleGetUserById,
  handlePatchBuyProducts,
  handlePatchViewProducts,
  handlePatchRefundProducts,
  handleDeleteRefundProducts,
  handleDeletePurchaseProducts,
  handleDeleteViewProducts,
} from "../controller/users.controller.js";
const router = Router();

// Read
router.get("/", handleGetAllUser);
router.get("/search/:lastname", handleGetUser);
router.get("/:id", handleGetUserById);

// PATCH
router.patch("/:productId/purchase", handlePatchBuyProducts);
router.patch("/:productId/viewed", handlePatchViewProducts);
router.patch("/:productId/refund", handlePatchRefundProducts);

// DELETE
router.delete("/:productId/purchase", handleDeletePurchaseProducts);
router.delete("/:productId/viewed", handleDeleteViewProducts);
router.delete("/:productId/refund", handleDeleteRefundProducts);

export default router;
