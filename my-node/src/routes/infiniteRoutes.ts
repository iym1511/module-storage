import { Router } from "express";
import { getInfiniteData } from "../controllers/infiniteController";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// GET /api/infinite/items
router.get("/items", authenticateToken, getInfiniteData);

export default router;
