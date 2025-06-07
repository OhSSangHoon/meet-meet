'use client';

import { useState, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchGatheringsPaginated } from '@/components/gatherings/shared/utils/fetch';
import { Gathering } from '@/types/gatherings';

/**
 * 모임 무한스크롤 훅
 * @param enabled 훅 활성화 여부
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 * @param filterSavedIds 저장된 모임 ID 배열
 */
interface UseFetchInfiniteGatheringsProps {
    enabled: boolean;
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
    filterSavedIds?: string[];
}

export function useFetchInfiniteGatherings({
    enabled,
    mainType = 'DALLAEMFIT',
    location = '',
    date = '',
    sortBy = 'registrationEnd',
    sortOrder = 'desc',
    filterSavedIds
}: UseFetchInfiniteGatheringsProps) {
    const [infiniteScrollEnabled] = useState(true);

    // 위치/날짜 필터값 정규화
    const normalizedLocation = location?.trim() || '';
    const normalizedDate = date?.trim() || '';
    
    // 쿼리 키
    const queryKey = [
        'gatherings',
        'infinite',
        {
            mainType,
            location: normalizedLocation,
            date: normalizedDate,
            sortBy,
            sortOrder,
            filterSavedIds: filterSavedIds?.sort().join(',') || ''
        }
    ];

    // 무한스크롤 데이터
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
        isError,
    } = useInfiniteQuery<Gathering[]>({
        queryKey,
        queryFn: ({ pageParam }) => {
            return fetchGatheringsPaginated(
                Number(pageParam),
                mainType, 
                normalizedLocation || undefined,
                normalizedDate || undefined,
                filterSavedIds,
                sortBy,
                sortOrder,
            );
        },
        getNextPageParam: (lastPage, allPages) => {
            // 마지막 페이지가 비어있거나 10개 미만이면 더 이상 없음
            if (!lastPage || lastPage.length === 0 || lastPage.length < 10) {
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

    // 무한스크롤 데이터
    const infiniteGatherings = data?.pages.flat() || [];

    // 무한스크롤 로딩 컴포넌트
    const observer = useRef<IntersectionObserver | null>(null);

    const lastItemRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });

            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, fetchNextPage, hasNextPage]
    );

    return {
        infiniteGatherings,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
        status,
        isLoading,
        isError,
    };
}