'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGatheringsStore } from '@/store/gatheringsStore';
import { GatheringApiParams } from '@/types/gatheringApi';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/axios';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { handleApiError } from '@/lib/api/handleApiResponse';

/** 모임 삭제 훅
* @param token 토큰
* @param onCallback 모달에 표시할 메세지를 전달
* @returns {function} cancelGathering - 모임 삭제 함수
*/
export const useCancelGathering = ({ token, onCallback }: GatheringApiParams) => {
    const removeGathering = useGatheringsStore((s) => s.removeGathering);

    const router = useRouter();

    const queryClient = useQueryClient();

    const cancelGathering = useMutation({
        mutationFn: async (id: number) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            await apiClient.put(INTERNAL_PATHS.cancelGathering(id));
            return id;
        },
        onSuccess: (id) => {
            removeGathering(id);
            queryClient.invalidateQueries({ queryKey: ["gatherings", "infinite"] });
            queryClient.invalidateQueries({ queryKey: ["createdGatherings", token] });
            onCallback?.('모임을 삭제했습니다', () => router.replace('/gatherings'));
        },
        onError: (error) => {
            const response = handleApiError(error);
            response.text().then(message => onCallback?.(message));
        }
    });

    return { cancelGathering: cancelGathering.mutate }
}