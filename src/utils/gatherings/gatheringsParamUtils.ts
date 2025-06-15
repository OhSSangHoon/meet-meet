import { getApiTypeFromMainType } from '@/utils/gatherings/gatheringsTypeUtils';
import { GATHERING_CONSTANTS } from '@/utils/gatherings/gatheringsConstants';

/**
 * 모임 API 파라미터 옵션
 */
export interface GatheringApiParams {
    limit?: number;
    offset?: number;
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
}

/**
 * 모임 API 요청을 위한 URLSearchParams 생성
 * @param options 파라미터 옵션
 * @returns URLSearchParams 객체
 */
export const buildGatheringParams = (options: GatheringApiParams): URLSearchParams => {
    const {
        limit = GATHERING_CONSTANTS.CSR_PAGE_SIZE,
        offset = 0,
        mainType = 'DALLAEMFIT',
        location = '',
        date = '',
        sortBy = 'registrationEnd',
        sortOrder = 'asc'
    } = options;

    const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        sortBy,
        sortOrder,
        type: getApiTypeFromMainType(mainType)
    });

    // 위치 필터
    if (location?.trim()) {
        params.set('location', location.trim());
    }

    // 날짜 필터
    if (date?.trim() && GATHERING_CONSTANTS.DATE_REGEX.test(date.trim())) {
        params.set('date', date.trim());
    }

    return params;
};

/**
 * 날짜 문자열 유효성 검사
 * @param date 날짜 문자열 (YYYY-MM-DD)
 * @returns 유효하면 true
 */
export const isValidDateString = (date: string): boolean => {
    return GATHERING_CONSTANTS.DATE_REGEX.test(date.trim());
};
