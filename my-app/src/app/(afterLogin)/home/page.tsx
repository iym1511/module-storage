import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import MainContents from '@/app/(afterLogin)/home/_components/MainContents';
import { UserType } from '@/fetchData/fetch-get';
import { cookies } from 'next/headers';
import { queryKeys } from '@/lib/query-keys';
import { FetchInfiniteResult } from '@/fetchData/fetch-infinite';

async function Page() {
    const queryClient = new QueryClient();

    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    // 모든 Query를 병렬로 Prefetch
    await Promise.all([
        // 유저 리스트 호출
        queryClient.prefetchQuery(queryKeys.user.list(cookieString)),

        // 인피니티 스크롤
        queryClient.prefetchInfiniteQuery({
            ...queryKeys.home.infinite(cookieString),
            initialPageParam: 0,
            // lastPage를 일단 받은 다음, (lastPage as 타입) 형태로 꺼내 쓰기
            getNextPageParam: (lastPage) => (lastPage as FetchInfiniteResult).nextCursor,
        }),

        // 페이지 네이션
        queryClient.prefetchQuery(queryKeys.home.paginated(1, cookieString)),
    ]);

    const dehydratedState = dehydrate(queryClient);

    // placeholder로 사용할 더미 데이터
    const placeholderAry: UserType[] = [
        {
            created_at: new Date().toISOString(),
            email: 'placeholder1@example.com',
            id: 'placeholder_id_1',
            name: 'Placeholder User 1',
            password_hash: 'placeholder_hash_1',
        },
        {
            created_at: new Date().toISOString(),
            email: 'placeholder2@example.com',
            id: 'placeholder_id_2',
            name: 'Placeholder User 2',
            password_hash: 'placeholder_hash_2',
        },
    ];

    return (
        <HydrationBoundary state={dehydratedState}>
            <MainContents placeholderAry={placeholderAry} />
        </HydrationBoundary>
    );
}

export default Page;
