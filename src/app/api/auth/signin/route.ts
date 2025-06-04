import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

/**
 * 로그인
 * @param request - 이메일, 비밀번호
 * @returns 로그인 성공 메세지
 */
export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    if (!email || !password) return new NextResponse(JSON.stringify({ error: '이메일과 비밀번호는 필수입니다' }), { status: 400 });

    try {
        const response = await axios.post(`${process.env.API_URI_DEV}/auths/signin`, { email, password })
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}