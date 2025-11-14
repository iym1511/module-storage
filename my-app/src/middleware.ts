// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { refreshAccessToken } from "@/fetchData/token";
// import {isValidToken} from "@/util/getCookieValue";
//
// export async function middleware(request: NextRequest) {
//     const pathname = request.nextUrl.pathname;
//     const accessToken = request.cookies.get("access_token")?.value;
//     const refreshToken = request.cookies.get("refresh_token")?.value;
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//
//     // 1️⃣ 로그인 페이지 - 이미 인증된 사용자는 홈으로
//     if (pathname === "/login") {
//         if (accessToken) {
//             try {
//                 await jwtVerify(accessToken, secret);
//                 return NextResponse.redirect(new URL("/home", request.url));
//             } catch {
//                 // accessToken 만료됨, 로그인 페이지 진입 허용
//                 return NextResponse.next();
//             }
//         }
//         return NextResponse.next();
//     }
//
//     // 2️⃣ 보호된 페이지 - 토큰 없으면 로그인으로
//     if (!accessToken && !refreshToken) {
//         console.warn("❌ 토큰 없음 → 로그인 리다이렉트");
//         return NextResponse.redirect(new URL("/login", request.url));
//     }
//
//     // 3️⃣ accessToken만 없고 refreshToken 있으면 갱신
//     if (!accessToken && refreshToken) {
//         console.log("🔄 accessToken 없음 → 갱신 시도");
//         return await handleTokenRefresh(request, refreshToken);
//     }
//
//     // 4️⃣ accessToken 검증
//     if (accessToken) {
//         try {
//             await jwtVerify(accessToken, secret);
//             return NextResponse.next();
//
//         } catch (error) {
//             // accessToken 만료
//             if (error instanceof Error) {
//                 console.warn("⚠️ accessToken 만료:", error.message);
//             }
//
//             // refreshToken으로 갱신 시도
//             if (refreshToken) {
//                 console.log("🔄 accessToken 만료 → 갱신 시도");
//                 return await handleTokenRefresh(request, refreshToken);
//             }
//
//             // refreshToken도 없으면 로그인으로
//             console.warn("❌ refreshToken 없음 → 로그인 리다이렉트");
//             return NextResponse.redirect(new URL("/login", request.url));
//         }
//     }
//
//     // 5️⃣ 예외 처리 (여기까지 오면 안됨)
//     console.error("❌ 예상치 못한 상태 → 로그인 리다이렉트");
//     return NextResponse.redirect(new URL("/login", request.url));
// }
//
// // 🔄 토큰 갱신 처리 함수
// async function handleTokenRefresh(
//     request: NextRequest,
//     refreshToken: string
// ): Promise<NextResponse> {
//     try {
//         const backendResponse = await refreshAccessToken(refreshToken);
//         console.log("🔥🔥🔥res : ", backendResponse)
//         if (!backendResponse.ok) {
//             throw new Error(`토큰 갱신 실패: ${backendResponse.status}`);
//         }
//
//         const data = await backendResponse.json();
//         const newAccessToken = data.access_token;
//         const newRefreshToken = data.refresh_token;
//
//         if (!newAccessToken) {
//             throw new Error("새 accessToken이 응답에 없음");
//         }
//
//         // ✅ rewrite 사용 (리다이렉트 없이 요청 계속 진행)
//         const response = NextResponse.redirect(new URL(request.url));
//
//         // ✅ 새로운 accessToken 쿠키 설정
//         response.cookies.set('access_token', newAccessToken, {
//             httpOnly: false,  // 클라이언트에서 읽을 수 있도록
//             secure: true,  // 프로덕션에서만 secure
//             sameSite: 'none',
//             maxAge: 5,  // 15분
//             path: "/",
//         });
//
//         response.cookies.set('refresh_token', newRefreshToken, {
//             httpOnly: false, // 개발 중엔 false (배포 시 true로 변경)
//             secure: true, // 프로덕션에서만 secure
//             sameSite: 'strict', // cross-site 쿠키 허용
//             maxAge: 7 * 24 * 60 * 60, // 7일
//             path: "/", // 루트 경로 전역 접근
//         });
//
//         console.log("✅ accessToken 갱신 완료");
//         return response;
//
//     } catch (error) {
//         console.error("❌ 토큰 갱신 실패:", error);
//
//         // 갱신 실패 시 모든 토큰 삭제하고 로 그인으로
//         // const response = NextResponse.redirect(new URL("/login", request.url));
//         // response.cookies.delete("access_token");
//         // response.cookies.delete("refresh_token");
//         const response = NextResponse.next();
//         return response;
//     }
// }


import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/*
* Middleware에서 외부 fetch를 권장하지 않아서 API Route에서 처리
* /api/auth/refresh는 API Route(서버 환경)라 refresh 로직이 안전하게 동작함
*
* */
export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // 로그인 페이지는 통과
    if (request.nextUrl.pathname === "/login") {
        return NextResponse.next();
    }

    // 토큰 둘 다 없으면 로그인으로
    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // accessToken이 있으면 검증
    if (accessToken) {
        try {
            await jwtVerify(accessToken, secret);
            return NextResponse.next();
        } catch {
            // 만료 → refresh 페이지로 이동
            if (refreshToken) {
                const url = new URL("/api/auth/refresh", request.url); // Next.js API Route 이동
                url.searchParams.set("redirect", request.nextUrl.pathname); // 리다이렉트 될 때 원래 있던 페이지로 돌아감
                return NextResponse.redirect(url);
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // accessToken 없고 refreshToken만 있으면 refresh 페이지로 이동
    if (!accessToken && refreshToken) {
        const url = new URL("api/auth/refresh", request.url);
        url.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/home"],
};