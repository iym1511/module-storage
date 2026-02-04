import { createKy } from '@/util/api';
import { CookieValueTypes } from 'cookies-next';

export interface Post {
    id: number;
    title: string;
    description: string;
}

export interface PaginatedResponse {
    data: Post[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

/**
 * ky를 사용한 페이지네이션 API 호출 함수 / next api 사용 ❤️
 */
export const fetchPaginatedItems = async ({
    page,
    limit = 5,
    cookieString,
}: {
    page: number;
    limit?: number;
    cookieString?: string;
}): Promise<PaginatedResponse> => {
    // createKy 유틸리티를 사용하여 요청 및 응답 파싱
    const result = await createKy(cookieString)
        .get('api/infinite/pagination', {
            searchParams: {
                page,
                limit,
            },
        })
        .json<PaginatedResponse>();
    return result;
};

/* next api 를 사용하지않을때 ⭐ */

export const fetchPaginatedItems2 = async ({
    page,
    limit = 5,
    cookieString,
}: {
    page: number;
    limit?: number;
    cookieString?: string | CookieValueTypes | Promise<CookieValueTypes>;
}): Promise<PaginatedResponse> => {
    // 문자열일 때만 validCookie로 사용
    const validCookie = typeof cookieString === 'string' ? cookieString : undefined;

    // createKy 유틸리티를 사용하여 요청 및 응답 파싱
    const result = await createKy(validCookie)
        .get('infinite/pagination', {
            searchParams: {
                page,
                limit,
            },
        })
        .json<PaginatedResponse>();
    return result;
};
