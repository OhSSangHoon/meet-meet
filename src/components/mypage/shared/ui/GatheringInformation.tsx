import { formatDate, formatTime } from "@/components/shared/utils/dateFormats";
import { Gathering } from '@/types/gatherings';
import { UserRoundCheck } from "lucide-react";

const DATE_STYLE = 'inline-flex items-center rounded-md';

export default function GatheringInformation({ data, children }: { data: Gathering, children?: React.ReactNode }) {
    return (
        <div className='flex flex-col gap-2 sm:gap-1 justify-between'>
            <div className='flex flex-col gap-2 sm:gap-1'>
                {/* 모임 이름  */}
                <span className="text-lg sm:text-xl font-semibold">{data?.name}</span>
                {/* 장소  */}
                <span className="text-sm sm:text-base text-gray-600 dark:text-white">{data?.location}</span>
            </div>
            <div className='flex items-center gap-4 text-sm font-medium'>
                {/* 참여자 수 */}
                <div className='flex items-center gap-1'>
                    <UserRoundCheck className="size-4 text-main-500" />
                    <span>{data?.participantCount ?? '-'}/{data?.capacity ?? '-'}</span>
                </div>
                {/* 날짜 */}
                <div className="flex flex-wrap gap-2">
                    <span className={DATE_STYLE}>{formatDate(data?.dateTime ?? '')}</span>
                    <span className={DATE_STYLE}>{formatTime(data?.dateTime ?? '')}</span>
                </div>
            </div>
            {children}
        </div>
    );
}