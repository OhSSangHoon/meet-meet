'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

export default function JoinedCountsProgressBar({ participantCount, capacity }: { participantCount: number, capacity: number }) {
    const pathname = usePathname();

    const isDetailPage = pathname.includes('/gatherings/detail');

    const minPercent = useMemo(() => {
        if (!capacity) return 0;
        return Math.min((5 / capacity) * 100, 100);
    }, [capacity]);

    return (
        <progress
            className="w-full relative bg-gray-200 rounded-full h-2 appearance-none [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-main-400 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-main-400 [&::-moz-progress-bar]:rounded-full"
            value={participantCount}
            max={capacity}
        >
            {/* 최소 인원 인디케이터 */}
            <div
                className="absolute -top-1 left-0"
                style={{ left: `calc(${minPercent}% - 8px)` }}
            >
                <div className="size-4 bg-main-pink rounded-full border-2 border-white shadow" />
                {!isDetailPage && (
                    <span className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-1 text-xs text-main-pink font-semibold whitespace-nowrap">
                        개설확정
                    </span>
                )}
            </div>
        </progress>
    );
}

