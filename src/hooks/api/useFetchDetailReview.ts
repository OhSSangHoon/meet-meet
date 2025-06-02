'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/** 
 * 모임 리뷰 목록 조회 훅
 * @param gatheringId
 * @param limit
 * @param offset
 * @method GET
 * @returns {data, isLoading, isError}
 */
export const useFetchDetailReview = (
    gatheringId: number,
    limit: number,
    offset: number,
    enabled: boolean
) => {
    const fetchGatheringReviews = async () => {
        try {
            const response = await axios.get(`/api/reviews`, { params: { gatheringId, limit, offset } });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                console.error(serverError?.message);
            }
        }
    }

    const { data, isLoading, isError } = useQuery({
        enabled: !!gatheringId && enabled,
        queryKey: ['gatheringReviews', gatheringId],
        queryFn: fetchGatheringReviews,
    })

    return { data, isLoading, isError }
}