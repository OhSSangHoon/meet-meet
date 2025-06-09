import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { apiClient } from '@/lib/api/clientFetchers';
import { Gathering } from "@/types/gatherings";

/**
 * 페이지네이션된 모임 목록 조회
 * @param page 페이지 번호
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜
 * @param filterSavedIds 찜목록 필터링
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 */
export async function fetchPaginatedGatherings(
    page: number,
    mainType: string = 'DALLAEMFIT',
    location?: string,
    date?: string,
    filterSavedIds?: string[],
    sortBy: string = 'registrationEnd',
    sortOrder: string = 'desc'
): Promise<Gathering[]> {
    try {
        // mainType에 따른 type 파라미터 설정
        let type: string;
        if (mainType === 'DORANDORAN') {
            type = 'WORKATION';
        } else {
            type = 'DALLAEMFIT';
        }

        // 모든 필터링과 정렬을 서버에서 처리
        const params: Record<string, string | number> = {
            offset: page * 10,
            limit: 10,
            type,
            sortBy,
            sortOrder
        };

        // 위치 필터
        if (location && location.trim() !== '') {
            params.location = location.trim();
        }

        // 날짜 필터
        if (date && date.trim() !== '') {
            const dateValue = date.trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                params.date = dateValue;
            } else {
                console.warn('잘못된 날짜 형식:', dateValue);
            }
        }

        // 모임 목록 조회
        const response = await apiClient.get(INTERNAL_PATHS.GATHERINGS, {
            params,
        });

        let gatherings = response.data || [];

        // 응답이 배열이 아닌 경우 구조 확인
        if (!Array.isArray(gatherings)) {
            if (response.data?.data) {
                gatherings = response.data.data;
            } else if (response.data?.gatherings) {
                gatherings = response.data.gatherings;
            } else {
                console.error('알 수 없는 응답 구조:', response.data);
                return [];
            }
        }

        // DALLAEMFIT 서브타입 필터링
        if (mainType === 'DALLAEMFIT') {
            gatherings = gatherings.filter((gathering: Gathering) =>
                gathering.type === 'OFFICE_STRETCHING' ||
                gathering.type === 'MINDFULNESS'
            );
        }

        // 찜한 모임 필터링
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