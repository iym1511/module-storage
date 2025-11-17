import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import redis from "../redis/redis";

dotenv.config();

interface DecodedToken {
    email: string;
    name?: string;
    tokenId : string;
    iat: number;
    exp: number;
}

interface VerifyResult {
    success: boolean;
    data?: DecodedToken;
    error?: string;
    message?: string;
}


const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

/**
 * 회원가입
 */

/**
 * @openapi
 * /signup:
 *   post:
 *     summary: 회원가입
 *     description: 새로운 사용자를 생성합니다.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: "admin"
 *               name:
 *                 type: string
 *                 example: 홍길동
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: 이미 존재하는 이메일
 *       500:
 *         description: 서버 오류
 */
export const signUp = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // 이메일 중복 체크
        const { data: result } = await supabase.rpc("check_email", { p_email: email });
        if (result) {
            return res.status(400).json({
                error: "EMAIL_EXISTS",
                message: "이미 존재하는 이메일입니다.",
            });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        const { data: newUser, error } = await supabase.rpc("create_user", {
            p_email: email,
            p_password: hashedPassword,
            p_name: name || null,
        });

        if (error || !newUser) {
            return res.status(500).json({
                error: "SIGNUP_FAILED",
                message: "회원가입에 실패했습니다.",
            });
        }

        return res.status(201).json({ user: { email: newUser.email, name: newUser.name } });
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

/**
 * @openapi
 * /login:
 *   post:
 *     summary: 로그인
 *     description: 이메일과 비밀번호를 통해 로그인을 수행합니다.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: 로그인 성공 (AccessToken, RefreshToken 발급)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: 잘못된 자격 증명
 *       500:
 *         description: 서버 오류
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.rpc("get_user_by_email", { p_email: email });
        const user = data?.[0];
        console.log("user 함 보자 ", user);
        if (error || !user) {
            return res.status(401).json({
                error: "INVALID_CREDENTIALS",
                message: "이메일 또는 비밀번호가 올바르지 않습니다zzz.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.v_password_hash);
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
            { expiresIn: "5s" }
        );

        // Refresh Token 생성 (tokenId 포함)
        const refreshToken = jwt.sign(
            { email: user.v_email, name: user.v_name, tokenId },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: "7d" }
        );

        // Redis에 Refresh Token 저장 (Key: refresh_token:{email}, Value: tokenId)
        const redisKey = `refresh_token:${user.v_email}`;
        await redis.setex(redisKey, 7 * 24 * 60 * 60, tokenId); // 7일 TTL
        console.log("redisKey : ", redisKey);
        console.log("node_env : ", process.env.NODE_ENV);
        // 쿠키 세팅
        res.cookie("access_token", accessToken, {
            httpOnly: false, // ✅ 자바스크립트에서 접근 불가 (XSS 차단) 배포 후 true 변경
            secure: process.env.NODE_ENV === "production", // ✅ HTTPS에서만 전송 (HTTP에서는 차단됨)
            sameSite: "none", // ✅ cross-site 허용
            maxAge: 60 * 1000, // 5초
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: false, // 배포 후 true 변경
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
        });

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
        // ✅ 쿠키에서 리프레시 토큰 가져오기
        // const token = req.cookies.get('refresh_token')?.value;
        // console.log("백엔드 꺼 토큰",token)
        // const token = req.cookies["refresh_token"];
        // console.log("백엔드 쿠키 리프레시 토큰:", token);
        // 토큰 ID 생성 (고유 식별자)
        const tokenId = uuidv4();
        const refreshToken = req.body.refreshToken; // 파라미터로 쿠키 가져오기
        console.log("백 리프래시토큰 : ",refreshToken)
        if (!refreshToken) {
            return res.status(401).json({
                error: "NO_REFRESH_TOKEN",
                message: "리프레시 토큰이 존재하지 않습니다.",
            });
        }

        // ✅ Refresh Token 검증
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as DecodedToken;
        const redisKey = `refresh_token:${decoded.email}`;
        const storedTokenId = await redis.get(redisKey);
        console.log("⚙️decoded : ", decoded.tokenId);
        console.log("⚙️storedTokenId : ", storedTokenId)

        if (!storedTokenId || storedTokenId !== decoded.tokenId) {
            return res.status(401).json({
                error: "INVALID_TOKEN",
                message: "유효하지 않은 토큰입니다.",
            });
        }

        // ✅ 사용자 조회
        const { data: user, error } = await supabase
            .from("users")
            .select("id, email, name")
            .eq("email", decoded.email)
            .single();

        if (error || !user) {
            return res.status(401).json({
                error: "USER_NOT_FOUND",
                message: "사용자를 찾을 수 없습니다.",
            });
        }

        // ✅ 새로운 액세스 토큰 발급
        const accessToken = jwt.sign(
            { email: user.email, name: user.name },
            process.env.JWT_SECRET!,
            { expiresIn: "5s" }
        );

        // Refresh Token 생성 (tokenId 포함)
        const newRefreshToken = jwt.sign(
            { email: user.email, name: user.name, tokenId },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: "7d" }
        );

        // res.cookie("refresh_token", refreshToken, {
        //     httpOnly: false, // 배포 후 true 변경
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
        // });

        console.log('newRefreshToken : ', newRefreshToken);

        // Redis에 Refresh Token 저장 (Key: refresh_token:{email}, Value: tokenId)
        const redisSaveKey = `refresh_token:${user.email}`;
        await redis.setex(redisSaveKey, 7 * 24 * 60 * 60, tokenId); // 7일 TTL

        return res.status(200).json({ access_token : accessToken, refresh_token : newRefreshToken});
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
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                error: "NO_TOKEN",
                message: "리프레시 토큰이 필요합니다.",
            });
        }

        // Refresh Token 검증
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as DecodedToken;

        // Redis에서 토큰 삭제
        const redisKey = `refresh_token:${decoded.email}`;
        await redis.del(redisKey);

        // 쿠키 삭제
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        return res.status(200).json({
            message: "로그아웃 성공",
        });
    } catch (err) {
        return res.status(500).json({
            error: "LOGOUT_FAILED",
            message: "로그아웃에 실패했습니다.",
        });
    }
};


/**
 * Access Token 검증 함수
 */
export const verifyAccessToken = (token: string): VerifyResult => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        console.log(decoded);
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

        if (err instanceof jwt.JsonWebTokenError) {
            return {
                success: false,
                error: "INVALID_TOKEN",
                message: "유효하지 않은 토큰입니다.",
            };
        }

        return {
            success: false,
            error: "VERIFICATION_ERROR",
            message: "토큰 검증 중 오류가 발생했습니다.",
        };
    }
};


/**
 * Refresh Token 검증 함수
 */
export const verifyRefreshToken = (token: string): VerifyResult => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as DecodedToken;
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

        if (err instanceof jwt.JsonWebTokenError) {
            return {
                success: false,
                error: "INVALID_REFRESH_TOKEN",
                message: "유효하지 않은 리프레시 토큰입니다.",
            };
        }

        return {
            success: false,
            error: "VERIFICATION_ERROR",
            message: "리프레시 토큰 검증 중 오류가 발생했습니다.",
        };
    }
};

/**
 * Authorization 헤더에서 Bearer 토큰 추출 및 검증
 */
export const verifyBearerToken = (authHeader: string | undefined): VerifyResult => {
    if (!authHeader) {
        return {
            success: false,
            error: "NO_AUTH_HEADER",
            message: "Authorization 헤더가 없습니다.",
        };
    }

    if (!authHeader.startsWith("Bearer ")) {
        return {
            success: false,
            error: "INVALID_AUTH_FORMAT",
            message: "Authorization 헤더 형식이 올바르지 않습니다. 'Bearer {token}' 형식이어야 합니다.",
        };
    }

    const token = authHeader.substring(7);

    if (!token) {
        return {
            success: false,
            error: "NO_TOKEN",
            message: "토큰이 없습니다.",
        };
    }

    // Access Token으로 검증
    return verifyAccessToken(token);
};

/**
 * 전체 사용자 조회 (테스트용)
 */
export const getUsers = async (_req: Request, res: Response) => {
    const { data } = await supabase.from("users").select("*");
    return res.json(data);
};
