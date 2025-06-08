'use client';

interface LoadingUIProps {
    width?: string;
}

/**
 * 마이페이지 모임 리스트 로딩 스켈레톤
 * @prop {string} width w-full, w-[17.5rem] 등
 * @prop {string} height h-32, h-[10rem] 등
 */
export default function LoadingUI({ width = 'w-full' }: LoadingUIProps) {
    return (
        <div className={`relative ${width} p-4 rounded-xl flex gap-4 border-1 hover:border-main-200 hover:shadow-md transition-gathering-item animate-pulse`}>
            {/* 좌측: 썸네일 및 뱃지 */}
            <article className="relative">
                {/* 상단 뱃지 */}
                <div className="absolute top-3 left-3 z-10 bg-main-300 rounded-full px-3 py-1 flex justify-center items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                    <div className="w-16 h-4 bg-gray-300 rounded" />
                </div>
                {/* 썸네일 이미지 */}
                <div className="w-[17.5rem] h-[10rem] rounded-xl bg-gray-200 object-cover" />
            </article>
            {/* 우측: 정보 및 버튼 */}
            <div className="flex flex-col justify-between flex-1 py-2">
                {/* 모임 정보 */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-5 bg-gray-300 rounded-full" />
                        <div className="w-16 h-5 bg-gray-200 rounded-full" />
                    </div>
                    <div className="w-32 h-6 bg-gray-300 rounded" />
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-gray-300 rounded-full" />
                            <div className="w-12 h-3 bg-gray-200 rounded" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="w-16 h-3 bg-gray-200 rounded" />
                            <div className="w-12 h-3 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
                {/* 버튼 영역 */}
                <div className="flex gap-2 mt-4">
                    <div className="w-32 h-8 bg-gray-300 rounded-lg" />
                    <div className="w-32 h-8 bg-gray-200 rounded-lg" />
                </div>
            </div>
        </div>
    );
}