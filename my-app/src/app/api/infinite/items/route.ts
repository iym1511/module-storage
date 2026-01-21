import { NextRequest, NextResponse } from 'next/server';

// next API 에서 쿠키를 헤더에 담아서 보낸다!!!
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor') || '0';
    const limit = searchParams.get('limit') || '3';

    const incomingCookieHeader = request.headers.get('cookie'); // ky에서 보낸 Cookie 헤더를 그대로 받음

    try {
        const res = await fetch(
            `http://localhost:8000/infinite/items?cursor=${cursor}&limit=${limit}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(incomingCookieHeader && { Cookie: incomingCookieHeader }), // 받은 Cookie 헤더를 그대로 백엔드로 전달
                },
            },
        );

        const data = await res.json();
        
        // 백엔드의 상태 코드(401 등)와 데이터를 그대로 프론트엔드로 전달
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Error in /api/infinite/items:', error);
        return NextResponse.json({ error: 'Failed to fetch infinite items' }, { status: 500 });
    }
}
