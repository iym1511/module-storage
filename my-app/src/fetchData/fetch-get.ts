import { createKy } from '@/util/api';

export interface UserType {
    created_at: string;
    email: string;
    id: string;
    name: string;
    password_hash: string;
}

export const apiTest = async () => {
    try {
        const data = await createKy().get('get-users').json<UserType[]>();

        console.log('✅ API 결과:', data);
        return data;
    } catch (error: unknown) {
        console.error('❌ ky 요청 실패:', error);
        throw error;
    }
};

// 2초 지연을 추가한 새로운 함수
export const delayedApiTest = async () => {
    console.log('⏳ 2초 지연 시작...');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = await apiTest();
    // 실제 데이터는 다른 내용으로 반환하여 placeholder와 구별
    return data.map((item) => ({
        ...item,
        name: `(실제 데이터) ${item.name}`,
    }));
};