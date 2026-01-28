import { createKy } from '@/util/api';

export interface UserType {
    created_at: string;
    email: string;
    id: string;
    name: string;
    password_hash: string;
}

/* next api를 사용할 때 ❤️ */
export const apiTest = async (cookie?: string | any) => {
    try {
        // SSR prefetch 시 string으로 넘어옴, useQuery 호출 시 context 객체로 넘어옴
        const validCookie = typeof cookie === 'string' ? cookie : undefined;
        // Next.js API Route 호출
        const data = await createKy(validCookie).get('api/users').json<UserType[]>();

        console.log('✅ API 결과:', data);
        return data;
    } catch (error: unknown) {
        console.error('❌ ky 요청 실패:', error);
        throw error;
    }
};

/* next api를 사용하지 않을 때 ⭐ */
// export const apiTest2 = async (cookie?: any) => {
//     try {
//         // leading slash 제거: 'get-users' 사용
//         const data = await createKy(cookie).get('get-users').json<UserType[]>();
//
//         return data;
//     } catch (error: unknown) {
//         console.error('❌ ky 요청 실패:', error);
//         throw error;
//     }
// };
