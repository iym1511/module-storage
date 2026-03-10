# 🚀 MobileDash Web (Next.js Dashboard)

This project is a high-performance dashboard web application built with [Next.js](https://nextjs.org).

---

# 🛡️ 왜 인증 로직을 Next.js API Routes에서 처리하나?

## 1. 보안의 핵심: `HttpOnly` 쿠키 제어
가장 중요한 기술적 이유입니다. **자바스크립트로 접근할 수 없는 쿠키**를 사용하기 위함입니다.
- **클라이언트 방식**: 토큰(JWT)을 `localStorage`나 일반 `Cookie`에 저장하면, 해커가 악성 스크립트를 심어(XSS 공격) 토큰을 탈취하기 매우 쉽습니다.
- **Next.js API 방식**: 서버에서 응답을 보낼 때 `Set-Cookie: access_token=...; HttpOnly` 옵션을 줍니다.
    - 이렇게 하면 **브라우저의 자바스크립트가 쿠키를 읽을 수 없으므로**, XSS 공격으로부터 토큰이 안전하게 보호됩니다.
    - 이 `HttpOnly` 설정은 오직 **서버 환경**에서만 가능합니다.

## 2. 백엔드 서버의 은닉 (Backend Masking)
실제 데이터를 가진 백엔드(Python FastAPI 등)의 주소와 구조를 사용자에게 숨길 수 있습니다.
- **직접 통신**: 브라우저 네트워크 탭에 실제 백엔드 주소(`http://api.internal:8000`)가 그대로 노출됩니다.
- **API Route 사용**: 사용자는 프론트엔드 주소인 `/api/auth/login`만 보게 됩니다. Next.js 서버가 백엔드와 통신하는 **'보안 게이트웨이'** 역할을 수행하여 백엔드 서버를 직접적인 위협으로부터 보호합니다.

## 3. 미들웨어(Middleware)와의 완벽한 궁합
Next.js의 미들웨어는 페이지에 접속하기 **전**에 서버 사이드에서 실행됩니다.
- 인증 로직이 API Route를 통해 쿠키로 관리되면, 미들웨어에서 **페이지 로드 전에 토큰 유효성을 즉시 판단**할 수 있습니다.
- "깜빡임 현상" 없이 인증되지 않은 사용자를 즉시 로그인 페이지로 리다이렉트할 수 있는 최적의 환경을 제공합니다.

## 4. 토큰 갱신(Refresh Token)의 자동화
액세스 토큰이 만료되었을 때 리프레시 토큰을 이용해 조용히 재발급받는 **"Silent Refresh"** 구현이 훨씬 쉬워집니다.
- 브라우저에 리프레시 토큰을 노출하지 않고, Next.js 서버 내부에서 백엔드와 통신하여 새 토큰을 받아온 뒤 다시 쿠키로 구워줄 수 있습니다.
- 사용자는 로그아웃되지 않고 계속 서비스를 이용할 수 있는 매끄러운 경험을 얻게 됩니다.

---

## 🏗️ 인증 데이터 흐름 (Data Flow) 비교

| 구분 | 클라이언트 직접 인증 | **Next.js API Route 인증 (권장)** |
| :--- | :--- | :--- |
| **토큰 저장소** | LocalStorage (위험 ❌) | HttpOnly Cookie (안전 ✅) |
| **XSS 취약점** | 매우 취약함 | 거의 완벽하게 방어됨 |
| **CORS 설정** | 백엔드에서 복잡하게 설정 필요 | Next.js 서버가 대행하므로 단순함 |
| **초기 로딩 UX** | 로그인 체크 중... (스피너 노출) | 서버에서 체크 후 즉시 렌더링 (빠름) |

---

## 🛠️ Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.