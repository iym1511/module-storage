'use client';

import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
// 무한스크롤 감지를 위해 react-intersection-observer 라이브러리 필요
import { useInView } from 'react-intersection-observer';
import { fetchInfiniteItemsFromApi2 } from '@/fetchData/fetch-infinite';
import { Card } from '@/components/ui/ui-Button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCookie } from 'cookies-next';

export default function InfiniteScrollExample() {
    const { ref, inView } = useInView();
    const token = getCookie('access_token');
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ['infiniteItems'],
        queryFn: ({ pageParam }) =>
            fetchInfiniteItemsFromApi2({
                pageParam: pageParam as number,
                cookieString: token as string,
            }),
        // queryFn: ({ pageParam }) => fetchInfiniteItemsFromApi2({ pageParam: pageParam as number }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            // nextCursor가 없으면 즉시 undefined 반환 (추가 로직 실행 안 함)
            if (!lastPage.nextCursor) {
                return undefined;
            }
            // 알아서 배열의 마지막 index 반환'lastPage 데이터 확인:', lastPage);
            return lastPage.nextCursor;
        },
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
    return (
        <div className="p-4 border rounded-xl bg-white dark:bg-slate-900 shadow-lg max-w-md mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4 px-2">내부 스크롤 무한 스크롤</h2>

            {/* 👇 스크롤이 생기는 컨테이너 박스 */}
            <div className="h-[400px] overflow-y-auto pr-2 space-y-4">
                {status === 'pending' ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-lg" />
                        ))}
                    </div>
                ) : status === 'error' ? (
                    <p className="text-red-500 p-4">데이터 로딩 중 오류가 발생했습니다.</p>
                ) : (
                    <>
                        {data?.pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {page.data.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="p-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-all hover:shadow-md"
                                    >
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            {item.description}
                                        </p>
                                    </Card>
                                ))}
                            </React.Fragment>
                        ))}

                        {/* 👇 관찰 대상 (박스 내부 가장 하단에 위치) + (리랜더링 방지) */}
                        <div
                            ref={hasNextPage ? ref : undefined}
                            className="h-20 flex justify-center items-center"
                        >
                            {isFetchingNextPage ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs text-blue-500 font-medium">로딩 중...</p>
                                </div>
                            ) : hasNextPage ? (
                                <p className="text-xs text-slate-400">스크롤하면 더 불러옵니다</p>
                            ) : (
                                <p className="text-xs text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    모든 아이템을 불러왔습니다
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
