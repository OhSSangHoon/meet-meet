'use client';

import { Gathering } from '@/types/gatherings'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const SaveToggleButton = dynamic(() => import('@/components/gatherings/shared/ui/SaveToggleButton'), { ssr: false });
const DateReminder = dynamic(() => import('@/components/shared/ui/DateReminder'), { ssr: false });

/** 모임 상세 페이지 썸네일 */
export default function Thumbnail({ detail, id }: { detail: Gathering, id: string }) {
    return (
        <article className='max-w-screen-lg sm:w-[30rem] h-[14rem] relative'>
            <DateReminder registrationEnd={detail?.registrationEnd} />
            <Image src={detail?.image}
                alt='모임 이미지'
                width={1000}
                height={1000}
                className='w-full h-full object-cover rounded-lg'
            />
            <div className='absolute sm:hidden top-3 right-3'>
                <SaveToggleButton gatheringId={id} />
            </div>
        </article>
    )
}