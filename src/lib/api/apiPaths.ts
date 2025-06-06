/** 외부 경로: 클라이언트, API 라우트 -> 백엔드 서버
 * @string signIn -> 로그인
 * @string signOut -> 로그아웃
 * @string signUp -> 회원가입
 * @string user -> 유저 정보 조회
 * @string fetchGatherings -> 모임 목록 조회
 * @string createGathering -> 모임 생성
 * @function joinGathering -> 모임 참여
 * @function leaveGathering -> 모임 참여 취소
 */
export const EXTERNAL_PATHS = {
    signIn: '/auths/signin',
    signOut: '/auths/signout',
    signUp: '/auths/signup',
    user: '/auths/user',

    fetchGatherings: '/gatherings',
    createGathering: '/gatherings',
    fetchGatheringDetail: (id: number) => `/gatherings/${id}`,
    joinGathering: (id: number) => `/gatherings/${id}/join`,
    cancelGathering: (id: number) => `/gatherings/${id}/cancel`,
    leaveGathering: (id: number) => `/gatherings/${id}/leave`,

    checkJoined: '/gatherings/joined',
    fetchGatheringParticipants: (id: number) => `/gatherings/${id}/participants`,
    fetchGatheringReviews: (queries: string) => `/reviews?${queries}`,
    createReview: '/reviews',
    fetchReviews: '/reviews',
} as const;

/** 내부 경로: 클라이언트 -> API 라우트
 * @string signIn -> 로그인
 * @string signOut -> 로그아웃
 * @string signUp -> 회원가입
 * @string user -> 유저 정보 조회
 * @string fetchGatherings -> 모임 목록 조회
 * @string createGathering -> 모임 생성
 * @function joinGathering -> 모임 참여
 * @function leaveGathering -> 모임 참여 취소
 * @function cancelGathering -> 모임 취소
 * @string createReview -> 리뷰 생성
 * @function fetchPaginatedGatherings -> 모임 목록 조회 (페이지네이션)
 * @function fetchGatheringDetail -> 모임 상세 정보 조회
 * @function fetchGatheringParticipants -> 모임 참여자 목록 조회
 * @function checkJoined -> 모임 참여 확인
 * @function fetchGatheringReviews -> 모임 상세 리뷰 조회
 */
export const INTERNAL_PATHS = {
    signIn: '/api/auths/signIn',
    signOut: '/api/auths/signOut',
    signUp: '/api/auths/signUp',
    user: '/api/auths/user',

    fetchGatherings: '/api/gatherings',
    createGathering: '/api/gatherings',
    fetchGatheringDetail: (id: number) => `/api/gatherings/detail?id=${id}`,
    joinGathering: (id: number) => `/api/gatherings/join?id=${id}`,
    cancelGathering: (id: number) => `/api/gatherings/cancel?id=${id}`,
    leaveGathering: (id: number) => `/api/gatherings/leave?id=${id}`,

    fetchPaginatedGatherings: (page: number, limit: number) => `/api/gatherings?offset=${(page - 1) * limit}&limit=${limit}`,
    fetchGatheringParticipants: (id: number) => `/api/gatherings/participants?id=${id}`,
    fetchGatheringReviews: (gatheringId: number, limit?: number, offset?: number) => `/api/gatherings/detail/reviews?gatheringId=${gatheringId}&limit=${limit}&offset=${offset}`,
    fetchCreatedGatherings: (userId: number) => `/api/gatherings?createdBy=${userId}&limit=1000`,
    checkJoined: (queries: string) => `/api/gatherings/joined?${queries}`,
    fetchJoinedGatherings: `/api/gatherings/joined?&limit=1000`,
    createReview: `/api/reviews`,
    fetchReviews: `/api/reviews`,
} as const;