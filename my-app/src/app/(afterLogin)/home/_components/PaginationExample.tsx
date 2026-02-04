'use client';

import React, { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchPaginatedItems2 } from '@/fetchData/fetch-pagination';
import { Card } from '@/components/ui/ui-Button';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getCookie } from 'cookies-next';

export default function PaginationExample() {
    const token = getCookie('access_token');
    const [page, setPage] = useState(1);

    // useQuery 사용 (기존 데이터를 유지하며 새 데이터 fetch -> 깜빡임 방지)
    const { data, isLoading, isError, isPlaceholderData } = useQuery({
        queryKey: ['paginatedItems', page],
        queryFn: () => fetchPaginatedItems2({ page, cookieString: token }),
        placeholderData: keepPreviousData, // 👈 중요! 새 데이터를 가져올 때까지 이전 데이터를 보여줌 (깜빡임 방지 / 페이지네이션에 유용)
    });

    const handlePrev = () => setPage((old) => Math.max(old - 1, 1));
    const handleNext = () => {
        if (!isPlaceholderData && data?.currentPage && data.currentPage < data.totalPages) {
            setPage((old) => old + 1);
        }
    };

    return (
        <div className="p-4 border rounded-xl bg-white dark:bg-slate-900 shadow-lg max-w-md mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4 px-2">페이지네이션 (useQuery)</h2>

            <div className="min-h-[400px] space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-lg" />
                        ))}
                    </div>
                ) : isError ? (
                    <p className="text-red-500 p-4">데이터 로딩 중 오류가 발생했습니다.</p>
                ) : (
                    <>
                        {data?.data.map((item) => (
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
                    </>
                )}
            </div>

            {/* 페이지네이션 컨트롤 */}
            <div className="flex justify-between items-center mt-6 px-2">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="w-24"
                >
                    이전
                </Button>

                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {page} / {data?.totalPages || 1}
                </span>

                <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={isPlaceholderData || (data ? page === data.totalPages : true)}
                    className="w-24"
                >
                    다음
                </Button>
            </div>
        </div>
    );
}
