'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { internalClient } from '@/lib/api/clientFetchers';
import { GatheringApiParams } from '@/types/gatheringApi';
import { useGatheringsStore } from '@/store/gatheringsStore';
import { AxiosError } from 'axios';
import { isErrorResponse } from '@/lib/api/surfGuard';
import { myPageQuery } from '@/queries/mypage.query';
import { gatheringDetailQuery } from '@/queries/gatherings.query';
import { reviewsQuery } from '@/queries/review.query';

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
            queryClient.invalidateQueries({ queryKey: myPageQuery.joinedGatherings(token!) });
            queryClient.invalidateQueries({ queryKey: myPageQuery.myReviews(token!) });
            queryClient.invalidateQueries({ queryKey: gatheringDetailQuery.reviews(currentGatheringId!) });
            queryClient.invalidateQueries({ queryKey: reviewsQuery.all() });
            onCallback?.('리뷰가 성공적으로 등록되었습니다');
        },
        onError: (error) => {
            const err = error as AxiosError;
            const message = (isErrorResponse(err?.response?.data) && err?.response?.data.message) || '리뷰 작성에 실패했습니다';
            onCallback?.(message);
        }
    });

    return { createReview: createReview.mutate }
}