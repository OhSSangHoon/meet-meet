'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGatheringsStore } from '@/store/gatheringsStore';
import { GatheringApiParams } from '@/types/gatheringApi';
import { useRouter } from 'next/navigation';
import axios from 'axios';

/** 모임 삭제 훅
* @param token 토큰
* @param onCallback 모달에 표시할 메세지를 전달
* @returns {function} cancelGathering - 모임 삭제 함수
*/
export const useCancelGathering = ({ token, onCallback }: GatheringApiParams) => {
    const queryClient = useQueryClient();

    const removeGathering = useGatheringsStore((s) => s.removeGathering);

    const router = useRouter();

    const cancelGathering = useMutation({
        mutationFn: async (id: number) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            await axios.put(`/api/gatherings/cancel?id=${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            return id;
        },
        onSuccess: (id) => {
            removeGathering(id);
            queryClient.invalidateQueries({ queryKey: ["gatherings", "infinite"] });
            queryClient.invalidateQueries({ queryKey: ["createdGatherings", token] });
            onCallback?.('모임을 삭제했습니다', () => router.replace('/gatherings'));
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

    return { cancelGathering: cancelGathering.mutate }
}