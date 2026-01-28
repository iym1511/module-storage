'use client';

import React from 'react';
import { UserType } from '../../../../fetchData/fetch-get';
import { Button as ShButton } from '@/components/ui/button';
import DrawerSlide from '@/app/(afterLogin)/home/_components/DrawerSlide';
import Contents from '@/app/(afterLogin)/home/_components/Contents';
import InfiniteScrollExample from '@/app/(afterLogin)/home/_components/InfiniteScrollExample';
import PaginationExample from '@/app/(afterLogin)/home/_components/PaginationExample';
import UserList from './UserList';
import PriceFilter from './PriceFilter';
import UIComponentDemo from './UIComponentDemo';

interface MainContentsProps {
    placeholderAry: UserType[];
}

function MainContents({ placeholderAry }: MainContentsProps) {
    const handleRefreshToken = async () => {
        // await refreshAccessToken();
        console.log('Refresh Token requested');
    };

    return (
        <div className="container mx-auto p-4 space-y-12">
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">3시30분 제일전기</p>
                        <h1 className="text-2xl font-bold">홈 페이지입니다~</h1>
                    </div>
                    <button 
                        onClick={handleRefreshToken}
                        className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 text-sm"
                    >
                        리프래시 토큰 발급
                    </button>
                </div>
            </section>
            
            <section className="space-y-6">
                <h2 className="text-xl font-semibold border-b pb-2">1. 사용자 목록 (Server Initial Data + React Query)</h2>
                {/* 데이터 페칭 및 리스트 표시 로직 분리 */}
                <UserList />
            </section>
            
            <section className="space-y-6">
                 <h2 className="text-xl font-semibold border-b pb-2">2. Shadcn 버튼 테스트</h2>
                 <ShButton>Shadcn Button</ShButton>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-semibold border-b pb-2">3. 가격 필터 (Client State)</h2>
                {/* 가격 슬라이더 로직 분리 */}
                <PriceFilter />
            </section>
            
            <section>
                {/* UI 데모 컴포넌트 모음 분리 */}
                <UIComponentDemo />
            </section>

            <section className="space-y-6">
                 <h2 className="text-xl font-semibold border-b pb-2">4. 기타 컨텐츠</h2>
                 <Contents />
            </section>

            <section className="space-y-6">
                 <h2 className="text-xl font-semibold border-b pb-2">5. 무한 스크롤 예제</h2>
                 <InfiniteScrollExample />
            </section>

            <section className="space-y-6">
                 <h2 className="text-xl font-semibold border-b pb-2">6. 페이지네이션 예제</h2>
                 <PaginationExample />
            </section>

            <div className="pb-20">
                <DrawerSlide />
            </div>
        </div>
    );
}

export default MainContents;