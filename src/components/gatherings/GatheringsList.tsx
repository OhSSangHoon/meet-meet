"use client"

import { useRouter } from "next/navigation";
import { useFetchInfiniteGatherings } from "@/hooks/api/gatherings/useFetchInfiniteGatherings";
import { useMemo, useCallback, useTransition, memo } from 'react';
import { formatDate, formatTime } from '@/utils/shared/date';
import { Gathering } from "@/types/gatherings";
import { UserRoundCheck } from "lucide-react";
import { filterGatheringsByType, getUniqueGatherings } from '@/utils/gatherings/gatheringsUtils';
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import JoinedCountsProgressBar from "@/components/gatherings/shared/JoinedCountsProgressBar";
import DateReminder from '@/components/shared/DateReminder';
import dynamic from 'next/dynamic';

const SaveToggleButton = dynamic(() => import('@/components/shared/SaveToggleButton'), {
    loading: () => <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />,
    ssr: false
});

// 스타일 상수
const BADGE_BASE_STYLES = "inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium rounded-md";
const DEFAULT_TITLE_MAX_LENGTH = 20;

interface GatheringsListProps {
    ssrGatherings: Gathering[];
    activeStartIndex: number;
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
    savedGatheringIds?: string[];
    isFilterChanged?: boolean;
}

// 컴포넌트 외부에 함수 선언
const truncateTitle = (title: string, maxLength: number = DEFAULT_TITLE_MAX_LENGTH): string => {
    if (!title) return '';
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
};

// 정적 컴포넌트들
const GatheringBadges = memo(({ dateTime }: { dateTime: string }) => (
    <div className="flex flex-wrap gap-2 mb-3 -mt-3">
        <span className={`${BADGE_BASE_STYLES} bg-main-400 text-white dark:bg-main-600 dark:text-gray-100`}>
            {formatDate(dateTime)}
        </span>
        <span className={`${BADGE_BASE_STYLES} border-2 border-main-400 text-main-400 dark:border-main-400 dark:text-main-400 dark:bg-none`}>
            {formatTime(dateTime)}
        </span>
    </div>
));

const LoadingState = memo(() => (
    <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors duration-200">
        <div className="flex items-center gap-3 mb-2">
            <div className="size-6 border-3 border-main-400 dark:border-main-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold">로딩 중...</p>
        </div>
        <p>모임을 불러오고 있어요</p>
    </div>
));

const EmptyState = memo(() => (
    <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors duration-200">
        <p className="text-lg font-semibold mb-2">아직 모임이 없어요</p>
        <p>곧 새로운 모임이 열릴 예정이에요</p>
    </div>
));

const InfiniteScrollLoader = memo(() => (
    <div className="w-full h-[80px] flex justify-center items-center">
        <div className="flex items-center gap-3">
            <div className="size-4 border-3 border-main-400 dark:border-main-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-200">더 많은 모임을 불러오는 중...</span>
        </div>
    </div>
));

// 개별 모임 아이템 컴포넌트 memo로 최적화
const GatheringItem = memo(({
    gathering,
    index,
    isLastItem,
    lastItemRef,
    onGatheringClick
}: {
    gathering: Gathering;
    index: number;
    isLastItem: boolean;
    lastItemRef?: (node: HTMLElement | null) => void;
    onGatheringClick: (id: number) => void;
}) => (
    <article
        role="button"
        tabIndex={0}
        key={`${gathering.teamId || 'unknown'}-${gathering.id}-${index}`}
        onClick={() => onGatheringClick(gathering.id)}
        ref={isLastItem ? lastItemRef : undefined}
        className="w-full flex flex-col md:flex-row justify-start border border-gray-200 dark:border-dark-2 dark:bg-dark-2 rounded-2xl bg-white hover:border-main-300 dark:hover:border-main-400 hover:shadow-lg dark:hover:shadow-dark-lg transition-all duration-300 overflow-hidden relative cursor-pointer"
        aria-label={`${gathering.name} 모임`}
    >
        {/* 이미지 영역 */}
        <div className="w-full md:w-80 h-48 md:h-40 flex-shrink-0 relative">
            <DateReminder registrationEnd={gathering.registrationEnd} />
            <ImageWithFallback
                src={gathering.image}
                fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1750048546/error_fallback_icbngz.avif'
                alt={`${gathering.name} 모임 썸네일`}
                width={1000}
                height={1000}
                sizes="(max-width: 401px) 300px, (max-width: 801px) 500px, 1000px"
                priority
                className="w-full h-full rounded-t-2xl md:rounded-l-2xl md:rounded-t-none object-cover pointer-events-none"
            />
        </div>

        <div className="flex-1 flex flex-col justify-between p-4 md:p-6 min-h-0">
            <div className="flex-1 w-full">
                <div className="flex flex-row md:justify-between gap-3">
                    <div className="flex-1 flex flex-row gap-2 items-center">
                        <h2 className="text-sm sm:text-lg font-semibold -mt-6 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                            {truncateTitle(gathering.name)}
                        </h2>
                        <div className="hidden md:block w-[2px] h-[16px] -mt-6 bg-gray-900 dark:bg-gray-300"></div>
                        <p className="text-sm font-medium -mt-6 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                            {gathering.location}
                        </p>
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                        <SaveToggleButton gatheringId={gathering.id.toString()} />
                    </div>
                </div>

                {gathering.dateTime && (
                    <GatheringBadges dateTime={gathering.dateTime} />
                )}
            </div>

            <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <UserRoundCheck className="size-4 text-main-400 dark:text-main-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                        {gathering.participantCount}/{gathering.capacity}
                    </span>
                </div>
                <div className="w-full px-2">
                    <JoinedCountsProgressBar
                        participantCount={gathering.participantCount}
                        capacity={gathering.capacity}
                    />
                </div>
            </div>
        </div>
    </article>
));

export default function GatheringsList({
    ssrGatherings,
    activeStartIndex,
    selectedMainType,
    selectedSubType,
    filters,
    sort,
    enableInfiniteScroll = true,
    savedGatheringIds = [],
    isFilterChanged = false,
}: GatheringsListProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const isSavedPage = savedGatheringIds.length > 0;

    const csrStartIndex = useMemo(() => {
        if (ssrGatherings.length === 0) {
            return activeStartIndex;
        }
        return activeStartIndex + ssrGatherings.length;
    }, [activeStartIndex, ssrGatherings.length]);

    const {
        infiniteGatherings,
        lastItemRef,
        isFetchingNextPage,
        status,
    } = useFetchInfiniteGatherings({
        enabled: enableInfiniteScroll && !isSavedPage,
        mainType: selectedMainType,
        location: filters.location,
        date: filters.date,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
        startIndex: csrStartIndex,
    });

    const filteredSSRGatherings = useMemo(() => {
        return filterGatheringsByType(ssrGatherings, selectedMainType, selectedSubType);
    }, [ssrGatherings, selectedMainType, selectedSubType]);

    const filteredCSRGatherings = useMemo(() => {
        if (isSavedPage) return [];
        return filterGatheringsByType(infiniteGatherings, selectedMainType, selectedSubType);
    }, [infiniteGatherings, selectedMainType, selectedSubType, isSavedPage]);


    const allGatherings = useMemo(() => {
        if (isSavedPage) return filteredSSRGatherings;
        const uniqueCSRGatherings = getUniqueGatherings(filteredCSRGatherings, filteredSSRGatherings);
        return filteredSSRGatherings.concat(uniqueCSRGatherings);
    }, [filteredSSRGatherings, filteredCSRGatherings, isSavedPage]);

    // useCallback으로 함수 최적화 + useTransition 적용
    const handleGatheringClick = useCallback((gatheringId: number) => {
        startTransition(() => {
            router.push(`/gatherings/detail/${gatheringId}`);
        });
    }, [router]);

    const isLoading = isFilterChanged || (enableInfiniteScroll && !isSavedPage && status === 'pending') || isPending;
    const isEmpty = allGatherings.length === 0 && !isLoading;

    return (
        <section
            className="w-full flex flex-col justify-start gap-5"
            aria-label="모임 목록"
        >
            {allGatherings.map((gathering: Gathering, index: number) => {
                const isLastItem = index === allGatherings.length - 1;
                const shouldAttachRef = isLastItem && !isFetchingNextPage && enableInfiniteScroll && !isSavedPage;

                return (
                    <GatheringItem
                        key={`${gathering.teamId || 'unknown'}-${gathering.id}-${index}`}
                        gathering={gathering}
                        index={index}
                        isLastItem={isLastItem}
                        lastItemRef={shouldAttachRef ? lastItemRef : undefined}
                        onGatheringClick={handleGatheringClick}
                    />
                );
            })}

            {/* 상태별 컴포넌트 */}
            {enableInfiniteScroll && isFetchingNextPage && <InfiniteScrollLoader />}
            {isLoading && <LoadingState />}
            {isEmpty && <EmptyState />}
        </section>
    );
}