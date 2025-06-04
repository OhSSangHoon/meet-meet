import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

/**
 * 모임 참여 확인
 * @header Authorization - 토큰
 * @param request - 쿼리 (모임 ID, 유저 ID, ...)
 * @method GET
 * @returns 성공 메세지
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const response = await axios.get(`${process.env.API_URI_DEV}/gatherings/joined`, {
            params: Object.fromEntries(searchParams),
            headers: {
                'Authorization': request.headers.get('Authorization'),
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}