// 토큰은 항상 내부에서 Bearer를 붙이고 외부에서는 붙이지 않음


/** 백엔드 API (외부 경로)
 * @description API 라우트 -> 백엔드 서버
 */
export const EXTERNAL_PATHS = {
    cancelGathering: (id: number) => `/gatherings/cancel?id=${id}`,
};

/** API 라우트 (내부 경로)
 * @description 클라이언트 -> API 라우트
 * @example INTERNAL_PATHS.createGathering() -> /api/gatherings
 * @function createGathering -> 모임 생성
 * @function cancelGathering -> 모임 취소
 * @function fetchJoinedCheck -> 모임 상세 참여 확인
 * @function fetchGatheringReviews -> 모임 상세 리뷰 조회
 * @function fetchGatheringDetail -> 모임 상세 정보 조회
 * @function fetchGatheringParticipants -> 모임 참여자 목록 조회
 * @function fetchGatherings -> 모임 목록 조회
 * @function fetchPaginatedGatherings -> 모임 목록 조회 (페이지네이션)
 * @function joinGathering -> 모임 참여
 * @function leaveGathering -> 모임 참여 취소
 * @function createReview -> 리뷰 생성
 */
export const INTERNAL_PATHS = {
    createGathering: `/api/gatherings`,
    cancelGathering: (id: number) => `/api/gatherings/cancel?id=${id}`,
    fetchJoinedCheck: (queries: string) => `/api/gatherings/joined?${queries}`,
    fetchGatheringReviews: (gatheringId: number, limit?: number, offset?: number) => `/api/gatherings/detail/reviews?gatheringId=${gatheringId}&limit=${limit}&offset=${offset}`,
    fetchGatheringDetail: (id: number) => `/api/gatherings/detail?id=${id}`,
    fetchGatheringParticipants: (id: number) => `/api/gatherings/participants?id=${id}`,
    fetchGatherings: `/api/gatherings`,
    fetchPaginatedGatherings: (page: number, limit: number) => `/api/gatherings?offset=${(page - 1) * limit}&limit=${limit}`,
    joinGathering: (id: number) => `/api/gatherings/join?id=${id}`,
    leaveGathering: (id: number) => `/api/gatherings/leave?id=${id}`,
    createReview: `/api/reviews`
} as const;