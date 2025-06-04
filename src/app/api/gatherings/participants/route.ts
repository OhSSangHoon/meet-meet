import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

/**
 * 모임 참여자 목록 조회    
 * @header Authorization - 토큰
 * @param request - 모임 ID
 * @method GET
 * @returns 해당 모임의 참가자 목록 조회
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const token = request.headers.get('Authorization');

    if (!id) return new NextResponse(JSON.stringify({ error: '모임 id가 필요합니다' }), { status: 400 });

    try {
        const response = await axios.get(`${process.env.API_URI_DEV}/gatherings/${id}/participants`, { headers: { 'Authorization': token } });
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}