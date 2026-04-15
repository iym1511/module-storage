import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import MainContents from '@/app/(afterLogin)/home/_components/MainContents';
import { cookies } from 'next/headers';
import { queryKeys } from '@/lib/query-keys';
import { fetchInfiniteItemsFromApi2, FetchInfiniteResult } from '@/fetchData/fetch-infinite';
import { apiTest2 } from '@/fetchData/fetch-get';
import { fetchPaginatedItems2 } from '@/fetchData/fetch-pagination';

async function Page() {
    const queryClient = new QueryClient();

    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    // 모든 Query를 병렬로 Prefetch
    await Promise.all([
        // 유저 리스트 호출
        queryClient.prefetchQuery({
            ...queryKeys.user.list,
            queryFn: () => apiTest2(cookieString),
        }),

        // 인피니티 스크롤
        queryClient.prefetchInfiniteQuery({
            ...queryKeys.home.infinite,
            queryFn: ({ pageParam }: { pageParam: number }) =>
                fetchInfiniteItemsFromApi2({
                    pageParam,
                    cookieString: cookieString,
                }),
            initialPageParam: 0,
            // lastPage를 일단 받은 다음, (lastPage as 타입) 형태로 꺼내 쓰기
            getNextPageParam: (lastPage) => (lastPage as FetchInfiniteResult).nextCursor,
        }),

        // 페이지 네이션
        queryClient.prefetchQuery({
            ...queryKeys.home.paginated(1),
            queryFn: () => fetchPaginatedItems2({ page: 1, cookieString }),
        }),
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <MainContents />
        </HydrationBoundary>
    );
}

export default Page;
