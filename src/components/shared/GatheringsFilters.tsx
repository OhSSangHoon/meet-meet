"use client"

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "@/providers/AuthProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn-ui/tooltip';
import Button from '@/components/shared/Button';

// 스타일 상수
const MAIN_TYPE_BUTTON_STYLES = "text-lg font-semibold py-1 cursor-pointer";
const SUB_TYPE_BUTTON_STYLES = "shadow-sm text-sm font-medium px-3 py-2 rounded-lg cursor-pointer";

/**
 * 모임 필터 속성
 * @param onTypeChange 메인 타입 변경 핸들러
 * @param showCreateButton 모임 생성 버튼 표시 여부
 * @param onCreateClick 모임 생성 클릭 핸들러
 * @param initialMainType 초기 메인 타입
 * @param initialSubType 초기 서브 타입
 */
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

    const isLoggedIn = useContext(AuthContext);

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
        <div className="w-full h-[160px] flex flex-col justify-start gap-4 py-5 whitespace-nowrap dark:text-white">
            <div className="flex flex-row relative gap-6">
                <div className={`absolute bottom-0 h-1 rounded-full bg-main-apricot transition-all duration-300 ease-in-out w-15 ${selectedMainType === 'DALLAEMFIT' ? 'translate-x-0' : 'translate-x-22'}`} />
                <Tooltip>
                    <TooltipTrigger onClick={() => handleMainTypeChange('DALLAEMFIT')} className={`${MAIN_TYPE_BUTTON_STYLES}`}>
                        북적북적
                    </TooltipTrigger>
                    <TooltipContent className='text-white'>
                        <p>외향적 성격의 모임이에요</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger onClick={() => handleMainTypeChange('DORANDORAN')} className={`${MAIN_TYPE_BUTTON_STYLES}`}>
                        도란도란
                    </TooltipTrigger>
                    <TooltipContent className='text-white'>
                        <p>내향적 성격의 모임이에요</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className="flex items-center">
                {selectedMainType === 'DALLAEMFIT' && (
                    <div className="w-full flex items-center py-5">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleSubTypeChange('ALL')}
                                className={`${selectedSubType === 'ALL' ? 'bg-main-apricot dark:text-dark' : 'bg-slate-100 dark:bg-gray-700'} ${SUB_TYPE_BUTTON_STYLES}`}
                            >
                                전체
                            </button>
                            <button
                                onClick={() => handleSubTypeChange('OFFICE_STRETCHING')}
                                className={`${selectedSubType === 'OFFICE_STRETCHING' ? 'bg-main-apricot dark:text-dark' : 'bg-slate-100 dark:bg-gray-700'} ${SUB_TYPE_BUTTON_STYLES}`}
                            >
                                엔터테인먼트
                            </button>
                            <button
                                onClick={() => handleSubTypeChange('MINDFULNESS')}
                                className={`${selectedSubType === 'MINDFULNESS' ? 'bg-main-apricot dark:text-dark' : 'bg-slate-100 dark:bg-gray-700'} ${SUB_TYPE_BUTTON_STYLES}`}
                            >
                                액티비티
                            </button>
                        </div>
                    </div>
                )}

                {selectedMainType === 'DORANDORAN' && (
                    <div className="w-full flex flex-col justify-start py-5">
                        <div className="flex flex-row items-center gap-2">
                            <button
                                onClick={() => handleSubTypeChange('ALL')}
                                className={`bg-main-apricot dark:text-dark ${SUB_TYPE_BUTTON_STYLES}`}
                            >
                                전체
                            </button>
                        </div>
                    </div>
                )}

                {showCreateButton && isLoggedIn?.token && (
                    <Button
                        variant="default"
                        text="모임 만들기"
                        onClick={onCreateClick}
                        customClassName="h-[55%] items-center shadow-md"
                    />
                )}
            </div>
        </div>
    );
}