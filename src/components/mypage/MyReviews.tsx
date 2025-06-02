'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { formatDate, formatTime } from '../shared/utils/format';
import { JoinedGathering } from '@/types/gatherings';
import { UserRoundCheck } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const CreateReviewDialog = dynamic(() => import('./CreateReviewDialog'), { ssr: false });

export default function MyReviews({ teamId }: { teamId: string }) {
  const { token, userId } = useContext(AuthContext);

  const [reviews, setReviews] = useState(0);
  const [reviewableGathering, setReviewableGathering] = useState<{
    teamId: string;
    userId: number;
    gatheringId: number
  } | null>(null);

  const queryClient = useQueryClient();
  const gatherings = queryClient.getQueryData<JoinedGathering[]>(["joinedGatherings", token]) ?? [];
  // 리뷰 가능한 모임: 마감 완료 && 개설 확정 (5명 이상) && 작성하지 않은 모임들
  const reviewableGatherings = gatherings.filter((gathering: JoinedGathering) => !gathering.isReviewed && gathering.isCompleted && gathering.participantCount >= 5);
  // 리뷰한 모임들 -> 필터링된 id들을 파라미터로 /{teamId}/reviews 요청
  const reviewedGatherings = gatherings.filter((gathering: JoinedGathering) => gathering.isReviewed);
  // 탭 선택에 따라 리스트 변경
  const list = reviews === 0 ? reviewableGatherings : reviewedGatherings;

  return (
    <div className="px-4 flex w-full flex-col justify-start gap-5">
      <div className="flex items-center gap-2">
        {/* 작성 가능한 리뷰, 작성한 리뷰 버튼 */}
        <button
          type="button"
          onClick={() => setReviews(0)}
          className={`rounded-lg px-4 py-2 text-sm transition-colors ${reviews === 0 ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'} cursor-pointer`}
        >
          작성 가능한 리뷰
        </button>
        <button
          type="button"
          onClick={() => setReviews(1)}
          className={`rounded-lg px-4 py-2 text-sm transition-colors ${reviews === 1 ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'} cursor-pointer`}
        >
          작성한 리뷰
        </button>
      </div>

      {/* 리뷰 */}
      {list.length === 0 ? (
        <span className="flex h-[100px] w-full items-center justify-center text-gray-700">
          {reviews === 0
            ? '작성 가능한 리뷰가 없어요'
            : '아직 작성한 리뷰가 없어요'}
        </span>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((gathering: JoinedGathering) => (
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
                {reviews === 0 && (
                  <button
                    type="button"
                    className="max-w-36 padding-button rounded-lg bg-main-500 text-sm text-white cursor-pointer hover:opacity-70"
                    onClick={() => setReviewableGathering({ teamId, userId: userId, gatheringId: Number(gathering.id) })}
                  >
                    리뷰 작성하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
