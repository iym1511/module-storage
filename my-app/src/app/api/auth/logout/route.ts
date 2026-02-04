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
        const response = NextResponse.json(data, { status: backendResponse.status });

        // Next.js에서 직접 쿠키 삭제 (더 깔끔한 방식)
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    }
}
