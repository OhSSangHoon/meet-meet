import { Gathering } from '@/types/gatherings';
import { AxiosResponse } from 'axios';

/**
 * API 응답 데이터를 정규화하여 Gathering 배열로 변환
 * @param response AxiosResponse 객체
 * @returns 정규화된 Gathering 배열
 */
export const normalizeGatheringsResponse = (response: AxiosResponse): Gathering[] => {
    // AxiosResponse에서 실제 데이터 추출
    const responseData = response.data;
    
    let gatherings = responseData || [];

    // 응답 구조 확인 및 정규화
    if (!Array.isArray(gatherings)) {
        if (responseData?.data) {
            gatherings = responseData.data;
        } else if (responseData?.gatherings) {
            gatherings = responseData.gatherings;
        } else if (responseData?.items) {
            gatherings = responseData.items;
        } else {
            console.error('Unexpected gatherings response format:', responseData);
            return [];
        }
    }

    return gatherings as Gathering[];
};

/**
 * 에러 응답 처리
 * @param error 에러 객체
 * @param context 에러 발생 컨텍스트
 * @returns 빈 배열
 */
export const handleGatheringsError = (error: unknown, context: string): Gathering[] => {
    console.error(`${context} 에러 발생:`, error);
    
    // 에러 객체 타입 확인 및 처리
    if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
    }
    
    return [];
};