import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { AxiosError } from 'axios';
import { apiServer } from '@/lib/api/axios';

/**
 * 로그인
 * @param request - 이메일, 비밀번호
 * @returns 로그인 성공 메세지
 */
export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    if (!email || !password) return new NextResponse(JSON.stringify({ error: '이메일과 비밀번호는 필수입니다' }), { status: 400 });

    try {
        const response = await apiServer.post(EXTERNAL_PATHS.signIn, { email, password })
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}