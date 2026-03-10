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
                    // [staleTime]: 데이터가 '신선하다'고 판정되어 백그라운드 재요청을 막는 시간 (기본값: 0)
                    // 0으로 설정하면, 화면에 재진입할 때마다 무조건 서버의 최신 데이터를 확인(Background Refetch)합니다.
                    // (이때 통신 중인 상태는 isFetching = true 로 나타납니다.)
                    staleTime: 0,
                    // staleTime: 1000 * 60

                    // [gcTime]: 화면에서 컴포넌트가 사라진 후 '메모리에 캐시를 유지하는' 시간 (기본값: 5분)
                    // 5분 안에 다시 페이지로 돌아오면, 백그라운드 통신을 기다리지 않고
                    // 이 메모리에 남은 캐시 데이터를 0초 만에 화면에 즉시 렌더링합니다.
                    gcTime: 1000 * 60 * 5,

                    /*
                                  💡 [상태값(Loading States) 사용 가이드]

                                  1. isPending (v5 기준 메인 로딩)
                                     - 의미: "메모리에 캐시된 데이터가 아예 없어서, 최초로 통신 중인가?"
                                     - 용도: 화면 전체를 덮는 로딩 스피너나 스켈레톤 UI를 띄울 때 무조건 이것만 사용!
                                     - 원리: gcTime 덕분에 캐시가 살아있다면 isPending은 false가 되므로, 로딩창 없이 캐시가 바로 보입니다.

                                  2. isFetching (보조/백그라운드 로딩)
                                     - 의미: "캐시 유무와 상관없이, 현재 서버와 어떤 통신이라도 하고 있는가?"
                                     - 용도: 화면 귀퉁이의 작은 '업데이트 중...' 텍스트나, 버튼 일시 비활성화 등에 사용.
                                     - 경고: 이걸로 메인 로딩창을 띄우면 staleTime: 0 때문에 매번 로딩창이 화면을 가려버립니다 (캐시 사용 불가).

                                  3. isPending(데이터 없음)과 isFetching(통신 중)이 둘 다 true일 때만 true가 됩니다

                                  * 참고: isLoading은 v5에서 isFetching && isPending 과 동일한 의미로 쓰입니다.
                                */

                    // 사용자가 다른 탭에 갔다가 다시 브라우저로 돌아왔을 때(refocus), 자동으로 refetch 하지 않음
                    refetchOnWindowFocus: false,

                    // 컴포넌트가 마운트될 때, 이전에 실패한 쿼리라도 다시 시도함
                    retryOnMount: true,

                    // 네트워크 연결이 끊겼다가 다시 연결될 때 자동 refetch 하지 않음
                    refetchOnReconnect: false,

                    // 쿼리 실패 시 서버에 재시도 폭탄을 던지지 않음 (기본은 3회 재시도)
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
