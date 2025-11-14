import {createKy} from "@/util/api";

export const apiTest = async () => {
    try {
        const data = await createKy().get("get-users").json<any>();

        console.log("✅ API 결과:", data);
        return data;
    } catch (error: any) {
        console.error("❌ ky 요청 실패:", error.message || error);
        throw error;
    }
};