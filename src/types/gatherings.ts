/**
 * 모임 프로퍼티
 * @type {string} teamId 팀 아이디
 * @type {number} id 모임 아이디
 * @type {"OFFICE_STRETCHING" | "MINDFULNESS" | "WORKATION"} type 모임 타입
 * @type {string} name 모임 이름
 * @type {string} dateTime 모임 날짜와 시간
 * @type {string} registrationEnd 참여 마감 일시
 * @type {string} location 모임 위치
 * @type {number} participantCount 모임 참여자 수
 * @type {number} capacity 모임 최대 정원
 * @type {string} image 모임 썸네일
 * @type {number} createdBy 모임 생성자 아이디
 * @type {string} canceledAt 모임 취소 일시
 */
export interface Gathering {
    teamId: string;
    id: number;
    type: "OFFICE_STRETCHING" | "MINDFULNESS" | "WORKATION";
    name: string;
    dateTime: string;
    registrationEnd: string;
    location: string;
    participantCount: number;
    capacity: number;
    image: string;
    createdBy: number;
    canceledAt: string | null;
    description?: string;
}

/**
 * 참여자 프로퍼티
 * @type {string} joinedAt 참여 일시
 * @type {boolean} isCompleted 마감 여부
 * @type {boolean} isReviewed 나의 리뷰 작성 여부
 */
export interface Participant {
    teamId: number;
    userId: number;
    gatheringId: number;
    joinedAt: string;
    User: {
        id: number;
        email: string;
        name: string;
        companyName: string;
        image: string;
    }
}

/**
 * 모임 목록 컴포넌트 프로퍼티
 * @type {Gathering[]} gatherings 모임 목록
 * @type {boolean} loading 로딩 여부
 * @type {string} error 에러 메시지
 * @type {string[]} savedGatheringIds 저장된 모임 아이디 배열
 * @type {function} onToggleSaved 저장된 모임 아이디 배열 업데이트 함수
 * @type {boolean} fetchFromApi API 호출 여부
 * @type {function} lastItemRef 마지막 아이템 참조 함수
 */
export interface GatheringsListProps {
    gatherings?: Gathering[];
    loading?: boolean;
    error?: string;
    savedGatheringIds?: string[];
    onToggleSaved?: (id: string) => void;
    fetchFromApi?: boolean;
    selectedMainType?: string;
    selectedSubType?: string;
}

/**
 * 참여한 모임 프로퍼티
 * @type {string} joinedAt 참여 일시
 * @type {boolean} isCompleted 마감 여부
 * @type {boolean} isReviewed 나의 리뷰 작성 여부
 */
export interface JoinedGathering extends Gathering {
    joinedAt: string;
    isCompleted: boolean;
    isReviewed: boolean;
}

/**
 * 모임 필터 타입
 * @type {string} category 모임 카테고리 (북적북적 or 도란도란)
 * @type {string} type 실제 모임 타입
 */
export type FilterCategory = 'DALLAEMFIT' | 'WORKATION';
export type FilterType = Gathering['type'] | 'ALL';

export interface FilterState {
    category: FilterCategory;
    type: FilterType;
}

export interface GatheringsFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    showCreateButton?: boolean;
    onCreateClick?: () => void;
    isLoggedIn?: boolean;
    showSortButton?: boolean;
    sortContent?: {
        mobile: string;
        desktop: string;
        className: string;
    };
    onSortClick?: () => void;
    sortDisabled?: boolean;
}