'use client';

import { useFetchCreatedGatherings } from '@/hooks/api/mypage/useFetchCreatedGatherings';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { getTimeRemaining } from '@/utils/shared/date';
import dynamic from 'next/dynamic';
import ImageWithFallback from '@/components/shared/ui/ImageWithFallback';
import GatheringInformation from '@/components/mypage/shared/ui/GatheringInformation';
import DateReminder from '@/components/shared/ui/DateReminder'

const LoadingUI = dynamic(() => import('@/components/mypage/shared/ui/LoadingUI'), { ssr: false });

/** 마이페이지 '내가 만든 모임' */
export default function CreatedGatherings() {
  const { token, userId } = useContext(AuthContext);

  const { data: gatheringsRaw = [], isLoading, error } = useFetchCreatedGatherings(token!, userId);

  const gatherings = gatheringsRaw.filter(gathering => {
    return getTimeRemaining(gathering.registrationEnd) !== '마감됨';
  });


  if (isLoading) return <LoadingUI />;
  if (error) return <p className="text-center text-red-500">에러: {(error as Error).message}</p>;
  if (!isLoading && !error && gatherings.length === 0) return <p className="text-center text-gray-500">내가 만든 모임이 없어요</p>;

  return (
    <section className='flex flex-col gap-2 dark:bg-dark-2'>
      <div className="flex w-full flex-col gap-4">
        {!isLoading && !error && gatherings.map(gathering => {
          return (
            <div
              key={gathering.id}
              className="relative min-h-[100px] w-full p-4 rounded-xl flex flex-col sm:flex-row gap-4 border-1 hover:border-main-200 hover:shadow-md transition-gathering-item"
            >
              {/* 좌측 이미지 */}
              <article className='relative'>
                <DateReminder registrationEnd={gathering?.registrationEnd} />
                <ImageWithFallback
                  src={gathering?.image}
                  fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1749802823/fallback_otg1es.avif'
                  alt='모임 썸네일'
                  width={1000}
                  height={1000}
                  className="w-[17.5rem] h-[10rem] rounded-xl object-cover pointer-events-none"
                />
              </article>

              {/* 우측 정보 */}
              <article className='flex flex-col justify-between'>
                <GatheringInformation data={gathering} />
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
