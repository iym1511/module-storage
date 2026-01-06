'use client';
import React, { useEffect, useState } from 'react';

import { apiTest, UserType } from '../../../../fetchData/fetch-get';
import { ThemeToggle } from '@/components/theme-toggle';

import { Button as ShButton } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import DrawerSlide from '@/app/(afterLogin)/home/_components/DrawerSlide';
import Pagination from '@/components/ui/Pagenation/Pagination';
import { Search } from 'lucide-react';
import Modal from '@/components/ui/Modal/Modal';
import { Button, Card, Input } from '@/components/ui/ui-Button';

function MainContents() {
    const [price, setPrice] = useState<[number, number]>([10000, 50000]);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [size, setSize] = useState('xl');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [ary, setAry] = useState<UserType[] | null>();

    const fetchData = async () => {
        const result = await apiTest();
        setAry(result); // ✅ 결과를 state에 반영
    };

    const 리프래시토큰재발급 = async () => {
        // await refreshAccessToken();
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            <ShButton>버튼~~</ShButton>
            <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-between text-sm">
                    <span>{price[0].toLocaleString()}원</span>
                    <span>{price[1].toLocaleString()}원</span>
                </div>

                <Slider
                    value={price}
                    onValueChange={(value) => setPrice(value as [number, number])}
                    min={0}
                    max={100000}
                    step={1000}
                />
            </div>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* 헤더 */}
                <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="container-custom between py-4">
                        <h1 className="text-title">내 사이트</h1>
                        <ThemeToggle />
                    </div>
                </header>
                <Search className="w-5 h-5" />
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

                        {/* 모달 */}
                        <div className="border border-card-border bg-card-bg rounded-lg shadow p-6 mb-6">
                            <h2 className="text-fg text-xl font-semibold mb-4">크기 선택</h2>
                            <div className="flex gap-3 mb-6">
                                {['sm', 'md', 'lg', 'xl'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSize(s)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            size === s
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {s.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsOpen(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Modal 열기
                            </button>
                        </div>
                        <Modal
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            title="모달 제목"
                            size={size}
                            closeOnOverlay={true}
                        >
                            <div className="space-y-4">
                                <p className="text-fg">
                                    이것은 재사용 가능한 Modal 컴포넌트입니다. 다양한 크기와 옵션을
                                    제공합니다.
                                </p>
                                <p className="text-fg">
                                    오버레이를 클릭하거나 ESC 키를 눌러서 닫을 수 있습니다.
                                </p>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={() => {
                                            alert('확인 버튼이 클릭되었습니다!');
                                            setIsOpen(false);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        확인
                                    </button>
                                </div>
                            </div>
                        </Modal>

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

                        {/* 페이지네이션 */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={20}
                            onPageChange={setCurrentPage}
                            maxVisible={5}
                        />

                        {/* 커스텀 스타일 */}
                        <div className="mt-6 p-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center">
                            <h2 className="text-3xl font-bold mb-2">일회성 스타일은 여기서!</h2>
                            <p>컴포넌트 + Tailwind 조합 모두 가능</p>
                        </div>
                    </div>
                </main>
            </div>
            {/*<Contents/>*/}
            <br />
            <br />
            <br />
            <DrawerSlide />
        </div>
    );
}

export default MainContents;
