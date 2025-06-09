import { NextResponse } from 'next/server';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { AxiosError } from 'axios';
import { externalClient } from '@/lib/api/clientFetchers';


/**
 * 로그아웃
 * @returns 로그아웃 성공 메세지
 */
export async function POST() {
    try {
        const response = await externalClient.post(EXTERNAL_PATHS.SIGN_OUT);
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}