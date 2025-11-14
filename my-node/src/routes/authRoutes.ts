import { Router } from "express";
import {signUp, login, refreshToken, getUsers, verifyAccessToken} from "../controllers/authController";
import {authenticateToken} from "../middleware/auth.middleware";

const router = Router();

/* POST */
router.post("/signup", signUp);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/verify-token", verifyAccessToken);

/* GET */
router.get("/get-users", authenticateToken, getUsers);

/* DELETE */

/* PETCH */

/* UPDATE */


export default router;