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

### 5. 상태 관리 (State Management)

- **서버 상태:** TanStack Query만 사용합니다. (`useEffect` 내부에서 `fetch` 금지)
- **전역 UI 상태:** Zustand를 사용합니다.
- **로컬 상태:** `useState` 또는 `useReducer`를 사용합니다.
- **로컬 상태 업데이트:** 객체 형태의 상태를 업데이트할 때는 반드시 **함수형 업데이트(`prev`)**와 **전개 연산자(`...`, Spread Operator)**를 사용하여 불변성을 유지합니다.
  - **이유:** 최신 상태 보장(Race Condition 방지) 및 참조값 변경을 통한 정확한 리렌더링 보장.
  - **예시:** `setState(prev => ({ ...prev, [key]: value }))`

### 6. 코드 스타일 (Code Style)

- 함수형 컴포넌트와 Named Export를 사용합니다.
- **네이밍 규칙**
  - 컴포넌트: `PascalCase`
  - 함수/변수: `camelCase`
  - 상수: `UPPER_SNAKE_CASE`
  - 타입/인터페이스: `PascalCase`
- `any` 타입 사용을 금지합니다.

### 7. 타입 정의 (Type Organization)

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

### 8. 환경 변수 (Environment Variables)

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
API_SECRET_KEY=...
```

### 9. 임포트 순서 (Import Order)

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

### 4. 미들웨어 전략 (Middleware Strategy)

- **역할:** 모든 페이지 및 API 요청에 대해 인증 상태를 체크하고 적절한 페이지로 리다이렉트합니다.
- **검증 방식:** Edge Runtime에서 실행되므로 가벼운 `jose` 라이브러리를 사용하여 JWT를 검증합니다.
- **리다이렉트 로직:**
  - 토큰이 전혀 없는 경우: `/login`으로 리다이렉트.
  - 액세스 토큰 만료 + 리프레시 토큰 존재: `/api/auth/refresh`로 리다이렉트하여 토큰 갱신 유도.

```ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (accessToken) {
    try {
      await jwtVerify(accessToken, secret);
      return NextResponse.next();
    } catch {
      if (refreshToken) {
        const url = new URL('/api/auth/refresh', request.url);
        url.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (!accessToken && refreshToken) {
    const url = new URL('api/auth/refresh', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/home'],
};
```

### 8. 테마 관리 (Theme Management)

- **라이브러리:** `next-themes`를 사용하여 전역 테마 상태를 관리합니다.
- **구성:** `RootLayout`에 `ThemeProvider`를 적용하고, `attribute="class"`를 통해 다크모드를 제어합니다.
- **깜빡임 방지:** `suppressHydrationWarning` 속성을 사용하여 SSR과 CSR 간의 테마 불일치 에러를 방지합니다.
- **Tailwind v4 연동:** `globals.css`에 `@custom-variant dark`를 정의하여 클래스 기반 다크모드가 정상 작동하도록 설정합니다.

---

## 주요 패턴 (Patterns)

### SSR 프리페칭 + 하이드레이션 (App Router 최상위 페이지)

```tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import MainContents from './_components/MainContents';
import { apiTest2 } from '@/fetchData/fetch-get';
import { fetchInfiniteItemsFromApi } from '@/fetchData/fetch-infinite';
import { fetchPaginatedItems } from '@/fetchData/fetch-pagination';

export default async function Page() {
  const queryClient = new QueryClient();

  const cookieStore = cookies();
  const cookieString = cookieStore.toString();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['users'],
      queryFn: () => apiTest2(cookieString),
    }),

    queryClient.prefetchInfiniteQuery({
      queryKey: ['infiniteItems'],
      queryFn: ({ pageParam }) =>
              fetchInfiniteItemsFromApi({
                pageParam: pageParam as number,
                cookieString,
              }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }),

    queryClient.prefetchQuery({
      queryKey: ['paginatedItems', 1],
      queryFn: () =>
              fetchPaginatedItems({
                page: 1,
                cookieString,
              }),
    }),
  ]);

  return (
          <HydrationBoundary state={dehydrate(queryClient)}>
            <MainContents />
          </HydrationBoundary>
  );
}
```

- **Server Component에서만 실행**
- `useQuery`와 **queryKey/queryFn 완전히 동일**해야 함
- 클라이언트에서는 로딩 없이 즉시 캐시 사용
- 쿠키/헤더 필요한 API는 여기서 처리

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

### 컴포넌트 템플릿 (Component Template)

```tsx
'use client';

import { useState, type FC } from 'react';
import { cn } from '@/lib/utils';

interface UserCardProps {
  userId: string;
  className?: string;
}

export const UserCard: FC<UserCardProps> = ({ userId, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded((p) => !p);

  return (
          <div className={cn('rounded-lg border p-4', className)}>
            <button onClick={handleToggle}>Toggle</button>
            {isExpanded && <div>Expanded</div>}
          </div>
  );
};
```

### TanStack Query

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '@/types/user';

export const useUser = (userId: string) =>
        useQuery({
          queryKey: ['user', userId],
          queryFn: () => fetchUser(userId),
          enabled: Boolean(userId),
        });

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data: User) => {
      qc.invalidateQueries({ queryKey: ['user', data.id] });
    },
  });
};
```

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

### 인피니티 스크롤 (Infinite Scroll)

- **라이브러리:** `react-intersection-observer`를 사용합니다.
- **구현 방식:** 직접적인 `IntersectionObserver` 대신 `hooks/use-infinite-scroll.ts` 커스텀 훅을 사용하여 재사용 가능한 형태로 구현합니다.

```tsx
// 사용 예시
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';

const { ref } = useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
});

// 하단 트리거 엘리먼트에 ref 연결
return <div ref={ref}>Loading More...</div>;
```

### Form (RHF + Zod)

```ts
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export type UserFormData = z.infer<typeof userSchema>;
```

---

## 로딩 / 에러 처리 (Error / Loading)

### 1. 전역 에러 메시지 관리

- **에러 메시지 중앙화:** 하드코딩된 에러 메시지는 피하고, `src/lib/errors.ts`의 `ERROR_MESSAGES` 상수를 사용하여 중앙 집중식으로 관리합니다.
- **유틸리티 함수 활용:** API 호출 등 공통적인 작업의 에러 처리는 `formatErrorMessage` 함수를 활용하여 일관된 메시지 형식을 유지합니다.
- **네임스페이스 구조:**
  - `COMMON`: 애플리케이션 전반에 걸친 공통 에러 (네트워크, 알 수 없는 에러 등)
  - `API`: API 요청 실패와 관련된 에러 (저장, 삭제, 처리 등)
  - `AUTH`: 인증 과정에서 발생하는 에러 (로그인 실패 등)
  - `VALIDATION`: 폼 입력값 검증과 관련된 에러

```ts
// 사용 예시
import { ERROR_MESSAGES, formatErrorMessage } from '@/lib/errors';

// API 에러 처리
if (!res.success) {
  alert(formatErrorMessage('save', res.message));
}

// 폼 검증
if (!form.title) {
  setErr(ERROR_MESSAGES.VALIDATION.TITLE_REQUIRED);
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

### 3. 로딩 컴포넌트

```tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

---

## 유틸리티 (Utilities)

```ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));
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
