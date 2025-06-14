"use client"

import { useRouter } from "next/navigation";
import { useFetchInfiniteGatherings } from "@/hooks/api/gatherings/useFetchInfiniteGatherings";
import { useMemo } from 'react';
import { formatDate, formatTime } from '@/components/shared/utils/dateFormats';
import { Gathering } from "@/types/gatherings";
import { UserRoundCheck } from "lucide-react";
import dynamic from 'next/dynamic';
import { filterGatheringsByType, getUniqueGatherings } from '@/components/gatherings/shared/utils/gatheringsUtils';
import ImageWithFallback from "@/components/shared/ui/ImageWithFallback";

const JoinedCountsProgressBar = dynamic(() => import('@/components/gatherings/shared/ui/JoinedCountsProgressBar'), { ssr: false });
const SaveToggleButton = dynamic(() => import('@/components/gatherings/shared/ui/SaveToggleButton'), { ssr: false });
const DateReminder = dynamic(() => import('@/components/shared/ui/DateReminder'), { ssr: false });

// 스타일 상수
const BADGE_BASE_STYLES = "inline-flex items-center px-3 py-1 text-sm font-medium rounded-md";

// 매직넘버 상수
const DEFAULT_TITLE_MAX_LENGTH = 20; // 제목 최대 길이

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
}

const truncateTitle = (title: string, maxLength: number = DEFAULT_TITLE_MAX_LENGTH): string => {
    if (!title) return '';
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
};

export default function GatheringsList({
    ssrGatherings,
    activeStartIndex,
    selectedMainType,
    selectedSubType,
    filters,
    sort,
    enableInfiniteScroll = true,
    savedGatheringIds = [],
}: GatheringsListProps) {
    const router = useRouter();
    const isSavedPage = savedGatheringIds.length > 0;

    const csrStartIndex = useMemo(() => {
        if (ssrGatherings.length === 0) {
            return activeStartIndex;
        }

        const calculatedIndex = activeStartIndex + ssrGatherings.length;
        return calculatedIndex;
    }, [activeStartIndex, ssrGatherings.length]);

    const {
        infiniteGatherings,
        lastItemRef,
        isFetchingNextPage,
        isLoading,
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
        if (isSavedPage) {
            return [];
        }

        return filterGatheringsByType(infiniteGatherings, selectedMainType, selectedSubType);
    }, [infiniteGatherings, selectedMainType, selectedSubType, isSavedPage]);

    const allGatherings = useMemo(() => {
        if (isSavedPage) {
            return filteredSSRGatherings;
        }

        const uniqueCSRGatherings = getUniqueGatherings(filteredCSRGatherings, filteredSSRGatherings);
        return filteredSSRGatherings.concat(uniqueCSRGatherings);
    }, [filteredSSRGatherings, filteredCSRGatherings, isSavedPage]);

    return (
        <div className="w-full flex flex-col justify-start gap-5">
            {allGatherings.map((gathering: Gathering, index: number) => {
                const isLastItem = index === allGatherings.length - 1;

                return (
                    <section
                        role="button"
                        tabIndex={0}
                        key={`${gathering.teamId || 'unknown'}-${gathering.id}-${index}`}
                        onClick={() => router.push(`/gatherings/detail/${gathering.id}`)}
                        ref={isLastItem && !isFetchingNextPage && enableInfiniteScroll && !isSavedPage ? lastItemRef : undefined}
                        className="w-full flex flex-col md:flex-row justify-start border border-gray-200 dark:border-dark-2 dark:bg-dark-2 rounded-2xl bg-white hover:border-main-300 dark:hover:border-main-400 hover:shadow-lg dark:hover:shadow-dark-lg transition-all duration-300 overflow-hidden relative cursor-pointer"
                    >
                        <div className="w-full md:w-80 h-48 md:h-40 relative flex-shrink-0">
                            <DateReminder registrationEnd={gathering.registrationEnd} />
                            <ImageWithFallback
                                src={gathering.image}
                                fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1749802823/fallback_otg1es.avif'
                                alt="모임 썸네일"
                                className="rounded-t-lg md:rounded-l-lg md:rounded-t-none object-cover pointer-events-none"
                                width={320}
                                height={180}
                            />
                        </div>

                        <div className="flex-1 flex flex-col justify-between p-4 md:p-6 min-h-0">
                            <div className="flex-1 w-full">
                                <div className="flex flex-row md:justify-between gap-3">
                                    <div className="flex-1 flex flex-row gap-2 items-center">
                                        <h1 className="text-lg font-semibold -mt-6 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                                            {truncateTitle(gathering.name)}
                                        </h1>
                                        <div className="hidden sm:block w-[2px] h-[16px] -mt-6 bg-gray-900 dark:bg-gray-300"></div>
                                        <p className="text-sm font-medium -mt-6 text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                            {gathering.location}
                                        </p>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                                        <SaveToggleButton gatheringId={gathering.id.toString()} />
                                    </div>
                                </div>

                                {gathering.dateTime && (
                                    <div className="flex flex-wrap gap-2 mb-3 -mt-3">
                                        <span className={`${BADGE_BASE_STYLES} bg-main-500 text-white dark:bg-main-600 dark:text-gray-100`}>
                                            {formatDate(gathering.dateTime)}
                                        </span>
                                        <span className={`${BADGE_BASE_STYLES} border-2 border-main-500 text-main-600 dark:border-main-400 dark:text-main-400 dark:bg-none`}>
                                            {formatTime(gathering.dateTime)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <UserRoundCheck className="w-4 h-4 text-main-500 dark:text-main-400" />
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
                    </section>
                );
            })}

            {enableInfiniteScroll && isFetchingNextPage && (
                <div className="w-full h-[80px] flex justify-center items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-3 border-main-500 dark:border-main-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-200">더 많은 모임을 불러오는 중...</span>
                    </div>
                </div>
            )}

            {!isLoading && allGatherings.length === 0 && (
                <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors duration-200">
                    <p className="text-lg font-semibold mb-2">아직 모임이 없어요</p>
                    <p>곧 새로운 모임이 열릴 예정이에요</p>
                </div>
            )}
        </div>
    );
}