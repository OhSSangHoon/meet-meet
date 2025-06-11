'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGatheringsStore } from '@/store/gatheringsStore';
import { GatheringApiParams } from '@/types/gatheringApi';
import { useRouter } from 'next/navigation';
import { internalClient } from '@/lib/api/clientFetchers';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { AxiosError } from 'axios';
import { isErrorResponse } from '@/lib/api/handleApiError';

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
            await internalClient.put(INTERNAL_PATHS.cancelGathering(id));
            return id;
        },
        onSuccess: (id) => {
            removeGathering(id);
            queryClient.invalidateQueries({ queryKey: ["gatherings", "infinite"] });
            queryClient.invalidateQueries({ queryKey: ["createdGatherings", token] });
            onCallback?.('모임을 삭제했습니다', () => router.replace('/gatherings'));
        },
        onError: (error) => {
            const err = error as AxiosError;
            const message = (isErrorResponse(err?.response?.data) && err?.response?.data.message) || '모임 취소에 실패했습니다';
            onCallback?.(message);
        }
    });

    return { cancelGathering: cancelGathering.mutate }
}