"use client"

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Clock, Timer, Star, Users } from 'lucide-react';

/**
 * 필터 프로퍼티
 */
interface Filters {
    location: string;
    date: string;
}

/**
 * 정렬 프로퍼티
 */
interface Sort {
    sortBy: string;
    sortOrder: string;
}

/**
 * 위치 날짜 필터 프로퍼티
 * @param onFilterChange 필터 변경 콜백
 * @param onSortChange 정렬 변경 콜백
 * @param pageType 페이지 타입
 * @param initialLocation 초기 위치
 * @param initialDate 초기 날짜
 * @param initialSort 초기 정렬
 */
interface LocationDateFilterProps {
    onFilterChange: (filters: Filters) => void;
    onSortChange?: (sort: Sort) => void;
    pageType: 'search' | 'review';
    initialLocation?: string;
    initialDate?: string;
    initialSort?: string;
}

export default function LocationDateFilter({
    onFilterChange,
    onSortChange,
    pageType,
    initialLocation = '',
    initialDate = '',
    initialSort = pageType === 'search' ? 'registrationEnd_desc' : 'createdAt_desc'
}: LocationDateFilterProps) {
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [currentSort, setCurrentSort] = useState(initialSort);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);

    // 페이지별 정렬 옵션 정의
    const sortOptions = pageType === 'search' ? [
        {
            value: 'registrationEnd_desc',
            label: '마감 여유순',
            icon: Clock,
            sortBy: 'registrationEnd',
            sortOrder: 'desc'
        },
        {
            value: 'registrationEnd_asc',
            label: '마감 임박순', 
            icon: Timer,
            sortBy: 'registrationEnd',
            sortOrder: 'asc'
        }
    ] : [
        {
            value: 'createdAt_desc',
            label: '최신순',
            icon: Clock,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        },
        {
            value: 'score_desc',
            label: '평점 높은순',
            icon: Star, 
            sortBy: 'score',
            sortOrder: 'desc'
        },
        {
            value: 'participantCount_desc',
            label: '참여인원 많은순',
            icon: Users,
            sortBy: 'participantCount',
            sortOrder: 'desc'
        }
    ];

    // 초기값 동기화
    useEffect(() => {
        setSelectedLocation(initialLocation);
        setSelectedDate(initialDate);
        setCurrentSort(initialSort);
    }, [initialLocation, initialDate, initialSort]);

    // 필터 변경 처리
    const updateFilters = useCallback(() => {
        const filters: Filters = {
            location: selectedLocation.trim(),
            date: selectedDate.trim()
        };

        onFilterChange(filters);
    }, [selectedLocation, selectedDate, onFilterChange]);

    // 상태 변경시 필터 업데이트
    useEffect(() => {
        updateFilters();
    }, [updateFilters]);

    // 정렬 변경 처리
    const handleSortChange = (optionValue: string) => {
        const option = sortOptions.find(opt => opt.value === optionValue);
        if (option && onSortChange) {
            setCurrentSort(optionValue);
            setIsSortOpen(false);
            
            const sort: Sort = {
                sortBy: option.sortBy,
                sortOrder: option.sortOrder
            };
            
            onSortChange(sort);
        }
    };

    // 모임찾기 페이지용 단순 토글 함수
    const handleSearchToggle = () => {
        const newSort = currentSort === 'registrationEnd_desc' ? 'registrationEnd_asc' : 'registrationEnd_desc';
        handleSortChange(newSort);
    };

    // 위치 선택 옵션
    const locations = [
        { value: '', label: '지역 선택' },
        { value: '건대입구', label: '건대입구' },
        { value: '을지로3가', label: '을지로3가' },
        { value: '신림', label: '신림' },
        { value: '홍대입구', label: '홍대입구' }
    ];

    // 위치 선택 함수
    const handleLocationChange = (location: string) => {
        setSelectedLocation(location);
        setIsLocationOpen(false);
    };

    // 날짜 선택 함수
    const handleDateChange = (date: string) => {
        if (date === '' || /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            setSelectedDate(date);
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const currentOption = sortOptions.find(opt => opt.value === currentSort);
    const CurrentIcon = currentOption?.icon || Clock;
    const currentLocation = locations.find(loc => loc.value === selectedLocation);

    return (
        <div className="w-full flex flex-col gap-4 py-4">
            <div className="flex flex-row gap-4">
                <div className="flex flex-wrap gap-3">
                    {/* 위치 선택 */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLocationOpen(!isLocationOpen)}
                            className="flex items-center gap-2 padding-button bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-main-300 focus:outline-none focus:ring-2 focus:ring-main-500 focus:border-main-500 transition-gathering-item justify-between"
                        >
                            <span>{currentLocation?.label || '지역 선택'}</span>
                            <ChevronDown 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    isLocationOpen ? 'rotate-180' : ''
                                }`} 
                            />
                        </button>

                        {/* 위치 드롭다운 메뉴 */}
                        {isLocationOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                {locations.map((location, index) => {
                                    const isSelected = selectedLocation === location.value;
                                    
                                    return (
                                        <button
                                            key={location.value}
                                            onClick={() => handleLocationChange(location.value)}
                                            className={`
                                                w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150
                                                ${isSelected ? 'bg-main-50 text-main-600' : 'text-gray-700'}
                                                ${index === 0 ? 'rounded-t-lg' : ''}
                                                ${index === locations.length - 1 ? 'rounded-b-lg' : ''}
                                            `}
                                        >
                                            <div className="flex-1">
                                                <div className={`text-sm font-medium ${
                                                    isSelected ? 'text-main-600' : 'text-gray-900'
                                                }`}>
                                                    {location.label}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="w-2 h-2 bg-main-600 rounded-full mt-1.5 ml-1 flex-shrink-0"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* 위치 드롭다운 외부 클릭 감지 */}
                        {isLocationOpen && (
                            <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setIsLocationOpen(false)}
                            />
                        )}
                    </div>

                    {/* 날짜 선택 */}
                    <input
                        type="date"
                        value={selectedDate}
                        min={pageType === 'search' ? today : undefined}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-500"
                    />

                    {/* 초기화 버튼 */}
                    {(selectedLocation || selectedDate) && (
                        <button
                            onClick={() => {
                                setSelectedLocation('');
                                setSelectedDate('');
                            }}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors duration-200"
                        >
                            필터 초기화
                        </button>
                    )}
                </div>
                {onSortChange && (
                    <div className="flex items-center gap-3 ml-auto">
                        {pageType === 'search' ? (
                            // 모임찾기 필터링 (마감 여유순, 마감 임박순)
                            <button
                                onClick={handleSearchToggle}
                                className="flex items-center gap-2 padding-button bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-main-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-main-500 focus:border-main-500 transition-all duration-200"
                            >
                                <CurrentIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">{currentOption?.label}</span>
                            </button>
                        ) : (
                            // 리뷰 필터링 (최신순, 평점 높은순, 참여인원 많은순)
                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-2 padding-button bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-main-300 focus:outline-none focus:ring-2 focus:ring-main-500 focus:border-main-500 transition-all duration-200"
                                >
                                    <CurrentIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{currentOption?.label}</span>
                                    <ChevronDown 
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                            isSortOpen ? 'rotate-180' : ''
                                        }`} 
                                    />
                                </button>

                                {/* 드롭다운 메뉴 */}
                                {isSortOpen && (
                                    <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                        {sortOptions.map((option) => {
                                            const Icon = option.icon;
                                            const isSelected = currentSort === option.value;
                                            
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleSortChange(option.value)}
                                                    className={`
                                                        w-18 sm:w-full flex items-start gap-3 px-3 py-3 text-left hover:bg-gray-50 transition-colors duration-150
                                                        ${isSelected ? 'bg-main-50 text-main-600' : 'text-gray-700'}
                                                        ${option.value === sortOptions[0].value ? 'rounded-t-lg' : ''}
                                                        ${option.value === sortOptions[sortOptions.length - 1].value ? 'rounded-b-lg' : ''}
                                                    `}
                                                >
                                                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                                        isSelected ? 'text-main-600' : 'text-gray-400'
                                                    }`} />
                                                    <div className="flex-1 hidden sm:block">
                                                        <div className={`text-sm font-medium ${
                                                            isSelected ? 'text-main-600' : 'text-gray-900'
                                                        }`}>
                                                            {option.label}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="w-2 h-2 bg-main-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* 정렬 드롭다운 외부 클릭 감지 */}
                                {isSortOpen && (
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setIsSortOpen(false)}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}