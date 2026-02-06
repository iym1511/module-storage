# Project Context

## Tech Stack

* **Framework:** Next.js (Latest, App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Client State:** Zustand
* **Server State:** TanStack Query (React Query)
* **Form:** React Hook Form + Zod
* **Authentication:** JWT (HTTP-only Cookie)

---

## Coding Principles

### 1. Next.js App Router

* **Server Components First:** 기본은 RSC. 훅 필요할 때만 `'use client'`.
* **Server Actions 우선:** API Route는 불가피할 때만.
* **Feature-based 구조:** `app/features/*`.
* **로딩/에러:** `loading.tsx`, `error.tsx` 사용.

### 2. Styling (Tailwind)

* Utility First
* `prettier-plugin-tailwindcss` 기준 정렬
* Mobile First (`min-width`)
* 조건부 클래스는 `clsx` + `tailwind-merge`

### 3. State Management

* **Server State:** TanStack Query만 사용 (fetch + useEffect 금지)
* **Global UI:** Zustand
* **Local State:** `useState` / `useReducer`

### 4. Code Style

* Function Component + Named Export
* **Naming**

  * Component: `PascalCase`
  * Function/Variable: `camelCase`
  * Constant: `UPPER_SNAKE_CASE`
  * Type/Interface: `PascalCase`
* `any` 금지

### 5. Type Organization

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

### 6. Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
API_SECRET_KEY=...
```

### 7. Import Order

```ts
// 1. React / Next
import { useRouter } from 'next/navigation';

// 2. External
import { useQuery } from '@tanstack/react-query';

// 3. Internal (@/)
import { Button } from '@/components/ui/button';

// 4. Relative
import { LocalComponent } from './LocalComponent';

// 5. Types
import type { User } from '@/types/user';
```

---

## Authentication & API Architecture

### 1. Token Handling Strategy
*   **Mechanism:** JWT in HTTP-only Cookies (`access_token`, `refresh_token`).
*   **Backend Auth:** Supports **both** Cookie and Authorization Header.

### 2. API Routing Strategy
*   **Authentication (Login/Logout/Refresh):**
    *   **Use Next.js API Routes** (`app/api/auth/*`).
    *   **Reason:** Requires secure server-side manipulation of HttpOnly Cookies (Set-Cookie) and Token Refresh logic.
*   **General Data Fetching:**
    *   **CSR:** Use **Next.js Rewrites** (`/ptc/*` -> Backend) directly.
    *   **SSR:** Call Backend directly (`http://localhost:8000`).
    *   **Do Not Use:** Intermediate Next.js API Routes (`app/api/users` etc.) just to inject headers.
        *   *Why?* The backend reads cookies directly. Passing through Next.js API adds unnecessary latency and code duplication.

### 3. `createKy` Utility
*   **Client Mode:** Sets `prefixUrl` to `/ptc` (proxied to backend).
*   **Server Mode:** Sets `prefixUrl` to Backend URL (`http://localhost:8000`).
*   **Header Handling:**
    *   **CSR:** Relies on browser's automatic cookie transmission via Rewrite (Same-Origin).
    *   **SSR:** Requires manual cookie injection via arguments.

---

## Patterns

### SSR Prefetch + Hydration (App Router 최상위 Server Component)

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

* **Server Component에서만 실행**
* `useQuery`와 **queryKey/queryFn 완전히 동일**해야 함
* 클라이언트에서는 로딩 없이 즉시 캐시 사용
* 쿠키/헤더 필요한 API는 여기서 처리

---

### Component Template

### Component Template

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

## Error / Loading

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

```tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

---

## Utilities

```ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));
```

---

## Recommended File Structure

```
app/
components/
hooks/
lib/
stores/
types/
schemas/
```
