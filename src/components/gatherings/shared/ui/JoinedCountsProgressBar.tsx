'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

export default function JoinedCountsProgressBar({ participantCount, capacity }: { participantCount: number, capacity: number }) {
    const pathname = usePathname();

    const hideMinIndicator = pathname.includes('/gatherings/detail');

    const percent = useMemo(() => {
        if (!participantCount || !capacity) return 0;
        return Math.min((participantCount / capacity) * 100, 100);
    }, [participantCount, capacity]);

    const minPercent = useMemo(() => {
        if (!capacity) return 0;
        return Math.min((5 / capacity) * 100, 100);
    }, [capacity]);

    return (
        <div className="w-full relative bg-gray-200 rounded-full h-2">
            {/* 최소 인원 인디케이터 */}
            <div
                className="absolute -top-1 left-0"
                style={{ left: `calc(${minPercent}% - 8px)` }}
            >
                <div className="size-4 bg-main-pink rounded-full border-2 border-white shadow" />
                {!hideMinIndicator && (
                    <span className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-1 text-xs text-main-pink font-semibold whitespace-nowrap">
                        개설확정
                    </span>
                )}
            </div>
            {/* 진행 바 */}
            <div
                className='bg-main-500 h-2 rounded-full transition-all duration-300'
                style={{ width: `${percent}%` }}
            ></div>
        </div>
    );
}

