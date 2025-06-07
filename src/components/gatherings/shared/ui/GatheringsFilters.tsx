"use client"

import Button from '@/components/shared/ui/Button';
import { useEffect, useState } from 'react';

interface GatheringFiltersProps {
    onTypeChange?: (mainType: string, subType: string) => void;
    showCreateButton?: boolean;
    onCreateClick?: () => void;
    initialMainType?: string;
    initialSubType?: string;
}

export default function GatheringFilters({
    onTypeChange,
    showCreateButton = false,
    onCreateClick,
    initialMainType = 'DALLAEMFIT',
    initialSubType = 'ALL'
}: GatheringFiltersProps) {
    const [selectedMainType, setSelectedMainType] = useState(initialMainType);
    const [selectedSubType, setSelectedSubType] = useState(initialSubType);

    // 초기값이 변경되면 상태 업데이트
    useEffect(() => {
        setSelectedMainType(initialMainType);
        setSelectedSubType(initialSubType);
    }, [initialMainType, initialSubType]);

    const handleMainTypeChange = (type: string) => {
        setSelectedMainType(type);

        if (type === 'DORANDORAN') {
            setSelectedSubType('WORKATION');
            onTypeChange?.(type, 'WORKATION');
        } else {
            setSelectedSubType('ALL');
            onTypeChange?.(type, 'ALL');
        }
    };

    const handleSubTypeChange = (type: string) => {
        setSelectedSubType(type);
        onTypeChange?.(selectedMainType, type);
    };

    return (
        <div className="w-full h-[160px] flex flex-col justify-start py-5">
            {/* 대분류 선택 */}
            <div className="flex flex-row relative">
                <div className={`absolute bottom-0 h-0.5 bg-gray-900 transition-all duration-300 ease-in-out w-20 ${selectedMainType === 'DALLAEMFIT' ? 'translate-x-2' : 'translate-x-26'}`} />
                <button
                    onClick={() => handleMainTypeChange('DALLAEMFIT')}
                    className={`text-gray-900 text-lg font-semibold px-4 py-1`}
                >
                    북적북적
                </button>
                <button
                    onClick={() => handleMainTypeChange('DORANDORAN')}
                    className={`text-gray-900 text-lg font-semibold px-4 py-1`}
                >
                    도란도란
                </button>
                {showCreateButton && (
                    <Button
                        variant='default'
                        text='모임 만들기'
                        onClick={onCreateClick}
                        customClassName="ml-auto"
                    />
                )}
            </div>

            {/* 북적북적 소분류 선택 */}
            {selectedMainType === 'DALLAEMFIT' && (
                <div className="w-full flex flex-col justify-start py-5 border-b-2 border-gray-200">
                    <div className="flex flex-row items-center gap-2">
                        <button
                            onClick={() => handleSubTypeChange('ALL')}
                            className={`${selectedSubType === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} text-sm font-medium px-3 py-2 rounded-lg`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => handleSubTypeChange('OFFICE_STRETCHING')}
                            className={`${selectedSubType === 'OFFICE_STRETCHING' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} text-sm font-medium px-3 py-2 rounded-lg`}
                        >
                            엔터테인먼트
                        </button>
                        <button
                            onClick={() => handleSubTypeChange('MINDFULNESS')}
                            className={`${selectedSubType === 'MINDFULNESS' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} text-sm font-medium px-3 py-2 rounded-lg`}
                        >
                            액티비티
                        </button>
                    </div>
                </div>
            )}

            {/* 도란도란 선택 시 border */}
            {selectedMainType === 'DORANDORAN' && (
                <div className="w-full h-[78px] flex flex-col justify-start py-5 border-b-2 border-gray-200" />
            )}
        </div>
    );
}