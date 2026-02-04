import { Request, Response } from "express";
import pool from "../util/db";

/**
 * 게시글 목록 조회
 * GET /board
 */
export const getBoards = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT b.id, b.title, b.content, b.created_at, b.author_id, u.email as author_email, u.name as author_name
      FROM public.boards b
      LEFT JOIN auth.users u ON b.author_id = u.id
      ORDER BY b.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB_ERROR", message: "게시글 목록을 불러오지 못했습니다." });
  }
};

/**
 * 게시글 상세 조회
 * GET /board/:id
 */
export const getBoardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT b.id, b.title, b.content, b.created_at, b.author_id, u.email as author_email, u.name as author_name
      FROM public.boards b
      LEFT JOIN auth.users u ON b.author_id = u.id
      WHERE b.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "NOT_FOUND", message: "게시글을 찾을 수 없습니다." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB_ERROR", message: "게시글을 불러오지 못했습니다." });
  }
};

/**
 * 게시글 작성
 * POST /board
 */
export const createBoard = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "로그인이 필요합니다." });
    }

    const query = `
      INSERT INTO public.boards (title, content, author_id)
      VALUES ($1, $2, (SELECT id FROM auth.users WHERE email = $3))
      RETURNING *
    `;
    const result = await pool.query(query, [title, content, userEmail]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB_ERROR", message: "게시글 작성에 실패했습니다." });
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
      return res.status(401).json({ error: "UNAUTHORIZED", message: "로그인이 필요합니다." });
    }

    // 작성자 확인 (본인만 수정 가능)
    const checkQuery = `
      SELECT b.id
      FROM public.boards b
      JOIN auth.users u ON b.author_id = u.id
      WHERE b.id = $1 AND u.email = $2
    `;
    const checkResult = await pool.query(checkQuery, [id, userEmail]);

    if (checkResult.rows.length === 0) {
      return res.status(403).json({ error: "FORBIDDEN", message: "수정 권한이 없습니다." });
    }

    const updateQuery = `
      UPDATE public.boards
      SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(updateQuery, [title, content, id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB_ERROR", message: "게시글 수정에 실패했습니다." });
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
      return res.status(401).json({ error: "UNAUTHORIZED", message: "로그인이 필요합니다." });
    }

    // 작성자 확인
    const checkQuery = `
      SELECT b.id
      FROM public.boards b
      JOIN auth.users u ON b.author_id = u.id
      WHERE b.id = $1 AND u.email = $2
    `;
    const checkResult = await pool.query(checkQuery, [id, userEmail]);

    if (checkResult.rows.length === 0) {
      return res.status(403).json({ error: "FORBIDDEN", message: "삭제 권한이 없습니다." });
    }

    await pool.query("DELETE FROM public.boards WHERE id = $1", [id]);

    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB_ERROR", message: "게시글 삭제에 실패했습니다." });
  }
};
