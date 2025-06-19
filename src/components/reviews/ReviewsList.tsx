"use client"

import { useMemo } from 'react';
import { ReviewItem } from '@/types/reviews';
import { useFetchInfiniteReviews } from '@/hooks/api/reviews/useFetchInfiniteReviews';
import { decodeHtmlEntities } from '@/utils/shared/decodeHtmlEntities';
import ReviewStats from '@/components/reviews/ReviewStats';
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import HeartRating from '@/components/reviews/HeartRating';

// 스타일 상수
const TEXT_GRAY_XS_STYLES = "text-xs text-gray-400";

/**
 * 리뷰 목록 프로퍼티
 */
interface ReviewsListProps {
    ssrReviews: ReviewItem[];
    selectedMainType: string;
    selectedSubType: string;
    filters: {
        location: string;
        date: string;
    };
    sort: {
        sortBy: string;
        sortOrder: string;
    };
    enableInfiniteScroll?: boolean;
    isFilterChanged?: boolean;
}

/**
 * 리뷰 타입 필터링
 */
const filterReviewsByType = (
    reviewsList: ReviewItem[],
    selectedMainType: string,
    selectedSubType: string
): ReviewItem[] => {
    if (selectedMainType === 'DORANDORAN') {
        return reviewsList.filter(review =>
            review.Gathering && review.Gathering.type === 'WORKATION'
        );
    } else {
        if (selectedSubType === 'ALL') {
            return reviewsList.filter(review =>
                review.Gathering && (
                    review.Gathering.type === 'OFFICE_STRETCHING' ||
                    review.Gathering.type === 'MINDFULNESS'
                )
            );
        } else {
            return reviewsList.filter(review =>
                review.Gathering && review.Gathering.type === selectedSubType
            );
        }
    }
};

/**
 * 리뷰 위치/날짜 필터링 함수
 */
const filterReviewsByLocationAndDate = (
    reviewsList: ReviewItem[],
    location: string
): ReviewItem[] => {
    return reviewsList.filter(review => {
        // 위치 필터 (모임 위치 기준)
        if (location && review.Gathering?.location !== location) {
            return false;
        }

        // 날짜 필터는 서버에서 처리하므로 클라이언트에서는 제거
        return true;
    });
};

/**
 * 중복 제거 함수
 */
const removeDuplicateReviews = (reviews: ReviewItem[]): ReviewItem[] => {
    const seen = new Set<string>();
    return reviews.filter(review => {
        if (seen.has(review.id)) {
            return false;
        }
        seen.add(review.id);
        return true;
    });
};

export default function ReviewsList({
    ssrReviews,
    selectedMainType,
    selectedSubType,
    filters,
    sort,
    enableInfiniteScroll = true,
    isFilterChanged = false,
}: ReviewsListProps) {

    // CSR 무한스크롤 데이터
    const {
        infiniteReviews,
        lastItemRef,
        isFetchingNextPage,
        status,
    } = useFetchInfiniteReviews({
        enabled: enableInfiniteScroll,
        mainType: selectedMainType,
        location: filters.location,
        date: filters.date,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder
    });

    // 최종 리뷰 목록 처리
    const allReviews = useMemo(() => {
        // 1. 서버에서 이미 정렬된 데이터들을 단순 병합
        const combined = [...ssrReviews, ...infiniteReviews];
        const deduplicated = removeDuplicateReviews(combined);

        // 2. 타입 필터링만 수행
        const typeFiltered = filterReviewsByType(deduplicated, selectedMainType, selectedSubType);

        const locationDateFiltered = filterReviewsByLocationAndDate(typeFiltered, filters.location);

        return locationDateFiltered;
    }, [ssrReviews, infiniteReviews, selectedMainType, selectedSubType, filters]);

    // 더 명확한 로딩 상태 계산
    const hasData = allReviews.length > 0;
    const isApiLoading = enableInfiniteScroll && status === 'pending';
    const isFilterLoading = isFilterChanged;
    
    // 서버에서 데이터를 받았다면 (빈 데이터라도) 로딩 표시하지 않음
    // 오직 초기 로드 시에만 로딩 표시
    const shouldShowLoading = isFilterLoading && !hasData;
    const shouldShowEmpty = !hasData && !shouldShowLoading;

    // 디버깅 로그 (개발 환경에서만)
    console.log('🔍 ReviewsList Debug:', {
        ssrReviewsLength: ssrReviews.length,
        infiniteReviewsLength: infiniteReviews.length,
        allReviewsLength: allReviews.length,
        status,
        isFilterChanged,
        hasData,
        isApiLoading,
        isFilterLoading,
        shouldShowLoading,
        shouldShowEmpty,
        filters
    });

    return (
        <section className="w-full flex flex-col">
            {/* 리뷰 전용 평균 평점 섹션 */}
            <ReviewStats reviews={allReviews} />

            {/* 리뷰 목록 */}
            <div className="w-full flex flex-col justify-start gap-5">
                {allReviews.map((review, index) => {
                    const isLastItem = index === allReviews.length - 1;

                    return (
                        <article
                            key={`${review.id}-${index}`}
                            className="w-full flex flex-col md:flex-row justify-start border border-gray-200 rounded-2xl bg-white hover:border-main-300 hover:shadow-lg transition-all duration-300 overflow-hidden relative dark:border-gray-700 dark:bg-dark-2 dark:text-white"
                            ref={isLastItem && !isFetchingNextPage && enableInfiniteScroll ? lastItemRef : undefined}
                        >
                            {/* 이미지 영역 */}
                            <div className="w-full md:w-80 h-48 md:h-40 flex-shrink-0">
                                <ImageWithFallback
                                    src={review.Gathering.image!}
                                    fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1750048546/error_fallback_icbngz.avif'
                                    alt="리뷰 썸네일"
                                    width={320}
                                    height={192}
                                    priority={index < 2}
                                    sizes="(max-width: 768px) 100vw, 320px"
                                    fetchPriority={index < 2 ? 'high' : 'auto'}
                                    loading={index < 2 ? 'eager' : 'lazy'}
                                    className="w-full h-full rounded-t-2xl md:rounded-l-2xl md:rounded-t-none object-cover pointer-events-none"
                                    crossOrigin=""
                                    decoding={index < 2 ? 'sync' : 'async'}
                                />
                            </div>

                            {/* 콘텐츠 영역 */}
                            <div className="flex-1 flex flex-col justify-between p-4 md:p-6 min-h-0">
                                <div className="flex-1 w-full">
                                    {/* 평점 */}
                                    <HeartRating score={review.score} />
                                    {/* 리뷰 내용 */}
                                    <p className="text-sm text-gray-700 mt-2 mb-3 dark:text-white">{decodeHtmlEntities(review.comment)}</p>
                                    {/* 모임 정보 */}
                                    <div className="space-y-1">
                                        <p className={TEXT_GRAY_XS_STYLES}>
                                            {review.Gathering.name} · {review.Gathering.location}
                                        </p>
                                        <p className={TEXT_GRAY_XS_STYLES}>
                                            {review.User.name} | 리뷰작성: {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className={TEXT_GRAY_XS_STYLES}>
                                            모임개최: {new Date(review.Gathering.dateTime).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}

                {/* 무한스크롤 로딩 */}
                {enableInfiniteScroll && isFetchingNextPage && (
                    <div className="w-full h-[80px] flex justify-center items-center">
                        <div className="flex items-center gap-3">
                            <div className="size-6 border-3 border-main-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-600 font-medium">더 많은 리뷰를 불러오는 중...</span>
                        </div>
                    </div>
                )}

                {/* 로딩 상태 */}
                {shouldShowLoading && (
                    <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors duration-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-6 border-3 border-main-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-lg font-semibold">로딩 중...</p>
                        </div>
                        <p>리뷰를 불러오고 있어요</p>
                    </div>
                )}

                {/* 빈 목록 메시지 */}
                {shouldShowEmpty && (
                    <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors duration-200">
                        <p className="text-lg font-semibold mb-2">선택한 조건에 맞는 리뷰가 없어요</p>
                        <p>다른 조건으로 검색해보세요</p>
                    </div>
                )}
            </div>
        </section>
    );
}