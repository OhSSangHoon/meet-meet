import { create } from 'zustand';
import { ReviewItem } from '@/types/reviews';

/**
 * SSR 리뷰 페이지 목록
 * @type {ReviewItem[]} reviews 리뷰 페이지 목록
 * @type {function} setReviews 리뷰 페이지 목록 설정 함수
 * @type {function} clearReviews 리뷰 페이지 목록 초기화 함수
 */
interface ReviewsStore {
    reviews: ReviewItem[];
    setReviews: (reviews: ReviewItem[]) => void;
    clearReviews: () => void;
}

export const useReviewsStore = create<ReviewsStore>((set) => ({
    reviews: [],
    setReviews: (reviews) => set({ reviews }),
    clearReviews: () => set({ reviews: [] }),
}));