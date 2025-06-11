import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { externalClient } from '@/lib/api/clientFetchers';
import { handleApiError } from '@/lib/api/handleApiError';

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
        const response = await externalClient.get(EXTERNAL_PATHS.CHECK_JOINED, {
            params: Object.fromEntries(searchParams),
            headers: { 'Authorization': request.headers.get('Authorization') },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return handleApiError(error);
    }
}