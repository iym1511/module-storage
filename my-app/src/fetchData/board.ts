import { createKy } from '@/util/api';
import type { Board, CreateBoardRequest, UpdateBoardRequest } from '@/types/board';

/**
 * 게시글 목록 조회
 */
export const fetchBoards = async (cookie?: string) => {
    try {
        const data = await createKy(cookie).get('board').json<Board[]>();
        return data;
    } catch (error) {
        console.error('❌ 게시글 목록 조회 실패:', error);
        throw error;
    }
};

/**
 * 게시글 상세 조회
 */
export const fetchBoardById = async (id: string) => {
    try {
        const data = await createKy().get(`board/${id}`).json<Board>();
        return data;
    } catch (error) {
        console.error(`❌ 게시글(${id}) 조회 실패:`, error);
        throw error;
    }
};

/**
 * 게시글 작성
 */
export const createBoard = async (payload: CreateBoardRequest) => {
    try {
        const data = await createKy().post('board', { json: payload }).json<Board>();
        return data;
    } catch (error) {
        console.error('❌ 게시글 작성 실패:', error);
        throw error;
    }
};

/**
 * 게시글 수정
 */
export const updateBoard = async (id: string, payload: UpdateBoardRequest) => {
    try {
        const data = await createKy().put(`board/${id}`, { json: payload }).json<Board>();
        return data;
    } catch (error) {
        console.error(`❌ 게시글(${id}) 수정 실패:`, error);
        throw error;
    }
};

/**
 * 게시글 삭제
 */
export const deleteBoard = async (id: string) => {
    try {
        await createKy().delete(`board/${id}`);
    } catch (error) {
        console.error(`❌ 게시글(${id}) 삭제 실패:`, error);
        throw error;
    }
};
