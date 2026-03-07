import { Router } from "express";
import { handleGetUser } from "./users.controller.js";
const router = Router();

// Read
router.get("/search/:lastName", handleGetUser);

export default router;
