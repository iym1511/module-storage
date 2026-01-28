# Frontend Project (my-app)

이 프로젝트는 **Next.js**를 기반으로 구축된 프론트엔드 애플리케이션입니다.
최신 웹 기술 스택을 활용하여 성능과 사용자 경험을 최적화하였으며, **TypeScript**를 통해 안정적인 개발 환경을 제공합니다.

## 🛠️ 기술 스택 (Tech Stack)

### Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Library**: [React 19](https://react.dev/)

### Styling
- **CSS Framework**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Utility**: `clsx`, `tailwind-merge`, `class-variance-authority` (CVA)
- **Animation**: `tailwindcss-animate`
- **Icons**: `lucide-react`
- **Theme**: `next-themes` (Dark/Light mode support)

### State Management & Data Fetching
- **Client State**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Server State**: [TanStack Query v5](https://tanstack.com/query/latest)
- **HTTP Client**: [ky](https://github.com/sindresorhus/ky)

### Authentication & Security
- `jose`, `jwt-decode`
- `cookies-next`

### Testing
- **Unit/Integration Test**: [Vitest](https://vitest.dev/)
- **Testing Library**: `@testing-library/react`

---

## 🚀 시작하기 (Getting Started)

### 사전 요구사항 (Prerequisites)
- Node.js (LTS 버전 권장)
- npm, yarn, pnpm, 또는 bun 패키지 매니저

### 설치 (Installation)

의존성 패키지를 설치합니다.

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

### 실행 (Run)

개발 서버를 실행합니다.

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

---

## 📜 스크립트 (Scripts)

`package.json`에 정의된 주요 스크립트입니다.

- `dev`: 개발 모드로 서버 실행 (Hot Reloading 지원)
- `build`: 프로덕션 배포를 위한 애플리케이션 빌드
- `start`: 빌드된 애플리케이션을 프로덕션 모드로 실행
- `lint`: ESLint를 통한 코드 스타일 검사
- `test`: Vitest를 이용한 테스트 실행

## 📂 프로젝트 구조 (Project Structure)

```
my-app/
├── src/
│   ├── app/           # Next.js App Router 페이지 및 레이아웃
│   ├── components/    # 재사용 가능한 UI 컴포넌트 (ui, layout 등)
│   ├── fetchData/     # 데이터 페칭 로직
│   ├── lib/           # 유틸리티 함수 및 설정
│   ├── styles/        # 전역 스타일 및 CSS 파일
│   ├── util/          # 기타 헬퍼 함수
│   └── middleware.ts  # Next.js 미들웨어
├── public/            # 정적 파일 (이미지, 아이콘 등)
└── ...설정 파일들
```