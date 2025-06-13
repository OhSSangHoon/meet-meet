import { internalClient } from "@/lib/api/clientFetchers";
import { ReviewItem } from "@/types/reviews";
import { isSameDateForFilter } from '@/components/shared/utils/dateFormats';

// 매직넘버 상수
const ITEMS_PER_PAGE = 3; // 페이지당 리뷰 개수

/**
 * 페이지네이션된 리뷰 목록 조회
 * @param page 페이지 번호
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜 (한국 시간 기준)
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
        // mainType에 따른 type 파라미터 설정
        let type: string;
        if (mainType === 'DORANDORAN') {
            type = 'WORKATION';
        } else {
            type = 'DALLAEMFIT';
        }

        // 서버 요청 파라미터
        const params: Record<string, string | number> = {
            offset: page * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
            type,
            sortBy,
            sortOrder
        };

        // 위치 필터
        if (location && location.trim() !== '') {
            params.location = location.trim();
        }

        // 리뷰 목록 조회
        const response = await internalClient.get('/api/reviews', { params });

        let reviews = response.data || [];

        // 응답 구조 확인 및 정규화
        if (!Array.isArray(reviews)) {
            if (response.data?.data) {
                reviews = response.data.data;
            } else if (response.data?.reviews) {
                reviews = response.data.reviews;
            } else if (response.data?.items) {
                reviews = response.data.items;
            } else {
                console.error('리뷰 응답 데이터 형식 오류:', response.data);
                return [];
            }
        }

        // 한국 시간 기준 날짜 필터링
        if (date && date.trim() !== '') {
            const targetDate = date.trim();
            
            reviews = reviews.filter((review: ReviewItem) => {
                if (!review.Gathering?.dateTime) return false;
                
                return isSameDateForFilter(review.Gathering.dateTime, targetDate);
            });
        }

        // DALLAEMFIT 서브타입 필터링
        let filteredReviews = reviews;
        if (mainType === 'DALLAEMFIT') {
            filteredReviews = reviews.filter((review: ReviewItem) =>
                review.Gathering && (
                    review.Gathering.type === 'OFFICE_STRETCHING' ||
                    review.Gathering.type === 'MINDFULNESS'
                )
            );
        }

        return filteredReviews;
    } catch (error) {
        console.error('리뷰 목록 조회 에러:', error);
        
        // 에러 상세 정보
        if (error instanceof Error) {
            console.error('에러 메시지:', error.message);
        }
        
        return [];
    }
}

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