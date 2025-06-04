import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

/**
 * 모임 참여 취소
 * @header Authorization - 토큰
 * @param request - 모임 ID
 * @method DELETE
 * @returns 성공 메세지
 */
export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const token = request.headers.get('Authorization');

    if (!id) return new NextResponse(JSON.stringify({ error: '모임 id가 필요합니다' }), { status: 400 });
    if (!token) return new NextResponse(JSON.stringify({ error: '토큰이 필요합니다' }), { status: 401 });

    try {
        const response = await axios.delete(`${process.env.API_URI_DEV}/gatherings/${id}/leave`, { headers: { 'Authorization': token } });
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}