'use client';

import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { apiClient } from '@/lib/api/axios';
import { JoinedGathering } from '@/types/gatherings';
import { useQuery } from '@tanstack/react-query';

/** 
 * 참여한 모임 목록 조회 훅
 * @param token
 * @returns {data, isLoading, isError}
 */
export const useFetchJoinedGatherings = (
    token: string
) => {
    const fetchJoinedGatherings = async (): Promise<JoinedGathering[]> => {
        const { data } = await apiClient.get(INTERNAL_PATHS.fetchJoinedGatherings);
        return data;
    };

    const { data, isLoading, error } = useQuery({
        enabled: !!token,
        queryKey: ["joinedGatherings", token],
        queryFn: async () => {
            const response = await fetchJoinedGatherings()
            return response
        },
    })

    return { data, isLoading, error }
}
