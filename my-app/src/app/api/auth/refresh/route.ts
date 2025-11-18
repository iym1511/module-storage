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
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 5, // 15분
        path: "/",
    });

    // 🔥 refreshToken 쿠키 재설정 (여기 추가)
    if (refresh_token) {
        response.cookies.set("refresh_token", refresh_token, {
            httpOnly: false,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7일
            path: "/",
        });
    }

    return response;
}
