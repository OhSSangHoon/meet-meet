'use client';

import { Gathering } from '@/types/gatherings'
import dynamic from 'next/dynamic'
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import DateReminder from '@/components/shared/DateReminder';

const SaveToggleButton = dynamic(() => import('@/components/shared/SaveToggleButton'), { ssr: false });

/** 모임 상세 페이지 썸네일 */
export default function Thumbnail({ detail, id }: { detail: Gathering, id: string }) {
    return (
        <article className='max-w-screen-lg sm:w-[30rem] h-[14rem] relative'>
            <DateReminder registrationEnd={detail?.registrationEnd} />
            <ImageWithFallback
                src={detail?.image}
                fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1750048546/error_fallback_icbngz.avif'
                alt='모임 썸네일'
                width={1000}
                height={1000}
                sizes="(max-width: 401px) 300px, (max-width: 801px) 500px, 1000px"
                priority
                className='w-full h-full object-cover rounded-lg'
            />
            <div className='absolute sm:hidden top-3 right-3'>
                <SaveToggleButton gatheringId={id} />
            </div>
        </article>
    )
}