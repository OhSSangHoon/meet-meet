'use client';

import { JoinedGathering } from '@/types/gatherings';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/** 
 * 참여한 모임 목록 조회 훅
 * @param token
 * @returns {data, isLoading, isError}
 */
export const useFetchJoinedGatherings = (
    token: string
) => {
    const fetchJoinedGatherings = async (token: string): Promise<JoinedGathering[]> => {
        const { data } = await axios.get(`/api/gatherings/joined?&limit=1000`, { headers: { Authorization: `Bearer ${token}` } });
        return data;
    };

    const { data, isLoading, error } = useQuery({
        enabled: !!token,
        queryKey: ["joinedGatherings", token],
        queryFn: async () => {
            const response = await fetchJoinedGatherings(token)
            return response
        },
    })

    return { data, isLoading, error }
}
