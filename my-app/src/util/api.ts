import ky from 'ky';

export const createKy = () => {
    return ky.create({
        prefixUrl: 'ptc/',
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
                    // if (accessToken) {
                    //     request.headers.set(
                    //         "Authorization",
                    //         `Bearer ${accessToken}`,
                    //     );
                    // }
                },
            ],
        },
    });
};

export const createRefreshKy = () => {
    return ky.create({
        prefixUrl: 'ptc/',
        // credentials: "include", // refresh_token은 HttpOnly 쿠키로 자동 전송
        // ✅ beforeRequest hook 없음 - Authorization 헤더 안 넣음
    });
};
