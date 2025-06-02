'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { JoinedGathering } from '@/types/gatherings';
import axios from 'axios';

/** 
 * 모임 참여 여부 확인 훅
 * @param id
 * @returns {data(boolean 타입), isLoading, isError}
 */
export const useCheckJoined = (
    id: number,
    token: string | null
) => {
    const searchParams = useSearchParams();
    const queries = searchParams.toString();

    const fetchJoinedCheck = async () => {
        try {
            const response = await axios.get(`/api/gatherings/joined?${queries}`, { headers: { Authorization: `Bearer ${token}` } },);
            return response.data.some((gathering: JoinedGathering) => gathering.id === Number(id))
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                console.error(serverError?.message);
            }
            return false;
        }
    }

    const { data, isLoading, isError } = useQuery({
        enabled: !!id && !!token,
        queryKey: ['checkGatheringJoined', id],
        queryFn: () => fetchJoinedCheck(),
    })

    return { data, isLoading, isError }
}

