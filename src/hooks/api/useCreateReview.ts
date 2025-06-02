'use client';

import { GatheringApiParams } from '@/types/gatheringApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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

    const createReview = useMutation({
        mutationFn: async ({ gatheringId, score, comment }: CreateReviewParams) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.post(`/api/reviews`, { gatheringId, score, comment }, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myReviews", token] });
            queryClient.invalidateQueries({ queryKey: ["gatheringReviews"] });
            onCallback?.('리뷰가 성공적으로 등록되었습니다');
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                onCallback?.(serverError?.message || '리뷰 등록에 실패했습니다');
            } else {
                onCallback?.(error.message);
            }
        }
    });

    return { createReview: createReview.mutate }
}