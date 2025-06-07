"use client"

import Image from 'next/image';
import HeartRating from '@/components/reviews/HeartRating';
import { ReviewItem } from '@/types/reviews';
import { useFetchInfiniteReviews } from '@/hooks/api/reviews/useFetchInfiniteReviews';
import { useReviewsStore } from '@/store/reviewsStore';
import { filterReviews } from '@/components/reviews/shared/utils/fetch';
import { isSameDateForFilter } from '@/components/shared/utils/dateFormats';
import ReviewStats from './ReviewStats';
import { useMemo } from 'react';

/**
 * 리뷰 목록 프로퍼티
 * @param fetchFromApi 무한스크롤 활성화 여부
 * @param selectedMainType 모임 주제
 * @param selectedSubType 모임 서브타입
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 * @param reviews 리뷰 목록
 */
interface ReviewsListProps {
    fetchFromApi?: boolean;
    selectedMainType?: string;
    selectedSubType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
    reviews?: ReviewItem[];
}

/**
 * 리뷰 위치/날짜 필터링 함수
 */
const filterReviewsByLocationAndDate = (
    reviewsList: ReviewItem[],
    location: string,
    date: string
): ReviewItem[] => {
    return reviewsList.filter(review => {
        // 위치 필터 (모임 위치 기준)
        if (location && review.Gathering?.location !== location) {
            return false;
        }
        
        // 날짜 필터 (모임 개최일 기준)
        if (date && review.Gathering?.dateTime) {
            if (!isSameDateForFilter(review.Gathering.dateTime, date)) {
                return false;
            }
        }
        
        return true;
    });
};

export default function ReviewsList({
    fetchFromApi = true,
    selectedMainType = 'DALLAEMFIT',
    selectedSubType = '',
    location = '',
    date = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    reviews
}: ReviewsListProps) {
    const ssrReviews = useReviewsStore((s) => s.reviews);

    // 필터 활성화 여부 확인
    const hasActiveFilters = location || date;

    // 리뷰 무한스크롤 훅
    const {
        infiniteReviews,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
        isLoading,
    } = useFetchInfiniteReviews({
        enabled: fetchFromApi,
        mainType: selectedMainType,
        location,
        date,
        sortBy,
        sortOrder
    });

    // 리뷰 하이브리드 필터링 로직
    const mergedReviews = useMemo(() => {
        // API를 사용하지 않는 경우 (찜목록 등)
        if (!fetchFromApi) {
            return filterReviews(reviews || [], selectedMainType, selectedSubType);
        }

        // 무한스크롤 데이터가 있으면 우선 사용
        if (infiniteReviews.length > 0) {
            return filterReviews(infiniteReviews, selectedMainType, selectedSubType);
        } 
        
        // 무한스크롤 데이터가 없을 때 SSR 사용
        if (hasActiveFilters) {
            // 타입 필터링
            const typeFiltered = filterReviews(ssrReviews, selectedMainType, selectedSubType);
            // 위치/날짜 필터링
            const clientFiltered = filterReviewsByLocationAndDate(typeFiltered, location, date);
            // 조건에 맞는 게 없으면 빈 배열 (이상한 fallback 방지)
            return clientFiltered;
        } else {
            // 필터가 없으면 SSR 데이터 그대로 사용
            return filterReviews(ssrReviews, selectedMainType, selectedSubType);
        }
    }, [
        fetchFromApi, 
        infiniteReviews, 
        ssrReviews, 
        selectedMainType, 
        selectedSubType, 
        location, 
        date,  
        reviews,
        hasActiveFilters
    ]);

    // 로딩 상태 개선 
    const isInitialLoading = fetchFromApi && isLoading && infiniteReviews.length === 0 && 
        (hasActiveFilters || ssrReviews.length === 0);

    return (
        <div className="w-full flex flex-col">
            {/* 리뷰 전용 평균 평점 섹션 */}
            <ReviewStats reviews={mergedReviews} />

            {/* 리뷰 목록 */}
            <div className="w-full flex flex-col justify-start gap-5">
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
                        {fetchFromApi ? (
                            hasActiveFilters ? (
                                <>
                                    <p className="">선택한 조건에 맞는 리뷰가 없어요,</p>
                                    <p className="">다른 조건으로 검색해보세요</p>
                                </>
                            ) : (
                                <>
                                    <p className="">아직 리뷰가 없어요,</p>
                                    <p className="">첫 번째 리뷰를 남겨보세요</p>
                                </>
                            )
                        ) : (
                            <>
                                <p className="">아직 리뷰가 없어요</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}