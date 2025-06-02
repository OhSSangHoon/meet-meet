'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GatheringApiParams } from '@/types/gatheringApi';
import axios from 'axios';

/** 모임 참여 취소 훅
* @param token 토큰
* @param onCallback 모달에 표시할 메세지를 전달
* @returns {function} leaveGathering - 모임 참여 취소 함수
*/
export const useLeaveGathering = ({ token, onCallback }: GatheringApiParams) => {
    const queryClient = useQueryClient();

    const leaveGathering = useMutation({
        mutationFn: async (id: number) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.delete(`/api/gatherings/leave?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["gatheringDetail", id] });
            queryClient.invalidateQueries({ queryKey: ["checkGatheringJoined"] });
            queryClient.invalidateQueries({ queryKey: ["joinedGatherings", token] });
            onCallback?.('참여 취소했습니다');
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

    return { leaveGathering: leaveGathering.mutate }
}