import { Request, Response } from "express";
import pool from "../util/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import redis from "../redis/redis";

dotenv.config();

interface DecodedToken {
  email: string;
  name?: string;
  tokenId: string;
  iat: number;
  exp: number;
}

interface VerifyResult {
  success: boolean;
  data?: DecodedToken;
  error?: string;
  message?: string;
}

/**
 * 회원가입
 */
// (기존 import 문은 그대로 유지: import { v4 as uuidv4 } from "uuid";)

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // 이메일 중복 체크
    const checkResult = await pool.query(
      "SELECT id FROM auth.users WHERE email = $1",
      [email],
    );
    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        error: "EMAIL_EXISTS",
        message: "이미 존재하는 이메일입니다.",
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // ⭐ [수정 1] ID 직접 생성하기
    const id = uuidv4();

    // ⭐ [수정 2] 쿼리에 id 추가하기 ($1 자리에 id 넣고, 나머지는 한 칸씩 뒤로)
    // 순서: id($1), email($2), password_hash($3), name($4)
    const result = await pool.query(
      "INSERT INTO auth.users (id, email, password_hash, name) VALUES ($1, $2, $3, $4) RETURNING email, name",
      [id, email, hashedPassword, name || null],
    );

    const newUser = result.rows[0];
    return res
      .status(201)
      .json({ user: { email: newUser.email, name: newUser.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "서버 오류가 발생했습니다.",
    });
  }
};

/**
 * 로그인
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // (수정: users -> auth.users)
    const result = await pool.query(
      "SELECT email as v_email, name as v_name, password_hash as v_password_hash FROM auth.users WHERE email = $1",
      [email],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
        message: `이메일 또는 비밀번호가 올바르지 않습니다.`,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.v_password_hash,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
        message: "비밀번호가 올바르지 않습니다.",
      });
    }

    // 토큰 ID 생성 (고유 식별자)
    const tokenId = uuidv4();

    // Access Token 생성
    const accessToken = jwt.sign(
      { email: user.v_email, name: user.v_name },
      process.env.JWT_SECRET!,
      { expiresIn: "60s" },
    );

    // Refresh Token 생성 (tokenId 포함)
    const refreshToken = jwt.sign(
      { email: user.v_email, name: user.v_name, tokenId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    // Redis에 Refresh Token 저장 (Key: refresh_token:{email}, Value: tokenId)
    const redisKey = `refresh_token:${user.v_email}`;
    await redis.setex(redisKey, 7 * 24 * 60 * 60, tokenId); // 7일 TTL

    // // 쿠키 세팅
    // res.cookie("access_token", accessToken, {
    //   httpOnly: false,
    //   secure: true,
    //   sameSite: "lax",
    //   maxAge: 60 * 1000,
    //   path: "/",
    // });
    //
    // res.cookie("refresh_token", refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    //   path: "/",
    // });

    return res.status(200).json({
      user: { email: user.v_email, name: user.v_name },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "서버 오류가 발생했습니다.",
    });
  }
};

/**
 * 토큰 갱신
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const tokenId = uuidv4();
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: "NO_REFRESH_TOKEN",
        message: "리프레시 토큰이 존재하지 않습니다.",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as DecodedToken;
    const redisKey = `refresh_token:${decoded.email}`;
    const storedTokenId = await redis.get(redisKey);

    if (!storedTokenId || storedTokenId !== decoded.tokenId) {
      return res.status(401).json({
        error: "INVALID_TOKEN",
        message: "유효하지 않은 토큰입니다.",
      });
    }

    // (수정: users -> auth.users)
    const result = await pool.query(
      "SELECT id, email, name FROM auth.users WHERE email = $1",
      [decoded.email],
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: "USER_NOT_FOUND",
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    const accessToken = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "15s" },
    );

    const newRefreshToken = jwt.sign(
      { email: user.email, name: user.name, tokenId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    const redisSaveKey = `refresh_token:${user.email}`;
    await redis.setex(redisSaveKey, 7 * 24 * 60 * 60, tokenId);

    return res
      .status(200)
      .json({ access_token: accessToken, refresh_token: newRefreshToken });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "TOKEN_EXPIRED",
        message: "리프레시 토큰이 만료되었습니다.",
      });
    }

    return res.status(401).json({
      error: "INVALID_TOKEN",
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

/**
 * 로그아웃
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    console.log(
      "로그아웃 : ",
      req.body.refreshToken,
      req.cookies?.refresh_token,
    );
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken) as DecodedToken | null;
      if (decoded?.email) {
        await redis.del(`refresh_token:${decoded.email}`).catch(() => {});
      }
    }

    return res.status(200).json({ message: "로그아웃 성공" });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ message: "로그아웃 성공" });
  }
};

/**
 * Access Token 검증 (기존 유지)
 */
export const verifyAccessToken = (token: string): VerifyResult => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return {
      success: true,
      data: decoded,
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        error: "TOKEN_EXPIRED",
        message: "토큰이 만료되었습니다.",
      };
    }
    return {
      success: false,
      error: "INVALID_TOKEN",
      message: "유효하지 않은 토큰입니다.",
    };
  }
};

/**
 * Refresh Token 검증 (기존 유지)
 */
export const verifyRefreshToken = (token: string): VerifyResult => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!,
    ) as DecodedToken;
    return {
      success: true,
      data: decoded,
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        error: "REFRESH_TOKEN_EXPIRED",
        message: "리프레시 토큰이 만료되었습니다.",
      };
    }
    return {
      success: false,
      error: "INVALID_REFRESH_TOKEN",
      message: "유효하지 않은 리프레시 토큰입니다.",
    };
  }
};

/**
 * Bearer 토큰 검증 (기존 유지)
 */
export const verifyBearerToken = (
  authHeader: string | undefined,
): VerifyResult => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      error: "INVALID_AUTH",
      message: "인증 헤더가 올바르지 않습니다.",
    };
  }
  const token = authHeader.substring(7);
  return verifyAccessToken(token);
};

/**
 * 전체 사용자 조회 (Postgres 버전)
 */
export const getUsers = async (_req: Request, res: Response) => {
  try {
    // (수정: users -> auth.users)
    const result = await pool.query(
      "SELECT id, email, name, created_at FROM auth.users",
    );
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: "DB_ERROR" });
  }
};
