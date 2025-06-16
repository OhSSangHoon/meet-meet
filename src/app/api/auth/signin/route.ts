import { NextRequest, NextResponse } from 'next/server';
import { externalClient } from '@/lib/api/clientFetchers';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { handleApiError } from '@/lib/api/handleApiError';

/**
 * 로그인
 * @param request - 이메일, 비밀번호
 * @returns 로그인 성공 메세지
 */
export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    if (!email || !password) return new NextResponse(JSON.stringify({ error: '이메일과 비밀번호는 필수입니다' }), { status: 400 });

    try {
        const response = await externalClient.post(EXTERNAL_PATHS.SIGN_IN, { email, password })
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}