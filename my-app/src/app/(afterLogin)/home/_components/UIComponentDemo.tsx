'use client';

import React, { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Search } from 'lucide-react';
import Modal from '@/components/ui/Modal/Modal';
import { Button, Card, Input } from '@/components/ui/ui-Button';
import Pagination from '@/components/ui/Pagenation/Pagination';

export default function UIComponentDemo() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [size, setSize] = useState('xl');
    const [currentPage, setCurrentPage] = useState<number>(1);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* 헤더 */}
            <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="container-custom between py-4 px-6 flex justify-between items-center">
                    <h1 className="text-xl font-bold">내 사이트 (UI 데모)</h1>
                    <div className="flex items-center gap-4">
                        <Search className="w-5 h-5" />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* 메인 */}
            <main className="section p-6">
                <div className="container-custom">
                    {/* 제목 */}
                    <div className="center stack mb-12 text-center">
                        <h2 className="text-2xl font-bold mb-2">방안 2: 컴포넌트 버전</h2>
                        <p className="text-gray-600 dark:text-gray-400">Button, Input, Card 컴포넌트 기반!</p>
                    </div>

                    {/* 카드 그리드 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card hover>
                            <h3 className="text-lg font-semibold mb-2">카드 1</h3>
                            <p className="text-sm">간단한 카드 컴포넌트</p>
                        </Card>

                        <Card hover>
                            <h3 className="text-lg font-semibold mb-2">카드 2</h3>
                            <p className="text-sm">다크모드 자동 지원</p>
                        </Card>

                        <Card hover>
                            <h3 className="text-lg font-semibold mb-2">카드 3</h3>
                            <p className="text-sm">props만 던지면 끝</p>
                        </Card>
                    </div>

                    {/* 버튼 */}
                    <Card className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">버튼 예시</h3>
                        <div className="flex gap-4 flex-wrap">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                        </div>
                    </Card>

                    {/* 모달 */}
                    <div className="border border-card-border bg-card-bg rounded-lg shadow p-6 mb-6 bg-white dark:bg-gray-800">
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

                    {/* 입력 */}
                    <Card className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">로그인 폼</h3>
                        <div className="space-y-4">
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
                    <div className="mt-6 p-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center shadow-lg">
                        <h2 className="text-3xl font-bold mb-2">일회성 스타일은 여기서!</h2>
                        <p>컴포넌트 + Tailwind 조합 모두 가능</p>
                    </div>
                </div>
            </main>

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
                    <div className="flex gap-3 pt-4 justify-end">
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
        </div>
    );
}
