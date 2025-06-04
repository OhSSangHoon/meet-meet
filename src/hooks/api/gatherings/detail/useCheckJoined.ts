'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { JoinedGathering } from '@/types/gatherings';
import { apiClient } from '@/lib/api/axios';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import axios from 'axios';

/** 
 * 모임 참여 확인 훅
 * @param id
 * @returns {data(boolean 타입), isLoading, isError}
 */
export const useCheckJoined = (
    id: number,
    token: string | null
) => {
    const searchParams = useSearchParams();
    const queries = searchParams.toString();

    const checkJoined = async () => {
        try {
            const response = await apiClient.get(INTERNAL_PATHS.checkJoined(queries), { headers: { Authorization: `Bearer ${token}` } },);
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
        queryFn: () => checkJoined(),
    })

    return { data, isLoading, isError }
}

