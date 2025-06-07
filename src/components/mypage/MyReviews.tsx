'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { formatDate, formatTime } from '@/components/shared/utils/dateFormats';
import { useFetchMyCreatedReviews } from '@/hooks/api/mypage/useFetchMyCreatedReviews';
import { JoinedGathering } from '@/types/gatherings';
import { ReviewItem } from '@/types/reviews';
import { Heart, UserRoundCheck } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Button from '../shared/ui/Button';

const CreateReviewDialog = dynamic(() => import('./CreateReviewDialog'), { ssr: false });

/** 마이페이지 나의 리뷰 */
export default function MyReviews({ teamId }: { teamId: string }) {
  const { token, userId } = useContext(AuthContext);

  const [tab, setTab] = useState(0);
  const [reviewableGathering, setReviewableGathering] = useState<{
    teamId: string;
    userId: number;
    gatheringId: number
  } | null>(null);

  const queryClient = useQueryClient();
  const gatherings = queryClient.getQueryData<JoinedGathering[]>(["joinedGatherings", token]) ?? [];

  // 작성 가능한 모임: 개설 확정 (5명 이상) && 작성하지 않은 모임
  const reviewableGatherings = gatherings.filter((gathering: JoinedGathering) => !gathering.isReviewed && gathering.participantCount >= 5);

  // 작성한 모임
  const reviewedGatherings = gatherings.filter((gathering: JoinedGathering) => gathering.isReviewed);

  // 작성한 리뷰 (작성한 모임의 ID와 유저 ID를 통해 조회)
  const { data: createdReviews } = useFetchMyCreatedReviews(token!, reviewedGatherings.map(gathering => gathering.id), userId);

  return (
    <div className="px-4 flex w-full flex-col justify-start gap-5">
      <div className="flex items-center gap-2">
        {/* 작성 가능한 리뷰, 작성한 리뷰 버튼 */}
        <button
          type="button"
          onClick={() => setTab(0)}
          className={`rounded-lg px-4 py-2 text-sm transition-colors ${tab === 0 ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'} cursor-pointer`}
        >
          작성 가능한 리뷰
        </button>
        <button
          type="button"
          onClick={() => setTab(1)}
          className={`rounded-lg px-4 py-2 text-sm transition-colors ${tab === 1 ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'} cursor-pointer`}
        >
          작성한 리뷰
        </button>
      </div>

      {/* 리뷰 */}
      {tab === 0 ? (
        reviewableGatherings.length === 0 ?
          <span className="text-gray-500 text-center">작성 가능한 리뷰가 없어요</span>
          :
          <div className="flex flex-col gap-4">
            {reviewableGatherings.map((gathering: JoinedGathering) => (
              <div
                key={gathering.id}
                className="relative min-h-[100px] w-full p-4 rounded-xl flex gap-4 border-1 hover:border-main-200 hover:shadow-md transition-gathering-item"
              >
                {/* 이미지 */}
                <div className="flex-shrink-0">
                  <Image
                    src={gathering.image ?? ''}
                    alt="모임 이미지"
                    width={1000}
                    height={1000}
                    className="w-[17.5rem] h-[10rem] rounded-xl object-cover"
                  />
                </div>
                {/* 정보 + 버튼 */}
                <div className="flex flex-col justify-between">
                  {/* 정보 */}
                  <div className='flex flex-col gap-1'>
                    <h1 className="text-xl font-semibold">{gathering.name}</h1>
                    <p className="text-gray-600">{gathering?.location}</p>
                    <div className='flex items-center gap-4 text-sm font-medium'>
                      <div className='flex items-center gap-1'>
                        <UserRoundCheck className="w-4 h-4 text-main-500" />
                        <span>{gathering.participantCount ?? '-'}/{gathering.capacity ?? '-'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center rounded-md`}>
                          {formatDate(gathering?.dateTime ?? '')}
                        </span>
                        <span className={`inline-flex items-center rounded-md`}>
                          {formatTime(gathering?.dateTime ?? '')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* 버튼 */}
                  {tab === 0 && (
                    <Button
                      variant='default'
                      text='리뷰 작성하기'
                      onClick={() => setReviewableGathering({ teamId, userId: userId, gatheringId: Number(gathering.id) })}
                      customClassName='w-32'
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
      ) :
        (
          createdReviews?.length === 0 ?
            <span className="text-gray-500 text-center">아직 작성한 리뷰가 없어요</span>
            :
            <div
              className="relative min-h-[100px] w-full p-4 rounded-xl flex gap-4 border-1 hover:border-main-200 hover:shadow-md transition-gathering-item"
            >
              {createdReviews?.map((review: ReviewItem) => (
                <div key={`${review?.Gathering?.id}-${review?.id}`} className='flex gap-4'>
                  {/* 이미지 */}
                  <div className="flex-shrink-0">
                    <Image
                      src={review?.Gathering?.image ?? ''}
                      alt="모임 이미지"
                      width={1000}
                      height={1000}
                      className="w-[17.5rem] h-[10rem] rounded-xl object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className='flex items-center gap-1'>
                      {Array.from({ length: review?.score }).map((_, index) => (
                        <Heart key={index} className="w-4 h-4 text-main-500 fill-main-500" />
                      ))}
                    </div>
                    <p>{review?.comment}</p>
                    <div className='flex gap-1 items-center'>
                      <h1 className="text-xl font-semibold">{review?.Gathering?.name}</h1>
                      <p className="text-gray-600">{review?.Gathering?.location}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center rounded-md`}>
                        {formatDate(review?.Gathering?.dateTime ?? '')}
                      </span>
                      <span className={`inline-flex items-center rounded-md`}>
                        {formatTime(review?.Gathering?.dateTime ?? '')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        )
      }

      {/* 리뷰 작성 모달 */}
      {reviewableGathering && (
        <CreateReviewDialog
          reviewFormData={reviewableGathering}
          onClose={() => setReviewableGathering(null)}
        />
      )}
    </div >
  );
}
