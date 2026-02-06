import { createKy } from '@/util/api';

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

/* next api 를 사용하지않을때 ⭐ */
export const fetchPaginatedItems2 = async ({
    page,
    limit = 5,
    cookieString,
}: {
    page: number;
    limit?: number;
    cookieString?: string | undefined;
}): Promise<PaginatedResponse> => {
    // createKy 유틸리티를 사용하여 요청 및 응답 파싱
    const result = await createKy(cookieString)
        .get('infinite/pagination', {
            searchParams: {
                page,
                limit,
            },
        })
        .json<PaginatedResponse>();
    return result;
};
