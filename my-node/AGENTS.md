# PROJECT KNOWLEDGE BASE - Backend

**Generated:** 2026-02-19
**Package:** my-node (Express 5 Backend)

## OVERVIEW

Express 5 backend with TypeScript, JWT authentication, Redis token storage, and auto-generated Swagger documentation.

## STRUCTURE

```
my-node/src/
├── controllers/           # Business logic
│   ├── authController.ts # Login, refresh, logout
│   ├── boardController.ts
│   ├── infiniteController.ts
│   └── health.ts
├── routes/               # Route definitions
├── middleware/           # Auth middleware
├── util/                 # DB, CORS
├── config/               # Swagger config
├── redis/                # Redis client
├── server.ts             # Entry point
└── app.ts               # Express app
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Auth logic | src/controllers/authController.ts |
| Redis operations | src/redis/redis.ts |
| Swagger config | src/config/swagger.ts |
| Auth routes | src/routes/authRoutes.ts |
| Board routes | src/routes/boardRoutes.ts |
| Server entry | src/server.ts |

## KEY PATTERNS

### Authentication (RTR Pattern)
```typescript
// src/controllers/authController.ts
// 1. Login: Validate creds → Create tokenId (uuid)
// 2. Store: Redis key = refresh_token:{email}, value = tokenId
// 3. Response: Set httpOnly cookies (access_token, refresh_token)
// 4. Refresh: Verify token → Redis whitelist check → Rotate tokens
```

### Redis Usage
```typescript
// src/redis/redis.ts
// - Refresh token whitelist (key: refresh_token:{email})
// - Data caching for expensive queries
```

### Swagger
```typescript
// Auto-generated at http://localhost:8000/api-docs
// Uses swagger-jsdoc annotations in routes
```

## CONVENTIONS

- **Auth**: JWT access tokens (short-lived) + Redis refresh token whitelist
- **Cookies**: httpOnly, secure, sameSite for XSS protection
- **API Docs**: Swagger auto-generated at `/api-docs`

## ANTI-PATTERNS

- DO NOT store refresh tokens in localStorage (use httpOnly cookies)
- DO NOT verify tokens without Redis whitelist check on refresh

## COMMANDS

```bash
cd my-node
npm run dev    # http://localhost:8000
npm run build  # TypeScript compilation
# Swagger: http://localhost:8000/api-docs
```
