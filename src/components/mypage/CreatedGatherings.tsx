'use client';

import { useFetchCreatedGatherings } from '@/hooks/api/mypage/useFetchCreatedGatherings';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { formatDate, formatTime, getTimeRemaining } from '@/components/shared/utils/dateFormats';
import { UserRoundCheck } from "lucide-react"
import Image from 'next/image';
import dynamic from 'next/dynamic';

const LoadingUI = dynamic(() => import('@/components/mypage/shared/ui/LoadingUI'), { ssr: false });
const OverlayForDisabled = dynamic(() => import('@/components/shared/ui/OverlayForDisabled'), { ssr: false });

/** 마이페이지 내가 만든 모임 */
export default function CreatedGatherings() {
  const { token, userId } = useContext(AuthContext);

  const { data: gatherings = [], isLoading, error } = useFetchCreatedGatherings(token!, userId);

  if (isLoading) return <LoadingUI />;
  if (error) return <p className="text-center text-red-500">에러: {(error as Error).message}</p>;
  if (!isLoading && !error && gatherings.length === 0) return <p className="text-center text-gray-500">내가 만든 모임이 없어요</p>;

  return (
    <div className='px-4 flex flex-col gap-2'>
      <div className="flex w-full flex-col gap-4">

        {!isLoading && !error && gatherings.map(gathering => {
          return (
            <div
              key={gathering.id}
              className="relative min-h-[100px] w-full p-4 rounded-xl flex gap-4 border-1 hover:border-main-200 hover:shadow-md transition-gathering-item"
            >
              <OverlayForDisabled
                filterings={getTimeRemaining(gathering?.registrationEnd) === '마감됨' && gathering.participantCount < 5}
                notice="마감되었습니다"
                reason="(모집 마감)"
              />
              {/* 좌측 */}
              <article className='relative'>
                <div className="relative px-3 bg-white/80 rounded-full flex items-center text-xs">
                  <div className="absolute top-3 left-3 bg-main-600 rounded-full px-3 py-1 flex justify-center items-center gap-2 z-10">
                    <Image src={"/icons/Alarm.svg"} alt="시간" width={24} height={24} />
                    <span className="font-medium text-white">{getTimeRemaining(gathering?.registrationEnd || '')}</span>
                  </div>
                </div>
                <Image src={gathering?.image}
                  alt='모임 이미지'
                  width={1000}
                  height={1000}
                  className="w-[17.5rem] h-[10rem] rounded-xl object-cover"
                />
              </article>

              {/* 우측 정보 */}
              <div className='flex flex-col justify-between'>
                <div className='flex flex-col gap-1'>
                  <h3 className="text-xl font-semibold text-gray-800">{gathering.name}</h3>
                  <p className="text-gray-600">{gathering.location}</p>
                  <div className='flex items-center gap-4 text-sm font-medium'>
                    {/* 참여자 수 */}
                    <div className='flex items-center gap-1'>
                      <UserRoundCheck className={`w-4 h-4 text-main-500`} />
                      <span>{gathering.participantCount}/{gathering.capacity}</span>
                    </div>
                    {/* 날짜/시간 */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center rounded-md`}>
                        {formatDate(gathering.dateTime)}
                      </span>
                      <span className={`inline-flex items-center rounded-md`}>
                        {formatTime(gathering.dateTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
