'use client';

import { useState, useRef, useCallback, useContext } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchGatheringsPaginated } from '@/components/gatherings/shared/utils/fetch';
import { AuthContext } from '@/providers/AuthProvider';
import { Gathering } from '@/types/gatherings';

interface UseFetchInfiniteGatheringsProps {
    enabled: boolean;
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * 무한스크롤 훅
 * @param enabled 무한스크롤 활성화 여부
 * @param mainType 메인 타입 필터
 * @param location 위치 필터
 * @param date 날짜 필터
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 * @returns 
 */
export function useFetchInfiniteGatherings({
    enabled,
    mainType = 'DALLAEMFIT',
    location = '',
    date = '',
    sortBy = 'registrationEnd',
    sortOrder = 'asc'
}: UseFetchInfiniteGatheringsProps) {
    const { token } = useContext(AuthContext);
    const [infiniteScrollEnabled] = useState(true);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
        isError,
    } = useInfiniteQuery<Gathering[]>({
        queryKey: [
            'gatherings', 
            mainType, 
            location, 
            date, 
            sortBy, 
            sortOrder
        ], //모든 필터와 정렬 정보를 queryKey에 포함
        queryFn: ({ pageParam }) => {
            return fetchGatheringsPaginated(
                Number(pageParam), 
                token, 
                mainType, 
                location, 
                date, 
                sortBy, 
                sortOrder
            );
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || lastPage.length === 0) return undefined;
            return allPages.length;
        },
        initialPageParam: 0,
        enabled: enabled && infiniteScrollEnabled,
        retry: (failureCount) => {
            // API 에러 시 재시도 로직
            if (failureCount < 2) return true;
            return false;
        },
    });

    const infiniteGatherings = data?.pages.flat() || [];

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

    // 디버깅
    const debugInfo = {
        totalGatherings: infiniteGatherings.length,
        totalPages: data?.pages.length || 0,
        sortBy,
        sortOrder,
        hasNextPage,
        isLoading,
        isError,

        // 첫 번째와 마지막 모임의 마감일 비교 (정렬 확인용)
        firstGatheringEnd: infiniteGatherings[0]?.registrationEnd,
        lastGatheringEnd: infiniteGatherings[infiniteGatherings.length - 1]?.registrationEnd,
    };

    return {
        infiniteGatherings,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
        status,
        isLoading,
        isError,
        debugInfo,
    };
}