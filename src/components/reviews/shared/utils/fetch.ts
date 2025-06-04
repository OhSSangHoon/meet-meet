import apiClient from "@/lib/api/axios";
import { ReviewItem } from "@/types/reviews";

/**
 * 클라이언트에서 모든 필터링과 정렬을 처리하는 리뷰 조회 함수
 * @param page 페이지 번호
 * @param mainType 메인 타입
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 * @returns 리뷰 목록
 */
export async function fetchReviewsPaginated(
    page: number,
    mainType: string = 'DALLAEMFIT',
    location?: string,
    date?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
): Promise<ReviewItem[]> {
    try {
        // 서버에는 기본 파라미터만 전송 (타입과 위치만)
        let type: string;
        if (mainType === 'DORANDORAN') {
            type = 'WORKATION';
        } else {
            type = 'DALLAEMFIT';
        }

        const params: Record<string, string | number> = {
            offset: 0, // 항상 처음부터 모든 데이터 가져오기
            limit: 100, // 충분한 데이터 확보
            type
        };

        // 위치 필터만 서버에 전달 
        if (location && location.trim() !== '') {
            params.location = location;
        }

        const response = await apiClient.get('/api/reviews', {
            params
        });

        let allReviews: ReviewItem[] = [];
        
        // API 응답 구조에 따른 안전한 데이터 추출
        if (Array.isArray(response.data)) {
            allReviews = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            allReviews = response.data.data;
        } else if (response.data && Array.isArray(response.data.reviews)) {
            allReviews = response.data.reviews;
        } else {
            console.warn('API 응답 구조가 예상과 다릅니다:', response.data);
            return [];
        }

        if (!Array.isArray(allReviews)) {
            console.error('allReviews가 배열이 아닙니다:', allReviews);
            return [];
        }

        // 타입 필터링
        let filteredReviews = allReviews;
        if (mainType === 'DALLAEMFIT') {
            filteredReviews = allReviews.filter((review: ReviewItem) => 
                review.Gathering && (
                    review.Gathering.type === 'OFFICE_STRETCHING' || 
                    review.Gathering.type === 'MINDFULNESS'
                )
            );
        }

        // 날짜 필터링 
        if (date && date.trim() !== '') {
            filteredReviews = filteredReviews.filter((review: ReviewItem) => {
                const reviewCreatedDate = new Date(review.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD 형식
                const matches = reviewCreatedDate === date;
                return matches;
            });
        }

        // 정렬
        if (sortBy && sortOrder) {
            filteredReviews.sort((a: ReviewItem, b: ReviewItem) => {
                if (sortBy === 'createdAt') {
                    // 최신순/오래된순
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    const result = sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
                    return result;
                } else if (sortBy === 'score') {
                    // 평점 높은순/낮은순
                    const result = sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
                    return result;
                } else if (sortBy === 'participantCount') {
                    // 참여인원 많은순/적은순
                    const countA = a.Gathering?.participantCount || 0;
                    const countB = b.Gathering?.participantCount || 0;
                    const result = sortOrder === 'desc' ? countB - countA : countA - countB;
                    return result;
                }
                return 0;
            });
        }

        // 페이지네이션
        const startIndex = page * 3;
        const endIndex = startIndex + 3;
        const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

        return paginatedReviews;
    } catch (error) {
        console.error('리뷰 목록 조회 에러:', error);
        return [];
    }
}

/**
 * 서브타입 필터링 함수
 * @param reviewsList 리뷰 목록
 * @param selectedMainType 메인 타입
 * @param selectedSubType 서브 타입
 * @returns 필터링된 리뷰 목록
 */
export const filterReviews = (
    reviewsList: ReviewItem[], 
    selectedMainType: string, 
    selectedSubType: string
): ReviewItem[] => {
    let filtered: ReviewItem[];
    
    if (selectedMainType === 'DORANDORAN') {
        // 도란도란 = WORKATION만
        filtered = reviewsList.filter(review => 
            review.Gathering && review.Gathering.type === 'WORKATION'
        );
    } else {
        // 북적북적 (DALLAEMFIT)
        if (selectedSubType === 'ALL') {
            // 전체 = 이미 fetchReviewsPaginated에서 필터링됨
            filtered = reviewsList;
        } else {
            // 특정 서브타입만
            filtered = reviewsList.filter(review => 
                review.Gathering && review.Gathering.type === selectedSubType
            );
        }
    }
    
    return filtered;
};