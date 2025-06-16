"use client"

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { ReviewItem } from "@/types/reviews";
import ReviewsList from "@/components/reviews/ReviewsList";
import GatheringFilters from "@/components/shared/GatheringsFilters";
import GatheringsHeader from "@/components/shared/GatheringsHeader";
import LocationDateFilter from "@/components/shared/LocationDateFilter";

// 페이지 컴포넌트 props 타입 정의
interface PageProps {
    ssrReviews: ReviewItem[];
    initialFilters: {
        mainType: string;
        location: string;
        date: string;
        sortBy: string;
        sortOrder: string;
    };
}

/**
 * 리뷰 필터 프로퍼티
 */
interface Filters {
    location: string;
    date: string;
}

/**
 * 리뷰 정렬 프로퍼티
 */
interface Sort {
    sortBy: string;
    sortOrder: string;
}

export default function ReviewsUI({ ssrReviews, initialFilters }: PageProps) {
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

    // 필터 변경 감지를 위한 키
    const [filterChangeKey, setFilterChangeKey] = useState(0);
    const [isFilterChanged, setIsFilterChanged] = useState(false);


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
        router.push(`/reviews?${params.toString()}`);
    }, [router, searchParams]);

    // 타입 변경 핸들러
    const handleTypeChange = useCallback((mainType: string, subType: string) => {
        setSelectedMainType(mainType);
        setSelectedSubType(subType);
        setIsFilterChanged(true);

        updateURL({
            mainType,
            location: currentFilters.location,
            date: currentFilters.date,
            sortBy: currentSort.sortBy,
            sortOrder: currentSort.sortOrder
        });

        setTimeout(() => {
            setIsFilterChanged(false);
        }, 300);
    }, [currentFilters, currentSort, updateURL]);

    // 필터 변경 핸들러
    const handleFilterChange = useCallback((filters: Filters) => {
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
    const handleSortChange = useCallback((sort: Sort) => {
        setCurrentSort(sort);

        updateURL({
            mainType: selectedMainType,
            location: currentFilters.location,
            date: currentFilters.date,
            sortBy: sort.sortBy,
            sortOrder: sort.sortOrder
        });
    }, [selectedMainType, currentFilters, updateURL]);

    return (
        <div className="w-full flex flex-col">
            <GatheringsHeader type="review" />

            <div className="w-full flex flex-col">
                {/* 모임 주제 선택 */}
                <GatheringFilters
                    showCreateButton={false} // 모임 만들기 버튼 숨김
                    onTypeChange={handleTypeChange} // 모임 주제 변경 핸들러
                    initialMainType={selectedMainType} // 초기 모임 주제
                    initialSubType={selectedSubType} // 초기 모임 서브타입
                />

                {/* 위치 및 날짜 필터 + 정렬 */}
                <LocationDateFilter
                    onFilterChange={handleFilterChange} // 필터 변경 핸들러
                    onSortChange={handleSortChange} // 정렬 변경 핸들러
                    pageType="review" // 페이지 타입
                    initialLocation={currentFilters.location} // 초기 위치
                    initialDate={currentFilters.date} // 초기 날짜
                    initialSort={`${currentSort.sortBy}_${currentSort.sortOrder}`} // 초기 정렬
                />
            </div>

            {/* 리뷰 목록 */}
            <ReviewsList
                key={filterChangeKey} // 필터 변경 시 컴포넌트 재마운트
                ssrReviews={ssrReviews} // 서버 렌더링 리뷰 목록
                selectedMainType={selectedMainType} // 선택된 모임 주제
                selectedSubType={selectedSubType} // 선택된 모임 서브타입
                filters={currentFilters} // 현재 필터 상태
                sort={currentSort} // 현재 정렬 상태
                enableInfiniteScroll={true} // 무한스크롤 활성화
                isFilterChanged={isFilterChanged}
            />
        </div>
    );
}