# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-19
**Type:** Fullstack Monorepo (Next.js + Express)

## OVERVIEW

This is a **fullstack monorepo** containing a Next.js frontend (`my-app`) and Express backend (`my-node`). Designed as a boilerplate for rapid prototyping with authentication, data fetching patterns, and infrastructure.

## STRUCTURE

```
fullstackProject/
├── my-app/          # Next.js 16 frontend (61 src files)
│   └── src/
│       ├── app/           # App Router pages
│       ├── components/    # UI components
│       ├── fetchData/     # TanStack Query hooks
│       └── util/          # API client
├── my-node/         # Express 5 backend (16 src files)
│   └── src/
│       ├── controllers/   # Business logic
│       ├── routes/        # API routes
│       ├── middleware/    # Auth middleware
│       └── redis/        # Redis client
├── docker-compose.yml
└── README.md
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Frontend API client | my-app/src/util/api.ts |
| Auth middleware | my-app/src/middleware.ts |
| TanStack Query hooks | my-app/src/fetchData/ |
| Login page | my-app/src/app/(beforeLogin)/login/ |
| Home page | my-app/src/app/(afterLogin)/home/ |
| Backend auth | my-node/src/controllers/authController.ts |
| Redis client | my-node/src/redis/redis.ts |
| Swagger docs | http://localhost:8000/api-docs |

## CONVENTIONS

- **API Communication**: Ky HTTP client with interceptors for silent refresh
- **Authentication**: JWT access tokens + Redis refresh token whitelist (RTR pattern)
- **Data Fetching**: TanStack Query v5 with SSR hydration
- **Client State**: Zustand (installed, available for use)
- **Pagination**: Cursor-based (not offset) for infinite scroll
- **Backend Proxy**: Frontend uses `/ptc` prefix for backend calls
- **Edge Runtime**: Use `jose` (not `jsonwebtoken`) for Next.js middleware

## COMMANDS

```bash
# Start infrastructure (DB, Redis)
docker-compose up -d

# Backend (http://localhost:8000)
cd my-node && npm run dev

# Frontend (http://localhost:3000)
cd my-app && npm run dev
```

## ANTI-PATTERNS

- DO NOT use `jsonwebtoken` in Next.js middleware (use `jose`)
- DO NOT use offset pagination for large datasets (use cursor-based)
- DO NOT fetch data directly in components (use fetchData/ layer)
- DO NOT put API URLs hardcoded in components

## NOTES

- Token refresh happens automatically via Ky interceptor
- Swagger auto-generated at `/api-docs` endpoint
- Redis used for: refresh token whitelist, data caching
