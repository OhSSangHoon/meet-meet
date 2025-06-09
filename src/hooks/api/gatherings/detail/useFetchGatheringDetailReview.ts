'use client';

import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { internalClient } from '@/lib/api/clientFetchers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/** 
 * 모임 상세 페이지 리뷰 목록 조회 훅
 * @param gatheringId
 * @param limit
 * @param offset
 * @method GET
 * @returns {data, isLoading, isError}
 */
export const useFetchGatheringDetailReview = (
    gatheringId: number,
    limit: number,
    offset: number,
    enabled: boolean
) => {
    const fetchGatheringDetailReviews = async () => {
        try {
            const response = await internalClient.get(INTERNAL_PATHS.REVIEWS, { params: { gatheringId, limit, offset } });
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
        queryKey: ["gatheringReviews", gatheringId],
        queryFn: fetchGatheringDetailReviews,
    })

    return { data, isLoading, isError }
}