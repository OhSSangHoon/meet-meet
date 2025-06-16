'use client';

import { useState, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchReviewsPaginated } from '@/utils/reviews/fetch';
import { ReviewItem } from '@/types/reviews';
import { reviewsQuery } from '@/queries/review.query';

/**
 * 리뷰 무한스크롤 훅 프로퍼티
 * @param enabled 무한스크롤 활성화 여부
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 * @param startPage 시작 페이지
 */
interface UseFetchInfiniteReviewsProps {
    enabled: boolean;
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
    startPage?: number;
}

/**
 * 리뷰 무한스크롤 훅
 * @param props 프로퍼티
 * @returns 무한스크롤 데이터
 */
export function useFetchInfiniteReviews({
    enabled,
    mainType = 'DALLAEMFIT',
    location = '',
    date = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    startPage = 1
}: UseFetchInfiniteReviewsProps) {
    const [infiniteScrollEnabled] = useState(true);
    const [hasTriggeredFirstFetch, setHasTriggeredFirstFetch] = useState(false);

    // 위치/날짜 필터값 정규화
    const normalizedLocation = location?.trim() || '';
    const normalizedDate = date?.trim() || '';

    // 쿼리 키
    const queryKey = [...reviewsQuery.infinite()];

    // 리뷰 무한스크롤 데이터
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isError,
    } = useInfiniteQuery<ReviewItem[]>({
        queryKey,
        queryFn: ({ pageParam }) => {
            return fetchReviewsPaginated(
                Number(pageParam),
                mainType,
                normalizedLocation || undefined,
                normalizedDate || undefined,
                sortBy,
                sortOrder,
            );
        },
        getNextPageParam: (lastPage, allPages) => {
            const lastPageLength = lastPage?.length || 0;
            const totalPages = allPages.length;
            const nextPage = startPage + totalPages;

            // 3개 미만이면 마지막 페이지
            if (lastPageLength < 3) {
                return undefined;
            }

            return nextPage;
        },
        initialPageParam: startPage,
        // 스크롤 기반 지연 로딩
        enabled: enabled && infiniteScrollEnabled && hasTriggeredFirstFetch,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    // 리뷰 목록
    const infiniteReviews = data?.pages.flat() || [];

    // 무한스크롤 옵저버
    const observer = useRef<IntersectionObserver | null>(null);

    // 무한스크롤 마지막 아이템 참조
    const lastItemRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    // 첫 번째 스크롤 감지 시 무한스크롤 시작
                    if (!hasTriggeredFirstFetch) {
                        setHasTriggeredFirstFetch(true);
                    } else if (hasNextPage) {
                        fetchNextPage();
                    }
                }
            }, {
                rootMargin: '0px',
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [isFetchingNextPage, fetchNextPage, hasNextPage, hasTriggeredFirstFetch]
    );

    return {
        infiniteReviews,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
        status,
        isError,
        hasNextPage,
    };
}