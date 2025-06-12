import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { internalClient } from '@/lib/api/clientFetchers';
import { Gathering } from "@/types/gatherings";
import { isSameDateForFilter } from '@/components/shared/utils/dateFormats';

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
    sortOrder: string = 'desc',
): Promise<Gathering[]> {
    try {
        // mainType에 따른 type 파라미터 설정
        let type: string;
        if (mainType === 'DORANDORAN') {
            type = 'WORKATION';
        } else {
            type = 'DALLAEMFIT';
        }

        // 서버 요청 파라미터 (날짜 필터 제외)
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

        // 모임 목록 조회
        const response = await internalClient.get(INTERNAL_PATHS.GATHERINGS, {
            params,
        });

        let gatherings = response.data || [];

        // 응답 구조 확인 및 정규화
        if (!Array.isArray(gatherings)) {
            if (response.data?.data) {
                gatherings = response.data.data;
            } else if (response.data?.gatherings) {
                gatherings = response.data.gatherings;
            } else if (response.data?.items) {
                gatherings = response.data.items;
            } else {
                console.error('응답 데이터 형식 오류:', response.data);
                return [];
            }
        }

        // 한국 시간 기준 날짜 필터링
        if (date && date.trim() !== '') {
            const targetDate = date.trim();
            
            gatherings = gatherings.filter((gathering: Gathering) => {
                if (!gathering.dateTime) return false;
                
                return isSameDateForFilter(gathering.dateTime, targetDate);
            });
        }

        // DALLAEMFIT 서브타입 필터링
        let filteredGatherings = gatherings;
        if (mainType === 'DALLAEMFIT') {
            filteredGatherings = gatherings.filter((gathering: Gathering) =>
                gathering.type === 'OFFICE_STRETCHING' ||
                gathering.type === 'MINDFULNESS'
            );
        }

        // 찜한 모임 필터링
        if (filterSavedIds && filterSavedIds.length > 0) {
            filteredGatherings = filteredGatherings.filter((gathering: Gathering) =>
                filterSavedIds.includes(gathering.id.toString())
            );
        }

        return filteredGatherings;
    } catch (error) {
        console.error('모임 목록 조회 에러:', error);
        
        // 에러 상세 정보
        if (error instanceof Error) {
            console.error('에러 메시지:', error.message);
        }
        return [];
    }
}