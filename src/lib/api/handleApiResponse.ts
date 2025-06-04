import { NextResponse } from 'next/server';
import { AxiosError } from 'axios';

/**
 * 성공 응답 처리
 * @param data - 응답 데이터
 * @param status - 응답 상태 코드
 * @returns {NextResponse} 응답 객체
 */
export function handleApiSuccess(data: unknown, status: number = 200) {
    return new NextResponse(JSON.stringify(data), { status });
}

/**
 * 에러 응답 처리
 * @param error - 에러 객체
 * @param fallbackMessage - 기본 메시지
 * @param fallbackStatus - 기본 상태 코드
 * @returns {NextResponse} 응답 객체
 */
export function handleApiError(error: unknown, fallbackMessage = '서버 에러 확인이 필요합니다', fallbackStatus = 500) {
    if (error && typeof error === 'object' && 'isAxiosError' in error && (error as AxiosError).isAxiosError) {
        const err = error as AxiosError;
        // 서버에서 응답이 온 경우
        if (err.response) return new NextResponse(JSON.stringify(err.response.data), { status: err.response.status || fallbackStatus });
        // 요청은 갔으나 응답이 없는 경우
        else if (err.request) return new NextResponse(JSON.stringify({ code: 'SERVER_ERROR', message: '서버에서 응답이 없습니다.' }), { status: 500 });
        // 요청 자체가 잘못된 경우
        else return new NextResponse(JSON.stringify({ code: 'REQUEST_ERROR', message: err.message || fallbackMessage }), { status: 500 });
    }
    // AxiosError가 아닌 경우
    return new NextResponse(JSON.stringify({ code: 'SERVER_ERROR', message: fallbackMessage }), { status: fallbackStatus });
}