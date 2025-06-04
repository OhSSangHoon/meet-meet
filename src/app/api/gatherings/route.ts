import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { AxiosError } from 'axios';
import { apiServer } from '@/lib/api/axios';

/**
 * 모임 생성 API
 * @header Authorization - 토큰
 * @param request - 모임 정보 (제목, 내용, 이미지, 위치, 시간, 참여자 수)
 * @method POST
 * @returns 모임 생성 성공 메세지
 */
export async function POST(request: NextRequest) {
    const token = request.headers.get('Authorization');

    try {
        const formData = await request.formData();

        if (!token) return new NextResponse(JSON.stringify({ error: '토큰이 필요합니다' }), { status: 401 });

        const response = await apiServer.post(EXTERNAL_PATHS.createGathering, formData, {
            headers: {
                'Authorization': token!,
                'Content-Type': 'multipart/form-data',
            },
        });

        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}


/**
 * 모임 목록 조회 API
 * @param request 
 * @returns 전체 모임 목록
 */
export async function GET(request: NextRequest) {
    const token = request.headers.get('Authorization');

    try {
        const searchParams = request.nextUrl.searchParams;
        const response = await apiServer.get(EXTERNAL_PATHS.fetchGatherings, {
            params: Object.fromEntries(searchParams),
            headers: {
                'Authorization': token!,
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}
