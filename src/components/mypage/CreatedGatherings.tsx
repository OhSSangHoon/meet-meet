'use client';

import { useFetchCreatedGatherings } from '@/hooks/api/mypage/useFetchCreatedGatherings';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { getTimeRemaining } from '@/utils/shared/date';
import { THUMBNAIL_CLASSNAME, THUMBNAIL_WIDTH } from '@/utils/mypage/constants/thumbnailConstants';
import dynamic from 'next/dynamic';
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import GatheringInformation from '@/components/mypage/GatheringInformation';
import DateReminder from '@/components/shared/DateReminder'

const GatheringSkeleton = dynamic(() => import('@/components/mypage/GatheringSkeleton'), { ssr: false });

/** 마이페이지 '내가 만든 모임' */
export default function CreatedGatherings() {
  const { token, userId } = useContext(AuthContext);

  const { data: gatheringsRaw = [], isLoading, error } = useFetchCreatedGatherings(token!, userId);

  const gatherings = gatheringsRaw.filter(gathering => {
    return getTimeRemaining(gathering.registrationEnd) !== '마감됨';
  });


  if (isLoading) return <GatheringSkeleton />;
  if (error) return <p className="text-center text-red-500">에러: {(error as Error).message}</p>;
  if (!isLoading && !error && gatherings.length === 0) return <p className="text-center text-gray-500">내가 만든 모임이 없어요</p>;

  return (
    <section className='flex w-full flex-col gap-2'>
      {!isLoading && !error && gatherings.map(gathering => {
        return (
          <article
            key={gathering.id}
            className="relative min-h-[100px] w-full p-4 rounded-xl border-1 hover:border-main-200 dark:bg-dark-2 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-gathering-item"
          >
            {/* 좌측 이미지 */}
            <div className='relative'>
              <DateReminder registrationEnd={gathering?.registrationEnd} />
              <ImageWithFallback
                src={gathering?.image}
                fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1750048546/error_fallback_icbngz.avif'
                alt='모임 썸네일'
                width={1000}
                height={1000}
                sizes="(max-width: 401px) 300px, (max-width: 801px) 500px, 1000px"
                priority
                className={`${THUMBNAIL_WIDTH} ${THUMBNAIL_CLASSNAME}`}
              />
            </div>

            {/* 우측 정보 */}
            <div className='flex flex-col justify-between'>
              <GatheringInformation data={gathering} />
            </div>
          </article>
        );
      })}
    </section>
  );
}
