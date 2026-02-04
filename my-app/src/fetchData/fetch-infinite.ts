import { createKy } from '@/util/api';
import { CookieValueTypes } from 'cookies-next';

export interface InfiniteItem {
    id: number;
    title: string;
    description: string;
}

export interface FetchInfiniteResult {
    data: InfiniteItem[];
    nextCursor: number | undefined;
}

/**
 * ky를 사용한 인피니티 스크롤 API 호출 함수 / next api 사용 ❤️
 */
// export const fetchInfiniteItemsFromApi = async ({
//     pageParam = 0,
//     cookieString,
// }: {
//     pageParam: number;
//     cookieString?: string | CookieValueTypes | Promise<CookieValueTypes>;
// }): Promise<FetchInfiniteResult> => {
//     // createKy()를 사용하여 백엔드 API 호출
//     const validCookie = typeof cookieString === 'string' ? cookieString : undefined;
//
//     // ⚠️ 바로 백엔드 호출 시 infinite/items
//     const result = await createKy(validCookie)
//         .get('api/infinite/items', {
//             searchParams: {
//                 cursor: pageParam,
//                 limit: 3,
//             },
//         })
//         .json<FetchInfiniteResult>();
//
//     return result;
// };

/* next api 를 사용하지않을때 ⭐ */
export const fetchInfiniteItemsFromApi2 = async ({
    pageParam = 0,
    cookieString,
}: {
    pageParam: number;
    cookieString?: string | CookieValueTypes | Promise<CookieValueTypes>;
}): Promise<FetchInfiniteResult> => {
    try {
        const validCookie = typeof cookieString === 'string' ? cookieString : undefined;

        const result = await createKy(validCookie)
            .get('infinite/items', {
                searchParams: {
                    cursor: pageParam,
                    limit: 3,
                },
            })
            .json<FetchInfiniteResult>();

        return result;
    } catch (error) {
        console.error('❌ Infinite API2 요청 실패:', error);
        throw error;
    }
};
