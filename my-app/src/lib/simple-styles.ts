/**
 * Tailwind 기본 색감 유지 + CSS 변수 기반 테마 반영 버전
 * Tailwind 4 문법 (var()) 완전 적용
 */

// 레이아웃 (색상 영향 없음)
export const center = 'flex items-center justify-center';
export const between = 'flex items-center justify-between';
export const stack = 'flex flex-col gap-4';

// 카드
export const card = `
  rounded-lg
  border border-[var(--card-border)]
  bg-[var(--card-bg)]
  p-6 shadow-smㄴ
`;

export const cardHover = `
  rounded-lg
  border border-[var(--card-border)]
  bg-[var(--card-bg)]
  p-6 shadow-sm
  hover:shadow-md transition-shadow
`;

// 버튼
export const btnPrimary = `
  px-4 py-2 rounded-lg font-medium transition-colors
  bg-[var(--color-btn-primary)]
  hover:bg-[var(--color-btn-primary-hover)]
  text-white
`;

export const btnSecondary = `
  px-4 py-2 rounded-lg font-medium transition-colors
  bg-[var(--color-btn-secondary)]
  hover:bg-[var(--color-btn-secondary-hover)]
  text-white
`;

export const btnOutline = `
  px-4 py-2 rounded-lg font-medium transition-colors
  border border-[var(--color-btn-primary)]
  text-[var(--color-btn-primary)]
  hover:bg-[color-mix(in srgb, var(--color-btn-primary) 10%, transparent)]
`;

// 입력
export const input = `
  w-full px-4 py-2 rounded-lg transition
  bg-[var(--card-bg)]
  border border-[var(--card-border)]
  text-[var(--foreground)]
  focus:outline-none focus:ring-2 focus:ring-[var(--color-btn-primary)]
`;

export const inputLabel = `
  block text-sm font-medium text-[var(--text-body)] mb-1
`;

// 텍스트
export const title = `
  text-3xl font-bold text-[var(--text-title)]
`;

export const subtitle = `
  text-xl font-semibold text-[var(--text-subtitle)]
`;

export const body = `
  text-base text-[var(--text-body)]
`;

export const small = `
  text-sm text-[var(--text-small)]
`;

// 컨테이너
export const container = `
  max-w-7xl mx-auto px-4
`;

export const section = `
  py-[var(--section-padding-y)] px-[var(--section-padding-x)]
`;
