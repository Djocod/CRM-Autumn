import { Router } from "express";
import {
  handleGetUser,
  handleGetAllUser,
  handleGetUserById,
} from "../controller/users.controller.js";
const router = Router();

// Read
router.get("/", handleGetAllUser);
router.get("/search/:lastname", handleGetUser);
router.get("/:id", handleGetUserById);

export default router;
