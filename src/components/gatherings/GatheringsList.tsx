"use client"

import { useState, useRef, useCallback, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchGatheringsPaginated } from "@/components/gatherings/shared/utils/fetch";
import { AuthContext } from "@/providers/AuthProvider";
import { useSavedGatherings } from "@/components/gatherings/shared/hooks/useSavedGatherings";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Gathering, GatheringsListProps } from "@/types/gatherings"; // ✅ 경로 변경
import { formatDate, formatTime, getTimeRemaining } from '@/components/shared/utils/format'; // ✅ format 함수 import

// 모임 목록 컴포넌트
export default function GatheringsList({
    gatherings: propGatherings = [],
    fetchFromApi = true
}: GatheringsListProps) {
    const { token } = useContext(AuthContext);
    const { savedIds, toggleSaved, isToggling } = useSavedGatherings();

    const observerRef = useRef<IntersectionObserver | null>(null);
    const router = useRouter();


    // 무한스크롤 활성화 상태
    const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false);

    // SSR 데이터 확인
    const hasSSRData = propGatherings.length > 0;
    
    // 무한스크롤 쿼리 
    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['gatherings', 'infinite'],
        queryFn: ({ pageParam = 2 }) => {
            return fetchGatheringsPaginated(pageParam, 10, token || '');
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || lastPage.length < 5) {
                return undefined;
            }
            const nextPage = allPages.length + 2;
            return nextPage;
        },
        initialPageParam: 2,
        enabled: infiniteScrollEnabled && hasSSRData && fetchFromApi,
        refetchOnWindowFocus: false,
    });

    // 처음 관찰될 때 무한스크롤 활성화
    const lastItemRef = useCallback((node: HTMLDivElement | null) => {
        if (!hasSSRData || !fetchFromApi) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (!infiniteScrollEnabled) {
                    setInfiniteScrollEnabled(true);
                } else if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '5px'
        });

        if (node) observerRef.current.observe(node);
    }, [hasSSRData, fetchFromApi, infiniteScrollEnabled, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // 전체 모임 데이터 합치기
    const allGatherings = (() => {
        const gatherings = [...propGatherings];

        if (hasSSRData && fetchFromApi && infiniteScrollEnabled && infiniteData?.pages) {
            infiniteData.pages.forEach(page => {
                gatherings.push(...page);
            });
        }

        return gatherings;
    })();

    // 최종 모임 목록
    const finalGatherings = fetchFromApi 
        ? (hasSSRData ? allGatherings : [])  // 메인 페이지: SSR + 무한스크롤
        : propGatherings;                    // 찜목록: 전달받은 데이터 그대로
    
    const isInitialLoading = fetchFromApi && !hasSSRData;

    
    return (
        <div className="w-full flex flex-col justify-start gap-5">
            {/* 모임 목록 */}
            {!isInitialLoading && finalGatherings.map((gathering: Gathering, index: number) => {
                const isSaved = savedIds.includes(gathering.id.toString());
                const isLastItem = index === finalGatherings.length - 1;

                return (
                    <section
                        role="button"
                        tabIndex={0}
                        key={`${gathering.teamId || 'unknown'}-${gathering.id}`}
                        onClick={() => router.push(`/gatherings/detail/${gathering.id}`)}
                        ref={isLastItem && hasSSRData && fetchFromApi ? lastItemRef : undefined}
                        className="w-full sm:h-[156px] flex flex-col sm:flex-row justify-start border-1 border-gray-100 rounded-lg bg-white hover:border-main-100 hover:shadow-md transition-all duration-300"
                    >
                        {/* 이미지 */}
                        <div className="w-full sm:w-1/3 h-[200px] sm:h-full relative">
                            <Image 
                                src={gathering.image} 
                                alt="모임 이미지"
                                fill
                                className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none object-cover pointer-events-none"
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute top-0 right-0 bg-main-600 rounded-bl-lg px-3 py-1 flex justify-center items-center gap-2 z-10">
                                <Image src={"/icons/Alarm.svg"} alt="시간" width={24} height={24} />
                                <span className="font-medium text-white">{getTimeRemaining(gathering.registrationEnd)}</span>
                            </div>
                        </div>

                        {/* 텍스트 정보와 버튼 */}
                        <div className="w-full flex flex-col sm:flex-row">
                            {/* 텍스트 정보 */}
                            <div className="flex-1 flex flex-col p-4">
                                {/* 제목과 위치 */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                                    <h1 className="text-lg font-semibold text-gray-900">{gathering.name}</h1>
                                    <div className="hidden sm:block w-[2px] h-[16px] bg-gray-900"></div>
                                    <p className="text-gray-700 text-sm font-medium">{gathering.location}</p>
                                    <div className="flex justify-end sm:justify-start ml-auto">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // ✅ 이벤트 버블링 방지
                                                toggleSaved(gathering.id.toString());
                                            }}
                                            disabled={isToggling}
                                            className={`w-[50px] h-[50px] rounded-full border-2 ${
                                                isSaved 
                                                    ? 'bg-main-100 border-main-300 text-main-700' 
                                                    : 'bg-white border-main-100'
                                            }`}
                                        >
                                            {isSaved ? (
                                                <svg width="50" height="50" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.22535 12.9541L11.7017 16.2198C11.8214 16.3322 11.8813 16.3885 11.9518 16.4023C11.9836 16.4086 12.0163 16.4086 12.0482 16.4023C11.1187 16.3885 12.1786 16.3322 12.2983 16.2198L15.7747 12.9541C16.7527 12.0353 16.8715 10.5233 16.0489 9.46307L15.8942 9.26367C14.9101 7.99531 12.9348 8.20801 12.2433 9.65687C12.1456 9.86152 11.8544 9.86152 11.7567 9.65687C11.0652 8.20801 9.08985 7.99531 8.10573 9.26367L7.95108 9.46307C7.12847 10.5233 7.24723 12.0353 8.22535 12.9541Z" fill="oklch(0.49 0.28 296)" stroke="oklch(0.49 0.28 296)"/>
                                                </svg>
                                            ) : (
                                                <svg width="50" height="50" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.22535 12.9541L11.7017 16.2198C11.8214 16.3322 11.8813 16.3885 11.9518 16.4023C11.9836 16.4086 12.0163 16.4086 12.0482 16.4023C12.1187 16.3885 12.1786 16.3322 12.2983 16.2198L15.7747 12.9541C16.7527 12.0353 16.8715 10.5233 16.0489 9.46307L15.8942 9.26367C14.9101 7.99531 12.9348 8.20801 12.2433 9.65687C12.1456 9.86152 11.8544 9.86152 11.7567 9.65687C11.0652 8.20801 9.08985 7.99531 8.10573 9.26367L7.95108 9.46307C7.12847 10.5233 7.24723 12.0353 8.22535 12.9541Z" stroke="oklch(0.61 0.24 296)"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* 날짜와 시간 */}
                                <div className="flex gap-2 font-medium text-sm mb-3 text-center">
                                    {gathering.dateTime && (
                                        <>
                                            <p className="min-w-20 border-2 bg-main-500 text-white border-main-500 rounded-sm py-1 px-2">
                                                {formatDate(gathering.dateTime)}
                                            </p>
                                            <p className="min-w-16 border-2 border-main-500 text-main-700 rounded-sm py-1 px-2">
                                                {formatTime(gathering.dateTime)}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* 인원 수 */}
                                <div className="flex items-center gap-1 font-medium text-sm">
                                    <Image src={"/icons/person.svg"} alt="인원 수" width={16} height={16} style={{ width: '19px', height: '19px' }} />
                                    <p className="text-gray-700 text-sm font-medium">{gathering.participantCount}/{gathering.capacity}</p>
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
                        <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 font-medium">더 많은 모임을 불러오는 중...</span>
                    </div>
                </div>
            )}

            {/* 빈 목록 */}
            {!isInitialLoading && finalGatherings.length === 0 && (
                <div className="w-full h-[100px] flex justify-center items-center border-2 border-gray-500">
                    <p className="text-gray-600 font-medium">아직 모임이 없어요</p>
                    <p className="text-gray-600 font-medium">지금 바로 모임을 만들어보세요</p>
                </div>
            )}
        </div>
    );
}