'use client';

interface OverlayForDisabledProps {
    emoji?: React.ReactNode;
    filterings: boolean
    notice: string;
    reason?: string;
}

/** 모집 마감 / 모집 취소 모임 아이템에 씌울 오버레이
 * @param emoji - lucide 아이콘
 * @param filterings - 오버레이를 적용하는 조건
 * @param notice - 주요 알림 문구
 * @param reason - 마감 또는 취소된 근거
 * @description 부모 아이템에 relative 속성 필요 
 */
export default function OverlayForDisabled({ emoji, filterings, notice, reason }: OverlayForDisabledProps) {
    return (
        <>
            {filterings && (
                <div className="absolute bg-black/90 inset-0 z-20 flex items-center justify-center text-center rounded-xl">
                    <div className="px-4 py-2 rounded-lg flex flex-col gap-1 text-sm text-white items-center">
                        <div className='flex items-center gap-1'>
                            {emoji && <>{emoji}</>}
                            <span>{notice}</span>
                        </div>
                        <span>{reason}</span>
                    </div>
                </div>
            )}
        </>
    );
}

