"use client"

import { useRouter } from "next/navigation";
import { useFetchInfiniteGatherings } from "@/hooks/api/gatherings/useFetchInfiniteGatherings";
import { useGatheringsStore } from '@/store/gatheringsStore';
import { Gathering, GatheringsListProps } from "@/types/gatherings";
import { formatDate, formatTime, getTimeRemaining } from '@/components/shared/utils/date';
import { filterGatherings } from '@/components/gatherings/shared/utils/fetch';
import { UserRoundCheck } from "lucide-react"
import Image from "next/image";
import JoinedCountsProgressBar from './shared/ui/JoinedCountsProgressBar';
import SaveToggleButton from './shared/ui/SaveToggleButton';

interface ExtendedGatheringsListProps extends GatheringsListProps {
    location?: string;
    date?: string;
    sortOrder?: 'asc' | 'desc';
}

export default function GatheringsList({
    gatherings,
    fetchFromApi = true,
    selectedMainType = 'DALLAEMFIT',
    selectedSubType = 'ALL',
    location = '',
    date = '',
    sortOrder = 'asc'
}: ExtendedGatheringsListProps) {
    const router = useRouter();
    const ssrGatherings = useGatheringsStore((s) => s.gatherings);
    const hasSSRData = ssrGatherings.length > 0;

    const {
        infiniteGatherings,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
    } = useFetchInfiniteGatherings({
        enabled: fetchFromApi,
        mainType: selectedMainType,
        location,
        date,
        sortBy: 'registrationEnd',
        sortOrder
    });

    // 데이터 합치기 시 정렬 순서 유지
    const mergedGatherings = (() => {
        if (!fetchFromApi) {
            // API를 사용하지 않는 경우 (찜목록 등)
            return filterGatherings(gatherings || ssrGatherings, selectedMainType, selectedSubType);
        }

        if (!hasSSRData) {
            return filterGatherings(infiniteGatherings, selectedMainType, selectedSubType);
        }

        const serverSortedData = infiniteGatherings.length > 0 ? infiniteGatherings : ssrGatherings;

        return filterGatherings(serverSortedData, selectedMainType, selectedSubType);
    })();

    const isInitialLoading = fetchFromApi && !hasSSRData && infiniteGatherings.length === 0;

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
                        className={`w-full flex flex-col md:flex-row justify-start border border-gray-200 rounded-2xl bg-white hover:border-main-300 hover:shadow-lg transition-all duration-300 overflow-hidden relative `}
                    >
                        {/* 마감된 모임 오버레이 */}
                        {expired && (
                            <div className="absolute bg-black/90 inset-0 z-10 flex items-center justify-center text-center">
                                <div className="px-4 py-2 black-bg rounded-lg flex flex-col text-sm text-white">
                                    <span className="">마감된 챌린지에요,</span>
                                    <span className="">다음 기회에 만나요🙌</span>
                                </div>
                            </div>
                        )}

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
                            <div className={`absolute top-3 left-3 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-sm ${expired
                                ? 'bg-gray-600'
                                : 'bg-main-600'
                                }`}>
                                <Image src={"/icons/Alarm.svg"} alt="시간" width={16} height={16} />
                                <span className="text-sm font-medium text-white">
                                    {getTimeRemaining(gathering.registrationEnd)}
                                </span>
                            </div>
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

            {/* 빈 목록 - 페이지별 다른 메시지 */}
            {!isInitialLoading && mergedGatherings.length === 0 && (
                <div className="w-full h-[100px] flex flex-col justify-center items-center text-gray-500 font-medium text-sm">
                    {fetchFromApi ? (
                        // 모임찾기 페이지 (API 데이터 사용)
                        <>
                            <p className="">아직 모임이 없어요,</p>
                            <p className="">지금 모임을 만들어보세요</p>
                        </>
                    ) : (
                        // 찜목록 페이지 (Props 데이터 사용)
                        <>
                            <p className="">아직 찜한 모임이 없어요</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}