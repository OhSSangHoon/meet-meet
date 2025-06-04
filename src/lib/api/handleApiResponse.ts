import { NextResponse } from 'next/server';
import { AxiosError } from 'axios';

export function handleApiSuccess(data: any, status: number = 200) {
    return new NextResponse(JSON.stringify(data), { status });
}

export function handleApiError(error: unknown, fallbackMessage = '서버 오류', fallbackStatus = 500) {
    if (error && typeof error === 'object' && 'isAxiosError' in error && (error as any).isAxiosError) {
        const err = error as AxiosError;
        // 서버에서 응답이 온 경우: 상태 코드와 데이터 그대로 전달
        if (err.response) return new NextResponse(JSON.stringify(err.response.data), { status: err.response.status || fallbackStatus });
        // 요청은 갔으나 응답이 없는 경우
        else if (err.request) return new NextResponse(JSON.stringify({ code: 'SERVER_ERROR', message: '서버에서 응답이 없습니다.' }), { status: 500 });
        // 요청 자체가 잘못된 경우
        else return new NextResponse(JSON.stringify({ code: 'REQUEST_ERROR', message: err.message || fallbackMessage }), { status: 500 });
    }
    // AxiosError가 아닌 경우
    return new NextResponse(JSON.stringify({ code: 'SERVER_ERROR', message: fallbackMessage }), { status: fallbackStatus });
}