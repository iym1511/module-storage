import { NextRequest, NextResponse } from 'next/server';

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
        // JavaScript로 접근 가능 (document.cookie로 읽을 수 있음)
        // false = 프론트에서 토큰을 직접 사용할 수 있음 (API 헤더에 넣기 등)
        // ⚠️ XSS 공격에 취약할 수 있으므로 주의 필요
        httpOnly: true, // 🔥 절대 프론트 접근 불가 (보안 핵심)
        // HTTPS 연결에서만 쿠키 전송 (HTTP에서는 전송 안 됨)
        // 단, localhost는 예외로 HTTP에서도 작동함
        // 프로덕션에서는 반드시 true로 설정해야 함
        secure: true, // 🔥 HTTPS 필수 (로컬에선 false)
        // 다른 도메인(cross-site)에서의 요청에도 쿠키 전송 허용
        // 'none' = 모든 외부 사이트 요청에 쿠키 포함
        // CORS API 호출, iframe 등에서 필요할 때 사용
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
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });
    }
    /*
   *조건	이유
   refresh_token sameSite가 lax여도	Next.js API Route 호출은 same-site 요청
   secure:false인데도 읽히는 이유	Next.js API Route는 서버라 secure 필요 없음
   httpOnly:true여도 읽히는 이유	서버 코드라서 httpOnly 쿠키 읽기 가능
   왜 쿠키 전달이 문제 없었냐	프론트→Next API Route는 same-site라 lax에서 허용
   * */

    return response;
}
