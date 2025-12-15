import React from 'react';

interface PaginationProps {
    currentPage: number; // 현제 페이지
    totalPages: number; // 총 페이지 갯수
    onPageChange: (page: number) => void;
    maxVisible?: number; // 한번에 보여줄 페이지 번호 수 (기본값: 5)
}

export default function Pagination({
                                       currentPage = 1,
                                       totalPages = 20,
                                       onPageChange,
                                       maxVisible = 5,
                                   }: PaginationProps) {
    // 페이지 번호 배열 생성
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const halfVisible = Math.floor(maxVisible / 2); // 현재페이지 중심 좌우 페이지 개수

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, currentPage + halfVisible);

        // 시작 부분 조정
        if (currentPage <= halfVisible) {
            endPage = Math.min(maxVisible, totalPages);
        }

        // 끝 부분 조정 5 + 2 >= 20 / (1, 20-5+1 16)
        if (currentPage + halfVisible >= totalPages) {
            startPage = Math.max(1, totalPages - maxVisible + 1);
        }

        // 첫 페이지와 ... 추가 (특정 페이지 부터 1, '...' 을 배열에 삽입)
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        // 중간 페이지들
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // 마지막 페이지와 ... 추가
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            {/* 이전 버튼 */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                이전
            </button>

            {/* 페이지 번호들 */}
            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="px-3 py-2">
              ...
            </span>
                    );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-4 py-2 rounded border transition-colors ${
                            isActive
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {pageNum}
                    </button>
                );
            })}

            {/* 다음 버튼 */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                다음
            </button>
        </div>
    );
}