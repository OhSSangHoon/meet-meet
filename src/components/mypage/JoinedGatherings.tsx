'use client';

import { useFetchJoinedGatherings } from '@/hooks/api/mypage/useFetchJoinedGatherings';
import { useLeaveGathering } from '@/hooks/api/gatherings/detail/useLeaveGathering';
import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { formatDate, formatTime, getTimeRemaining } from '@/components/shared/utils/dateFormats';
import { UserRoundCheck, CheckCircle } from "lucide-react"
import dynamic from 'next/dynamic';
import Image from 'next/image';

const LoadingUI = dynamic(() => import('@/components/mypage/shared/ui/LoadingUI'), { ssr: false });
const ConfirmDialog = dynamic(() => import('@/components/shared/ui/ConfirmDialog'), { ssr: false });
const OverlayForDisabled = dynamic(() => import('@/components/shared/ui/OverlayForDisabled'), { ssr: false });
const Button = dynamic(() => import('@/components/shared/ui/Button'), { ssr: false });

/** 마이페이지 참여중인 모임 */
export default function JoinedGatherings({ setSelectedTab, setMyReviewsTab, onOpenReviewDialog }: { setSelectedTab: (tab: number) => void, setMyReviewsTab: (tab: number) => void, onOpenReviewDialog: (gathering: { userId: number, gatheringId: number }) => void }) {
  const { token, userId } = useContext(AuthContext);

  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: gatherings = [], isLoading, error } = useFetchJoinedGatherings(token!);

  const { leaveGathering } = useLeaveGathering({
    token,
    onCallback: (message) => {
      setErrorMessage(message);
      setIsErrorDialogOpen(true);
    },
  });

  const sortedGatherings = [...gatherings].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) {
      const A_REGISTRATION_END = new Date(a.registrationEnd || '').getTime();
      const B_REGISTRATION_END = new Date(b.registrationEnd || '').getTime();
      return B_REGISTRATION_END - A_REGISTRATION_END;
    }
    return a.isCompleted ? 1 : -1;
  });

  if (isLoading) return <LoadingUI />;
  if (error) return <div className="text-red-500">에러: {error.message}</div>;
  if (gatherings.length === 0) return <div className="text-gray-500 text-center">참여한 모임이 없습니다</div>;

  return (
    <div className='px-4 flex flex-col gap-2'>
      {sortedGatherings.map(data => (
        <div
          key={data.id}
          className="relative min-h-[100px] w-full p-4 rounded-xl flex gap-4 border-1 hover:border-main-200 hover:shadow-md transition-gathering-item"
        >
          {/* 마감 완료 및 5명 미만 */}
          <OverlayForDisabled
            filterings={getTimeRemaining(data?.registrationEnd) === '마감됨' && data?.participantCount < 5}
            notice="모집이 취소된 모임입니다"
            reason="(모집 마감 및 최소 인원 미달)"
          />

          {/* 좌측 */}
          <article className='relative'>
            <div className="relative px-3 bg-white/80 rounded-full flex items-center text-xs">
              <div className="absolute top-3 left-3 z-10 bg-main-600 rounded-full px-3 py-1 flex justify-center items-center gap-2">
                <Image src={"/icons/Alarm.svg"} alt="시간" width={24} height={24} />
                <span className="font-medium text-white">{getTimeRemaining(data?.registrationEnd || '')}</span>
              </div>
            </div>
            <Image src={data?.image}
              alt='모임 이미지'
              width={1000}
              height={1000}
              className="w-[17.5rem] h-[10rem] rounded-xl object-cover"
            />
          </article>

          {/* 우측 */}
          <div className='flex flex-col justify-between'>
            {/* 모임 정보 */}
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-1'>
                {/* 마감 완료 및 5명 이상 모집 및 모임 후 '이용 완료' */}
                {getTimeRemaining(data?.registrationEnd) === '마감됨' && data?.participantCount >= 5 && data?.isCompleted && (
                  <div className="px-3 py-1 rounded-full bg-gray-200 self-start text-gray-500 text-xs">이용 완료</div>
                )}
                {/* 마감 미완료 및 모임 전 '이용 예정' */}
                {getTimeRemaining(data?.registrationEnd) !== '마감됨' && !data?.isCompleted && (
                  <div className="px-3 py-1 rounded-full bg-main-200 self-start text-white text-xs">이용 예정</div>
                )}
                {/* 마감 미완료 및 5명 이상 모집 '개설 확정'  */}
                {getTimeRemaining(data?.registrationEnd) !== '마감됨' && data?.participantCount >= 5 && (
                  <div className="px-3 py-1 rounded-full bg-main-200 self-start text-white text-xs flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                    개설 확정
                  </div>
                )}
                {/* 마감 미완료 및 5명 미만 시 '개설 대기' */}
                {getTimeRemaining(data?.registrationEnd) !== '마감됨' && data?.participantCount < 5 && (
                  <div className="px-3 py-1 rounded-full bg-gray-200 self-start text-gray-500 text-xs">개설 대기</div>
                )}
              </div>
              <h1 className="text-xl font-semibold">{data?.name}</h1>
              <p className="text-gray-600">{data?.location}</p>
              <div className='flex items-center gap-4 text-sm font-medium'>
                {/* 참여자 수 */}
                <div className='flex items-center gap-1'>
                  <UserRoundCheck className="w-4 h-4 text-main-500" />
                  <span>{data?.participantCount ?? '-'}/{data?.capacity ?? '-'}</span>
                </div>
                {/* 날짜 */}
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center rounded-md`}>
                    {formatDate(data?.dateTime ?? '')}
                  </span>
                  <span className={`inline-flex items-center rounded-md`}>
                    {formatTime(data?.dateTime ?? '')}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex gap-2'>
              {/* 개설 확정 모임은 참여 상태라면 리뷰 작성이 가능*/}
              {data?.participantCount >= 5 && (
                <div>
                  {data.isReviewed ? (
                    <Button
                      variant='default'
                      text='내가 쓴 리뷰 보기'
                      onClick={() => {
                        setSelectedTab(1);
                        setMyReviewsTab(1);
                      }}
                      customClassName='w-36'
                    />
                  ) : (
                    <Button
                      variant='default'
                      text='리뷰 작성하기'
                      onClick={() => onOpenReviewDialog({ userId, gatheringId: Number(data.id) })}
                      customClassName='w-32'
                    />
                  )}
                </div>
              )}
              {/* 참여 취소 */}
              <Button
                variant='cancel'
                text='참여 취소하기'
                onClick={() => leaveGathering(Number(data?.id))}
                customClassName='w-32'
              />
            </div>

          </div>
        </div>
      ))}

      <ConfirmDialog
        isOpen={isErrorDialogOpen}
        text={errorMessage}
        onClose={() => setIsErrorDialogOpen(false)}
      />
    </div>
  );
}
