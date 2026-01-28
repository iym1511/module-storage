import { Router } from "express";
import { getInfiniteData, getPaginatedData } from "../controllers/infiniteController";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// GET /api/infinite/items (Cursor-based)
router.get("/items", authenticateToken, getInfiniteData);

// GET /api/infinite/pagination (Offset-based)
router.get("/pagination", authenticateToken, getPaginatedData);

export default router;
