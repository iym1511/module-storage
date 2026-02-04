import ky from 'ky';
import { getCookie } from 'cookies-next';

/* 💡 SSR(서버 사이드 렌더링) 환경에서는 브라우저가 API 요청을 보내는 것이 아니라, Next.js Node 서버가 API 요청을 보냅니다. */
export const createKy = (cookie?: string) => {
    const isServer = typeof window === 'undefined';
    return ky.create({
        // prefixUrl: isServer
        //     ? 'http://localhost:3000/' // Next.js api 서버 (자기 자신) ❤️
        //     : '/', // 클라이언트는 상대 경로
        prefixUrl: isServer
            ? 'http://localhost:8000/' // ⚠️ next api 가 아닐땐 8000 서버주소로 ⭐
            : '/ptc', // ⚠️ 백엔드로 바로 통신할경우 next.config의 /ptc 로 연결
        headers: cookie ? { Cookie: cookie } : undefined, // ssr에서는 쿠키를 직점 담아줘야함 ❤️
        credentials: 'include', // Next가 내부 프록시로 API 연결 중이라서 이거없어도 same-origin이라 쿠키 전달가능
        hooks: {
            beforeRequest: [
                (request) => {
                    //     /* ⭐
                    //      * 인증 방식: HTTP-only Cookie 기반 JWT 인증
                    //      * - 프론트에서는 access_token에 접근하지 않음
                    //      * - Authorization 헤더를 사용하지 않음
                    //      * - 브라우저가 쿠키를 자동 전송
                    //      * - 서버(req.cookies)에서만 토큰 검증
                    //      ⭐ */
                    const accessToken = getCookie('access_token');
                    console.log('쿠키없나?', accessToken);
                    const token = cookie || accessToken; // ssr일땐 cookie ❤️ , csr일땐accessToken ⭐

                    if (token) {
                        request.headers.set('Authorization', `Bearer ${token}`);
                    }
                },
            ],
            afterResponse: [
                async (request, options, response) => {
                    // 401 에러(토큰 만료) 발생 시
                    if (response.status === 401) {
                        try {
                            // 1. 리프레시 토큰으로 액세스 토큰 갱신 시도
                            const refreshRes = await fetch('/api/auth/refresh', {
                                method: 'POST',
                            });

                            // 2. 갱신 성공 시 원래 요청 재시도
                            if (refreshRes.ok) {
                                // 3. 새로 발급된 토큰 가져오기 (쿠키 업데이트 됨)
                                const newAccessToken = getCookie('access_token');

                                // 4. 기존 요청의 헤더 업데이트 (Authorization 재설정)
                                if (newAccessToken) {
                                    request.headers.set(
                                        'Authorization',
                                        `Bearer ${newAccessToken}`,
                                    );
                                } else {
                                    // 쿠키가 없다면 헤더를 제거해서 브라우저가 자동 쿠키를 쓰도록 유도
                                    request.headers.delete('Authorization');
                                }

                                // 5. 재요청
                                return ky(request);
                            }
                        } catch (error) {
                            // 리프레시 실패 시(리프레시 토큰도 만료됨) -> 에러를 그대로 둠 (로그인 페이지 이동 등은 React Query나 컴포넌트에서 처리)
                            console.error('Silent refresh failed:', error);
                        }
                    }
                },
            ],
        },
    });
};
