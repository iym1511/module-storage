# 🗃️ Module Storage & Fullstack Pattern Dictionary

이 프로젝트는 **Fullstack 개발(Next.js + Node.js)** 시 반복적으로 사용되는 **핵심 로직, 아키텍처 패턴, 설정 값**들을 모아둔 저장소(Boilerplate)입니다.
새로운 프로젝트를 시작할 때, 이 저장소의 코드를 참조하거나 복사하여 빠르게 환경을 구축하는 것이 목적입니다.

---

## 📑 목차 (Table of Contents)

1.  [🛠️ Tech Stack & Version](#-tech-stack--version)
2.  [🚀 Quick Start & Commands](#-quick-start--commands)
3.  [🎨 Frontend Architecture (Next.js)](#-frontend-architecture-nextjs)
    *   [1. 네트워크 계층 (Ky + Interceptor)](#1-네트워크-계층-ky--interceptor-설정)
    *   [2. 인증 미들웨어 (Next Middleware)](#2-인증-미들웨어-nextjs-middleware--jose)
    *   [3. 서버 상태 관리 (TanStack Query)](#3-서버-상태-관리-tanstack-query-v5)
    *   [4. 무한 스크롤 & 페이지네이션](#4-무한-스크롤--페이지네이션-infinite--pagination)
4.  [⚙️ Backend Architecture (Express)](#-backend-architecture-express)
    *   [1. 인증 시스템 (JWT + Redis + Cookie)](#1-인증-시스템-jwt--redis--cookie)
    *   [2. Redis 캐싱 전략](#2-redis-캐싱-설정)
    *   [3. API 문서화 (Swagger)](#3-api-문서화-swagger)
5.  [🏗️ Infrastructure (Docker)](#-infrastructure-docker)

---

## 🛠️ Tech Stack & Version

| 영역 | 기술 (Technology) | 버전 | 선정 이유 & 특징 |
|:---:|:---:|:---:|:---|
| **Front** | **Next.js (App Router)** | **v16** | RSC(React Server Components), SEO 최적화, 최신 라우팅 시스템 |
| | **React** | v19 | 최신 훅 및 동시성 모드 지원 |
| | **TanStack Query** | v5 | 서버 데이터 캐싱, Prefetching, Infinite Scroll 표준 |
| | **Ky** | v1.13 | `fetch` 기반의 가볍고 직관적인 HTTP 클라이언트 (axios 대체) |
| | **Tailwind CSS** | v4 | Zero-runtime CSS, 생산성 향상 |
| | **Zustand** | v5 | 가볍고 직관적인 전역 클라이언트 상태 관리 |
| **Back** | **Node.js (Express)** | **v5** | 가장 대중적이고 유연한 백엔드 프레임워크 |
| | **TypeScript** | v5 | 정적 타입 안정성 보장 |
| | **Swagger** | v6 | `tsoa` / `swagger-jsdoc` 기반 API 문서 자동화 |
| **DB/Infra** | **PostgreSQL** | v17 | 신뢰성 높은 관계형 데이터베이스 |
| | **Redis** | v7 | Refresh Token 저장(Whitelist) 및 데이터 캐싱 |
| | **Docker Compose** | v3 | DB, Redis, App을 한 번에 실행 및 관리 |

---

## 🚀 Quick Start & Commands

### 1. 환경 변수 설정 (Environment Variables)
프로젝트 루트나 각 폴더에 `.env` 파일이 필요합니다. (보안상 gitignore 처리됨)

**backend (.env example)**
```env
PORT=8000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=xxxx
DB_NAME=fullstackDB
JWT_SECRET=access_secret_key
JWT_REFRESH_SECRET=refresh_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 2. 실행 명령어
```bash
# 1. 인프라 실행 (DB, Redis) - 루트 디렉토리에서
docker-compose up -d

# 2. 백엔드 실행
cd my-node
npm install
npm run dev
# -> Server: http://localhost:8000
# -> Swagger: http://localhost:8000/api-docs

# 3. 프론트엔드 실행
cd my-app
npm install
npm run dev
# -> Client: http://localhost:3000
```

---

## 🎨 Frontend Architecture (Next.js)

### 1. 네트워크 계층 (Ky + Interceptor 설정)
**위치:** `my-app/src/util/api.ts`

단순 `fetch` 대신 `ky` 라이브러리를 래핑하여 **공통 설정(Base URL, Header)**과 **인터셉터(Silent Refresh)**를 관리합니다.

*   **Bearer 토큰 자동화:**
    *   `beforeRequest` 훅을 통해 쿠키(CSR) 또는 인자(SSR)로 받은 `access_token`이 있을 경우, **`Authorization: Bearer <token>` 헤더를 자동으로 생성**하여 요청을 보냅니다.
*   **SSR vs CSR 분기:**
    *   서버(SSR)에서 요청 시: `http://localhost:8000` (백엔드 직통) + **쿠키 수동 전달**
    *   클라이언트(CSR)에서 요청 시: `/ptc` (Next.js Proxy) 또는 백엔드 URL + **쿠키 자동 전송** (Credentials: include)
*   **Silent Refresh 로직:**
    *   `afterResponse` 훅을 사용하여 401(Unauthorized) 응답 감지.
    *   401 발생 시 `/api/auth/refresh` 엔드포인트 호출.
    *   갱신 성공 시 새로 발급된 토큰으로 헤더를 업데이트하여 원래 요청을 **재전송(Retry)**.

```typescript
// 핵심 코드 요약
export const createKy = (cookie?: string) => {
    return ky.create({
        prefixUrl: isServer ? 'http://localhost:8000/' : '/ptc',
        hooks: {
            beforeRequest: [
                (request) => {
                    const token = cookie || getCookie('access_token');
                    if (token) {
                        request.headers.set('Authorization', `Bearer ${token}`);
                    }
                },
            ],
            afterResponse: [
                async (request, options, response) => {
                    if (response.status === 401) {
                        const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
                        if (refreshRes.ok) return ky(request); // 재시도
                    }
                },
            ],
        },
    });
};
```

### 2. 인증 미들웨어 (Next.js Middleware + Jose)
**위치:** `my-app/src/middleware.ts`

Next.js의 Edge Runtime 환경에서는 Node.js의 `jsonwebtoken` 모듈이 무거워 동작하지 않을 수 있습니다. 따라서 가벼운 `jose` 라이브러리를 사용합니다.

*   **동작 원리:** 모든 페이지 접근 시 실행 (`matcher` 설정).
*   **로직:**
    1.  `access_token` 유무 확인.
    2.  없으면 `refresh_token` 확인.
    3.  Access Token 만료 or 없음 + Refresh Token 있음 -> `/api/auth/refresh`로 리다이렉트하여 토큰 갱신 유도.
    4.  둘 다 없음 -> `/login` 리다이렉트.

### 3. 서버 상태 관리 (TanStack Query v5)
**위치:** `my-app/src/fetchData/`, `src/app/page.tsx`

*   **Clean Architecture:** 컴포넌트 내부에서 바로 `fetch` 하지 않고, `src/fetchData` 폴더에 API 호출 함수를 분리합니다.
*   **SSR Prefetching 패턴:**
    1.  서버 컴포넌트(`page.tsx`)에서 `QueryClient` 생성.
    2.  `queryClient.prefetchQuery(...)` 실행.
    3.  `dehydrate` 하여 `HydrationBoundary` 컴포넌트로 감싸서 클라이언트에 전달.
    4.  클라이언트는 로딩 없이 즉시 데이터 사용 가능 (SEO 향상).

### 4. 무한 스크롤 & 페이지네이션 (Infinite & Pagination)
**위치:** `my-app/src/app/(afterLogin)/home/_components/InfiniteScrollExample.tsx`

*   **도구:** `useInfiniteQuery` + `react-intersection-observer`
*   **Cursor Based Pagination:**
    *   기존 Offset 방식(Page 1, 2...)보다 성능이 좋고 데이터 중복/누락 이슈가 적은 **Cursor 방식(마지막 아이템 ID 기준)**을 선호합니다.
*   **구현 로직:**
    *   화면 하단에 투명한 `div`(`ref`)를 배치.
    *   `IntersectionObserver`가 `div`를 감지(`inView`)하면 `fetchNextPage()` 실행.

---

## ⚙️ Backend Architecture (Express)

### 1. 인증 시스템 (JWT + Redis + Cookie)
**위치:** `my-node/src/controllers/authController.ts`

보안을 위해 **Access Token은 짧게(15초~1시간)**, **Refresh Token은 길게(7일)** 가져가며, **RTR(Rotate Token Request)** 방식을 부분 차용합니다.

*   **Login Process:**
    1.  User DB에서 이메일/비밀번호 검증 (`bcrypt`).
    2.  `uuidv4()`로 고유 `tokenId` 생성.
    3.  **Redis 저장:** Key=`refresh_token:user@email.com`, Value=`tokenId` (TTL 7일).
    4.  **Cookie 설정:** `httpOnly: true`, `secure: true` 옵션으로 JS 접근 차단 (XSS 방지).
*   **Refresh Process:**
    1.  Refresh Token의 유효성 및 Redis의 whitelist 확인.
    2.  유효하면 **새로운 Access Token & Refresh Token 발급** (Rotation).
    3.  Redis 값 업데이트.

### 2. Redis 캐싱 전략
**위치:** `my-node/src/redis/redis.ts`

`ioredis` 라이브러리를 사용하여 Redis 컨테이너와 연결합니다.
*   **용도 1:** Refresh Token 화이트리스트 관리 (로그아웃 시 해당 키 삭제로 즉시 무효화 가능).
*   **용도 2:** 자주 조회되지만 변경이 적은 데이터 캐싱 (API 성능 최적화).

### 3. API 문서화 (Swagger)
**위치:** `my-node/src/config/swagger.ts`, `my-node/src/app.ts`

코드 내에 별도 주석이나 YAML을 작성하지 않고, `tsoa` 혹은 `swagger-jsdoc` 설정을 통해 컨트롤러와 라우트 파일을 스캔하여 문서를 자동 생성합니다.
*   접속 주소: `http://localhost:8000/api-docs`

---

## 🏗️ Infrastructure (Docker)

**파일:** `docker-compose.yml`

로컬 개발 환경을 컨테이너로 격리하여, 팀원 간 환경 차이(DB 버전 등)로 인한 문제를 방지합니다.

*   **Services:**
    *   `db (postgres:17)`: 5433 포트로 노출 (내부 5432). 데이터는 `./postgres_data` 로컬 폴더에 영구 저장(Volume).
    *   `redis (alpine)`: 6379 포트 노출. 가벼운 Alpine 이미지 사용.
    *   `back`: `my-node` 디렉토리의 Dockerfile을 빌드하여 실행. `depends_on` 옵션으로 DB/Redis 실행 후 기동되도록 설정.

---

### 📝 Memo & Tips
*   **스키마 정보:** `schema_info.txt` 파일 참조.
*   **SQL 쿼리:** `queries/` 폴더 참조.
*   **Next.js Proxy:** 개발 환경에서 CORS 문제를 피하기 위해 `next.config.ts`의 `rewrites` 기능을 활용하거나, 백엔드 `cors` 설정을 확인하세요.

---
*Created by Gemini Agent*