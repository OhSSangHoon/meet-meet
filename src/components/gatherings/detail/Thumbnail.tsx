import { Gathering } from '@/types/gatherings'
import { getTimeRemaining } from '@/components/shared/utils/format'
import Image from 'next/image'
import SaveToggleButton from '../shared/ui/SaveToggleButton'


export default function Thumbnail({ detail, id }: { detail: Gathering, id: string }) {
    return (
        <article className='max-w-screen-lg sm:w-[30rem] h-[14rem] relative'>
            <div className="relative px-3 bg-white/80 rounded-full flex items-center text-xs">
                <div className="absolute top-3 left-3 bg-main-600 rounded-full px-3 py-1 flex justify-center items-center gap-2 z-10">
                    <Image src={"/icons/Alarm.svg"} alt="시간" width={24} height={24} />
                    <span className="font-medium text-white">{getTimeRemaining(detail?.registrationEnd || '')}</span>
                </div>
            </div>
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