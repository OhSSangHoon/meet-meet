"use client"

import React from 'react';
import { useSavedGatherings } from "@/components/gatherings/shared/hooks/useSavedGatherings";

interface SaveToggleButtonProps {
    gatheringId: string;
    className?: string;
}

/**
 * 모임 찜하기/찜 해제 토글 버튼 컴포넌트
 * @param {SaveToggleButtonProps} props - 컴포넌트 props
 * @param {string} props.gatheringId - 찜할 모임의 ID
 * @param {string} [props.className] - 추가 CSS 클래스명
 * @returns {JSX.Element} 찜하기 토글 버튼
 */
export default function SaveToggleButton({ 
    gatheringId,
    className = ''
}: SaveToggleButtonProps) {
    const { savedIds, toggleSaved, isToggling } = useSavedGatherings();
    const isSaved = savedIds.includes(gatheringId);

    return (
        <button 
            onClick={() => toggleSaved(gatheringId)}
            disabled={isToggling}
            className={`
                flex-shrink-0 w-12 h-12 rounded-full border-2 transition-all duration-200
                ${isSaved 
                    ? 'bg-main-50 border-main-300 text-main-600 hover:bg-main-100 hover:text-main-600' 
                    : 'bg-white border-main-300 text-main-400 hover:bg-main-100 hover:text-main-600'
                }
                ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
            aria-label={isSaved ? '찜 해제' : '찜하기'}
        >
            {isSaved ? (
                <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 23" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            ) : (
                <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 23" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            )}
        </button>
    );
}