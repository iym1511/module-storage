import React from 'react';
import MainContents from '@/app/(afterLogin)/home/_components/MainContents';
import { UserType } from '@/fetchData/fetch-get';

function Page() {
    // placeholder로 사용할 더미 데이터 ( 더 ux가 좋은 스켈레톤 ui 로 대체 )
    const placeholderAry: UserType[] = [
        {
            created_at: new Date().toISOString(),
            email: 'placeholder1@example.com',
            id: 'placeholder_id_1',
            name: 'Placeholder User 1',
            password_hash: 'placeholder_hash_1',
        },
        {
            created_at: new Date().toISOString(),
            email: 'placeholder2@example.com',
            id: 'placeholder_id_2',
            name: 'Placeholder User 2',
            password_hash: 'placeholder_hash_2',
        },
    ];

    return (
        <div>
            <MainContents placeholderAry={placeholderAry} />
        </div>
    );
}

export default Page;
