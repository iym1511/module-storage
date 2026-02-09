import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  createBoard,
  deleteBoard,
  getBoardById,
  getBoards,
  updateBoard,
} from "../controllers/boardController";

const router = Router();

// Public routes (누구나 조회 가능)
router.get("/", authenticateToken, getBoards);
router.get("/:id", authenticateToken, getBoardById);

// Protected routes (로그인 필요)
router.post("/", authenticateToken, createBoard);
router.put("/:id", authenticateToken, updateBoard);
router.delete("/:id", authenticateToken, deleteBoard);

export default router;
