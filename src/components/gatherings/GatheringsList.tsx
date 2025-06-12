"use client"

import { useRouter } from "next/navigation";
import { useFetchInfiniteGatherings } from "@/hooks/api/gatherings/useFetchInfiniteGatherings";
import { useMemo } from 'react';
import { formatDate, formatTime, getTimeRemaining } from '@/components/shared/utils/dateFormats';
import { Gathering } from "@/types/gatherings";
import { UserRoundCheck } from "lucide-react";
import Image from "next/image";
import dynamic from 'next/dynamic';

const JoinedCountsProgressBar = dynamic(() => import('@/components/gatherings/shared/ui/JoinedCountsProgressBar'), { ssr: false });
const SaveToggleButton = dynamic(() => import('@/components/gatherings/shared/ui/SaveToggleButton'), { ssr: false });
const DateReminder = dynamic(() => import('@/components/shared/ui/DateReminder'), { ssr: false });
const OverlayForDisabled = dynamic(() => import('@/components/shared/ui/OverlayForDisabled'), { ssr: false });

/**
 * 모임 목록 컴포넌트 props
 * @param ssrGatherings 서버 렌더링 모임 목록
 * @param selectedMainType 선택된 모임 주제
 * @param selectedSubType 선택된 모임 서브타입
 * @param filters 필터 조건
 * @param sort 정렬 조건
 * @param enableInfiniteScroll 무한 스크롤 활성화 여부
 * @param savedGatheringIds 찜한 모임 ID 목록
 */
interface GatheringsListProps {
    ssrGatherings: Gathering[];
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

/**
 * 모임 타입 필터링
 * @param gatheringsList 모임 목록
 * @param selectedMainType 선택된 모임 주제
 * @param selectedSubType 선택된 모임 서브타입
 * @returns 필터링된 모임 목록
 */
const filterGatheringsByType = (
    gatheringsList: Gathering[],
    selectedMainType: string,
    selectedSubType: string
): Gathering[] => {

    if (selectedMainType === 'DORANDORAN') {
        const result = gatheringsList.filter(gathering => gathering.type === 'WORKATION');
        return result;
    } else {
        if (selectedSubType === 'ALL') {
            const result = gatheringsList.filter(gathering =>
                gathering.type === 'OFFICE_STRETCHING' ||
                gathering.type === 'MINDFULNESS'
            );

            return result;
        } else {
            const result = gatheringsList.filter(gathering => gathering.type === selectedSubType);
            return result;
        }
    }
};

/**
 * 중복 제거 함수
 * @param gatherings 모임 목록
 * @returns 중복 제거된 모임 목록
 */
const removeDuplicateGatherings = (gatherings: Gathering[]): Gathering[] => {
    const seen = new Set<number>();
    const duplicates: Gathering[] = [];

    const result = gatherings.filter(gathering => {
        if (seen.has(gathering.id)) {
            duplicates.push(gathering);
            return false;
        }
        seen.add(gathering.id);
        return true;
    });
    return result;
};

/**
 * 모임이 마감되었는지 확인하는 함수
 * @param gathering 모임 정보
 * @returns 마감 여부
 */
const isGatheringClosed = (gathering: Gathering): boolean => {
    if (!gathering.registrationEnd) return false;

    const timeRemaining = getTimeRemaining(gathering.registrationEnd);
    return timeRemaining === '마감됨';
};

export default function GatheringsList({
    ssrGatherings,
    selectedMainType,
    selectedSubType,
    filters,
    sort,
    enableInfiniteScroll = true,
    savedGatheringIds = [],
}: GatheringsListProps) {
    const router = useRouter();
    const isSavedPage = savedGatheringIds.length > 0;

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
        startPage: 1,
    });

    // SSR 데이터 타입
    const filteredSSRGatherings = useMemo(() => {
        const result = filterGatheringsByType(ssrGatherings, selectedMainType, selectedSubType);

        return result;
    }, [ssrGatherings, selectedMainType, selectedSubType]);

    // CSR 데이터 타입 필터링
    const filteredCSRGatherings = useMemo(() => {
        if (isSavedPage) {
            return [];
        }

        const result = filterGatheringsByType(infiniteGatherings, selectedMainType, selectedSubType);

        return result;
    }, [infiniteGatherings, selectedMainType, selectedSubType, isSavedPage]);

    // 중복 제거된 최종 모임 목록
    const allGatherings = useMemo(() => {
        const combined = [...filteredSSRGatherings, ...filteredCSRGatherings];
        const deduplicated = removeDuplicateGatherings(combined);

        return deduplicated;
    }, [filteredSSRGatherings, filteredCSRGatherings]);

    //제목 자르기
    const truncateTitle = (title: string, maxLength: number = 20): string => {
        if (!title) return '';
        return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
    };

    return (
        <div className="w-full flex flex-col justify-start gap-5">
            {allGatherings.map((gathering: Gathering, index: number) => {
                const isLastItem = index === allGatherings.length - 1;
                const isClosed = isGatheringClosed(gathering);

                return (
                    <section
                        role="button"
                        tabIndex={0}
                        key={`${gathering.teamId || 'unknown'}-${gathering.id}-${index}`}
                        onClick={() => !isClosed && router.push(`/gatherings/detail/${gathering.id}`)}
                        ref={isLastItem && !isFetchingNextPage && enableInfiniteScroll && !isSavedPage ? lastItemRef : undefined}
                        className={`w-full flex flex-col md:flex-row justify-start border border-gray-200 rounded-2xl bg-white transition-all duration-300 overflow-hidden relative ${isClosed
                                ? 'cursor-not-allowed opacity-75'
                                : 'hover:border-main-300 hover:shadow-lg cursor-pointer'
                            }`}
                    >
                        {/* 이미지 영역 */}
                        <div className="w-full md:w-80 h-48 md:h-40 relative flex-shrink-0">
                            <Image
                                src={gathering.image}
                                alt="모임 이미지"
                                fill
                                className="rounded-t-lg md:rounded-l-lg md:rounded-t-none object-cover pointer-events-none"
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, 320px"
                            />
                            <DateReminder registrationEnd={gathering.registrationEnd} />
                        </div>

                        {/* 콘텐츠 영역 */}
                        <div className="flex-1 flex flex-col justify-between p-4 md:p-6 min-h-0">
                            {/* 상단 영역 */}
                            <div className="flex-1 w-full">
                                {/* 제목과 위치 */}
                                <div className="flex flex-row md:justify-between gap-3">
                                    <div className="flex-1 flex flex-row gap-2 items-center">
                                        <h1 className="text-lg font-semibold -mt-6">
                                            {truncateTitle(gathering.name)}
                                        </h1>
                                        <div className="hidden sm:block w-[2px] h-[16px] -mt-6 bg-gray-900"></div>
                                        <p className="text-sm font-medium -mt-6 text-gray-700">
                                            {gathering.location}
                                        </p>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                                        <SaveToggleButton gatheringId={gathering.id.toString()} />
                                    </div>
                                </div>

                                {/* 날짜와 시간 */}
                                {gathering.dateTime && (
                                    <div className="flex flex-wrap gap-2 mb-3 -mt-3">
                                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md bg-main-500 text-white">
                                            {formatDate(gathering.dateTime)}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 border-2 text-sm font-medium rounded-md border-main-500 text-main-600">
                                            {formatTime(gathering.dateTime)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* 하단 영역 */}
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <UserRoundCheck className="w-4 h-4 text-main-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {gathering.participantCount}/{gathering.capacity}
                                    </span>
                                </div>
                                <div className='w-full px-2'>
                                    <JoinedCountsProgressBar
                                        participantCount={gathering.participantCount}
                                        capacity={gathering.capacity}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 마감된 모임에 오버레이 적용 */}
                        <OverlayForDisabled
                            emoji=''
                            filterings={isClosed}
                            notice="모집 마감"
                            reason="등록 기간이 종료되었습니다"
                        />
                    </section>
                );
            })}

            {/* 무한스크롤 로딩 */}
            {enableInfiniteScroll && isFetchingNextPage && (
                <div className="w-full h-[80px] flex justify-center items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-3 border-main-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 font-medium">더 많은 모임을 불러오는 중...</span>
                    </div>
                </div>
            )}

            {/* 빈 목록 메시지 */}
            {!isLoading && allGatherings.length === 0 && (
                <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500 font-medium text-sm">
                    <p className="text-lg font-semibold mb-2">아직 모임이 없어요</p>
                    <p>곧 새로운 모임이 열릴 예정이에요</p>
                </div>
            )}
        </div>
    );
}