'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GatheringApiParams } from '@/types/gatheringApi';
import axios from 'axios';

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
            const response = await axios.post(`/api/gatherings`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatherings', 'infinite'] });
            queryClient.invalidateQueries({ queryKey: ["createdGatherings", token] });
            onCallback?.('모임을 생성했습니다');
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                onCallback?.(serverError?.message || '에러가 발생했습니다');
            } else {
                onCallback?.(error.message);
            }
        }
    });

    return { createGathering: createGathering.mutate }
}