'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { internalClient } from '@/lib/api/clientFetchers';
import { GatheringApiParams } from '@/types/gatheringApi';
import { handleApiError } from '@/lib/api/handleApiResponse';
import { useGatheringsStore } from '@/store/gatheringsStore';

interface CreateReviewParams {
    gatheringId: number;
    score: number;
    comment: string;
}

/**
 * 리뷰 작성 훅
 * @param onSuccessCallback 
 * @returns {function} mutateCreateMyReview - 리뷰 생성 함수
 */
export const useCreateReview = ({ token, onCallback }: GatheringApiParams) => {
    const queryClient = useQueryClient();

    const currentGatheringId = useGatheringsStore(state => state.currentGatheringId);

    const createReview = useMutation({
        mutationFn: async ({ gatheringId, score, comment }: CreateReviewParams) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await internalClient.post(INTERNAL_PATHS.REVIEWS, { gatheringId, score, comment });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myReviews", token] });
            queryClient.invalidateQueries({ queryKey: ["joinedGatherings", token] });
            queryClient.invalidateQueries({ queryKey: ["gatheringReviews", currentGatheringId] });
            onCallback?.('리뷰가 성공적으로 등록되었습니다');
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

    return { createReview: createReview.mutate }
}