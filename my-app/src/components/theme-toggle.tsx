'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import * as s from '@/lib/simple-styles';

export function ThemeToggle() {
    const [mounted, setMounted] = useState<boolean>(false);

    /**
     * `useTheme` 훅은 현재 테마와 테마를 변경하는 함수를 제공합니다.
     * `resolvedTheme`는 'system' 설정일 경우 실제 적용된 테마('light' 또는 'dark')를 반환합니다.
     */
    const { resolvedTheme, setTheme } = useTheme();

    /**
     * 컴포넌트가 마운트된 후에만 UI를 렌더링하여,
     * 서버사이드 렌더링(SSR) 시 발생할 수 있는 하이드레이션 오류를 방지합니다.
     */
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors ${s.small} `}
        >
            {isDark ? '🌞 라이트' : '🌙 다크'}
        </button>
    );
}
