"use client"

import { useRouter } from "next/navigation";
import { useFetchInfiniteGatherings } from "@/hooks/api/gatherings/useFetchInfiniteGatherings";
import { useGatheringsStore } from '@/store/gatheringsStore';
import { useMemo } from 'react';
import { formatDate, formatTime, getTimeRemaining, isSameDateForFilter } from '@/components/shared/utils/dateFormats';
import { Gathering, GatheringsListProps } from "@/types/gatherings";
import { UserRoundCheck } from "lucide-react";
import Image from "next/image";
import dynamic from 'next/dynamic';

const JoinedCountsProgressBar = dynamic(() => import('@/components/gatherings/shared/ui/JoinedCountsProgressBar'), { ssr: false });
const SaveToggleButton = dynamic(() => import('@/components/gatherings/shared/ui/SaveToggleButton'), { ssr: false });
const OverlayForDisabled = dynamic(() => import('@/components/shared/ui/OverlayForDisabled'), { ssr: false });
const DateReminder = dynamic(() => import('@/components/shared/ui/DateReminder'), { ssr: false });

/**
 * 모임 목록 프로퍼티 확장
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 */
interface ExtendedGatheringsListProps extends GatheringsListProps {
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
}

/**
 * 모임 필터링
 * @param gatheringsList 모임 목록
 * @param selectedMainType 모임 주제
 * @param selectedSubType 모임 서브타입
 * @returns 필터링된 모임 목록
 */
const filterGatherings = (
    gatheringsList: Gathering[],
    selectedMainType: string,
    selectedSubType: string
): Gathering[] => {
    let filtered: Gathering[];

    if (selectedMainType === 'DORANDORAN') {
        // 도란도란 = WORKATION만
        filtered = gatheringsList.filter(gathering => gathering.type === 'WORKATION');
    } else {
        // 북적북적 (DALLAEMFIT)
        if (selectedSubType === 'ALL') {
            // 전체 = OFFICE_STRETCHING + MINDFULNESS
            filtered = gatheringsList.filter(gathering =>
                gathering.type === 'OFFICE_STRETCHING' ||
                gathering.type === 'MINDFULNESS'
            );
        } else {
            // 특정 서브타입만
            filtered = gatheringsList.filter(gathering => gathering.type === selectedSubType);
        }
    }

    return filtered;
};

/**
 * 모임 목록 컴포넌트
 * @param gatherings 모임 목록
 * @param fetchFromApi 모임 목록 조회 여부
 * @param selectedMainType 모임 주제
 * @param selectedSubType 모임 서브타입
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 */
export default function GatheringsList({
    gatherings,
    fetchFromApi = true,
    selectedMainType = 'DALLAEMFIT',
    selectedSubType = 'ALL',
    location = '',
    date = '',
    sortBy = 'registrationEnd',
    sortOrder = 'desc',
}: ExtendedGatheringsListProps) {
    const router = useRouter();
    const ssrGatherings = useGatheringsStore((s) => s.gatherings);

    const {
        infiniteGatherings,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
        isLoading,
    } = useFetchInfiniteGatherings({
        enabled: fetchFromApi,
        mainType: selectedMainType,
        location,
        date,
        sortBy,
        sortOrder,
    });

    /**
     * 위치/날짜 필터링 함수 추가
     */
    const filterByLocationAndDate = (
        gatheringsList: Gathering[],
        location: string,
        date: string
    ): Gathering[] => {
        return gatheringsList.filter(gathering => {
            // 위치 필터
            if (location && gathering.location !== location) {
                return false;
            }

            // 날짜 필터 (모임 개최일 기준)
            if (date && gathering.dateTime) {
                if (!isSameDateForFilter(gathering.dateTime, date)) {
                    return false;
                }
            }

            return true;
        });
    };

    // 모임 목록 필터링
    const mergedGatherings = useMemo(() => {
        // API를 사용하지 않는 경우 (찜목록 등)
        if (!fetchFromApi) {
            return filterGatherings(gatherings || [], selectedMainType, selectedSubType);
        }

        const hasActiveFilters = location || date;

        // 무한스크롤 데이터가 있으면 우선 사용
        if (infiniteGatherings.length > 0) {
            return filterGatherings(infiniteGatherings, selectedMainType, selectedSubType);
        }

        // 무한스크롤 데이터가 없을 때 SSR 사용
        if (hasActiveFilters) {
            // 타입 필터링
            const typeFiltered = filterGatherings(ssrGatherings, selectedMainType, selectedSubType);
            // 위치/날짜 필터링
            const clientFiltered = filterByLocationAndDate(typeFiltered, location, date);
            // 조건에 맞는 게 없으면 빈 배열
            return clientFiltered;
        } else {
            // 필터가 없으면 SSR 데이터 그대로 사용
            return filterGatherings(ssrGatherings, selectedMainType, selectedSubType);
        }
    }, [
        fetchFromApi,
        infiniteGatherings,
        ssrGatherings,
        selectedMainType,
        selectedSubType,
        location,
        date,
        gatherings
    ]);

    // 초기 로딩 여부
    const hasActiveFilters = location || date;
    const isInitialLoading = fetchFromApi && isLoading && infiniteGatherings.length === 0 &&
        (hasActiveFilters || ssrGatherings.length === 0);

    // 마감 여부
    const isExpired = (gathering: Gathering): boolean => {
        if (!gathering.registrationEnd) return false;
        return getTimeRemaining(gathering.registrationEnd) === '마감됨';
    };

    return (
        <div className="w-full flex flex-col justify-start gap-5">
            {!isInitialLoading && mergedGatherings.map((gathering: Gathering, index: number) => {
                const isLastItem = index === mergedGatherings.length - 1;
                const expired = isExpired(gathering);

                return (
                    <section
                        role="button"
                        tabIndex={0}
                        key={`${gathering.teamId || 'unknown'}-${gathering.id}-${index}`}
                        onClick={expired ? undefined : () => router.push(`/gatherings/detail/${gathering.id}`)}
                        ref={isLastItem && fetchFromApi ? lastItemRef : undefined}
                        className="w-full flex flex-col md:flex-row justify-start border border-gray-200 rounded-2xl bg-white hover:border-main-300 hover:shadow-lg transition-all duration-300 overflow-hidden relative"
                    >
                        {/* 오버레이 컴포넌트 */}
                        <OverlayForDisabled
                            emoji=""
                            filterings={expired}
                            notice="마감된 챌린지에요,"
                            reason="다음 기회에 만나요🙌"
                        />

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
                            {/* 마감 시간 배지 */}
                            <DateReminder registrationEnd={gathering.registrationEnd} />
                        </div>

                        {/* 콘텐츠 영역 */}
                        <div className="flex-1 flex flex-col justify-between p-4 md:p-6 min-h-0">
                            {/* 상단 영역 */}
                            <div className="flex-1 w-full">
                                {/* 제목과 위치 */}
                                <div className="flex flex-row md:justify-between gap-3">
                                    <div className="flex-1 flex flex-row gap-2 items-center">
                                        <h1 className={`text-lg font-semibold -mt-6 ${expired ? 'text-gray-500' : 'text-gray-900'
                                            }`}>
                                            {gathering.name}
                                        </h1>
                                        <div className={`hidden sm:block w-[2px] h-[16px] -mt-6 ${expired ? 'bg-gray-500' : 'bg-gray-900'
                                            }`}></div>
                                        <p className={`text-sm font-medium -mt-6 ${expired ? 'text-gray-500' : 'text-gray-700'
                                            }`}>
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
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${expired
                                            ? 'bg-gray-400 text-white'
                                            : 'bg-main-500 text-white'
                                            }`}>
                                            {formatDate(gathering.dateTime)}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 border-2 text-sm font-medium rounded-md ${expired
                                            ? 'border-gray-400 text-gray-500'
                                            : 'border-main-500 text-main-600'
                                            }`}>
                                            {formatTime(gathering.dateTime)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* 하단 영역 */}
                            <div className="flex flex-row items-center justify-between">
                                {/* 참여 인원 */}
                                <div className="flex items-center gap-2">
                                    <UserRoundCheck className={`w-4 h-4 ${expired ? 'text-gray-400' : 'text-main-500'
                                        }`} />
                                    <span className={`text-sm font-medium ${expired ? 'text-gray-500' : 'text-gray-700'
                                        }`}>
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
                    </section>
                );
            })}

            {/* 무한스크롤 로딩 */}
            {infiniteScrollEnabled && isFetchingNextPage && (
                <div className="w-full h-[80px] flex justify-center items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-3 border-main-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 font-medium">더 많은 모임을 불러오는 중...</span>
                    </div>
                </div>
            )}

            {/* 빈 목록 메시지 */}
            {!isInitialLoading && mergedGatherings.length === 0 && (
                <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500 font-medium text-sm">
                    {fetchFromApi ? (
                        hasActiveFilters ? (
                            <>
                                <p className="">선택한 조건에 맞는 모임이 없어요,</p>
                                <p className="">다른 조건으로 검색해보세요</p>
                            </>
                        ) : (
                            <>
                                <p className="">아직 모임이 없어요,</p>
                                <p className="">지금 모임을 만들어보세요</p>
                            </>
                        )
                    ) : (
                        <>
                            <p className="">아직 찜한 모임이 없어요</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}