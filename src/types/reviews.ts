/**
 * 리뷰 아이템
 * @type teamId: 팀 아이디
 * @type id: 리뷰 아이디
 * @type score: 리뷰 점수
 * @type comment: 리뷰 내용
 * @type createdAt: 리뷰 작성 시간
 * @type Gathering: 모임 정보
 * @type User: 유저 정보
 */
export interface ReviewItem {
    id: string;
    score: number;
    comment: string;
    createdAt: string;
    User: {
        id: string;
        name: string;
        image: string;
    };
    Gathering: {
        id: string;
        name: string;
        type: string;
        location: string;
        dateTime: string;
        image?: string;
        participantCount?: number;
    };
}

/**
 * 모임 정보
 * @type teamId: 팀 아이디
 * @type id: 모임 아이디
 * @type type: 모임 타입
 * @type name: 모임 이름
 * @type dateTime: 모임 날짜
 * @type location: 모임 장소
 * @type image: 모임 이미지
 * @type participantCount: 참여인원 수 (추가)
 * @type capacity: 최대 정원 (추가)
 */
export interface GatheringInfo {
    teamId: number;
    id: number;
    type: string;
    name: string;
    dateTime: string;
    location: string;
    image: string;
    participantCount: number;
    capacity: number;
}

/**
 * 유저 정보
 * @type teamId: 팀 아이디
 * @type id: 유저 아이디
 * @type name: 유저 이름
 * @type image: 유저 프로필 이미지
 */
export interface UserInfo {
    teamId: number;
    id: number;
    name: string;
    image: string;
}

/**
 * 리뷰 목록 조회 (기존 DetailReviews용)
 * @type data: 리뷰 아이템
 * @type totalItemCount: 총 리뷰 개수
 * @type currentPage: 현재 페이지
 * @type totalPages: 총 페이지 수
 */
export interface Reviews {
    data: ReviewItem[];
    totalItemCount: number;
    currentPage: number;
    totalPages: number;
}

// 새로운 리뷰 페이지용 타입 추가
export interface ReviewsResponse {
    data: ReviewItem[];
    total: number;
}

// 필터 관련 공통 타입들
export interface ReviewFilters {
    location: string;
    date: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export interface ReviewType {
    mainType: string;
    subType: string;
}

export interface ReviewStats {
    average: number;
    ratingCounts: {
        [key: number]: number;
    };
    totalReviews: number;
}