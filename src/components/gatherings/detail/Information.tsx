import { Participant } from '@/app/gatherings/detail/[id]/ClientPage';
import { formatDate, formatTime } from '@/components/shared/utils/format';
import { Gathering } from '@/types/gatherings';
import { Check, UserRoundCheck } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from 'next/image';
import SaveToggleButton from '../shared/ui/SaveToggleButton';
import JoinedCountsProgressBar from '../shared/ui/JoinedCountsProgressBar';

export default function Information({ detail, id, participants }: { detail: Gathering, id: string, participants: Participant[] }) {
    return (
        <article className='max-w-screen-lg sm:w-[30rem] h-[14rem] px-6 py-5 border-2 border-gray-300 bg-white rounded-lg flex flex-col justify-between gap-4 overflow-hidden'
        >
            {/* 상단 */}
            <div className='flex justify-between gap-8'>
                {/* LEFT */}
                <div className='flex flex-col'>
                    {/* 제목, 주소 */}
                    <div className="flex flex-col min-w-0">
                        <h2 className="text-xl font-bold max-w-full" title={detail?.name}>
                            {detail?.name
                                ? detail.name.length > 20
                                    ? detail.name.slice(0, 20) + '...'
                                    : detail.name
                                : ''}
                        </h2>
                        <span className="text-gray-500">{detail?.location || '장소'}</span>
                    </div>
                    {/* 날짜 시간 */}
                    <div className="flex sm:hidden md:flex items-center gap-1 text-sm text-gray-500">
                        <span>{formatDate(detail?.dateTime || 'OOOO-OO-OO')}</span>
                        <span>·</span>
                        <span>{formatTime(detail?.dateTime || 'OO:OO')}</span>
                    </div>
                </div>
                {/* RIGHT 찜하기 버튼 */}
                <div className='hidden sm:flex'>
                    <SaveToggleButton gatheringId={id} />
                </div>
            </div>
            <div className="w-full border-t-2 border-dotted border-gray-300"></div>
            {/* 하단 */}
            <div className='flex flex-col gap-1'>
                {/* 모집정원, 개설확정 */}
                <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className='flex items-center gap-1'>
                            <UserRoundCheck className='w-4 h-4 text-main-500' />
                            <span>{detail?.participantCount}명 참여 중</span>
                        </div>
                        {/* 참여자들의 프로필 이미지 */}
                        <TooltipProvider>
                            <div className="flex items-center">
                                {participants?.slice(0, 4).map((participant: Participant, i: number) => (
                                    <Image
                                        key={participant?.User?.id}
                                        src={participant?.User?.image || '/icons/default_profile_image.svg'}
                                        alt="프로필 이미지"
                                        width={100}
                                        height={100}
                                        className={`w-8 h-8 rounded-full border-2 border-white ${i === 0 ? 'ml-0' : '-ml-2'}`}
                                    />
                                ))}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center cursor-pointer">
                                            <span className='text-sm font-semibold'>
                                                {participants?.length - 4 > 0 ? `+${participants?.length - 4}` : '+0'}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="center" className="flex gap-1 bg-white border border-button rounded-lg p-2 shadow-lg">
                                        {participants?.slice(4).length > 0 ? (
                                            participants?.slice(4).map((participant: Participant, i: number) => (
                                                <Image
                                                    key={participant?.User?.id}
                                                    src={participant?.User?.image || '/icons/default_profile_image.svg'}
                                                    alt="프로필 이미지"
                                                    width={100}
                                                    height={100}
                                                    className={`w-8 h-8 rounded-full border-2 border-white ${i === 0 ? 'ml-0' : '-ml-2'}`}
                                                />
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400">아직 없습니다</span>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>
                    {detail && detail?.participantCount >= 5 ? (
                        <div className='flex items-center gap-2'>
                            <div className='p-1 bg-main-300 rounded-full'>
                                <Check className='text-white w-3 h-3' />
                            </div>
                            <span>개설확정</span>
                        </div>
                    ) : null}
                </div>
                {/* 프로그레스 바 */}
                <JoinedCountsProgressBar participantCount={detail?.participantCount} capacity={detail?.capacity} />
                {/* 최소인원, 최대인원 */}
                <div className="flex justify-between text-sm">
                    <span>최소 5명</span>
                    <span>최대 {detail?.capacity}명</span>
                </div>
            </div>
        </article>
    )
}