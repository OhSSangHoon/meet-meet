'use client';

import Image from 'next/image';

export default function ThumbnailLoading() {
    return (
        <article className='max-w-screen-lg sm:w-[30rem] h-[14rem] bg-gray-50 rounded-lg animate-pulse'>
            <div className="relative px-3 bg-white/80 rounded-full flex items-center text-xs">
                <div className="absolute top-3 left-3 bg-main-600 rounded-full px-3 py-1 flex justify-center items-center gap-2 z-10">
                    <Image
                        src={"https://res.cloudinary.com/dbvzbdffi/image/upload/v1749717734/Alarm_ll6cax.svg"}
                        alt="시계 아이콘"
                        width={24}
                        height={24}
                    />
                    <span className="font-medium text-white">-후 마감</span>
                </div>
            </div>
        </article>
    );
}

