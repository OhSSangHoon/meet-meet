import { getTimeRemaining } from '@/components/shared/utils/dateFormats';
import Image from 'next/image';

/** 모임 마감 알리미 */
export default function DateReminder({ registrationEnd }: { registrationEnd: string }) {
    return (
        <div className="relative px-3 bg-white/80 rounded-full flex items-center text-xs">
            <div className="absolute top-3 left-3 z-10 bg-main-600 rounded-full px-3 py-1 flex justify-center items-center gap-2">
                <Image src={"https://res.cloudinary.com/dbvzbdffi/image/upload/v1749717734/Alarm_ll6cax.svg"} alt="시간" width={24} height={24} />
                <span className="font-medium text-white">{getTimeRemaining(registrationEnd)}</span>
            </div>
        </div>
    );
}