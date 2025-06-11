'use client';

import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { internalClient } from '@/lib/api/clientFetchers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/** 
 * 모임 상세 페이지 상세 정보 조회 훅
 * @param id
 * @returns {detail, participants, isLoading, isError, retchIsSaved}
 */
export const useFetchGatheringDetail = (
    id: number
) => {
    const queryClient = useQueryClient();

    const fetchGatheringDetail = async (id: number) => {
        try {
            const response = await internalClient.get(INTERNAL_PATHS.fetchGatheringDetail(id));
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                console.error(serverError?.message);
            }
        }
    }

    const fetchGatheringParticipants = async (id: number) => {
        try {
            const response = await internalClient.get(INTERNAL_PATHS.fetchGatheringParticipants(id));
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                console.error(serverError?.message);
            }
        }
    }

    const { data, isLoading, isError } = useQuery({
        enabled: !!id,
        queryKey: ['gatheringDetail', id],
        queryFn: async () => {
            const detail = await fetchGatheringDetail(id)
            const participants = await fetchGatheringParticipants(id)
            return { detail, participants }
        },
    })

    const retchIsSaved = useMutation({
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gatheringDetail', id] })
    });

    return { detail: data?.detail, participants: data?.participants, isLoading, isError, retchIsSaved }
}
