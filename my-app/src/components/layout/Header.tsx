'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Header() {
    const router = useRouter();

    const onLogout = async () => {
        try {
            // Next.js API Route 호출 (쿠키 삭제 및 백엔드 로그아웃 처리)
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (response.ok) {
                router.replace('/login');
            } else {
                console.error('Logout failed');
                router.replace('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            router.replace('/login');
        }
    };

    return (
        <header className="flex justify-end p-4 border-b">
            <Button variant="outline" onClick={onLogout}>
                로그아웃
            </Button>
        </header>
    );
}
