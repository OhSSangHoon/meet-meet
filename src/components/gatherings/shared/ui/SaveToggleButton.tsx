'use client';

import { useContext } from 'react';
import { Heart } from 'lucide-react';
import { useToggleSavedGatherings } from '@/hooks/api/saved/useToggleSavedGatherings';
import { AuthContext } from '@/providers/AuthProvider';

interface SaveToggleButtonProps {
    gatheringId: string;
}

/**
 * 찜하기/찜 해제 토글 버튼
 * @param gatheringId 모임 ID
 */
export default function SaveToggleButton({ gatheringId }: SaveToggleButtonProps) {
    const { token, setSignInDialogOpen } = useContext(AuthContext);
    const isAuthenticated = !!token;
    
    const { savedIds, toggleSaved, isToggling } = useToggleSavedGatherings();
    const isSaved = savedIds.includes(gatheringId);

    const handleToggleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 부모 요소 클릭 이벤트 방지

        // 로그인 상태 확인
        if (!isAuthenticated) {
            setSignInDialogOpen(true);
            return;
        }

        // 로그인된 경우 찜하기 토글 실행
        toggleSaved(gatheringId);
    };

    return (
        <button
            onClick={handleToggleClick}
            disabled={isToggling}
            className={`
                flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
                ${isSaved 
                    ? 'bg-main-500 text-white hover:bg-main-600' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-main-500'
                }
                ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                hover:outline-none hover:ring-2 hover:ring-main-300 hover:ring-offset-2
            `}
            aria-label={isSaved ? '찜 해제' : '찜하기'}
            type="button"
        >
            <Heart 
                className={`w-5 h-5 transition-transform duration-200 ${
                    isToggling ? 'scale-90' : 'scale-100'
                }`}
                fill={isSaved ? 'currentColor' : 'none'}
            />
        </button>
    );
}