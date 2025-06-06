import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { apiClient } from '@/lib/api/axios';
import { Gathering } from "@/types/gatherings";

/**
 * 페이지네이션된 모임 목록을 조회합니다.
 * @param page - 조회할 페이지 번호 
 * @param token - 인증 토큰
 * @param mainType - 메인 타입 필터
 * @param location - 위치 필터
 * @param date - 날짜 필터
 * @param sortBy - 정렬 기준
 * @param sortOrder - 정렬 순서
 * @param filterSavedIds - 찜한 모임 ID 목록
 * @returns {Promise<Array>} 모임 목록 배열
 */
export async function fetchGatheringsPaginated(
    page: number,
    token: string | null,
    mainType: string = 'DALLAEMFIT',
    location?: string,
    date?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filterSavedIds?: string[]
): Promise<Gathering[]> {
    try {
        // mainType에 따른 type 파라미터 설정
        let type: string;
        if (mainType === 'DORANDORAN') {
            type = 'WORKATION';
        } else {
            // DALLAEMFIT의 경우 모든 타입을 가져와서 클라이언트에서 필터링
            type = 'DALLAEMFIT';
        }

        const params: Record<string, string | number> = {
            offset: page * 10,
            limit: 10,
            type
        };

        // 위치 필터 추가
        if (location) {
            params.location = location;
        }

        // 날짜 필터 추가
        if (date) {
            params.date = date;
        }

        // 정렬 기준 추가
        if (sortBy) {
            params.sortBy = sortBy;
        }

        // 정렬 순서 추가
        if (sortOrder) {
            params.sortOrder = sortOrder;
        }

        const response = await apiClient.get(INTERNAL_PATHS.fetchGatherings, {
            params,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });

        let gatherings = response.data || [];

        // DALLAEMFIT의 경우 클라이언트에서 필터링
        if (mainType === 'DALLAEMFIT') {
            gatherings = gatherings.filter((gathering: Gathering) =>
                gathering.type === 'OFFICE_STRETCHING' ||
                gathering.type === 'MINDFULNESS'
            );
        }

        // 찜한 모임 ID 목록이 있는 경우 필터링
        if (filterSavedIds && filterSavedIds.length > 0) {
            gatherings = gatherings.filter((gathering: Gathering) =>
                filterSavedIds.includes(gathering.id.toString())
            );
        }

        return gatherings;
    } catch (error) {
        console.error('모임 목록 조회 에러:', error);
        return [];
    }
}

/**
 * 전체 모임 목록을 조회합니다.
 * @returns {Promise<Gathering[]>} 모임 목록 배열
 */
export const fetchGatherings = async (): Promise<Gathering[]> => {
    try {
        const response = await apiClient.get(INTERNAL_PATHS.fetchGatherings);
        return response.data || [];
    } catch (error) {
        console.error('전체 모임 목록 조회 에러:', error);
        return [];
    }
};


/**
 * 찜한 모임 목록을 조회합니다.
 * @returns {Promise<Gathering[]>} 찜한 모임 목록
 */
export const fetchSavedGatherings = async (): Promise<Gathering[]> => {
    try {
        const response = await apiClient.get('/api/gatherings/saved');
        return response.data || [];
    } catch (error) {
        console.error('찜한 모임 목록 조회 에러:', error);
        return [];
    }
};

/**
 * 모임 목록을 필터링하는 유틸 함수
 */
export const filterGatherings = (
    gatheringsList: Gathering[],
    selectedMainType: string,
    selectedSubType: string
): Gathering[] => {
    let filtered: Gathering[];

    if (selectedMainType === 'DORANDORAN') {
        // 도란도란 = WORKATION만
        filtered = gatheringsList.filter(gathering => gathering.type === 'WORKATION');
    } else {
        // 북적북적 (DALLAEMFIT)
        if (selectedSubType === 'ALL') {
            // 전체 = OFFICE_STRETCHING + MINDFULNESS
            filtered = gatheringsList.filter(gathering =>
                gathering.type === 'OFFICE_STRETCHING' ||
                gathering.type === 'MINDFULNESS'
            );
        } else {
            // 특정 서브타입만
            filtered = gatheringsList.filter(gathering => gathering.type === selectedSubType);
        }
    }

    return filtered;
};

/**
 * 필터 상태에 따른 타입별 개수를 계산하는 함수
 * @param gatherings - 모임 목록
 * @returns {Record<string, number>} 타입별 개수
 */
export const getTypeDistribution = (gatherings: Gathering[]): Record<string, number> => {
    return gatherings.reduce((acc, g) => {
        acc[g.type] = (acc[g.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
};