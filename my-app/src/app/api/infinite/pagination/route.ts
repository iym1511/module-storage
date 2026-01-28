import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '5';

    const incomingCookieHeader = request.headers.get('cookie');

    try {
        const res = await fetch(
            `http://localhost:8000/infinite/pagination?page=${page}&limit=${limit}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(incomingCookieHeader && { Cookie: incomingCookieHeader }),
                },
            },
        );

        const data = await res.json();
        
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Error in /api/infinite/pagination:', error);
        return NextResponse.json({ error: 'Failed to fetch paginated items' }, { status: 500 });
    }
}
