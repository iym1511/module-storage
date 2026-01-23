import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import MainContents from '@/app/(afterLogin)/home/_components/MainContents';
import { apiTest, UserType } from '@/fetchData/fetch-get';
import { fetchInfiniteItemsFromApi } from '@/fetchData/fetch-infinite';
import { cookies } from 'next/headers';

async function Page() {
    const queryClient = new QueryClient();

    // 이렇게 프리패칭 하면 서버에서 미리 데이터를 가져다줘서 로딩안뜨고
    // 바로 데이터가 나와서 개빠르다.

    // ✅ Next 서버가 실행될때 브라우저에서 쿠키값을 전송해줘서 사용가능
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    // 모든 Query를 병렬로 Prefetch
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ['users'],
            queryFn: () => apiTest(cookieString),
        }),
        queryClient.prefetchInfiniteQuery({
            queryKey: ['infiniteItems'],
            queryFn: ({ pageParam }) =>
                fetchInfiniteItemsFromApi({
                    pageParam: pageParam as number,
                    cookieString,
                }),
            initialPageParam: 0,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }),
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
