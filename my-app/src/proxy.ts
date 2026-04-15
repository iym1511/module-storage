import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // 이용자수 다수의 JWT 토큰 검증 라이브러리

/*
 * Middleware에서 외부 fetch를 권장하지 않아서 API Route에서 처리
 * 🚨 모든 페이지/API 요청마다 Middleware 실행
 * 🚨 외부 fetch 느리면 전체 앱이 느려짐
 * 🚨 사용자 경험 악화
 * /api/auth/refresh는 API Route(서버 환경)라 refresh 로직이 안전하게 동작함
 */

/*
 * NextResponse.redirect & NextResponse.rewrite 차이 🤔
 * ☀️ redirect는 로그인 안 한 유저가 /dashboard에 접근할 때 /login으로 강제로 쫓아낼 때.
 * 페이지 주소가 완전히 바뀌어서 구버전 주소(/old-url)로 들어온 사람을 신버전 주소(/new-url)로 안내할 때.
 *
 * ☀️ rewrite 는 브라우저 주소창 url 이 바귀지 않을때
 * 사용자가 토큰 재발급 과정을 눈치채지 못함 + 원래 가려고했던 주소로 자연스럽게 이동
 */

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // jose 토큰검증을 위한 Unit8Array 변환

    // 로그인 페이지는 통과
    if (request.nextUrl.pathname === '/login') {
        return NextResponse.next();
    }

    // 토큰 둘 다 없으면 로그인으로
    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // accessToken이 있으면 검증.
    if (accessToken) {
        try {
            await jwtVerify(accessToken, secret); // 토큰 검증

            return NextResponse.next();
        } catch {
            // 만료 → refresh 페이지로 이동
            if (refreshToken) {
                const url = new URL('/api/auth/refresh', request.url); // Next.js API Route 이동
                url.searchParams.set('redirect', request.nextUrl.pathname); // 리다이렉트 될 때 원래 있던 페이지로 돌아감
                return NextResponse.redirect(url); // ← 여기서 브라우저가 실제로 이동하고, 그때 route.ts GET 핸들러 실행됨
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // accessToken 없고 refreshToken만 있으면 refresh 페이지로 이동
    if (!accessToken && refreshToken) {
        const url = new URL('/api/auth/refresh', request.url);
        url.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/home', '/board/:path*', '/board'],
};
