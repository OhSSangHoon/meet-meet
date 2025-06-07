"use client"

import { useEffect, useState, useCallback } from "react";
import { ReviewItem } from "@/types/reviews";
import { useReviewsStore } from '@/store/reviewsStore';
import ReviewsList from "@/components/reviews/ReviewsList";
import GatheringsFilters from "@/components/gatherings/shared/ui/GatheringsFilters";
import GatheringsHeader from "@/components/gatherings/shared/ui/GatheringsHeader";
import LocationDateFilter from "@/components/gatherings/shared/ui/LocationDateFilter";

/**
 * 리뷰 페이지 메인 컴포넌트 프로퍼티
 * @param initialReviews 초기 리뷰 목록
 */
interface PageProps {
    initialReviews?: ReviewItem[];
}

/**
 * 리뷰 필터 프로퍼티
 * @param location 위치
 * @param date 날짜
 */
interface Filters {
    location: string;
    date: string;
}

/**
 * 리뷰 정렬 프로퍼티
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 */
interface Sort {
    sortBy: string;
    sortOrder: string;
}

export default function Reviews({ initialReviews = [] }: PageProps) {
    const [selectedMainType, setSelectedMainType] = useState('DALLAEMFIT'); // 모임 주제
    const [selectedSubType, setSelectedSubType] = useState('ALL'); // 모임 서브타입
    const [sort, setSort] = useState<Sort>({ sortBy: 'createdAt', sortOrder: 'desc' }); // 정렬
    const [filters, setFilters] = useState<Filters>({ location: '', date: '' }); // 필터
    
    const setReviews = useReviewsStore((state) => state.setReviews); // 리뷰 목록 설정
    
    // 초기 SSR 데이터 설정
    useEffect(() => {
        if (initialReviews.length > 0) {
            setReviews(initialReviews);
        }
    }, [initialReviews, setReviews]);

    // 타입 변경 핸들러
    const handleTypeChange = useCallback((mainType: string, subType: string) => {
        setSelectedMainType(mainType);
        setSelectedSubType(subType);
    }, []);

    // 필터 변경 핸들러
    const handleFilterChange = useCallback((newFilters: Filters) => {
        setFilters(prev => {
            if (
                prev.location === newFilters.location && 
                prev.date === newFilters.date
            ) {
                return prev; // 값이 동일하면 상태 업데이트 안함
            }
            
            return newFilters;
        });
    }, []);

    // 정렬 변경 핸들러
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
        <div className="w-full flex flex-col">
            <GatheringsHeader type="review" />
            
            <div className="w-full flex flex-col">
                {/* 모임 주제 선택 */}
                <GatheringsFilters 
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
                    initialLocation={filters.location} // 초기 위치
                    initialDate={filters.date} // 초기 날짜
                    initialSort="latest" // 초기 정렬
                />
            </div>
            
            {/* 리뷰 목록 */}
            <ReviewsList
                fetchFromApi={true} // 무한스크롤 활성화
                selectedMainType={selectedMainType} // 모임 주제
                selectedSubType={selectedSubType} // 모임 서브타입
                location={filters.location} // 위치
                date={filters.date} // 날짜
                sortBy={sort.sortBy} // 정렬 기준
                sortOrder={sort.sortOrder} // 정렬 순서
            />
        </div>
    );
}