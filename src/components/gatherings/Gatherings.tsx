"use client"

import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { useGatheringsStore } from '@/store/gatheringsStore';
import { Gathering } from "@/types/gatherings";
import dynamic from "next/dynamic";

const CreateGatheringModal = dynamic(() => import('@/components/gatherings/CreateGatheringDialog'), { ssr: false });
const GatheringsList = dynamic(() => import('@/components/gatherings/GatheringsList'), { ssr: false });
const GatheringFilters = dynamic(() => import('@/components/gatherings/shared/ui/GatheringsFilters'), { ssr: false });
const GatheringsHeader = dynamic(() => import('@/components/gatherings/shared/ui/GatheringsHeader'), { ssr: false });
const LocationDateFilter = dynamic(() => import('@/components/gatherings/shared/ui/LocationDateFilter'), { ssr: false });

/**
 * 모임 페이지 프로퍼티
 * @param initialGatherings 초기 모임 목록
 */
interface PageProps {
    initialGatherings?: Gathering[];
}

/**
 * 필터 프로퍼티
 * @param location 위치
 * @param date 날짜
 */
interface Filters {
    location: string;
    date: string;
}

/**
 * 정렬 프로퍼티
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 */
interface Sort {
    sortBy: string;
    sortOrder: string;
}

export default function Gatherings({ initialGatherings = [] }: PageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMainType, setSelectedMainType] = useState('DALLAEMFIT');
    const [selectedSubType, setSelectedSubType] = useState('ALL');
    const [filters, setFilters] = useState<Filters>({
        location: '',
        date: ''
    });
    const [sort, setSort] = useState<Sort>({
        sortBy: 'registrationEnd',
        sortOrder: 'desc'
    });
    const isLoggedIn = useContext(AuthContext);

    const setGatherings = useGatheringsStore((state) => state.setGatherings); // 모임 목록 설정

    // 초기 모임 목록 설정
    useEffect(() => {
        if (initialGatherings.length > 0) {
            setGatherings(initialGatherings);
        }
    }, [initialGatherings, setGatherings]);

    // 모달 열기
    const openModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    // 모달 닫기
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // 모임 주제 변경
    const handleTypeChange = useCallback((mainType: string, subType: string) => {
        setSelectedMainType(mainType);
        setSelectedSubType(subType);
    }, []);

    // 위치/날짜 필터 변경
    const handleFilterChange = useCallback((newFilters: Filters) => {
        setFilters(prev => {
            if (
                prev.location === newFilters.location &&
                prev.date === newFilters.date
            ) {
                return prev;
            }

            return newFilters;
        });
    }, []);

    // 마감시간 정렬 변경
    const handleSortChange = useCallback((newSort: Sort) => {
        setSort(prev => {
            if (
                prev.sortBy === newSort.sortBy &&
                prev.sortOrder === newSort.sortOrder
            ) {
                return prev;
            }

            return newSort;
        });
    }, []);

    return (
        <>
            {isModalOpen && (
                <CreateGatheringModal
                    onClose={closeModal}
                />
            )}
            <div className="w-full flex flex-col">
                <GatheringsHeader type="search" />
                <div className="w-full flex flex-col">
                    {/* 모임 주제 선택 및 모임 만들기 */}
                    <GatheringFilters
                        showCreateButton={!!isLoggedIn} // 모임 만들기 버튼 표시 여부
                        onCreateClick={openModal} // 모임 만들기 버튼 클릭 핸들러
                        onTypeChange={handleTypeChange} // 모임 주제 변경 핸들러
                        initialMainType={selectedMainType} // 초기 모임 주제
                        initialSubType={selectedSubType} // 초기 모임 서브타입
                    />

                    {/* 위치/날짜 필터 + 정렬 */}
                    <LocationDateFilter
                        onFilterChange={handleFilterChange} // 필터 변경 핸들러
                        onSortChange={handleSortChange} // 정렬 변경 핸들러
                        pageType="search" // 페이지 타입
                        initialLocation={filters.location} // 초기 위치
                        initialDate={filters.date} // 초기 날짜
                    />
                </div>

                {/* 모임 목록 조회 */}
                <GatheringsList
                    fetchFromApi={true} // 무한스크롤 활성화
                    selectedMainType={selectedMainType} // 모임 주제
                    selectedSubType={selectedSubType} // 모임 서브타입
                    location={filters.location} // 위치
                    date={filters.date} // 날짜
                    sortBy={sort.sortBy} // 정렬 기준
                    sortOrder={sort.sortOrder} // 정렬 순서
                />
            </div>
        </>
    );
}