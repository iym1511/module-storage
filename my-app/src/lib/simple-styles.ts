
/**
 * 초간단 스타일 유틸리티
 * 자주 쓰는 Tailwind 조합만 모아놓음
 * 복붙해서 바로 사용!
 */

// 레이아웃
export const center = 'flex items-center justify-center';
export const between = 'flex items-center justify-between';
export const stack = 'flex flex-col gap-4';

// 카드
export const card = 'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm';
export const cardHover = 'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow';

// 버튼
export const btnPrimary = 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors';
export const btnSecondary = 'px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors';
export const btnOutline = 'px-4 py-2 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg font-medium transition-colors';

// 입력
export const input = 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
export const inputLabel = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

// 텍스트
export const title = 'text-3xl font-bold text-gray-900 dark:text-gray-100';
export const subtitle = 'text-xl font-semibold text-gray-800 dark:text-gray-200';
export const body = 'text-base text-gray-700 dark:text-gray-300';
export const small = 'text-sm text-gray-600 dark:text-gray-400';

// 컨테이너
export const container = 'max-w-7xl mx-auto px-4';
export const section = 'py-16 px-4';