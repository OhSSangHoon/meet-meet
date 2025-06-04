/** 외부 경로
 * @description API 라우트, 클라이언트 -> 백엔드 서버
 * @string signin -> 로그인
 * @string signout -> 로그아웃
 * @string signup -> 회원가입
 * @string user -> 유저 정보 조회
 */
export const EXTERNAL_PATHS = {
    signin: '/auths/signin',
    signout: '/auths/signout',
    signup: '/auths/signup',
    user: '/auths/user',

    fetchGatherings: '/gatherings',
    createGathering: '/gatherings',
    fetchGatheringDetail: (id: number) => `/gatherings/${id}`,
    joinGathering: (id: number) => `/gatherings/${id}/join`,
    cancelGathering: (id: number) => `/gatherings/${id}/cancel`,
    leaveGathering: (id: number) => `/gatherings/${id}/leave`,
    fetchJoinedCheck: (queries: string) => `/gatherings/joined?${queries}`,
    fetchGatheringParticipants: (id: number) => `/gatherings/${id}/participants`,
    fetchGatheringReviews: (queries: string) => `/reviews?${queries}`,
    createReview: '/reviews',
} as const;

/** 내부 경로
 * @description 클라이언트 -> API 라우트
 * @example INTERNAL_PATHS.createGathering() -> /api/gatherings
 * @string fetchGatherings -> 모임 목록 조회
 * @string createGathering -> 모임 생성
 * @function joinGathering -> 모임 참여
 * @function leaveGathering -> 모임 참여 취소
 * @function cancelGathering -> 모임 취소
 * @string createReview -> 리뷰 생성
 * @function fetchPaginatedGatherings -> 모임 목록 조회 (페이지네이션)
 * @function fetchGatheringDetail -> 모임 상세 정보 조회
 * @function fetchGatheringParticipants -> 모임 참여자 목록 조회
 * @function fetchJoinedCheck -> 모임 상세 참여 확인
 * @function fetchGatheringReviews -> 모임 상세 리뷰 조회
 */
export const INTERNAL_PATHS = {
    fetchGatherings: `/api/gatherings`,
    createGathering: `/api/gatherings`,
    joinGathering: (id: number) => `/api/gatherings/join?id=${id}`,
    cancelGathering: (id: number) => `/api/gatherings/cancel?id=${id}`,
    leaveGathering: (id: number) => `/api/gatherings/leave?id=${id}`,
    fetchPaginatedGatherings: (page: number, limit: number) => `/api/gatherings?offset=${(page - 1) * limit}&limit=${limit}`,
    fetchGatheringDetail: (id: number) => `/api/gatherings/detail?id=${id}`,
    fetchJoinedCheck: (queries: string) => `/api/gatherings/joined?${queries}`,
    fetchGatheringParticipants: (id: number) => `/api/gatherings/participants?id=${id}`,
    fetchGatheringReviews: (gatheringId: number, limit?: number, offset?: number) => `/api/gatherings/detail/reviews?gatheringId=${gatheringId}&limit=${limit}&offset=${offset}`,
    createReview: `/api/reviews`,
} as const;