"use client"

import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AuthContext } from "@/providers/AuthProvider";

const Button = dynamic(() => import('@/components/shared/ui/Button'), { ssr: false });

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
        <div className="w-full h-[160px] flex flex-col justify-start gap-4 py-5 whitespace-nowrap">
            {/* 대분류 선택 */}
            <div className="flex flex-row relative gap-6">
                <div className={`absolute bottom-0 h-1 rounded-full bg-main-apricot transition-all duration-300 ease-in-out w-15 ${selectedMainType === 'DALLAEMFIT' ? 'translate-x-0' : 'translate-x-22'}`} />
                <button
                    onClick={() => handleMainTypeChange('DALLAEMFIT')}
                    title='외향인인 당신에게 추천하는 모임!'
                    className='text-lg font-semibold py-1 cursor-pointer'
                >
                    북적북적
                </button>
                <button
                    onClick={() => handleMainTypeChange('DORANDORAN')}
                    title='내향인인 당신에게 추천하는 모임!'
                    className='text-lg font-semibold py-1 cursor-pointer'
                >
                    도란도란
                </button>
            </div>

            <div className='flex items-center'>
                {/* 북적북적 소분류 선택 */}
                {selectedMainType === 'DALLAEMFIT' && (
                    <div className="w-full flex items-center py-5">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleSubTypeChange('ALL')}
                                className={`${selectedSubType === 'ALL' ? 'bg-main-apricot' : 'bg-slate-100'} shadow-sm text-sm font-medium px-3 py-2 rounded-lg cursor-pointer`}
                            >
                                전체
                            </button>
                            <button
                                onClick={() => handleSubTypeChange('OFFICE_STRETCHING')}
                                className={`${selectedSubType === 'OFFICE_STRETCHING' ? 'bg-main-apricot' : 'bg-slate-100'} shadow-sm text-sm font-medium px-3 py-2 rounded-lg cursor-pointer`}
                            >
                                엔터테인먼트
                            </button>
                            <button
                                onClick={() => handleSubTypeChange('MINDFULNESS')}
                                className={`${selectedSubType === 'MINDFULNESS' ? 'bg-main-apricot' : 'bg-slate-100'} shadow-sm text-sm font-medium px-3 py-2 rounded-lg cursor-pointer`}
                            >
                                액티비티
                            </button>
                        </div>

                    </div>
                )}

                {/* 선택된 모임 타입에 따라 필터 표시 */}
                {selectedMainType === 'DORANDORAN' && (
                    <div className="w-full flex flex-col justify-start py-5" >
                        <div className="flex flex-row items-center gap-2">
                            <button
                                onClick={() => handleSubTypeChange('ALL')}
                                className="bg-main-apricot text-sm shadow-sm font-medium px-3 py-2 rounded-lg cursor-pointer"
                            >
                                전체
                            </button>
                        </div>
                    </div>
                )}

                {showCreateButton && isLoggedIn?.token && (
                    <Button
                        variant='default'
                        text='모임 만들기'
                        onClick={onCreateClick}
                        customClassName='h-[55%] items-center shadow-md'
                    />
                )}
            </div>
        </div>
    );
}