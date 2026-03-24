import React from 'react';
import { UiTestDashboard } from '@/components/board/UiTestDashboard';

async function Page() {
    // 의도적인 딜레이 추가 (2초)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return (
        <div>
            <UiTestDashboard />
        </div>
    );
}

export default Page;
