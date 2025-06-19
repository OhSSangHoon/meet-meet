import { useQuery } from '@tanstack/react-query';
import { allSavedQueries } from '@/queries/saved.query';
import { internalClient } from '@/lib/api/clientFetchers';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { Gathering } from '@/types/gatherings';

// 매직넘버 상수
const API_LIMIT = 1000; // 모임 조회 제한

export const useSavedGatherings = (savedIds: string[]) => {
    return useQuery({
        queryKey: allSavedQueries.idsByFilter(savedIds),
        queryFn: async () => {
            if (savedIds.length === 0) return [];

            const response = await internalClient.get(INTERNAL_PATHS.GATHERINGS, {
                params: { limit: API_LIMIT }
            });

            const gatherings = response.data;

            const gatheringsMap = new Map(
                gatherings.map((gathering: Gathering) => [gathering.id.toString(), gathering])
            );

            return savedIds
                .map(id => gatheringsMap.get(id))
                .filter((gathering): gathering is Gathering => gathering !== undefined);
        },
        enabled: savedIds.length > 0,
        retry: 2,
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    });
};