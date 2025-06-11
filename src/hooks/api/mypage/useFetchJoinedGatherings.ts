'use client';

import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { internalClient } from '@/lib/api/clientFetchers';
import { JoinedGathering } from '@/types/gatherings';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { isErrorResponse } from '@/lib/api/handleApiError';

/** 
 * 참여한 모임 목록 조회 훅
 * @param token
 * @returns {data, isLoading, error, errorMessage}
 */
export const useFetchJoinedGatherings = (token: string) => {
    const fetchJoinedGatherings = async (): Promise<JoinedGathering[]> => {
        const { data } = await internalClient.get(INTERNAL_PATHS.FETCH_JOINED_GATHERINGS);
        return data;
    };

    const { data, isLoading, error } = useQuery({
        enabled: !!token,
        queryKey: ["joinedGatherings", token],
        queryFn: async () => {
            const response = await fetchJoinedGatherings()
            return response
        }
    });

    const errorMessage = error ? (() => {
        const err = error as AxiosError;
        return (isErrorResponse(err?.response?.data) && err?.response?.data.message) || '데이터를 불러오는데 실패했습니다';
    })() : null;

    return { data, isLoading, error, errorMessage }
}
