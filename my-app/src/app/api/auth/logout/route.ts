// Next.js Route Handler (더 단순화)
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;

        // 백엔드로 요청만 전달
        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        // 백엔드 응답 그대로 반환
        const data = await backendResponse.json();
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    }
}
