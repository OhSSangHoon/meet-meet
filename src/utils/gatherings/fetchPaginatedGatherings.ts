import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { internalClient } from '@/lib/api/clientFetchers';
import { Gathering } from "@/types/gatherings";
import { isSameDateForFilter } from '@/utils/shared/date';
import { buildGatheringParams, normalizeGatheringsResponse, handleGatheringsError, filterGatheringsByMainType } from '@/utils/gatherings/gatheringsUtils';

// 매직넘버 상수
const DEFAULT_LIMIT = 10;

/**
 * 페이지네이션된 모임 목록 조회
 */
export async function fetchPaginatedGatherings(
    page: number,
    mainType: string = 'DALLAEMFIT',
    location?: string,
    date?: string,
    filterSavedIds?: string[],
    sortBy: string = 'registrationEnd',
    sortOrder: string = 'desc',
    limit: number = DEFAULT_LIMIT
): Promise<Gathering[]> {
    try {
        // 파라미터 생성
        const params = buildGatheringParams({
            limit,
            offset: page * limit,
            mainType,
            location,
            sortBy,
            sortOrder
        });

        // API 요청
        const response = await internalClient.get(INTERNAL_PATHS.GATHERINGS, {
            params: Object.fromEntries(params)
        });

        // 응답 정규화
        const gatherings = normalizeGatheringsResponse(response);

        // 날짜 필터링
        let dateFilteredGatherings = gatherings;
        if (date && date.trim() !== '') {
            const targetDate = date.trim();
            dateFilteredGatherings = gatherings.filter((gathering: Gathering) => {
                if (!gathering.dateTime) return false;
                return isSameDateForFilter(gathering.dateTime, targetDate);
            });
        }

        // 메인타입 필터링
        const typeFilteredGatherings = filterGatheringsByMainType(dateFilteredGatherings, mainType);

        // 찜한 모임 필터링
        let finalGatherings = typeFilteredGatherings;
        if (filterSavedIds && filterSavedIds.length > 0) {
            finalGatherings = typeFilteredGatherings.filter((gathering: Gathering) =>
                filterSavedIds.includes(gathering.id.toString())
            );
        }

        return finalGatherings;
    } catch (error) {
        return handleGatheringsError(error, 'fetchPaginatedGatherings');
    }
}