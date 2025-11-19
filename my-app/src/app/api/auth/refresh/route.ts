import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 🔥 백엔드에 refresh 요청
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    // 🔥 실패 시 로그인
    if (!backendResponse.ok) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("access_token");
        res.cookies.delete("refresh_token");
        return res;
    }

    // 🔥 백엔드에서 access, refresh 둘 다 받기
    const { access_token, refresh_token } = await backendResponse.json();

    const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/home";
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    console.log("여기~")
    // 🔥 accessToken 쿠키 재설정
    response.cookies.set("access_token", access_token, {
        httpOnly: false,      // 🔥 절대 프론트 접근 불가 (보안 핵심)
        secure: true,        // 🔥 HTTPS 필수
        sameSite: "none",    // 🔥 cross-site 요청시 쿠키 전달 허용
        maxAge: 15, // 15분
        path: "/",
    });

    // 🔥 refreshToken 쿠키 재설정 (여기 추가)
    if (refresh_token) {
        response.cookies.set("refresh_token", refresh_token, {
            httpOnly: true,      // 🔥 절대 프론트 접근 불가 (보안 핵심)
            secure: false,        // 🔥 HTTPS 필수
            sameSite: "none",    // 🔥 cross-site 요청시 쿠키 전달 허용
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });
    }

    return response;
}
