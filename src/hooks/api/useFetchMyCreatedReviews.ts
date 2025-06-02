'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/** 
 * 작성한 리뷰 조회 훅
 * @param token
 * @param userId
 * @method GET
 * @returns {data, isLoading, isError}
 */
export const useFetchMyCreatedReviews = (token: string, gatheringIds: number[], userId: number) => {
    const fetchGatheringReviews = async () => {
        try {
            // axios는 배열을 gatheringId=1&gatheringId=2&gatheringId=3 형태로 보냄
            const response = await Promise.all(
                gatheringIds.map(id =>
                    axios.get('/api/reviews', { params: { gatheringId: id, userId } })
                        .then(res => res.data.data)
                        .catch(() => null)
                )
            );
            return response.flat().filter(Boolean);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                console.error(serverError?.message);
            }
        }
    }

    const { data, isLoading, isError } = useQuery({
        enabled: !!token && gatheringIds.length > 0,
        queryKey: ["myReviews", token],
        queryFn: fetchGatheringReviews,
    })

    return { data, isLoading, isError }
}