'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type Props = {
    children: React.ReactNode;
};

function RQProvider({ children }: Props) {
    const [client] = useState(
        new QueryClient({
            defaultOptions: {
                // react-query 전역 설정
                queries: {
                    staleTime: 1000 * 60,
                    gcTime: 1000 * 60 * 5,
                    // 사용자가 다시 브라우저로 돌아왔을 때(refocus), 자동으로 refetch 하지 않음
                    refetchOnWindowFocus: false,

                    // 컴포넌트가 마운트될 때, 이전에 실패한 쿼리라도 다시 시도함
                    retryOnMount: true,

                    // 네트워크 연결이 끊겼다가 다시 연결될 때 자동 refetch 하지 않음
                    refetchOnReconnect: false,

                    // 쿼리 실패 시 재시도 안 함 (기본은 3회 재시도)
                    retry: false,
                },
            },
        }),
    );
    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={process.env.NEXT_PUBLIC_MODE === 'local'} />
        </QueryClientProvider>
    );
}

export default RQProvider;
