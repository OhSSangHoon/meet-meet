'use client';

import { useState, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchReviewsPaginated } from '@/components/reviews/shared/utils/fetch';
import { ReviewItem } from '@/types/reviews';

/**
 * 리뷰 무한스크롤 훅 프로퍼티
 * @param enabled 훅 활성화 여부
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 */
interface UseFetchInfiniteReviewsProps {
    enabled: boolean;
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
}

export function useFetchInfiniteReviews({
    enabled,
    mainType = 'DALLAEMFIT',
    location = '',
    date = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
}: UseFetchInfiniteReviewsProps) {
    const [infiniteScrollEnabled] = useState(true);

    // 위치/날짜 필터값 정규화
    const normalizedLocation = location?.trim() || '';
    const normalizedDate = date?.trim() || '';

    // 쿼리 키
    const queryKey = [
        'reviews',
        'infinite',
        {
            mainType,
            location: normalizedLocation,
            date: normalizedDate,
            sortBy,
            sortOrder
        }
    ];

    // 리뷰 무한스크롤 데이터
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
        isError,
    } = useInfiniteQuery<ReviewItem[]>({
        queryKey,
        queryFn: async ({ pageParam }) => {
            // 리뷰 목록 조회
            return await fetchReviewsPaginated(
                Number(pageParam),
                mainType,
                normalizedLocation || undefined,
                normalizedDate || undefined,
                sortBy,
                sortOrder
            );
        },
        getNextPageParam: (lastPage, allPages) => {
            // 무한스크롤 활성화 여부
            if (!lastPage || lastPage.length === 0 || lastPage.length < 3) {
                return undefined;
            }
            return allPages.length;
        },
        initialPageParam: 0,
        enabled: enabled && infiniteScrollEnabled,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
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
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });

            // 만약 노드가 있다면 옵저버 관찰
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, fetchNextPage, hasNextPage]
    );

    return {
        infiniteReviews,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled: true,
        status,
        isLoading,
        isError,
    };
}