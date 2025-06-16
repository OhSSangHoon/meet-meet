import { NextResponse } from 'next/server';
import { AxiosError } from 'axios';

export interface ErrorResponse {
    code?: string;
    message?: string;
    [key: string]: unknown;
}

/** 
 * 에러 응답 타입 가드 함수
 * @description 에러 응답 데이터가 ErrorResponse 타입인지 확인
 * @param data - 에러 응답 데이터
 * @returns {boolean}
 */
export function isErrorResponse(data: unknown): data is ErrorResponse {
    return typeof data === 'object' && data !== null;
}

/**
 * 에러 응답 처리
 * @param error - 에러 객체
 * @param fallbackMessage - 기본 메시지
 * @param fallbackStatus - 기본 상태 코드
 * @returns {NextResponse} 응답 객체
 */
export function handleApiError(error: unknown, fallbackMessage = '서버 에러 확인이 필요합니다', fallbackStatus = 500): NextResponse {
    if (error && typeof error === 'object' && 'isAxiosError' in error && (error as AxiosError).isAxiosError) {
        const err = error as AxiosError;

        if (err.response) {
            if (err.response.status === 401 &&
                isErrorResponse(err.response.data) &&
                err.response.data.message === '유효하지 않은 토큰입니다') {
                return new NextResponse(JSON.stringify({
                    ...err.response.data,
                    message: '로그인이 만료되었습니다'
                }), { status: err.response.status });
            }

            return new NextResponse(JSON.stringify(err.response.data), { status: err.response.status || fallbackStatus });
        }
        else if (err.request) return new NextResponse(JSON.stringify({ code: 'SERVER_ERROR', message: '서버에서 응답이 없습니다.' }), { status: 500 });
        else return new NextResponse(JSON.stringify({ code: 'REQUEST_ERROR', message: err.message || fallbackMessage }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ code: 'SERVER_ERROR', message: fallbackMessage }), { status: fallbackStatus });
}