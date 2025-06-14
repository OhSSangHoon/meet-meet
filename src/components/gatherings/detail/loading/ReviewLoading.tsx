'use client';

import { Heart } from 'lucide-react';

interface ReviewLoadingProps {
    width: string;
    height: string;
}

const DIV_STYLE = 'h-2 bg-gray-300 shadow-md rounded';

/**
 * 모임 상세 페이지 로딩 스켈레톤
 * @prop {string} width w-2, w-full, w-[10rem]
 * @prop {string} height h-2, h-full, h-[10rem]
 */
export default function ReviewLoading({ width = 'w-1/4', height = 'h-32' }: ReviewLoadingProps) {

    return (
        <div className={`${width} ${height} m-auto flex flex-col gap-4 animate-pulse`} >
            {/* 하트 */}
            <div className='flex gap-1'>{Array.from({ length: 5 }).map((_, index) => (
                <Heart key={index} className="size-4 fill-gray-300 text-gray-300" />
            ))}</div>
            {/* 본문 */}
            <div className={`w-20 ${DIV_STYLE}`} />
            {/* 닉네임 | 날짜 */}
            <div className='flex items-center gap-1'>
                <div className={`w-12 ${DIV_STYLE}`} />
                <span className='text-gray-300'>|</span>
                <div className={`w-12 ${DIV_STYLE}`} />
            </div>
        </div>
    );
}