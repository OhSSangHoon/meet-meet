'use client';

import { useState, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPaginatedGatherings } from '@/utils/gatherings/fetchPaginatedGatherings';
import { Gathering } from '@/types/gatherings';
import { filterActiveGatherings, GATHERING_CONSTANTS } from '@/utils/gatherings/gatheringsUtils';

/**
 * 무한 스크롤 데이터 쿼리 프로퍼티
 * @param enabled 무한 스크롤 활성화 여부
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 * @param filterSavedIds 찜목록 필터링
 * @param startIndex 시작 인덱스
 */
interface UseFetchInfiniteGatheringsProps {
    enabled: boolean;
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
    filterSavedIds?: string[];
    startIndex?: number;
}

export function useFetchInfiniteGatherings({
    enabled,
    mainType = 'DALLAEMFIT',
    location = '',
    date = '',
    sortBy = 'registrationEnd',
    sortOrder = 'asc',
    filterSavedIds,
    startIndex = 0,
}: UseFetchInfiniteGatheringsProps) {
    const [infiniteScrollEnabled] = useState(true);
    const [hasTriggeredFirstFetch, setHasTriggeredFirstFetch] = useState(false);

    const normalizedLocation = location?.trim() || ''; // 위치 정규화
    const normalizedDate = date?.trim() || ''; // 날짜 정규화

    const queryKey = [
        'gatherings',
        'infinite',
        {
            mainType,
            location: normalizedLocation,
            date: normalizedDate,
            sortBy,
            sortOrder,
            startIndex,
            filterSavedIds: filterSavedIds?.sort().join(',') || ''
        }
    ];

    // 무한 스크롤 데이터 쿼리
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
        isError,
    } = useInfiniteQuery<{ gatherings: Gathering[], nextPage: number | null }>({
        queryKey,
        queryFn: async ({ pageParam }) => {
            const csrPage = Number(pageParam);

            // 전체 데이터에서 충분히 많은 데이터를 가져와서
            // 진행중 모임만 필터링한 후 CSR에 해당하는 부분만 추출
            let allActiveGatherings: Gathering[] = [];
            let currentOffset = 0; // 현재 오프셋
            let noMoreData = false; // 더 이상 데이터가 없는지 확인

            // 처음부터 끝까지 모든 데이터를 가져와서 진행중 모임만 필터링
            while (!noMoreData && allActiveGatherings.length < GATHERING_CONSTANTS.MAX_ACTIVE_GATHERINGS) {
                const allGatherings = await fetchPaginatedGatherings(
                    Math.floor(currentOffset / GATHERING_CONSTANTS.CSR_PAGE_SIZE),
                    mainType,
                    normalizedLocation || undefined,
                    normalizedDate || undefined,
                    filterSavedIds,
                    sortBy,
                    sortOrder,
                    GATHERING_CONSTANTS.BATCH_SIZE
                );

                // 더 이상 데이터가 없으면 종료
                if (allGatherings.length === 0) {
                    noMoreData = true;
                    break;
                }

                // 진행중 모임만 필터링해서 누적
                const newActiveGatherings = filterActiveGatherings(allGatherings);

                // 중복 제거 후 추가
                const uniqueNewGatherings = newActiveGatherings.filter((gathering: Gathering) =>
                    !allActiveGatherings.some(existing => existing.id === gathering.id)
                );

                allActiveGatherings = allActiveGatherings.concat(uniqueNewGatherings);

                currentOffset += GATHERING_CONSTANTS.BATCH_SIZE;
            }

            // CSR 페이지에 해당하는 10개 추출
            const csrPageStart = GATHERING_CONSTANTS.SSR_COUNT + (csrPage * GATHERING_CONSTANTS.CSR_PAGE_SIZE); // CSR 페이지 시작점
            const csrPageEnd = csrPageStart + GATHERING_CONSTANTS.CSR_PAGE_SIZE; // CSR 페이지 끝부분
            const csrGatherings = allActiveGatherings.slice(csrPageStart, csrPageEnd);

            // 다음 페이지가 있는지 확인
            const hasMore = csrPageEnd < allActiveGatherings.length;
            const nextPage = hasMore ? csrPage + 1 : null;

            return {
                gatherings: csrGatherings,
                nextPage
            };
        },
        getNextPageParam: (lastPage) => {
            return lastPage.nextPage;
        },
        initialPageParam: 0, // CSR은 항상 0페이지부터 시작(SSR은 페이지 X)
        enabled: enabled && infiniteScrollEnabled && hasTriggeredFirstFetch,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    // 모든 페이지의 gatherings만 추출
    const infiniteGatherings = data?.pages.flatMap(page => page.gatherings) || [];

    const observer = useRef<IntersectionObserver | null>(null);

    const lastItemRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    if (!hasTriggeredFirstFetch) {
                        // 첫 번째 페이지 요청 트리거
                        setHasTriggeredFirstFetch(true);
                    } else if (hasNextPage) {
                        // 다음 10개 모임 요청 트리거
                        fetchNextPage();
                    }
                }
            }, {
                rootMargin: '100px',
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