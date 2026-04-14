import { NextRequest, NextResponse } from 'next/server';

/**
 * 🛠️ 설계 변경 핵심 요약:
 * 1. 역할 분리 (Separation of Concerns): 미들웨어(페이지 이동)와 클라이언트(데이터 요청)의 목적에 맞는 전용 핸들러 제공.
 * 2. 중복 제거 (DRY): 공통 로직을 함수화하여 보안 정책(쿠키 옵션) 및 백엔드 통신 로직의 일관성 보장.
 * 3. 효율성 최적화: 배경 요청(Silent Refresh) 시 불필요한 리다이렉트와 HTML 다운로드를 방지하여 네트워크 비용 절감.
 */

/**
 * [공통] 백엔드 서버에 토큰 갱신을 요청하는 함수
 * - 관리 포인트 단일화: 백엔드 엔드포인트나 통신 방식 변경 시 이 함수만 수정하면 됨.
 */
async function fetchNewTokens(refreshToken: string) {
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });

    if (!backendResponse.ok) return null;

    return await backendResponse.json(); // { access_token, refresh_token }
}

/**
 * [공통] 브라우저에 토큰 쿠키를 구워주는 함수
 * - 보안 일관성: httpOnly, secure, sameSite 등 보안 옵션을 한 곳에서 제어하여 설정 누락 방지.
 * - MaxAge 최적화: 엑세스 토큰(15분), 리프레시 토큰(7일)으로 현실적인 유지 시간 설정.
 */
function setTokenCookies(response: NextResponse, access_token: string, refresh_token: string) {
    response.cookies.set('access_token', access_token, {
        httpOnly: true, // XSS 공격 방지 (JS 접근 불가)
        secure: true, // HTTPS 환경 강제
        sameSite: 'lax', // CSRF 방어와 UX(링크 클릭 이동) 사이의 균형
        maxAge: 15 * 60, // 15분 (일반적인 보안 권장 사항)
        path: '/',
    });

    if (refresh_token) {
        response.cookies.set('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7일
            path: '/',
        });
    }
}

/**
 * [GET] 미들웨어 및 페이지 이동 전용 핸들러
 * - 목적: 사용자가 엑세스 토큰 없이 페이지에 접근했을 때, 토큰 갱신 후 '원래 가려던 페이지'로 자동 이동시킴.
 * - 특징: Cache-Control 설정을 통해 브라우저가 낡은 토큰 정보를 캐싱하지 않도록 강제함.
 */
export async function GET(request: NextRequest) {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    // 리프레시 토큰조차 없으면 즉시 로그인 페이지로 추방
    if (!refreshToken) return NextResponse.redirect(new URL('/login', request.url));

    const tokens = await fetchNewTokens(refreshToken);

    // 갱신 실패 시 (리프레시 토큰 만료 등): 기존 쿠키를 삭제하고 로그인 페이지로 유도
    if (!tokens) {
        const res = NextResponse.redirect(new URL('/login', request.url));
        res.cookies.delete('access_token');
        res.cookies.delete('refresh_token');
        return res;
    }

    // 성공 시: 원래 가려던 페이지(redirect 파라미터) 또는 홈으로 리다이렉트
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/home';
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    // 중요: 토큰 페이지는 절대 캐싱되면 안 됨 (기본 캐싱 셋팅이 캐싱이 안되어서 설정 안해도됨)
    response.headers.set('Cache-Control', 'no-store');

    setTokenCookies(response, tokens.access_token, tokens.refresh_token);
    return response;
}

/**
 * [POST] 클라이언트(ky, fetch) Silent Refresh 전용 핸들러
 * - 목적: 배경에서 API 호출 중 401 에러가 났을 때, 페이지 이동 없이 쿠키만 조용히 갱신.
 * - 장점 (Redirect 대비):
 *   1. 네트워크 부하 감소: 페이지 전체 HTML 대신 짧은 JSON 메시지만 주고받음.
 *   2. 데이터 무결성: 클라이언트가 JSON을 기대하는 AJAX 요청 중에 HTML이 섞여 들어오는 파싱 에러를 근본적으로 차단.
 *   3. 명확한 상태 코드: 성공 시 200, 실패 시 401을 명확히 반환하여 클라이언트 측 예외 처리 용이.
 */
export async function POST(request: NextRequest) {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    const tokens = await fetchNewTokens(refreshToken);

    if (!tokens) {
        const res = NextResponse.json({ message: 'Refresh failed' }, { status: 401 });
        res.cookies.delete('access_token');
        res.cookies.delete('refresh_token');
        return res;
    }

    // 페이지 이동 없이 쿠키만 세팅하고 성공 메시지 반환
    const response = NextResponse.json({ message: 'Refreshed successfully' });
    setTokenCookies(response, tokens.access_token, tokens.refresh_token);
    return response;
}
