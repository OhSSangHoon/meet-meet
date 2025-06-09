'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { GatheringApiParams } from '@/types/gatheringApi';
import { apiClient } from '@/lib/api/clientFetchers';
import { handleApiError } from '@/lib/api/handleApiResponse';

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
            const response = await apiClient.post(INTERNAL_PATHS.joinGathering(id));
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["gatheringDetail", id] });
            queryClient.invalidateQueries({ queryKey: ["checkGatheringJoined"] });
            queryClient.invalidateQueries({ queryKey: ["joinedGatherings", token] });
            onCallback?.('참여 완료했습니다');
        },
        onError: (error) => {
            const response = handleApiError(error);
            response.text().then(text => {
                try {
                    const json = JSON.parse(text);
                    const message = json?.error?.message || json?.message || text;
                    onCallback?.(message);
                } catch {
                    onCallback?.(text);
                }
            });
        }
    });

    return { joinGathering: joinGathering.mutate }
}