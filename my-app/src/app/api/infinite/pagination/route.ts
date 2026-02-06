// import { NextRequest, NextResponse } from 'next/server';
//
// export async function GET(request: NextRequest) {
//     const searchParams = request.nextUrl.searchParams;
//     const cursor = searchParams.get('cursor') || '0';
//     const limit = searchParams.get('limit') || '3';
//
//     // 1. 쿠키에서 'access_token' 값만 쏙 빼냅니다. (이름은 실제 쿠키 키값으로 변경하세요)
//     const accessToken = request.cookies.get('access_token')?.value;
//
//     try {
//         const res = await fetch(
//             `http://localhost:8000/infinite/items?cursor=${cursor}&limit=${limit}`,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     // 2. 토큰이 있을 때만 'Authorization: Bearer <토큰>' 헤더를 추가합니다.
//                     // (Cookie 헤더를 통째로 넘기는 것이 아니라, 인증 정보만 표준 규격으로 보냅니다)
//                     ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
//                 },
//             },
//         );
//
//         const data = await res.json();
//
//         return NextResponse.json(data, { status: res.status });
//     } catch (error) {
//         console.error('Error in /api/infinite/items:', error);
//         return NextResponse.json({ error: 'Failed to fetch infinite items' }, { status: 500 });
//     }
// }
