import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

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
  next: NextFunction,
) {
  try {
    let accessToken: string | null = null;

    // ✅ 1순위: Cookie에서 토큰 확인
    if (req.cookies.access_token) {
      accessToken = req.cookies.access_token;
      console.log(
        "✅ Cookie에서 토큰 추출:",
        accessToken?.substring(0, 20) + "...",
      );
    }

    // ✅ 2순위: Authorization 헤더에서 확인 (하위 호환성)
    // if (!accessToken) {
    //   const authHeader = req.headers["authorization"];
    //   if (authHeader && authHeader.startsWith("Bearer ")) {
    //     accessToken = authHeader.split(" ")[1];
    //     console.log(
    //       "✅ Authorization 헤더에서 토큰 추출:",
    //       accessToken?.substring(0, 20) + "...",
    //     );
    //   }
    // }

    // 토큰이 없으면 401
    if (!accessToken) {
      console.log(
        "❌ 토큰 없음 - Cookie:",
        req.cookies,
        "Auth Header:",
        req.headers["authorization"],
      );
      return res.status(401).json({
        error: "NO_TOKEN",
        message: "토큰이 없습니다.",
      });
    }

    // 토큰 검증
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!,
    ) as DecodedUser;

    console.log("✅ 토큰 검증 성공:", decoded.email);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.log("❌ 토큰 만료");
      return res.status(401).json({
        error: "TOKEN_EXPIRED",
        message: "토큰이 만료되었습니다.",
      });
    }

    console.log("❌ 토큰 검증 실패:", err);
    return res.status(403).json({
      error: "INVALID_TOKEN",
      message: "유효하지 않은 토큰입니다.",
    });
  }
}
