import { createKy } from '@/util/api';

export interface InfiniteItem {
    id: number;
    title: string;
    description: string;
}

export interface FetchInfiniteResult {
    data: InfiniteItem[];
    nextCursor: number | undefined;
}

/* next api 를 사용하지않을때 ⭐ */
export const fetchInfiniteItemsFromApi2 = async ({
    pageParam = 0,
    cookieString,
}: {
    pageParam: number;
    cookieString?: string | undefined;
}): Promise<FetchInfiniteResult> => {
    try {
        const result = await createKy(cookieString)
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
