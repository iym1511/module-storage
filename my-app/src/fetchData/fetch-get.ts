import {createKy} from "@/util/api";

interface UserType {
    created_at : string;
    email : string;
    id: string;
    name : string;
    password_hash : string;
}

export const apiTest = async () => {
    try {
        const data = await createKy().get("get-users").json<UserType>();

        console.log("✅ API 결과:", data);
        return data;
    } catch (error: unknown) {
        console.error("❌ ky 요청 실패:", error);
        throw error;
    }
};