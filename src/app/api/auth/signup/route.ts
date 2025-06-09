import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { AxiosError } from 'axios';
import { apiServer } from '@/lib/api/clientFetchers';

/**
 * 회원가입
 * @param request
 * @returns 회원가입 성공 메세지
 */
export async function POST(request: NextRequest) {
    const { email, password, name, companyName } = await request.json();

    if (!email || !password || !name || !companyName) return new NextResponse(JSON.stringify({ error: '이메일, 비밀번호, 닉네임, 회사명은 필수 입력입니다' }), { status: 400 });

    try {
        const response = await apiServer.post(EXTERNAL_PATHS.SIGN_UP, {
            email,
            password,
            name,
            companyName
        })
        return new NextResponse(JSON.stringify(response.data), { status: 201 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}