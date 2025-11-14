import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// 1️⃣ 사용자 정의 타입 (JWT 페이로드)
interface DecodedUser extends JwtPayload {
    email: string;
    name?: string;
}

// 2️⃣ Express Request 확장 (req.user 타입 추가)
declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser;
        }
    }
}

// 3️⃣ 미들웨어 함수 타입 지정
export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

    if (!accessToken) {
        return res.status(401).json({
            error: "NO_TOKEN",
            message: "토큰이 없습니다.",
        });
    }

    if (!accessToken) {
        return res.status(401).json({
            error: "NO_TOKEN",
            message: "토큰이 없습니다.",
        });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as DecodedUser;

        req.user = decoded;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: "TOKEN_EXPIRED",
                message: "토큰이 만료되었습니다.",
            });
        }
        return res.status(403).json({
            error: "INVALID_TOKEN",
            message: "유효하지 않은 토큰입니다.",
        });
    }
}
