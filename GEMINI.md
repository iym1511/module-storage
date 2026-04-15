# Project Context

## 기술 스택 (Tech Stack)

- **프레임워크:** Next.js (최신 버전, App Router 사용)
- **컴파일러:** React Compiler (Babel/SWC 대체, 자동 메모이제이션)
- **언어:** TypeScript
- **스타일링:** Tailwind CSS
- **클라이언트 상태 관리:** Zustand
- **서버 상태 관리:** TanStack Query (React Query)
- **폼 핸들링:** React Hook Form + Zod
- **인증:** JWT (HTTP-only Cookie 방식)

---

## 코딩 원칙 (Coding Principles)

### 1. Next.js App Router

- **서버 컴포넌트 우선:** 기본적으로 React Server Component(RSC)를 사용합니다. 훅이나 상호작용이 필요할 때만 `'use client'`를 명시합니다.
- **Server Actions 우선:** API Route는 불가피할 때만 사용합니다.
- **로딩/에러 처리:** `loading.tsx`, `error.tsx` 파일을 적극 활용합니다.
- **React Compiler (자동 메모이제이션):** `next.config.ts`에 `reactCompiler: true`가 설정되어 있습니다. 따라서 수동으로 `useMemo`나 `useCallback`을 사용하여 최적화하는 대신, 깨끗하고 선언적인 코드를 작성하는 데 집중합니다. 컴파일러가 렌더링 성능을 자동으로 최적화합니다.

### 2. 스타일링 (Tailwind)

- **Utility First:** Tailwind 유틸리티 클래스를 우선 사용합니다.
- **정렬:** `prettier-plugin-tailwindcss` 기준을 따릅니다.
- **모바일 우선:** `min-width` 기준으로 반응형을 작성합니다.
- **조건부 스타일:** `clsx`와 `tailwind-merge`를 조합하여 사용합니다.

### 3. Shadcn UI 활용 원칙

- **컴포넌트 설치:** 필요한 컴포넌트만 `npx shadcn-ui@latest add [component]`로 설치하여 사용합니다.
- **커스텀 가이드:** `components/ui`에 설치된 코드는 프로젝트 디자인 시스템에 맞게 적극적으로 수정하여 사용합니다. (복사-붙여넣기 기반이므로 소유권은 프로젝트에 있음)
- **Radix UI 활용:** 복잡한 인터페이스(Dialog, Dropdown 등)는 Shadcn이 래핑하고 있는 Radix UI의 원칙을 존중하며 기능을 확장합니다.
- **일관된 테마:** `globals.css`의 CSS 변수(`--primary`, `--background` 등)를 통해 테마를 제어하며, 직접적인 색상 코드 사용보다는 테마 변수 사용을 지향합니다.
- **재사용성:** 단순 UI 조각은 `components/ui`에, 비즈니스 로직이 포함된 컴포넌트는 `components/features` 또는 `app/features`에 위치시킵니다.

### 4. 아이콘 활용 원칙

- **Lucide React:** 모든 아이콘은 `lucide-react` 라이브러리를 사용합니다.
- **일관성:** 유사한 기능을 수행하는 요소에는 동일한 아이콘을 사용하여 사용자 경험의 일관성을 유지합니다.
- **접근성:** 아이콘이 단독으로 버튼 역할을 할 경우 `aria-label`을 반드시 제공합니다.

### 5. 이미지 최적화 원칙 (Next.js Image)

- **`next/image` 필수 사용:** 모든 이미지는 표준 `<img>` 태그 대신 Next.js의 `Image` 컴포넌트를 사용하여 자동 최적화(WebP 변환, 리사이징, 지연 로딩)를 적용합니다.
- **이미지 저장 위치:** 모든 정적 이미지 파일은 `public/images` 디렉토리에 체계적으로 관리합니다.
- **크기 명시:** 레이아웃 시프트(LCP) 방지를 위해 `width`와 `height`를 반드시 명시하거나, 부모 요소에 맞춰야 할 경우 `fill` 속성과 `object-fit`을 조합하여 사용합니다.
- **우선순위(Priority):** 페이지 상단에 위치하여 LCP에 직접적인 영향을 주는 이미지는 `priority` 속성을 부여하여 즉시 로드되도록 합니다.
- **외부 이미지:** 외부 도메인의 이미지를 사용할 경우 `next.config.ts`의 `remotePatterns`에 해당 도메인을 안전하게 등록하여 사용합니다.

### 6. SVG 최적화 및 컴포넌트 활용 (SVGR)

- **SVGR 적용:** `next.config.ts`의 Turbopack 설정을 통해 모든 `.svg` 파일은 React 컴포넌트로 자동 변환됩니다.
- **아이콘 저장 위치:** 모든 SVG 아이콘 파일은 `src/assets/icons` 디렉토리에 위치시켜 관리합니다.
- **사용 방식:** `<img>` 태그를 사용하는 대신, SVG 파일을 직접 `import`하여 컴포넌트처럼 사용합니다. (예: `import LogoIcon from '@/assets/icons/logo.svg'`)
- **스타일링:** SVG 컴포넌트에 `className`을 전달하여 Tailwind CSS로 크기(`w-6 h-6`), 색상(`text-primary`), 회전 등을 간편하게 제어합니다.
- **최적화:** SVGR은 내부적으로 SVGO를 사용하여 SVG 코드의 불필요한 메타데이터와 공백을 제거하여 번들 크기를 최적화합니다.

### 7. 상태 관리 (State Management)

- **서버 상태:** TanStack Query만 사용합니다. (`useEffect` 내부에서 `fetch` 금지)
- **전역 UI 상태:** Zustand를 사용합니다.
- **로컬 상태:** `useState`를 사용합니다.
- **로컬 상태 업데이트:** 객체 형태의 상태를 업데이트할 때는 반드시 **함수형 업데이트(`prev`)**와 **전개 연산자(`...`, Spread Operator)**를 사용하여 불변성을 유지합니다.
  - **이유:** 최신 상태 보장(Race Condition 방지) 및 참조값 변경을 통한 정확한 리렌더링 보장.
  - **예시:** `setState(prev => ({ ...prev, [key]: value }))`

### 8. 코드 스타일 (Code Style)

- 함수형 컴포넌트와 Named Export를 사용합니다.
- **주석 규칙:** 모든 주석(설명, TODO, 복잡한 로직 해설 등)은 **한글**로 작성합니다.
- **네이밍 규칙**
  - 컴포넌트: `PascalCase`
  - 함수/변수: `camelCase`
  - 상수: `UPPER_SNAKE_CASE`
  - 타입/인터페이스: `PascalCase`
- `any` 타입 사용을 금지합니다.

### 9. 타입 정의 (Type Organization)

```ts
// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserResponse {
  data: User;
  message: string;
}
```

### 10. 환경 변수 (Environment Variables)

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
API_SECRET_KEY=...
```

### 11. 임포트 순서 (Import Order)

```ts
// 1. React / Next
import { useRouter } from 'next/navigation';

// 2. 외부 라이브러리 (External)
import { useQuery } from '@tanstack/react-query';

// 3. 내부 모듈 (Internal @/)
import { Button } from '@/components/ui/button';

// 4. 상대 경로 (Relative)
import { LocalComponent } from './LocalComponent';

// 5. 타입 (Types)
import type { User } from '@/types/user';
```

---

## 인증 및 API 아키텍처 (Authentication & API Architecture)

### 1. 토큰 처리 전략

- **메커니즘:** JWT를 HTTP-only Cookie (access_token, refresh_token)에 저장합니다.
- **백엔드 인증:** 쿠키와 Authorization Header 방식을 모두 지원합니다.

### 2. API 라우팅 전략

- **인증 (로그인/로그아웃/재발급):**
  - **Next.js API Routes 사용** (`app/api/auth/*`).
  - **이유:** HttpOnly 쿠키(Set-Cookie) 조작 및 토큰 재발급 로직을 서버 사이드에서 안전하게 처리하기 위함입니다.
- **일반 데이터 페칭:**
  - **CSR (클라이언트):** Use **Next.js Rewrites를 통해 백엔드로 직접 요청** (/ptc/\* -> Backend) directly.
  - **SSR (서버):** 백엔드 주소로 직접 호출 (`http://localhost:8000`).
  - **사용 금지:** 단순히 헤더 주입을 위해 Next.js API Routes(app/api/users 등)를 거쳐가지 마세요. (불필요한 레이턴시 및 코드 중복 방지)

### 3. `createKy` 유틸리티

- **클라이언트 모드:** `prefixUrl`을 프론트엔드의 프록시 경로(예: `/api`)로 설정 (해당 경로를 통해 백엔드로 요청이 중계됨).
- **서버 모드:** Sets `prefixUrl` 을 백엔드 실제 주소 (`http://localhost:8000`)로 설정.
- **헤더 핸들링:**
  - **CSR:** 브라우저가 Rewrite 시 쿠키를 자동으로 전송하므로 별도 처리 불필요.
  - **SSR:** 함수 인자로 쿠키를 받아 수동으로 주입해야 함.

```ts
import ky from 'ky';

/* 💡 SSR(서버 사이드 렌더링) 환경에서는 브라우저가 API 요청을 보내는 것이 아니라, Next.js Node 서버가 API 요청을 보냅니다. */
export const createKy = (cookie?: string) => {
  const isServer = typeof window === 'undefined';
  return ky.create({
    prefixUrl: isServer
            ? 'http://localhost:8000/' // ⚠️ next api 가 아닐땐 8000 서버주소로 ⭐ 그리고 애초에 ssr컴포넌트에서 /ptc 즉 rewrite는 읽지못함
            : '/ptc', // ⚠️ 백엔드로 바로 통신할경우 next.config의 /ptc 로 연결
    headers: cookie ? { Cookie: cookie } : undefined, // ssr에서는 쿠키를 직점 담아줘야함 ❤️
    // Next가 내부 프록시로 API 연결 중이라서 이거없어도 same-origin이라 쿠키 전달가능
    // ⭐ /ptc 를 설정한 rewrite 가 있기때문 localhost:8000 생으로 쓸려면 include 필요
    // credentials: 'include',
    hooks: {
      afterResponse: [
        async (request, options, response) => {
          // 401 에러(토큰 만료) 발생 시
          if (response.status === 401) {
            try {
              // 1. 리프레시 토큰으로 액세스 토큰 갱신 시도
              const refreshRes = await fetch('/api/auth/refresh', {
                method: 'POST',
              });

              // 2. 갱신 성공 시 원래 요청 재시도
              if (refreshRes.ok) {
                // 3. 재요청
                return ky(request);
              }
            } catch (error) {
              // 리프레시 실패 시(리프레시 토큰도 만료됨) -> 에러를 그대로 둠 (로그인 페이지 이동 등은 React Query나 컴포넌트에서 처리)
              console.error('Silent refresh failed:', error);
            }
          }
        },
      ],
    },
  });
};
```

---

## 주요 패턴 (Patterns)

### TanStack Query (query-key-factory 중앙 관리 패턴)

- **중앙 집중 관리:** 모든 쿼리 키와 페칭 함수(`queryFn`)는 `src/lib/query-keys.ts`에서 관리합니다.

```ts
// src/lib/query-keys.ts (실제 구현 예시)
export const queryKeys = createQueryKeyStore({
  board: {
    all: null,
    detail: (id: string) => [id],
  },
  home: {
    infinite: null,
    paginated: (page: number) => [page],
  },
});
```

### CSR 데이터 조회 (Client Component)

#### 1. 일반 리스트 조회 (`useQuery`)
- **패턴:** `queryKeys.domain.action()`을 호출하여 `queryKey`와 `queryFn`을 한 번에 전달합니다.

```tsx
// src/components/board/BoardComponent.tsx (실제 구현 예시)
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export default function BoardComponent() {
  const queryClient = useQueryClient();

  // 1. 데이터 조회 (Read) - 키와 함수를 통합하여 호출
  const { data: boards } = useQuery(queryKeys.board.all);

  // 2. 캐시 무효화 (Invalidate)
  const createMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.board.all);
    },
  });
  // ...
}
```

#### 2. 무한 스크롤 조회 (`useInfiniteQuery`)
- **패턴:** `useInfiniteQuery`에 5가지 제네릭 타입을 명시하고 `...queryKeys` 스프레드를 사용합니다.

```tsx
// src/app/(afterLogin)/home/_components/InfiniteScrollExample.tsx (실제 구현 예시)
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { InfiniteData } from '@tanstack/query-core';
import type { FetchInfiniteResult } from '@/fetchData/fetch-infinite';

export default function InfiniteScrollExample() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery<
          FetchInfiniteResult, // 1. queryFn이 리턴하는 순수 데이터 타입
          Error, // 2. 에러 발생 시 타입
          InfiniteData<FetchInfiniteResult>, // 3. 전체 데이터 구조 (InfiniteData로 감싸야 함!)
          any, // 4. queryKey의 타입
          number // 5. pageParam의 타입 (우리는 0, 1, 2... 숫자를 쓰므로)
  >({
    ...queryKeys.home.infinite,
    initialPageParam: 0,
    queryFn: ({ pageParam }: { pageParam: number }) =>
            fetchInfiniteItemsFromApi2({
              pageParam,
            }),
    getNextPageParam: ({ nextCursor }) => {
      // nextCursor가 없으면 즉시 undefined 반환 (추가 로직(호출) 실행 안 함)
      if (!nextCursor) {
        return undefined;
      }
      // 알아서 배열의 마지막 index 반환 (pageParam값이 됨)
      return nextCursor;
    },
  });
  // ...
}
```

#### 3. 무한 스크롤 인터랙션 (`useInfiniteScroll` 훅)
- **패턴:** `react-intersection-observer`를 래핑한 `useInfiniteScroll` 훅을 사용하여 하단 감지 및 다음 페이지 로드를 처리합니다.

```tsx
// src/hooks/use-infinite-scroll.ts
import { useEffect } from 'react';
import { IntersectionOptions, useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions extends IntersectionOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
}

export function useInfiniteScroll({ fetchNextPage, ...options }: UseInfiniteScrollOptions) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    ...options,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return { ref };
}
```

**사용 예시:**
// ...
const { ref } = useInfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
});

return (
  <div>
    {/* 리스트 렌더링... */}
    <div ref={ref} className="h-10" /> {/* 감지용 요소 */}
  </div>
);
```

#### 4. 데이터 전환 최적화 (Data Transition UX)
- **대상:** 페이지네이션(Pagination), 검색 필터링(Search/Filter) 등 클라이언트 사이드에서 `queryKey`가 변경되어 목록이 갱신되는 영역.
- **패턴:** 새로운 데이터를 불러오는 동안 화면이 깜빡이거나 빈 화면이 노출되는 것을 방지하기 위해 `placeholderData: keepPreviousData`를 사용합니다.
- **상태 활용:** `isPlaceholderData` 값을 사용하여 데이터가 '교체 중'임을 시각적으로 표현(예: `opacity-50`, 스피너 노출, 버튼 비활성화 등)합니다.

```tsx
'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

// 페이지네이션 & 검색 필터 최적화 예시
export default function SearchList({ keyword, page }: { keyword: string; page: number }) {
  const { data, isPlaceholderData } = useQuery({
    ...queryKeys.board.search(keyword, page),
    queryFn: () => fetchPaginatedItems2({keyword, page }),
    // 💡 검색어나 페이지가 바뀌어도 새로운 데이터가 올 때까지 기존 목록을 유지하여 깜빡임 방지
    placeholderData: keepPreviousData, 
  });
// ...
  return (
    <div className={isPlaceholderData ? 'opacity-50 pointer-events-none' : 'opacity-100'}>
       {/* 검색 결과 리스트... */}
    </div>
  );
}
```

#### 5. 실시간 데이터 폴링 (Real-time Data Polling)
- **대상:** 대시보드, 알림 숫자, 실시간 상태 확인 등 실시간에 가까운 최신 데이터 유지가 필요한 경우.
- **패턴:** `refetchInterval` 옵션을 사용하여 일정 주기마다 자동으로 데이터를 다시 불러옵니다.
- **주의사항:** 브라우저 탭이 활성화된 상태에서만 동작하는 것이 기본값이며, 백그라운드에서도 폴링이 필요하다면 `refetchIntervalInBackground: true`를 추가로 설정합니다.

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export default function RealTimeStatus() {
  const { data } = useQuery({
    ...queryKeys.status.all,
    // 💡 5초마다 데이터를 자동으로 다시 불러옴 (단위: ms)
    refetchInterval: 5000, 
    // 필요 시: 탭이 백그라운드에 있어도 폴링 유지
    // refetchIntervalInBackground: true, 
  });

  return (
    <div>
      현재 상태: {data?.status}
    </div>
  );
}
```

### SSR 프리페칭 (Server Component)
// ...
```tsx
// src/app/(afterLogin)/home/page.tsx (실제 구현 예시)
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { queryKeys } from '@/lib/query-keys';

async function Page() {
  const queryClient = new QueryClient();
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  // 모든 Query를 병렬로 Prefetch
  await Promise.all([
    // 일반 조회 프리페칭
    queryClient.prefetchQuery({
      ...queryKeys.user.list,
      queryFn: () => apiTest2(cookieString),
    }),

    // 무한 스크롤 프리페칭 (수동 캐스팅 활용)
    queryClient.prefetchInfiniteQuery({
      ...queryKeys.home.infinite,
      queryFn: ({ pageParam }: { pageParam: number }) =>
              fetchInfiniteItemsFromApi2({
                pageParam,
                cookieString: cookieString,
              }),
      initialPageParam: 0,
      // lastPage를 일단 받은 다음, (lastPage as 타입) 형태로 꺼내 쓰기
      getNextPageParam: (lastPage) => (lastPage as FetchInfiniteResult).nextCursor,
    }),
  ]);

  return (
          <HydrationBoundary state={dehydrate(queryClient)}>
            <MainContents />
          </HydrationBoundary>
  );
}
```

---

### 테마 설정 (next-themes)

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
          <html lang="ko" suppressHydrationWarning>
          <body>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
          </body>
          </html>
  );
}
```

---

### Zustand Store

```ts
import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
```

---

## 로딩 / 에러 처리 (Error / Loading)

### 1. 전역 에러 메시지 관리

- **에러 메시지 중앙화:** 하드코딩된 에러 메시지는 피하고, `src/lib/errors.ts`의 `ERROR_MESSAGES` 상수를 사용하여 중앙 집중식으로 관리합니다.

```ts
// 사용 예시
import { ERROR_MESSAGES, formatErrorMessage } from '@/lib/errors';

// API 에러 처리
if (!res.success) {
  alert(formatErrorMessage('save', res.message));
}
```

### 2. Next.js 에러 바운더리

```tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
          <div>
            <p>{error.message}</p>
            <button onClick={reset}>Retry</button>
          </div>
  );
}
```

---

## 폴더 구조 제안 (Recommended File Structure)

```
app/
components/
hooks/
lib/
stores/
types/
schemas/
```
