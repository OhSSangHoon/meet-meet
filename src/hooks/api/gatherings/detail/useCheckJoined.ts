'use client';

import { useQuery } from '@tanstack/react-query';
import { JoinedGathering } from '@/types/gatherings';
import { internalClient } from '@/lib/api/clientFetchers';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { isErrorResponse } from '@/lib/api/handleApiError';
import { AxiosError } from 'axios';

/** 
 * 모임 참여 확인 훅
 * @param id
 * @returns {data(boolean 타입), isLoading, isError}
 */
export const useCheckJoined = (
    id: number,
    token: string | null
) => {
    const checkJoined = async () => {
        const response = await internalClient.get(INTERNAL_PATHS.CHECK_JOINED, { headers: { Authorization: `Bearer ${token}` } },);
        return response.data.some((gathering: JoinedGathering) => gathering.id === Number(id))
    }

    const { data, isLoading, isError, error } = useQuery({
        enabled: !!id && !!token,
        queryKey: ['checkGatheringJoined', id],
        queryFn: () => checkJoined(),
    })

    const errorMessage = error ? (() => {
        const err = error as AxiosError;
        return (isErrorResponse(err?.response?.data) && err?.response?.data.message) || '참여 확인에 실패했습니다';
    })() : null;

    return { data, isLoading, isError, errorMessage }
}

