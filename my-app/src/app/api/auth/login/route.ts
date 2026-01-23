import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 🔥 백엔드에 로그인 요청
        const backendResponse = await fetch(`${process.env.BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            return NextResponse.json(errorData, { status: backendResponse.status });
        }

        const data = await backendResponse.json();
        const response = NextResponse.json(data);

        // 🔥 백엔드가 설정한 쿠키(Set-Cookie)를 그대로 클라이언트에게 전달
        const setCookieHeader = backendResponse.headers.get('Set-Cookie');
        if (setCookieHeader) {
            response.headers.set('Set-Cookie', setCookieHeader);
        }

        return response;
    } catch (e) {
        console.error('Login API Error:', e);
        return NextResponse.json({ message: '서버 에러가 발생했습니다.' }, { status: 500 });
    }
}
