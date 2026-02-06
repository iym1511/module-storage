import ky from 'ky';

/* 💡 SSR(서버 사이드 렌더링) 환경에서는 브라우저가 API 요청을 보내는 것이 아니라, Next.js Node 서버가 API 요청을 보냅니다. */
export const createKy = (cookie?: string) => {
    const isServer = typeof window === 'undefined';
    return ky.create({
        prefixUrl: isServer
            ? 'http://localhost:8000/' // ⚠️ next api 가 아닐땐 8000 서버주소로 ⭐ 그리고 애초에 ssr컴포넌트에서 /ptc 즉 rewrite는 읽지못함
            : '/ptc', // ⚠️ 백엔드로 바로 통신할경우 next.config의 /ptc 로 연결
        headers: cookie ? { Cookie: cookie } : undefined, // ssr에서는 쿠키를 직점 담아줘야함 ❤️
        // Next가 내부 프록시로 API 연결 중이라서 이거없어도 same-origin이라 쿠키 전달가능
        // ⭐ /ptc 를 설정한 rewrite 가 있기때문 localhost:8000 생으로 쓸려면 include 필요
        // credentials: 'include',
        hooks: {
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
                                // 3. 재요청
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
