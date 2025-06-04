'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GatheringApiParams } from '@/types/gatheringApi';
import { apiClient } from '@/lib/api/axios';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { handleApiError } from '@/lib/api/handleApiResponse';

/**
 * 모임 생성 훅
* @param token 토큰
* @param onCallback 모달에 표시할 메세지를 전달
 * @returns {function} createGathering - 모임 생성 함수
 */
export const useCreateGathering = ({ token, onCallback }: GatheringApiParams) => {
    const queryClient = useQueryClient();

    const createGathering = useMutation({
        mutationFn: async (formData: FormData) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await apiClient.post(INTERNAL_PATHS.createGathering, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatherings', 'infinite'] });
            queryClient.invalidateQueries({ queryKey: ["createdGatherings", token] });
            onCallback?.('모임을 생성했습니다');
        },
        onError: (error) => {
            const response = handleApiError(error);
            response.text().then(message => onCallback?.(message));
        }
    });

    return { createGathering: createGathering.mutate }
}