'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { GatheringApiParams } from '@/types/gatheringApi';
import { internalClient } from '@/lib/api/clientFetchers';
import { AxiosError } from 'axios';
import { isErrorResponse } from '@/lib/api/handleApiError';

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
            const response = await internalClient.post(INTERNAL_PATHS.joinGathering(id));
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["gatheringDetail", id] });
            queryClient.invalidateQueries({ queryKey: ["gatherings", "infinite"] });
            queryClient.invalidateQueries({ queryKey: ["checkGatheringJoined"] });
            queryClient.invalidateQueries({ queryKey: ["joinedGatherings", token] });
            onCallback?.('참여 완료했습니다');
        },
        onError: (error) => {
            const err = error as AxiosError;
            const message = (isErrorResponse(err?.response?.data) && err?.response?.data.message) || '참여에 실패했습니다';
            onCallback?.(message);
        }
    });

    return { joinGathering: joinGathering.mutate }
}