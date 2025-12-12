'use client';
import React, {useEffect, useState} from 'react';

import {apiTest, UserType} from "../../../../fetchData/fetch-get";
import {ThemeToggle} from "@/components/theme-toggle";
import {Button, Card, Input} from "@/components/ui/Button";
import DrawerSlide from "@/app/(afterLogin)/home/_components/DrawerSlide";

function MainContents() {

    const [ary, setAry] = useState<UserType[] | null>();


    const fetchData = async () => {
        const result = await apiTest();
        setAry(result); // ✅ 결과를 state에 반영
    };

    const 리프래시토큰재발급 = async () => {
        // await refreshAccessToken();
    }

    useEffect(() => {
        fetchData();
    },[]);

    return (
        <div>
            3시30분 제일전기
            <h1>홈 페이지입니다~</h1>
            <button onClick={리프래시토큰재발급}>리프래시 토큰 발급</button>
            {ary?.map((item, index) => (
                <div key={index}>
                    <h3>{item.id}</h3>
                    <p>{item.name}</p>
                </div>
            ))}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

                {/* 헤더 */}
                <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="container-custom between py-4">
                        <h1 className="text-title">내 사이트</h1>
                        <ThemeToggle />
                    </div>
                </header>

                {/* 메인 */}
                <main className="section">
                    <div className="container-custom">

                        {/* 제목 */}
                        <div className="center stack mb-12">
                            <h2 className="text-title">방안 2: 컴포넌트 버전</h2>
                            <p className="text-body">Button, Input, Card 컴포넌트 기반!</p>
                        </div>

                        {/* 카드 그리드 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card hover>
                                <h3 className="text-subtitle">카드 1</h3>
                                <p className="text-body">간단한 카드 컴포넌트</p>
                            </Card>

                            <Card hover>
                                <h3 className="text-subtitle">카드 2</h3>
                                <p className="text-body">다크모드 자동 지원</p>
                            </Card>

                            <Card hover>
                                <h3 className="text-subtitle">카드 3</h3>
                                <p className="text-body">props만 던지면 끝</p>
                            </Card>
                        </div>

                        {/* 버튼 */}
                        <Card className="mb-6">
                            <h3 className="text-subtitle mb-4">버튼 예시</h3>
                            <div className="flex gap-4">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                            </div>
                        </Card>

                        {/* 입력 */}
                        <Card>
                            <h3 className="text-subtitle mb-4">로그인 폼</h3>
                            <div className="stack">
                                <Input label="이메일" placeholder="email@example.com" />
                                <Input label="비밀번호" type="password" placeholder="••••••••" />
                                <Button variant="primary" className="w-full">
                                    로그인
                                </Button>
                            </div>
                        </Card>

                        {/* 커스텀 스타일 */}
                        <div className="mt-6 p-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center">
                            <h2 className="text-3xl font-bold mb-2">
                                일회성 스타일은 여기서!
                            </h2>
                            <p>컴포넌트 + Tailwind 조합 모두 가능</p>
                        </div>

                    </div>
                </main>
            </div>
        {/*<Contents/>*/}
            <br />
            <br />
            <br />
            <DrawerSlide/>
        </div>
    );
}

export default MainContents;