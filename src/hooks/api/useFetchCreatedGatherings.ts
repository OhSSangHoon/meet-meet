'use client';

import { Gathering } from '@/types/gatherings';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/** 
 * 참여한 모임 목록 조회 훅
 * @param token
 * @returns {data, isLoading, isError}
 */
export const useFetchCreatedGatherings = (
    token: string,
    userId: number
) => {
    const fetchCreatedGatherings = async (
        token: string,
    ): Promise<Gathering[]> => {
        const { data } = await axios.get(`/api/gatherings?createdBy=${userId}&limit=1000`, { headers: { Authorization: `Bearer ${token}` } });
        return data;
    };

    const { data, isLoading, error } = useQuery({
        enabled: !!token,
        queryKey: ["createdGatherings", token],
        queryFn: async () => {
            const response = await fetchCreatedGatherings(token)
            return response
        },
    })

    return { data, isLoading, error }
}
