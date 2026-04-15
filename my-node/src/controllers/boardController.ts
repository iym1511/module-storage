import { Request, Response } from "express";
import pool from "../util/db";

/**
 * 게시글 목록 조회
 * GET /board
 */
export const getBoards = async (req: Request, res: Response) => {
  try {
    // 프로시저 호출 (함수가 테이블을 반환하므로 SELECT * FROM 사용)
    const query = `SELECT * FROM public.sp_get_boards()`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "DB_ERROR",
      message: "게시글 목록을 불러오지 못했습니다.",
    });
  }
};

/**
 * 게시글 상세 조회
 * GET /board/:id
 */
export const getBoardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM public.sp_get_board_by_id($1)`;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "DB_ERROR", message: "게시글을 불러오지 못했습니다." });
  }
};

/**
 * @swagger
 * /board:
 *   post:
 *     summary: 게시글 작성
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string, example: "안녕하세요" }
 *               content: { type: string, example: "반갑습니다." }
 *     responses:
 *       201:
 *         description: 작성 성공
 *       401:
 *         description: 인증 실패
 */
export const createBoard = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res
        .status(401)
        .json({ error: "UNAUTHORIZED", message: "로그인이 필요합니다." });
    }

    const query = `SELECT * FROM public.sp_create_board($1, $2, $3)`;
    const result = await pool.query(query, [title, content, userEmail]);

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.message === "User not found") {
      return res.status(400).json({
        error: "USER_NOT_FOUND",
        message: "사용자 정보를 찾을 수 없습니다.",
      });
    }
    res
      .status(500)
      .json({ error: "DB_ERROR", message: "게시글 작성에 실패했습니다." });
  }
};

/**
 * 게시글 수정
 * PUT /board/:id
 */
export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res
        .status(401)
        .json({ error: "UNAUTHORIZED", message: "로그인이 필요합니다." });
    }

    const query = `SELECT * FROM public.sp_update_board($1, $2, $3, $4)`;
    const result = await pool.query(query, [id, title, content, userEmail]);

    res.json(result.rows[0]);
    // 위 처럼 데이터 주는 이유
    // {
    //   command: 'SELECT',
    //     rowCount: 1,
    //   oid: null,
    //   rows: [  // 👈 여기에 진짜 데이터가 "배열"로 들어있음
    //   { id: 1, title: '안녕하세요', content: '반갑습니다' }
    // ],
    //   fields: [ ... ]
    // }
  } catch (err: any) {
    console.error(err);
    if (err.message.includes("Permission denied")) {
      return res
        .status(403)
        .json({ error: "FORBIDDEN", message: "수정 권한이 없습니다." });
    }
    if (err.message.includes("Board not found")) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." });
    }
    res
      .status(500)
      .json({ error: "DB_ERROR", message: "게시글 수정에 실패했습니다." });
  }
};

/**
 * 게시글 삭제
 * DELETE /board/:id
 */
export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res
        .status(401)
        .json({ error: "UNAUTHORIZED", message: "로그인이 필요합니다." });
    }

    const query = `SELECT * FROM public.sp_delete_board($1, $2)`;
    const result = await pool.query(query, [id, userEmail]);

    // sp_delete_board returns BOOLEAN (true if deleted, false if not found)
    const isDeleted = result.rows[0]?.sp_delete_board;

    if (isDeleted === false) {
      // null이 아니라 명시적 false인 경우
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." });
    }

    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (err: any) {
    console.error(err);
    if (err.message.includes("Permission denied")) {
      return res
        .status(403)
        .json({ error: "FORBIDDEN", message: "삭제 권한이 없습니다." });
    }
    res
      .status(500)
      .json({ error: "DB_ERROR", message: "게시글 삭제에 실패했습니다." });
  }
};
