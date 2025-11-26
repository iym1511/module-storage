'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import * as s from '@/lib/simple-styles';
import {small} from "@/lib/simple-styles";

export function ThemeToggle() {
    const [mounted, setMounted] = useState<boolean>(false);
    const { theme, setTheme } = useTheme();

    // 마운트 후에만 렌더링 (SSR 이슈 방지)
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors ${s.small} `}
        >
            {theme === 'dark' ? '🌞 라이트' : '🌙 다크'}
        </button>
    );
}