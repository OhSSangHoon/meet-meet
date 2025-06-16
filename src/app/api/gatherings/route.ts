import { NextRequest, NextResponse } from 'next/server';
import { externalClient } from '@/lib/api/clientFetchers';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { handleApiError } from '@/lib/api/handleApiError';

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

        const response = await externalClient.post(EXTERNAL_PATHS.GATHERINGS, formData, {
            headers: {
                'Authorization': token!,
                'Content-Type': 'multipart/form-data',
            },
        });

        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        return handleApiError(error);
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
        const response = await externalClient.get(EXTERNAL_PATHS.GATHERINGS, {
            params: Object.fromEntries(searchParams),
            headers: {
                'Authorization': token!,
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return handleApiError(error);
    }
}
