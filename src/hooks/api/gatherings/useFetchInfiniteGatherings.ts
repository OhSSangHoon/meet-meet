'use client';

import { useState, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPaginatedGatherings } from '@/components/gatherings/shared/utils/fetchPaginatedGatherings';
import { Gathering } from '@/types/gatherings';


/**
 * 무한 스크롤 모임 목록 조회
 * @param enabled 조회 가능 여부
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 * @param filterSavedIds 찜목록 필터링
 * @param startPage 시작 페이지
 * @param excludeExpired 마감된 모임 제외 여부
 */
interface UseFetchInfiniteGatheringsProps {
    enabled: boolean;
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
    filterSavedIds?: string[];
    startPage?: number;
    excludeExpired?: boolean;
}

export function useFetchInfiniteGatherings({
    enabled,
    mainType = 'DALLAEMFIT',
    location = '',
    date = '',
    sortBy = 'registrationEnd',
    sortOrder = 'desc',
    filterSavedIds,
    startPage = 0,
    excludeExpired = true
}: UseFetchInfiniteGatheringsProps) {
    const [infiniteScrollEnabled] = useState(true);
    const [hasTriggeredFirstFetch, setHasTriggeredFirstFetch] = useState(false);

    const normalizedLocation = location?.trim() || '';
    const normalizedDate = date?.trim() || '';

    // 쿼리키
    const queryKey = [
        'gatherings',
        'infinite',
        {
            mainType,
            location: normalizedLocation,
            date: normalizedDate,
            sortBy,
            sortOrder,
            startPage,
            excludeExpired,
            filterSavedIds: filterSavedIds?.sort().join(',') || ''
        }
    ];

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
            return fetchPaginatedGatherings(
                Number(pageParam),
                mainType,
                normalizedLocation || undefined,
                normalizedDate || undefined,
                filterSavedIds,
                sortBy,
                sortOrder,
                excludeExpired
            );
        },
        getNextPageParam: (lastPage, allPages) => {
            const lastPageLength = lastPage?.length || 0;
            const totalPages = allPages.length;
            const nextPage = startPage + totalPages;
            
            // 10개 미만이면 마지막 페이지
            if (lastPageLength < 10) {
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

    const infiniteGatherings = data?.pages.flat() || [];

    const observer = useRef<IntersectionObserver | null>(null);

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
        infiniteGatherings,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
        status,
        isLoading,
        isError,
        hasNextPage,
    };
}