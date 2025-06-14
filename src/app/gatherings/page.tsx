import { Metadata } from 'next';
import { serverFetcher } from '@/lib/api/serverFetcher';
import { Gathering } from "@/types/gatherings";
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import Gatherings from "@/components/gatherings/GatheringsUI";
import { buildGatheringParams, filterGatheringsByMainType, isActiveGathering, GATHERING_CONSTANTS } from '@/components/gatherings/shared/utils/gatheringsUtils';

export const metadata: Metadata = {
    title: `모임 찾기 | Meet Meet`,
    description: `모임 찾기 페이지 입니다`,
};

/**
 * 마감된 모임들을 완전히 건너뛰고 첫 진행중 모임부터 10개 정확히 가져오기
 */
async function getActiveGatheringsWithSkip(searchParams: {
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
}): Promise<{ gatherings: Gathering[], activeStartIndex: number }> {
    try {
        const {
            mainType = 'DALLAEMFIT',
            location = '',
            date = '',
            sortBy = 'registrationEnd',
            sortOrder = 'asc'
        } = searchParams;

        let currentOffset = 0;
        let activeStartIndex = -1; // 첫 번째 진행중 모임의 전체 인덱스
        const activeGatherings: Gathering[] = [];
        let noMoreData = false; // 더 이상 데이터가 없는지 여부

        // 마감된 모임들을 건너뛰면서 첫 번째 진행중 모임 찾기
        while (activeStartIndex === -1 && !noMoreData) {
            // 파라미터 생성
            const params = buildGatheringParams({
                limit: GATHERING_CONSTANTS.BATCH_SIZE,
                offset: currentOffset,
                mainType,
                location,
                date,
                sortBy,
                sortOrder
            });

            const data = await serverFetcher(`${EXTERNAL_PATHS.GATHERINGS}?${params.toString()}`);

            if (!Array.isArray(data) || data.length === 0) {
                noMoreData = true;
                break;
            }

            // 타입별 필터링
            const typeFilteredData = filterGatheringsByMainType(data, mainType);

            // 첫 번째 진행중 모임 찾기
            for (let i = 0; i < typeFilteredData.length; i++) {
                const gathering = typeFilteredData[i];
                
                if (isActiveGathering(gathering)) {
                    activeStartIndex = currentOffset + i; // 전체 데이터에서의 인덱스
                    break;
                }
            }

            // 현재 오프셋 증가
            currentOffset += data.length;

            // 서버에서 받은 데이터가 batchSize보다 적으면 마지막 페이지
            if (data.length < GATHERING_CONSTANTS.BATCH_SIZE) {
                noMoreData = true;
            }
        }

        // 첫 번째 진행중 모임부터 정확히 10개 수집
        if (activeStartIndex !== -1) {
            let collectedCount = 0;
            let searchOffset = Math.floor(activeStartIndex / GATHERING_CONSTANTS.BATCH_SIZE) * GATHERING_CONSTANTS.BATCH_SIZE; // 해당 배치의 시작점
            noMoreData = false;

            while (collectedCount < GATHERING_CONSTANTS.SSR_COUNT && !noMoreData) {
                // 파라미터 생성
                const params = buildGatheringParams({
                    limit: GATHERING_CONSTANTS.BATCH_SIZE,
                    offset: searchOffset,
                    mainType,
                    location,
                    date,
                    sortBy,
                    sortOrder
                });

                const data = await serverFetcher(`${EXTERNAL_PATHS.GATHERINGS}?${params.toString()}`);

                if (!Array.isArray(data) || data.length === 0) {
                    noMoreData = true;
                    break;
                }

                // 타입별 필터링
                const typeFilteredData = filterGatheringsByMainType(data, mainType);

                // 현재 배치에서 유효한 진행중 모임만 수집
                for (let i = 0; i < typeFilteredData.length; i++) {
                    const globalIndex = searchOffset + i;
                    
                    // activeStartIndex 이후의 모임만 수집
                    if (globalIndex >= activeStartIndex) {
                        const gathering = typeFilteredData[i];
                        
                        if (isActiveGathering(gathering)) {
                            activeGatherings.push(gathering);
                            collectedCount++;
                            
                            if (collectedCount >= GATHERING_CONSTANTS.SSR_COUNT) break;
                        }
                    }
                }

                searchOffset += GATHERING_CONSTANTS.BATCH_SIZE;

                // 서버에서 받은 데이터가 batchSize보다 적으면 마지막 페이지
                if (data.length < GATHERING_CONSTANTS.BATCH_SIZE) {
                    noMoreData = true;
                }
            }
        }

        return {
            gatherings: activeGatherings,
            activeStartIndex: activeStartIndex === -1 ? 0 : activeStartIndex
        };
        
    } catch (error) {
        console.error('SSR 에러 발생:', error);
        return { gatherings: [], activeStartIndex: 0 };
    }    
}

/**
 * 모임 찾기 페이지
 */
export default async function GatheringsPage({
    searchParams
}: {
    searchParams: Promise<{
        mainType?: string;
        location?: string;
        date?: string;
        sortBy?: string;
        sortOrder?: string;
    }>
}) {
    const params = await searchParams;
    
    const { gatherings: ssrGatherings, activeStartIndex } = await getActiveGatheringsWithSkip(params);

    return (
        <div>
            <div className="contents-container bg-white dark:bg-dark min-h-screen transition-colors duration-200">
                <Gatherings 
                    ssrGatherings={ssrGatherings}
                    activeStartIndex={activeStartIndex}
                    initialFilters={{
                        mainType: params.mainType || 'DALLAEMFIT',
                        location: params.location || '',
                        date: params.date || '',
                        sortBy: params.sortBy || 'registrationEnd',
                        sortOrder: params.sortOrder || 'asc'
                    }}
                />
            </div>
        </div>
    );
}