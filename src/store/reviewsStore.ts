import { create } from 'zustand';
import { Reviews, ReviewItem } from '@/types/reviews';

/**
 * SSR 모임 상세 리뷰 목록
 * @type {Reviews} detailReviews 모임 상세 리뷰 목록
 * @type {function} setDetailReviews 모임 상세 리뷰 목록 설정 함수
 * */
interface DetailReviewsState {
    detailReviews: Reviews;
    setDetailReviews: (detailReviews: Reviews) => void;
}

export const useDetailReviewsStore = create<DetailReviewsState>((set) => ({
    detailReviews: {
        data: [],
        totalItemCount: 0,
        currentPage: 0,
        totalPages: 0,
    },
    setDetailReviews: (detailReviews: Reviews) =>
        set((state) => ({
            detailReviews: {
                data: state.detailReviews.data.concat(detailReviews.data),
                totalItemCount: detailReviews.totalItemCount,
                currentPage: detailReviews.currentPage,
                totalPages: detailReviews.totalPages,
            },
        })),
}));


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