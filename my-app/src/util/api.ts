import ky from 'ky';

export const createKy = (cookie?: string) => {
    const isServer = typeof window === 'undefined';
    return ky.create({
        prefixUrl: isServer
            ? 'http://localhost:3000/' // Next.js 서버 (자기 자신)
            : '/', // 클라이언트는 상대 경로
        // prefixUrl: isServer
        //     ? 'http://localhost:8000/' // ⚠️ next api 가 아닐땐 8000 서버주소로
        //     : '/ptc', // ⚠️ 백엔드로 바로 통신할경우 next.config의 /ptc 로 연결
        headers: cookie ? { Cookie: cookie } : undefined,
        credentials: 'include', // Next가 내부 프록시로 API 연결 중이라서 이거없어도 same-origin이라 쿠키 전달가능
        hooks: {
            beforeRequest: [
                (request) => {
                    /* ⭐
                     * 인증 방식: HTTP-only Cookie 기반 JWT 인증
                     * - 프론트에서는 access_token에 접근하지 않음
                     * - Authorization 헤더를 사용하지 않음
                     * - 브라우저가 쿠키를 자동 전송
                     * - 서버(req.cookies)에서만 토큰 검증
                     ⭐ */
                    // const accessToken = getCookie('access_token');
                    // console.log('accessToken:', accessToken);
                    //     if (accessToken) {
                    //         request.headers.set(
                    //             "Authorization",
                    //             `Bearer ${accessToken}`,
                    //         );
                    //     }
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
                                // ky(request)를 반환하면 ky가 자동으로 재요청을 수행합니다.
                                // 브라우저가 갱신된 쿠키를 자동으로 포함해서 보냅니다.
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
