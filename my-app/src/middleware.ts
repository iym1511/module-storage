import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // 이용자수 다수의 JWT 토큰 검증 라이브러리

/*
 * Middleware에서 외부 fetch를 권장하지 않아서 API Route에서 처리
 * 🚨 모든 페이지/API 요청마다 Middleware 실행
 * 🚨 외부 fetch 느리면 전체 앱이 느려짐
 * 🚨 사용자 경험 악화
 * /api/auth/refresh는 API Route(서버 환경)라 refresh 로직이 안전하게 동작함
 */

export async function middleware(request: NextRequest) {
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
                return NextResponse.redirect(url);
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
    matcher: ['/', '/login', '/home', '/board/:path*'],
};
