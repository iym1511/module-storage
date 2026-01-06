import { Router } from "express";
import {
  getUsers,
  login,
  refreshToken,
  signUp,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/auth.middleware";
import { healthTest } from "../controllers/health";

const router = Router();

/* POST */
router.post("/signup", signUp);
router.post("/login", login);
router.post("/refresh", refreshToken);
// router.post("/verify-token", verifyAccessToken);

// 🔥 health 체크 추가
router.get("/health", healthTest);

/* GET */
router.get("/get-users", authenticateToken, getUsers);

/* DELETE */

/* PETCH */

/* UPDATE */

export default router;
