import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const incomingCookieHeader = request.headers.get('cookie'); // ky에서 보낸 Cookie 헤더를 그대로 받음

    try {
        const res = await fetch('http://localhost:8000/get-users', {
            headers: {
                'Content-Type': 'application/json',
                ...(incomingCookieHeader && { Cookie: incomingCookieHeader }), // 받은 Cookie 헤더를 그대로 백엔드로 전달
            },
        });

        if (!res.ok) {
            throw new Error(`Backend responded with ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in /api/users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
