import { ReviewItem } from "@/types/reviews";

/**
 * 리뷰 타입 필터링
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