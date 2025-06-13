"use client"

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Clock, Timer, Star, Users } from 'lucide-react';

// 스타일 상수
const BUTTON_BASE_STYLES = "flex items-center gap-2 padding-button bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-main-300 focus:outline-none focus:ring-2 focus:ring-main-500 focus:border-main-500";
const DROPDOWN_CONTAINER_STYLES = "absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50";
const DROPDOWN_ITEM_BASE_STYLES = "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150";
const SELECTED_INDICATOR_STYLES = "w-2 h-2 bg-main-600 rounded-full mt-1.5 flex-shrink-0";

// 매직넘버 상수
const DATE_REGEX_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // 날짜 형식 검증 정규식

const locations = [
    { value: '', label: '지역 선택' },
    { value: '건대입구', label: '건대입구' },
    { value: '을지로3가', label: '을지로3가' },
    { value: '신림', label: '신림' },
    { value: '홍대입구', label: '홍대입구' }
];

const searchSortOptions = [
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
];

const reviewSortOptions = [
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

/**
 * 위치 및 날짜 필터 속성
 */
interface Filters {
    location: string;
    date: string;
}

/**
 * 정렬 속성
 */
interface Sort {
    sortBy: string;
    sortOrder: string;
}

/**
 * 위치 및 날짜 필터 속성
 * @param onFilterChange 필터 변경 핸들러
 * @param onSortChange 정렬 변경 핸들러
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

    const sortOptions = pageType === 'search' ? searchSortOptions : reviewSortOptions;

    useEffect(() => {
        setSelectedLocation(initialLocation);
        setSelectedDate(initialDate);
        setCurrentSort(initialSort);
    }, [initialLocation, initialDate, initialSort]);

    const updateFilters = useCallback(() => {
        const filters: Filters = {
            location: selectedLocation.trim(),
            date: selectedDate.trim()
        };

        onFilterChange(filters);
    }, [selectedLocation, selectedDate, onFilterChange]);

    useEffect(() => {
        updateFilters();
    }, [updateFilters]);

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

    const handleSearchToggle = () => {
        const newSort = currentSort === 'registrationEnd_desc' ? 'registrationEnd_asc' : 'registrationEnd_desc';
        handleSortChange(newSort);
    };

    const handleLocationChange = (location: string) => {
        setSelectedLocation(location);
        setIsLocationOpen(false);
    };

    const handleDateChange = (date: string) => {
        if (date === '' || DATE_REGEX_PATTERN.test(date)) {
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
                    <div className="relative">
                        <button
                            onClick={() => setIsLocationOpen(!isLocationOpen)}
                            className={`${BUTTON_BASE_STYLES} hover:bg-gray-50 transition-gathering-item justify-between`}
                        >
                            <span>{currentLocation?.label || '지역 선택'}</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    isLocationOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {isLocationOpen && (
                            <div className={`${DROPDOWN_CONTAINER_STYLES} left-0`}>
                                {locations.map((location, index) => {
                                    const isSelected = selectedLocation === location.value;

                                    return (
                                        <button
                                            key={location.value}
                                            onClick={() => handleLocationChange(location.value)}
                                            className={`
                                                ${DROPDOWN_ITEM_BASE_STYLES}
                                                ${isSelected ? 'bg-main-50 text-main-600' : 'text-gray-700'}
                                                ${index === 0 ? 'rounded-t-lg' : ''}
                                                ${index === locations.length - 1 ? 'rounded-b-lg' : ''}
                                            `}
                                        >
                                            <div className="flex-1">
                                                <div className={`text-sm font-medium ${isSelected && 'text-main-600'}`}>
                                                    {location.label}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className={`${SELECTED_INDICATOR_STYLES} ml-1`}></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {isLocationOpen && (
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsLocationOpen(false)}
                            />
                        )}
                    </div>

                    <input
                        type="date"
                        value={selectedDate}
                        min={pageType === 'search' ? today : undefined}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-500"
                    />

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
                            <button
                                onClick={handleSearchToggle}
                                className={`${BUTTON_BASE_STYLES} hover:bg-gray-50 transition-all duration-200`}
                            >
                                <CurrentIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">{currentOption?.label}</span>
                            </button>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className={`${BUTTON_BASE_STYLES} transition-all duration-200`}
                                >
                                    <CurrentIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{currentOption?.label}</span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                            isSortOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {isSortOpen && (
                                    <div className={`${DROPDOWN_CONTAINER_STYLES} right-0`}>
                                        {sortOptions.map((option) => {
                                            const Icon = option.icon;
                                            const isSelected = currentSort === option.value;

                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleSortChange(option.value)}
                                                    className={`
                                                        w-18 sm:w-full ${DROPDOWN_ITEM_BASE_STYLES} px-3 py-3
                                                        ${isSelected ? 'bg-main-50 text-main-600' : 'text-gray-700'}
                                                        ${option.value === sortOptions[0].value ? 'rounded-t-lg' : ''}
                                                        ${option.value === sortOptions[sortOptions.length - 1].value ? 'rounded-b-lg' : ''}
                                                    `}
                                                >
                                                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                                        isSelected ? 'text-main-600' : 'text-gray-400'
                                                    }`} />
                                                    <div className="flex-1 hidden sm:block">
                                                        <div className={`text-sm font-medium ${isSelected && 'text-main-600'}`}>
                                                            {option.label}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className={`${SELECTED_INDICATOR_STYLES} mt-1.5`}></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

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