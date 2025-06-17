/** 외부 경로: 클라이언트, API 라우트 -> 백엔드 서버
 * @string SIGN_IN -> 로그인
 * @string SIGN_OUT -> 로그아웃
 * @string SIGN_UP -> 회원가입
 * @string USER -> 유저 정보 조회
 * @string GATHERINGS -> 모임 목록 조회, 모임 생성
 * @string REVIEWS -> 리뷰 목록 조회, 리뷰 생성
 * @string CHECK_JOINED -> 모임 상세 참여 확인
 * @function fetchGatheringDetail -> 모임 상세 정보 조회
 * @function fetchDetailReview -> 모임 상세 리뷰 목록 조회
 * @function fetchGatheringParticipants -> 모임 상세 참여자 목록 조회
 * @function joinGathering -> 모임 참여
 * @function leaveGathering -> 모임 참여 취소
 * @function cancelGathering -> 모임 취소
 */
export const EXTERNAL_PATHS = {
    SIGN_IN: '/auths/signin',
    SIGN_OUT: '/auths/signout',
    SIGN_UP: '/auths/signup',
    USER: '/auths/user',
    GATHERINGS: '/gatherings',
    REVIEWS: '/reviews',
    CHECK_JOINED: '/gatherings/joined',
    fetchGatheringDetail: (id: number) => `/gatherings/${id}`,
    fetchDetailReview: (id: number) => `/reviews?gatheringId=${id}&limit=4&offset=0`,
    fetchGatheringParticipants: (id: number) => `/gatherings/${id}/participants?limit=100`,
    joinGathering: (id: number) => `/gatherings/${id}/join`,
    cancelGathering: (id: number) => `/gatherings/${id}/cancel`,
    leaveGathering: (id: number) => `/gatherings/${id}/leave`,
} as const;

/** 내부 경로: 클라이언트 -> API 라우트
 * @string SIGN_IN -> 로그인
 * @string SIGN_OUT -> 로그아웃
 * @string SIGN_UP -> 회원가입
 * @string USER -> 유저 정보 조회
 * @string GATHERINGS -> 모임 목록 조회, 모임 생성
 * @string REVIEWS -> 리뷰 목록 조회, 리뷰 생성
 * @string CHECK_JOINED -> 모임 상세 참여 확인
 * @function fetchGatheringDetail -> 모임 상세 정보 조회
 * @function fetchGatheringParticipants -> 모임 상세 참여자 목록 조회
 * @function joinGathering -> 모임 참여
 * @function leaveGathering -> 모임 참여 취소
 * @function cancelGathering -> 모임 취소
 * @string FETCH_JOINED_GATHERINGS -> 마이페이지 참여중인 모임 목록 조회
 * @function fetchCreatedGatherings -> 마이페이지 내가 만든 모임 목록 조회
 */
export const INTERNAL_PATHS = {
    SIGN_IN: '/api/auth/signin',
    SIGN_OUT: '/api/auth/signout',
    SIGN_UP: '/api/auth/signup',
    USER: '/api/auth/user',
    GATHERINGS: '/api/gatherings',
    REVIEWS: `/api/reviews`,
    CHECK_JOINED: `/api/gatherings/joined`,
    fetchGatheringDetail: (id: number) => `/api/gatherings/detail?id=${id}`,
    fetchGatheringParticipants: (id: number) => `/api/gatherings/participants?id=${id}`,
    joinGathering: (id: number) => `/api/gatherings/join?id=${id}`,
    cancelGathering: (id: number) => `/api/gatherings/cancel?id=${id}`,
    leaveGathering: (id: number) => `/api/gatherings/leave?id=${id}`,
    FETCH_JOINED_GATHERINGS: `/api/gatherings/joined?&limit=100`,
    fetchCreatedGatherings: (userId: number) => `/api/gatherings?createdBy=${userId}&limit=100&sortBy=registrationEnd`,
} as const;