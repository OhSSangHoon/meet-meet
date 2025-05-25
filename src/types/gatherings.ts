export interface Gathering {
    teamId: string;
    id: number;
    type: "DALLAEMFIT" | "OFFICE_STRETCHING" | "MINDFULNESS" | "WORKATION";
    name: string;
    dateTime: string;
    registrationEnd: string;
    location: string;
    participantCount: number;
    capacity: number;
    image: string;
    createdBy: number;
    canceledAt: string | null;
}

export interface GatheringsListProps {
    gatherings?: Gathering[];
    loading?: boolean;
    error?: string;
    // 저장된 모임 아이디 배열  
    savedGatheringIds?: string[];
    // 저장된 모임 아이디 배열 업데이트
    onToggleSaved?: (id: string) => void;
    // API 호출 여부
    fetchFromApi?: boolean;
}

export interface JoinedGathering extends Gathering {
    joinedAt: string;
    isCompleted: boolean;
    isReviewed: boolean;
}