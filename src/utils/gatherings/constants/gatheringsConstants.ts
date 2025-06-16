/**
 * 모임 목록 조회 시 사용하는 상수
 * @BATCH_SIZE 배치 사이즈
 * @SSR_COUNT SSR 카운트
 * @CSR_PAGE_SIZE CSR 페이지 사이즈
 * @MAX_ACTIVE_GATHERINGS 최대 활성 모임 수
 * @DATE_REGEX 날짜 정규식
 */
export const GATHERING_CONSTANTS = {
    BATCH_SIZE: 100,
    SSR_COUNT: 10,
    CSR_PAGE_SIZE: 10,
    MAX_ACTIVE_GATHERINGS: 100,
    DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/
} as const;

/**
 * 모임 타입
 * @MAIN 메인 타입
 * @API API 타입
 * @SUB 서브 타입
 */
export const GATHERING_TYPES = {
    MAIN: {
        DALLAEMFIT: 'DALLAEMFIT',
        DORANDORAN: 'DORANDORAN'
    },
    API: {
        DALLAEMFIT: 'DALLAEMFIT',
        WORKATION: 'WORKATION'
    },
    SUB: {
        ALL: 'ALL',
        OFFICE_STRETCHING: 'OFFICE_STRETCHING',
        MINDFULNESS: 'MINDFULNESS'
    }
} as const;