"use client"

import { useEffect, useState, useCallback } from "react";
import { ReviewItem } from "@/types/reviews";
import { useReviewsStore } from '@/store/reviewsStore';
import ReviewsList from "@/components/reviews/ReviewsList";
import GatheringsFilters from "@/components/gatherings/shared/ui/GatheringsFilters";
import GatheringsHeader from "@/components/gatherings/shared/ui/GatheringsHeader";
import LocationDateFilter from "@/components/gatherings/shared/ui/LocationDateFilter";

// 리뷰 페이지 컴포넌트
interface PageProps {
    initialReviews?: ReviewItem[];
}

// 필터 타입 정의
interface Filters {
    location: string;
    date: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * 리뷰 페이지 컴포넌트
 * @param initialReviews 초기 리뷰 목록
 * @returns 리뷰 페이지 컴포넌트
 */
export default function Reviews({ initialReviews = [] }: PageProps) {
    const [selectedMainType, setSelectedMainType] = useState('DALLAEMFIT');
    const [selectedSubType, setSelectedSubType] = useState('ALL');
    const [filters, setFilters] = useState<Filters>({ 
        location: '', 
        date: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    
    // 리뷰 상태 관리
    const setReviews = useReviewsStore((state) => state.setReviews);
    
    useEffect(() => {
        if (initialReviews.length > 0) {
            setReviews(initialReviews);
        }
    }, [initialReviews, setReviews]);

    const handleTypeChange = useCallback((mainType: string, subType: string) => {
        setSelectedMainType(mainType);
        setSelectedSubType(subType);
    }, []);

    const handleFilterChange = useCallback((newFilters: Filters) => {
        setFilters(prev => {
            if (
                prev.location === newFilters.location && 
                prev.date === newFilters.date &&
                prev.sortBy === newFilters.sortBy &&
                prev.sortOrder === newFilters.sortOrder
            ) {
                return prev;
            }
            return newFilters;
        });
    }, []);

    return (
        <div className="w-full flex flex-col">
            <GatheringsHeader type="review" />
            <div className="w-full flex flex-col">
                {/* 모임 주제 선택 */}
                <GatheringsFilters 
                    showCreateButton={false}
                    onTypeChange={handleTypeChange}
                    initialMainType={selectedMainType}
                    initialSubType={selectedSubType}
                />
                {/* 위치 및 날짜 필터 */}
                <LocationDateFilter 
                    onFilterChange={handleFilterChange}
                    pageType="review"
                />
            </div>
            {/* 리뷰 목록 조회 */}
            <ReviewsList
                fetchFromApi={true}
                selectedMainType={selectedMainType}
                selectedSubType={selectedSubType}
                location={filters.location}
                date={filters.date}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
            />
        </div>
    );
}