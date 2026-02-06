import { createKy } from '@/util/api';

export interface UserType {
    created_at: string;
    email: string;
    id: string;
    name: string;
    password_hash: string;
}

/* next api를 사용하지 않을 때 ⭐ */
export const apiTest2 = async (cookieString?: string | undefined) => {
    try {
        // leading slash 제거: 'get-users' 사용
        const data = await createKy(cookieString).get('get-users').json<UserType[]>();

        return data;
    } catch (error: unknown) {
        console.error('❌ ky 요청 실패:', error);
        throw error;
    }
};
