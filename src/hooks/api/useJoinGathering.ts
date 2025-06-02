'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GatheringApiParams } from '@/types/gatheringApi';
import axios from 'axios';

/** 모임 참여 훅
* @param token 토큰
* @param onCallback 모달에 표시할 메세지를 전달
* @returns {function} joinGathering - 모임 참가 함수
*/
export const useJoinGathering = ({ token, onCallback }: GatheringApiParams) => {
    const queryClient = useQueryClient();

    const joinGathering = useMutation({
        mutationFn: async (id: number) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.post(`/api/gatherings/join?id=${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["gatheringDetail", id] });
            queryClient.invalidateQueries({ queryKey: ["checkGatheringJoined"] });
            queryClient.invalidateQueries({ queryKey: ["joinedGatherings", token] });
            onCallback?.('참여 완료했습니다');
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

    return { joinGathering: joinGathering.mutate }
}