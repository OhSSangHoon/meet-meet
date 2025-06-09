import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { AxiosError } from 'axios';
import { apiServer } from '@/lib/api/clientFetcher';

/**
 * 모임 상세 조회
 * @param request - 모임 ID
 * @method GET
 * @returns 성공 메세지
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = Number(searchParams.get('id'));

    if (!id) return new NextResponse(JSON.stringify({ error: '모임 id가 필요합니다' }), { status: 400 });

    try {
        const response = await apiServer.get(EXTERNAL_PATHS.fetchGatheringDetail(id));
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}