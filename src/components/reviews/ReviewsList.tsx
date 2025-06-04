"use client"

import Image from 'next/image';
import HeartRating from '@/components/reviews/HeartRating';
import { ReviewItem } from '@/types/reviews';
import { useFetchInfiniteReviews } from '@/hooks/api/useFetchInfiniteReviews';
import { useReviewsStore } from '@/store/reviewsStore';
import { filterReviews } from '@/components/reviews/shared/utils/fetch';
import ReviewStats from './ReviewStats';

interface ReviewsListProps {
    fetchFromApi?: boolean;
    selectedMainType?: string;
    selectedSubType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    reviews?: ReviewItem[];
}

export default function ReviewsList({
    fetchFromApi = true,
    selectedMainType = 'DALLAEMFIT',
    selectedSubType = 'ALL',
    location = '',
    date = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    reviews
}: ReviewsListProps) {
    const ssrReviews = useReviewsStore((s) => s.reviews);
    const hasSSRData = ssrReviews.length > 0;

    // 무한스크롤 훅
    const {
        infiniteReviews,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
    } = useFetchInfiniteReviews({
        enabled: fetchFromApi,
        mainType: selectedMainType,
        location,
        date,
        sortBy,
        sortOrder
    });

    // 데이터 병합 로직
    const mergedReviews = (() => {
        if (!fetchFromApi) {
            // API를 사용하지 않는 경우 (찜목록 등)
            return filterReviews(reviews || ssrReviews, selectedMainType, selectedSubType);
        }

        if (!hasSSRData) {
            return filterReviews(infiniteReviews, selectedMainType, selectedSubType);
        }

        // SSR 데이터가 있는 경우
        const serverData = infiniteReviews.length > 0 ? infiniteReviews : ssrReviews;
        return filterReviews(serverData, selectedMainType, selectedSubType);
    })();

    const isInitialLoading = fetchFromApi && !hasSSRData && infiniteReviews.length === 0;

    return (
        <div className="w-full flex flex-col">
            {/* 리뷰 전용 평균 평점 섹션 */}
            <ReviewStats reviews={mergedReviews} />

            {/* 리뷰 목록 */}
            <div className="w-full flex flex-col justify-start gap-5">
                <h3 className="text-lg font-semibold text-gray-900">
                    모든 리뷰 ({mergedReviews.length}개)
                </h3>
                
                {!isInitialLoading && mergedReviews.map((review, index) => {
                    const isLastItem = index === mergedReviews.length - 1;
                    
                    return (
                        <section
                            key={`${review.id}-${index}`}
                            className="w-full flex flex-col md:flex-row justify-start border border-gray-200 rounded-2xl bg-white hover:border-main-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                            ref={isLastItem && fetchFromApi ? lastItemRef : undefined}
                        >
                            {/* 이미지 영역 */}
                            <div className="w-full md:w-80 h-48 md:h-40 relative flex-shrink-0">
                                <Image
                                    src={review.Gathering.image || '/images/placeholder.jpg'}
                                    alt="review image"
                                    fill
                                    className="rounded-t-lg md:rounded-l-lg md:rounded-t-none object-cover pointer-events-none"
                                    priority={index === 0}
                                    sizes="(max-width: 768px) 100vw, 320px"
                                />
                            </div>
                            
                            {/* 콘텐츠 영역 */}
                            <div className="flex-1 flex flex-col justify-between p-4 md:p-6 min-h-0">
                                <div className="flex-1 w-full">
                                    {/* 평점 */}
                                    <HeartRating score={review.score} />
                                    {/* 리뷰 내용 */}
                                    <p className="text-sm text-gray-700 mt-2 mb-3">{review.comment}</p>
                                    {/* 모임 정보 */}
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400">
                                            {review.Gathering.name} · {review.Gathering.location}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {review.User.name} | 리뷰작성: {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            모임개최: {new Date(review.Gathering.dateTime).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })}
                
                {/* 무한스크롤 로딩 */}
                {infiniteScrollEnabled && isFetchingNextPage && (
                    <div className="w-full h-[80px] flex justify-center items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 border-3 border-main-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-600 font-medium">더 많은 리뷰를 불러오는 중...</span>
                        </div>
                    </div>
                )}
                
                {/* 빈 목록 메시지 */}
                {!isInitialLoading && mergedReviews.length === 0 && (
                    <div className="w-full h-[100px] flex flex-col justify-center items-center text-gray-500 font-medium text-sm">
                        <p className="">아직 리뷰가 없어요,</p>
                        <p className="">첫 번째 리뷰를 남겨보세요</p>
                    </div>
                )}
            </div>
        </div>
    );
}