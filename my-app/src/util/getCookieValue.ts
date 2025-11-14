// jwt 복호화 후 가져오는 유저 객체 Type
export type UserType = Record<string, string | number | boolean | null>;
export type getSessionType = string | number | boolean | null;

export interface UserInfoType {
    id: string;
    password: string;
}


function getCookieValue(name: string): string | null {
    const value = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
    return value ?? null;
}

// export function jwtDecode(token: string): UserType | null {
//     try {
//         if (!token) return null;
//
//         const parts: string[] = token.split(".");
//
//         if (parts.length < 2) {
//             throw new Error("Invalid token!");
//         }
//         const base64Url: string = parts[1];
//         const base64: string = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//         const decoded: UserType = JSON.parse(atob(base64)); // 복호화 한 것을 문자열 -> 객체로 변환
//
//         return decoded; // 복호화된 유저정보 반환
//     } catch (error) {
//         console.error("Error decoding token:", error);
//         throw error;
//     }
// }
//
//
// export function isValidToken(
//     accessToken: string
// ): "valid" | "expired" | "invalid" {
//     if (!accessToken) {
//         return "invalid";
//     }
//     try {
//         const { exp } = jwtDecode<{ exp: number }>(accessToken);
//         const now = Date.now() / 1000;
//         // ✅ 만료 1초 전부터 expired로 간주
//         if (exp - now <= 1) return "expired";
//         return "valid";
//     } catch (error) {
//         console.error("Error during token validation:", error);
//         return "invalid";
//     }
// }