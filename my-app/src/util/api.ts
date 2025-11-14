import ky from "ky";
import {getCookie} from "cookies-next";

export const createKy = () => {

    return ky.create({
        prefixUrl: process.env.NEXT_PUBLIC_API_URL,
        credentials: "include", // Next가 내부 프록시로 API 연결 중이라서 이거없어도 same-origin이라 쿠키 전달가능
        hooks: {
            beforeRequest: [
                (request) => {
                    const accessToken = getCookie('access_token');
                    console.log("accessToken:", accessToken);
                    if (accessToken) {
                        request.headers.set(
                            "Authorization",
                            `Bearer ${accessToken}`,
                        );
                    }
                },
            ],
        },
    });
};


export const createRefreshKy = () => {
    return ky.create({
        prefixUrl: process.env.NEXT_PUBLIC_API_URL,
        // credentials: "include", // refresh_token은 HttpOnly 쿠키로 자동 전송
        // ✅ beforeRequest hook 없음 - Authorization 헤더 안 넣음
    });
};