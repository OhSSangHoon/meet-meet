'use client';

import { useState, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchReviewsPaginated } from '@/components/reviews/shared/utils/fetch';
import { ReviewItem } from '@/types/reviews';

// 무한스크롤 훅 타입
interface UseFetchInfiniteReviewsProps {
    enabled: boolean;
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * 수정된 무한스크롤 훅 - subType 처리 개선
 * @param enabled 무한스크롤 활성화 여부
 * @param mainType 모임 타입
 * @param subType 서브 타입
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 */
export function useFetchInfiniteReviews({
    enabled,
    mainType = 'DALLAEMFIT',
    location = '',
    date = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
}: UseFetchInfiniteReviewsProps) {
    const [infiniteScrollEnabled] = useState(true);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
        isError,
    } = useInfiniteQuery<ReviewItem[]>({
        queryKey: [
            'reviews', 
            mainType, 
            location, 
            date, 
            sortBy, 
            sortOrder
        ],
        queryFn: ({ pageParam }) => {
            
            // fetchReviewsPaginated는 subType을 직접 처리하지 않음
            // 서버에서 mainType 데이터를 모두 가져온 후, 
            // 클라이언트에서 subType 필터링은 filterReviews에서 처리됨
            return fetchReviewsPaginated(
                Number(pageParam),
                mainType,
                location,
                date,
                sortBy,
                sortOrder
            );
        },
        getNextPageParam: (lastPage, allPages) => {
            // 마지막 페이지가 없거나 3개 이하의 데이터가 있으면 더 이상 페이지를 불러오지 않음
            if (!lastPage || lastPage.length < 3) {
                return undefined;
            }
            const nextPage = allPages.length;
            return nextPage;
        },
        initialPageParam: 0,
        enabled: enabled && infiniteScrollEnabled,
        retry: (failureCount, error) => {
            console.error('무한스크롤 에러:', error);   
            if (failureCount < 2) return true;
            return false;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
    });

    // 모든 페이지의 데이터를 하나의 배열로 합침
    const infiniteReviews = data?.pages.flat() || [];
    
    // 무한스크롤 로딩 처리
    const observer = useRef<IntersectionObserver | null>(null);
    
    // 무한스크롤 로딩 처리
    const lastItemRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) {
                return;
            }
            
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [isFetchingNextPage, fetchNextPage, hasNextPage]
    );

    return {
        infiniteReviews,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
        status,
        isLoading,
        isError,
    };
}