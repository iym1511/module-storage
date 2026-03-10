import { NextRequest, NextResponse } from 'next/server';

/*
 * 📝 로직 변경 사유:                   (로그인 시  csr컴포넌트에 쿠키에 액세스토큰이 안나오는 현상)
 * 기존에는 백엔드의 Set-Cookie 헤더를 그대로 전달(Proxy)했으나,
 * 브라우저 환경에 따라 쿠키가 즉시 반영되지 않거나 옵션 제어가 어려운 이슈가 있었습니다.
 *
 * 따라서 백엔드 응답 Body의 토큰을 사용하여 Next.js에서 명시적으로 쿠키를 설정(response.cookies.set)하는 방식으로 변경했습니다.
 * 이는 Refresh API와 동일한 방식이며, 안정적인 쿠키 설정과 즉각적인 클라이언트 반영을 보장합니다.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 🔥 백엔드에 로그인 요청
        const backendResponse = await fetch(`${process.env.BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password,
            }),
        });
        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            return NextResponse.json(errorData, { status: backendResponse.status });
        }

        // 🔥 백엔드에서 데이터(토큰 포함) 받기
        const data = await backendResponse.json();
        const { accessToken, refreshToken } = data; // 백엔드가 JSON으로도 토큰을 줌

        const response = NextResponse.json(data);

        // 🔥 명시적으로 쿠키 설정 (Refresh Route와 동일한 방식)
        // Access Token
        if (accessToken) {
            response.cookies.set('access_token', accessToken, {
                httpOnly: true, // 프론트 접근 허용 / JS는 자유롭게 읽는다
                secure: true, // HTTPS 요청에서만 쿠키 전송 / HTTPS에서만 전송되고 / localhost 에서는 https 아니여도 예외적으로 쿠키읽을 수 있음
                sameSite: 'lax',
                maxAge: 60, // 60초 (백엔드와 동일하게)
                path: '/',
            });
        }

        // Refresh Token
        if (refreshToken) {
            response.cookies.set('refresh_token', refreshToken, {
                httpOnly: true, // 프론트 접근 불가
                secure: true,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60, // 7일
                path: '/',
            });
        }

        return response;
    } catch (e) {
        console.error('Login API Error:', e);
        return NextResponse.json({ message: '서버 에러가 발생했습니다.' }, { status: 500 });
    }
}
