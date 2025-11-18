

const baseUrl = 'http://localhost:8000';

export async function verifyToken(token: string) {
    try {
        const res = await fetch(`${baseUrl}/ptc/verify-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });
        if (!res.ok) return false; // 200 아니면 false
        console.log(res)
        const data = await res.json();
        return data.valid; // API에서 true/false로 반환한다고 가정
    } catch (e : unknown) {
        console.error("verifyToken error:", e);
        return false;
    }
}

        // const accessTokne = getCookie("access_token");

export const refreshAccessToken = async (
    refreshToken: string
): Promise<Response> => {
    try {
        // const res = await createKy().post("refresh", {
        //     json: { refreshToken },
        //     credentials: "include", // refresh_token 쿠키 포함
        // });
        // rewrite로 나가는 서버 → 서버 요청(fetch) 은 middleware를 통하지 않는다.
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
            console.error("❌ refresh 요청 실패:", res.status, res.statusText);
            throw new Error("Refresh failed");
        }

        return res;
    } catch (e: unknown) {
        console.error("refreshAccessToken error:", e);
        throw e;
    }
};