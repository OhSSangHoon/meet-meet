"use client"

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gathering } from "@/types/gatherings";
import GatheringFilters from '@/components/gatherings/shared/ui/GatheringsFilters';
import LocationDateFilter from '@/components/gatherings/shared/ui/LocationDateFilter';
import GatheringsList from '@/components/gatherings/GatheringsList';
import dynamic from 'next/dynamic';
import GatheringsHeader from './shared/ui/GatheringsHeader';

// 모달 컴포넌트 동적 import
const CreateGatheringDialog = dynamic(() => import('@/components/gatherings/CreateGatheringDialog'), { ssr: false });

/**
 * 모임 검색 페이지 컴포넌트
 * @param ssrGatherings 서버 렌더링 모임 목록
 * @param initialFilters 초기 필터 상태
 * @returns 모임 검색 페이지 컴포넌트
 */
interface GatheringsProps {
    ssrGatherings: Gathering[];
    initialFilters: {
        mainType: string;
        location: string;
        date: string;
        sortBy: string;
        sortOrder: string;
    };
}

export default function Gatherings({ ssrGatherings, initialFilters }: GatheringsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [selectedMainType, setSelectedMainType] = useState(initialFilters.mainType);
    const [selectedSubType, setSelectedSubType] = useState('ALL');
    const [currentFilters, setCurrentFilters] = useState({
        location: initialFilters.location,
        date: initialFilters.date
    });
    const [currentSort, setCurrentSort] = useState({
        sortBy: initialFilters.sortBy,
        sortOrder: initialFilters.sortOrder
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // 필터 변경 감지를 위한 키 
    const [filterChangeKey, setFilterChangeKey] = useState(0);

    // URL 업데이트 함수
    const updateURL = useCallback((newParams: Record<string, string>) => {
        const params = new URLSearchParams(searchParams);
        
        Object.entries(newParams).forEach(([key, value]) => {
            if (value && value.trim()) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        // 필터 변경 감지를 위한 키 업데이트
        setFilterChangeKey(prev => prev + 1);

        // URL 업데이트 (SSR 트리거)
        router.push(`/gatherings?${params.toString()}`);
    }, [router, searchParams]);

    // 타입 변경 핸들러
    const handleTypeChange = useCallback((mainType: string, subType: string) => {
        setSelectedMainType(mainType);
        setSelectedSubType(subType);
        
        updateURL({
            mainType,
            location: currentFilters.location,
            date: currentFilters.date,
            sortBy: currentSort.sortBy,
            sortOrder: currentSort.sortOrder
        });
    }, [currentFilters, currentSort, updateURL]);

    // 필터 변경 핸들러
    const handleFilterChange = useCallback((filters: { location: string; date: string }) => {
        setCurrentFilters(filters);
        
        updateURL({
            mainType: selectedMainType,
            location: filters.location,
            date: filters.date,
            sortBy: currentSort.sortBy,
            sortOrder: currentSort.sortOrder
        });
    }, [selectedMainType, currentSort, updateURL]);

    // 정렬 변경 핸들러
    const handleSortChange = useCallback((sort: { sortBy: string; sortOrder: string }) => {
        setCurrentSort(sort);
        
        updateURL({
            mainType: selectedMainType,
            location: currentFilters.location,
            date: currentFilters.date,
            sortBy: sort.sortBy,
            sortOrder: sort.sortOrder
        });
    }, [selectedMainType, currentFilters, updateURL]);

    // 모임 만들기 핸들러
    const handleCreateClick = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    // 모달 닫기 + 새로고침 핸들러
    const handleCloseModal = useCallback((shouldRefresh = false) => {
        setIsCreateModalOpen(false);
        
        // 모임 생성이 성공한 경우 페이지 새로고침으로 SSR 다시 실행
        if (shouldRefresh) {
            router.refresh();
        }
    }, [router]);

    return (
        <>
            <div className="flex flex-col">
                {/* 모임 헤더 */}
                <GatheringsHeader type="search"/>

                {/* 필터 컴포넌트들 */}
                <GatheringFilters
                    onTypeChange={handleTypeChange}
                    showCreateButton={true}
                    onCreateClick={handleCreateClick}
                    initialMainType={selectedMainType}
                    initialSubType={selectedSubType}
                />

                <LocationDateFilter
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    pageType="search"
                    initialLocation={currentFilters.location}
                    initialDate={currentFilters.date}
                    initialSort={`${currentSort.sortBy}_${currentSort.sortOrder}`}
                />

                {/* 모임 목록 */}
                <GatheringsList
                    key={filterChangeKey}
                    ssrGatherings={ssrGatherings}
                    selectedMainType={selectedMainType}
                    selectedSubType={selectedSubType}
                    filters={currentFilters}
                    sort={currentSort}
                    enableInfiniteScroll={true}
                    savedGatheringIds={[]}
                />
            </div>

            {/* 모임 만들기 모달 */}
            {isCreateModalOpen && (
                <CreateGatheringDialog 
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}