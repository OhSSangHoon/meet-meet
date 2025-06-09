import { apiClient } from "@/lib/api/clientFetchers";
import { ReviewItem } from "@/types/reviews";

/**
 * 리뷰 목록 조회
 * @param page 페이지 번호
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 */
export async function fetchReviewsPaginated(
    page: number,
    mainType: string = 'DALLAEMFIT',
    location?: string,
    date?: string,
    sortBy: string = 'createdAt',
    sortOrder: string = 'desc'
): Promise<ReviewItem[]> {
    try {
        let type: string;
        if (mainType === 'DORANDORAN') {
            type = 'WORKATION';
        } else {
            type = 'DALLAEMFIT';
        }

        // 리뷰 목록 조회
        const params: Record<string, string | number> = {
            offset: page * 3, // 페이지 번호 * 3
            limit: 3, // 한 페이지당 3개
            type,
            sortBy,
            sortOrder
        };

        // 위치 필터
        if (location && location.trim() !== '') {
            params.location = location.trim();
        }

        // 날짜 필터
        if (date && date.trim() !== '') {
            const dateValue = date.trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                params.date = dateValue;
            } else {
                console.warn('잘못된 날짜 형식:', dateValue);
            }
        }

        // 리뷰 목록 조회
        const response = await apiClient.get('/api/reviews', { params });

        // 응답 데이터 구조 파싱
        let allReviews: ReviewItem[] = [];
        if (Array.isArray(response.data)) {
            allReviews = response.data;
        } else if (response.data?.data) {
            allReviews = response.data.data;
        } else {
            console.error('알 수 없는 응답 구조:', response.data);
            return [];
        }

        return allReviews;

    } catch (error) {
        console.error('리뷰 목록 조회 에러:', error);
        return [];
    }
}

/**
 * 리뷰 필터링
 * @param reviewsList 리뷰 목록
 * @param selectedMainType 모임 주제
 * @param selectedSubType 모임 서브타입
 * @returns 필터링된 리뷰 목록
 */
export const filterReviews = (
    reviewsList: ReviewItem[],
    selectedMainType: string,
    selectedSubType: string
): ReviewItem[] => {
    // 도란도란 (WORKATION)
    if (selectedMainType === 'DORANDORAN') {
        return reviewsList.filter(review =>
            review.Gathering && review.Gathering.type === 'WORKATION'
        );
    } else {
        // 북적북적 (DALLAEMFIT)
        if (selectedSubType === 'ALL' || !selectedSubType) {
            return reviewsList.filter(review =>
                review.Gathering && (
                    review.Gathering.type === 'OFFICE_STRETCHING' ||
                    review.Gathering.type === 'MINDFULNESS'
                )
            );
        } else {
            // 특정 서브타입만
            return reviewsList.filter(review =>
                review.Gathering && review.Gathering.type === selectedSubType
            );
        }
    }
};