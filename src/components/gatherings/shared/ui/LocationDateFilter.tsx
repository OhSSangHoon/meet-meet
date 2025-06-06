"use client"

import { useState, useEffect, useCallback } from 'react';

interface Filters {
    location: string;
    date: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface LocationDateFilterProps {
    onFilterChange: (filters: Filters) => void;
    pageType: 'search' | 'review';
    initialLocation?: string;
    initialDate?: string;
    initialSortBy?: string;
    initialSortOrder?: 'asc' | 'desc';
}

export default function LocationDateFilter({
    onFilterChange,
    pageType,
    initialLocation = '',
    initialDate = '',
    initialSortBy,
    initialSortOrder
}: LocationDateFilterProps) {
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [sortBy, setSortBy] = useState(initialSortBy || (pageType === 'search' ? 'registrationEnd' : 'createdAt'));
    const [sortOrder, setSortOrder] = useState(initialSortOrder || (pageType === 'search' ? 'asc' : 'desc'));

    // 초기값이 변경되면 상태 업데이트
    useEffect(() => {
        setSelectedLocation(initialLocation);
        setSelectedDate(initialDate);
        if (initialSortBy) setSortBy(initialSortBy);
        if (initialSortOrder) setSortOrder(initialSortOrder);
    }, [initialLocation, initialDate, initialSortBy, initialSortOrder]);

    // 필터 변경 함수를 useCallback으로 메모이제이션
    const updateFilters = useCallback(() => {
        const filters: Filters = {
            location: selectedLocation,
            date: selectedDate,
            sortBy,
            sortOrder
        };

        onFilterChange(filters);
    }, [selectedLocation, selectedDate, sortBy, sortOrder, onFilterChange]);

    // 상태 변경 시에만 필터 업데이트
    useEffect(() => {
        updateFilters();
    }, [updateFilters]);

    // 위치 옵션 (공통)
    const locations = [
        { value: '', label: '지역 선택' },
        { value: '건대입구', label: '건대입구' },
        { value: '을지로3가', label: '을지로3가' },
        { value: '신림', label: '신림' },
        { value: '홍대입구', label: '홍대입구' }
    ];

    // 페이지별로 다르게 정렬
    const sortOptions = pageType === 'search'
        ? [
            { value: 'registrationEnd', label: '마감임박순' }
        ]
        : [
            { value: 'createdAt', label: '최신순' },
            { value: 'score', label: '평점 높은순' },
            { value: 'participantCount', label: '참여인원 많은순' }
        ];


    const handleLocationChange = (location: string) => {
        setSelectedLocation(location);
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
    };

    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy);

        // 정렬 기준에 따른 기본 정렬 순서 설정
        if (pageType === 'search') {
            setSortOrder('asc');
        } else {
            if (newSortBy === 'createdAt') {
                setSortOrder('desc');
            } else if (newSortBy === 'score') {
                setSortOrder('desc');
            } else if (newSortBy === 'participantCount') {
                setSortOrder('desc');
            }
        }
    };

    // 마감 시간 정렬 순서 토글
    const handleSortOrderToggle = () => {
        if (pageType === 'search') {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(newOrder);
        }
    };

    return (
        <div className="w-full flex flex-row gap-4 py-4">
            <div className="flex flex-wrap gap-3">
                {/* 위치 선택 */}
                <div className="flex items-center gap-2">
                    <select
                        value={selectedLocation}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-500 focus:border-transparent"
                    >
                        {locations.map((location) => (
                            <option key={location.value} value={location.value}>
                                {location.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 날짜 선택 */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                handleDateChange(e.target.value);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-500 focus:border-transparent"
                            title={pageType === 'search' ? '모임 개최일로 필터링' : '리뷰 작성일로 필터링'}
                        />
                    </div>
                </div>
            </div>

            {/* 정렬 옵션 */}
            <div className="flex items-center gap-3 ml-auto">
                {pageType === 'search' ? (
                    // 마감임박순
                    <>
                        <button
                            onClick={handleSortOrderToggle}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-main-500 focus:border-transparent transition-colors"
                        >
                            {sortOrder === 'asc' ? '마감임박순' : '마감여유순'}
                        </button>
                    </>
                ) : (
                    // 최신순, 평점높은순, 참여인원많은순
                    <>
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-500 focus:border-transparent"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>
        </div>
    );
}