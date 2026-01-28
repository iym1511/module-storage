import { NextRequest, NextResponse } from 'next/server';

// GET (페이지 이동용)
// 사용자가 직접 URL을 입력하거나, 서버사이드(Middleware)에서 페이지를 통째로 옮길 때 사용합니다.
// 로직이 끝나면 NextResponse.redirect()를 통해 특정 페이지(홈 등)로 브라우저를 강제 이동시킵니다.
export async function GET(request: NextRequest) {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 🔥 백엔드에 refresh 요청
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });

    // 🔥 실패 시 로그인
    if (!backendResponse.ok) {
        const res = NextResponse.redirect(new URL('/login', request.url));
        res.cookies.delete('access_token');
        res.cookies.delete('refresh_token');
        return res;
    }

    // 🔥 백엔드에서 access, refresh 둘 다 받기
    const { access_token, refresh_token } = await backendResponse.json();

    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/home';
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    // 🔥 accessToken 쿠키 재설정
    response.cookies.set('access_token', access_token, {
        // false = JavaScript로 접근 가능 (document.cookie로 읽을 수 있음)
        // false = 프론트에서 토큰을 직접 사용할 수 있음 (API 헤더에 넣기 등)
        // ⚠️ XSS 공격에 취약할 수 있으므로 주의 필요
        httpOnly: true, // 🔥 절대 프론트 접근 불가 (보안 핵심)

        // HTTPS 연결에서만 쿠키 전송 (HTTP에서는 전송 안 됨)
        // 단, localhost는 예외로 HTTP에서도 작동함
        // 프로덕션에서는 반드시 true로 설정해야 함
        // httpOnly true일때  이것도 true가 함께 적용됨
        secure: true, // 🔥 HTTPS 필수 (로컬에선 false)

        // 다른 도메인(cross-site)에서의 요청에도 쿠키 전송 허용
        // CORS API 호출, iframe 등에서 필요할 때 사용
        // 'lax' : Strict와 비슷하지만, **"링크 타고 들어오는 이동(GET)"**은 허용해 줌.
        // ⚠️ 'none' 사용 시 반드시 secure: true 필요
        sameSite: 'lax', // 🔥 cross-site 요청시 쿠키 전달 허용
        maxAge: 15, // 15분
        path: '/',
    });

    // 🔥 refreshToken 쿠키 재설정 (여기 추가)
    if (refresh_token) {
        response.cookies.set('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            // 가장 엄격한 CSRF 방어 모드
            // 'strict' = 완전히 같은 사이트 내에서만 쿠키 전송
            // 외부 링크 클릭해서 들어와도 쿠키 안 보냄
            // ⚠️ UX 저하 가능: 이메일/카카오톡 링크로 접속 시 로그인 안 된 것처럼 보일 수 있음
            // 'lax'로 변경 고려 (보안과 UX 균형)
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });
    }

    return response;
}

// POST (데이터 요청용/Silent Refresh)
// 지금처럼 인피니티 스크롤 같은 배경 API 요청 중에 토큰을 갱신할 때 사용합니다.
// 페이지가 이동되면 안 되고, 단순히 쿠키만 구워준 뒤 JSON 응답({ message: "success" })을 보내야 합니다.
// 만약 여기서 GET처럼 리다이렉트를 해버리면, API 요청 결과로 데이터 대신 "홈페이지 HTML 코드"가 날아와서 에러가 나게 됩니다.
export async function POST(request: NextRequest) {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    // 🔥 백엔드에 refresh 요청
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });

    // 🔥 실패 시 401 반환
    if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        const res = NextResponse.json(errorData, { status: backendResponse.status });
        console.log('출력!', res);
        res.cookies.delete('access_token');
        res.cookies.delete('refresh_token');
        return res;
    }

    // 🔥 백엔드에서 access, refresh 둘 다 받기
    const { access_token, refresh_token } = await backendResponse.json();

    const response = NextResponse.json({ message: 'Refreshed successfully' });

    // 🔥 accessToken 쿠키 재설정
    response.cookies.set('access_token', access_token, {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 15, // 15분
        path: '/',
    });

    // 🔥 refreshToken 쿠키 재설정
    if (refresh_token) {
        response.cookies.set('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });
    }

    return response;
}
