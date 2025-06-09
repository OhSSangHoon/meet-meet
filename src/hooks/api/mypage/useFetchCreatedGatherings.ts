'use client';

import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { apiClient } from '@/lib/api/clientFetchers';
import { Gathering } from '@/types/gatherings';
import { useQuery } from '@tanstack/react-query';

/** 
 * 마이페이지 '내가 만든 모임' 목록 조회 훅
 * @param token
 * @returns {data, isLoading, isError}
 */
export const useFetchCreatedGatherings = (
    token: string,
    userId: number
) => {
    const fetchCreatedGatherings = async (): Promise<Gathering[]> => {
        const { data } = await apiClient.get(INTERNAL_PATHS.fetchCreatedGatherings(userId));
        return data;
    };

    const { data, isLoading, error } = useQuery({
        enabled: !!token,
        queryKey: ["createdGatherings", token],
        queryFn: async () => {
            return await fetchCreatedGatherings()
        },
    })

    return { data, isLoading, error }
}
