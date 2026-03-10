# PROJECT KNOWLEDGE BASE - Frontend

**Generated:** 2026-02-19
**Package:** my-app (Next.js 16 Frontend)

## OVERVIEW

Next.js 16 frontend with App Router, TanStack Query v5, and Tailwind CSS v4. Features authentication with silent refresh, infinite scroll, and cursor-based pagination.

## STRUCTURE

```
my-app/src/
├── app/                    # Next.js App Router pages
│   ├── (beforeLogin)/      # Public routes (login)
│   ├── (afterLogin)/       # Protected routes (home, board)
│   └── api/                # API routes (auth endpoints)
├── components/             # UI components
│   ├── ui/                 # Radix UI primitives
│   ├── layout/             # Header, etc
│   └── board/              # Board components
├── fetchData/              # TanStack Query hooks
├── util/                   # API client (Ky wrapper)
├── lib/                    # Utilities
└── middleware.ts           # Auth guard (jose)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| API client | src/util/api.ts | Ky with interceptors |
| Auth middleware | src/middleware.ts | jose for Edge Runtime |
| Infinite scroll | src/fetchData/fetch-infinite.ts | useInfiniteQuery |
| Pagination | src/fetchData/fetch-pagination.ts | Cursor-based |
| Login page | src/app/(beforeLogin)/login/ | |
| Home page | src/app/(afterLogin)/home/ | |
| Board | src/app/(afterLogin)/board/ | |

## TECH STACK

- **Framework**: Next.js 16 (App Router)
- **State**: TanStack Query v5 (server) + Zustand v5 (client, available)
- **HTTP**: Ky with interceptors
- **Auth**: jose (Edge Runtime)
- **Styling**: Tailwind CSS v4, Radix UI

## KEY PATTERNS

### HTTP Client (Ky)
```typescript
// src/util/api.ts
// - beforeRequest: adds Authorization header
// - afterResponse: handles 401, triggers silent refresh
```

### Auth (jose)
```typescript
// src/middleware.ts
// - Verify access_token on every request
// - Redirect to /login if no valid token
// - Use jose (NOT jsonwebtoken) for Edge Runtime
```

### Data Fetching (TanStack Query)
```typescript
// src/fetchData/
// - SSR: prefetchQuery + dehydrate + HydrationBoundary
// - CSR: useQuery, useInfiniteQuery
// - Pagination: cursor-based (not offset)
```

## CONVENTIONS

- **API Layer**: All API calls go through `src/fetchData/` - never fetch in components
- **Client State**: Use Zustand for global UI state (modal, sidebar, theme)
- **Server State**: Use TanStack Query (NOT useState for data)
- **Auth**: Token stored in httpOnly cookies, middleware handles refresh
- **Pagination**: Always use cursor-based, never offset for large datasets
- **Imports**: Avoid barrel files where possible

## ANTI-PATTERNS

- DO NOT use `jsonwebtoken` in middleware (use `jose`)
- DO NOT fetch data directly in components
- DO NOT use offset pagination
- DO NOT hardcode API URLs in components

## COMMANDS

```bash
cd my-app
npm run dev    # http://localhost:3000
npm run build  # Production build
npm run test  # Vitest tests
```
