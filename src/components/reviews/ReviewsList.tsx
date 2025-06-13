"use client"

import Image from 'next/image';
import HeartRating from '@/components/reviews/HeartRating';
import { ReviewItem } from '@/types/reviews';
import { useFetchInfiniteReviews } from '@/hooks/api/reviews/useFetchInfiniteReviews';
import { isSameDateForFilter } from '@/components/shared/utils/dateFormats';
import ReviewStats from './ReviewStats';
import { useMemo } from 'react';

// 스타일 상수
const TEXT_GRAY_XS_STYLES = "text-xs text-gray-400";

/**
 * 리뷰 목록 프로퍼티
 * @param ssrReviews 서버 렌더링 리뷰 목록
 * @param selectedMainType 선택된 모임 주제
 * @param selectedSubType 선택된 모임 서브타입
 * @param filters 필터 옵션
 * @param sort 정렬 옵션
 * @param enableInfiniteScroll 무한스크롤 활성화 여부
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
}

/**
 * 리뷰 타입 필터링 (클라이언트 사이드)
 * @param reviewsList 리뷰 목록
 * @param selectedMainType 선택된 메인 타입
 * @param selectedSubType 선택된 서브 타입
 * @returns 필터링된 리뷰 목록
 */
const filterReviewsByType = (
    reviewsList: ReviewItem[],
    selectedMainType: string,
    selectedSubType: string
): ReviewItem[] => {
    
    if (selectedMainType === 'DORANDORAN') {
        const result = reviewsList.filter(review => 
            review.Gathering && review.Gathering.type === 'WORKATION'
        );
        return result;
    } else {
        if (selectedSubType === 'ALL') {
            const result = reviewsList.filter(review =>
                review.Gathering && (
                    review.Gathering.type === 'OFFICE_STRETCHING' ||
                    review.Gathering.type === 'MINDFULNESS'
                )
            );
            
            return result;
        } else {
            const result = reviewsList.filter(review => 
                review.Gathering && review.Gathering.type === selectedSubType
            );
            return result;
        }
    }
};

/**
 * 리뷰 위치/날짜 필터링 함수
 * @param reviewsList 리뷰 목록
 * @param location 위치
 * @param date 날짜
 * @returns 필터링된 리뷰 목록
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

/**
 * 중복 제거 함수
 * @param reviews 리뷰 목록
 * @returns 중복 제거된 리뷰 목록
 */
const removeDuplicateReviews = (reviews: ReviewItem[]): ReviewItem[] => {
    const seen = new Set<string>();
    const duplicates: ReviewItem[] = [];
    
    const result = reviews.filter(review => {
        if (seen.has(review.id)) {
            duplicates.push(review);
            return false;
        }
        seen.add(review.id);
        return true;
    });
    return result;
};

export default function ReviewsList({
    ssrReviews,
    selectedMainType,
    selectedSubType,
    filters,
    sort,
    enableInfiniteScroll = true,
}: ReviewsListProps) {

    // CSR 무한스크롤 데이터
    const {
        infiniteReviews,
        lastItemRef,
        isFetchingNextPage,
        isLoading,
    } = useFetchInfiniteReviews({
        enabled: enableInfiniteScroll,
        mainType: selectedMainType,
        location: filters.location,
        date: filters.date,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder
    });

    // SSR 데이터 타입 및 위치/날짜 필터링
    const filteredSSRReviews = useMemo(() => {
        // 1. 타입 필터링
        const typeFiltered = filterReviewsByType(ssrReviews, selectedMainType, selectedSubType);
        
        // 2. 위치/날짜 필터링
        const locationDateFiltered = filterReviewsByLocationAndDate(typeFiltered, filters.location, filters.date);
        
        return locationDateFiltered;
    }, [ssrReviews, selectedMainType, selectedSubType, filters]);

    // CSR 데이터 타입 필터링
    const filteredCSRReviews = useMemo(() => {
        const result = filterReviewsByType(infiniteReviews, selectedMainType, selectedSubType);
        
        return result;
    }, [infiniteReviews, selectedMainType, selectedSubType]);

    // 중복 제거된 최종 리뷰 목록
    const allReviews = useMemo(() => {
        const combined = [...filteredSSRReviews, ...filteredCSRReviews];
        const deduplicated = removeDuplicateReviews(combined);
        
        return deduplicated;
    }, [filteredSSRReviews, filteredCSRReviews]);

    return (
        <div className="w-full flex flex-col">
            {/* 리뷰 전용 평균 평점 섹션 */}
            <ReviewStats reviews={allReviews} />

            {/* 리뷰 목록 */}
            <div className="w-full flex flex-col justify-start gap-5">
                {allReviews.map((review, index) => {
                    const isLastItem = index === allReviews.length - 1;

                    return (
                        <section
                            key={`${review.id}-${index}`}
                            className="w-full flex flex-col md:flex-row justify-start border border-gray-200 rounded-2xl bg-white hover:border-main-300 hover:shadow-lg transition-all duration-300 overflow-hidden relative"
                            ref={isLastItem && !isFetchingNextPage && enableInfiniteScroll ? lastItemRef : undefined}
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
                        </section>
                    );
                })}

                {/* 무한스크롤 로딩 */}
                {enableInfiniteScroll && isFetchingNextPage && (
                    <div className="w-full h-[80px] flex justify-center items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 border-3 border-main-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-600 font-medium">더 많은 리뷰를 불러오는 중...</span>
                        </div>
                    </div>
                )}

                {/* 빈 목록 메시지 */}
                {!isLoading && allReviews.length === 0 && (
                    <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500 font-medium text-sm">
                        <>
                                <p>선택한 조건에 맞는 리뷰가 없어요,</p>
                                <p>다른 조건으로 검색해보세요</p>
                            </>
                    </div>
                )}
            </div>
        </div>
    );
}