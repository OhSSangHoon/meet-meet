'use client';

import { useFetchJoinedGatherings } from '@/hooks/api/mypage/useFetchJoinedGatherings';
import { useLeaveGathering } from '@/hooks/api/gatherings/detail/useLeaveGathering';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { getTimeRemaining, toKoreanTime } from '@/utils/shared/date';
import { THUMBNAIL_CLASSNAME, THUMBNAIL_WIDTH } from '@/utils/mypage/constants/thumbnailConstants';
import { CheckCircle } from "lucide-react"
import dynamic from 'next/dynamic';
import Button from '@/components/shared/Button';
import GatheringInformation from '@/components/mypage/GatheringInformation';
import DateReminder from '@/components/shared/DateReminder';
import ImageWithFallback from '@/components/shared/ImageWithFallback';

const GatheringSkeleton = dynamic(() => import('@/components/mypage/GatheringSkeleton'), { ssr: false });
const ConfirmDialog = dynamic(() => import('@/components/shared/ConfirmDialog'), { ssr: false });
const OverlayForDisabled = dynamic(() => import('@/components/shared/OverlayForDisabled'), { ssr: false });

interface JoinedGatheringsProps {
  setSelectedTab: (tab: number) => void;
  setMyReviewsTab: (tab: number) => void;
  onOpenReviewDialog: (gathering: { userId: number, gatheringId: number }) => void;
}

const DEACTIVATED_STYLE = 'px-3 py-1 rounded-full bg-slate-200 self-start text-gray-500 text-xs';
const ACTIVATED_STYLE = 'px-3 py-1 rounded-full bg-main-200 dark:bg-main-500 self-start text-white text-xs'

/** 마이페이지 '참여중인 모임' */
export default function JoinedGatherings({ setSelectedTab, setMyReviewsTab, onOpenReviewDialog }: JoinedGatheringsProps) {
  const { token, userId, signOut } = useContext(AuthContext);

  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: gatherings = [], isLoading, error, errorMessage: fetchErrorMessage } = useFetchJoinedGatherings(token!);

  const { leaveGathering } = useLeaveGathering({
    token,
    onCallback: (message) => {
      setErrorMessage(message);
      setIsErrorDialogOpen(true);
    },
  });

  // 참여 모임 데이터 페칭 에러 발생 시, 에러 메시지 팝업 (토큰 만료)
  useEffect(() => {
    if (fetchErrorMessage) {
      setErrorMessage(fetchErrorMessage);
      setIsErrorDialogOpen(true);
    }
  }, [fetchErrorMessage]);

  const handleErrorDialogClose = () => {
    setIsErrorDialogOpen(false);
    if (errorMessage === '로그인이 만료되었습니다') signOut();
  };

  const sortedGatherings = [...gatherings].sort((a, b) => {
    // 완료 상태가 같은 경우, 마감일 기준으로 정렬 (최신 마감일 우선)
    if (a.isCompleted === b.isCompleted) {
      const aRegistrationEnd = a.registrationEnd ? toKoreanTime(a.registrationEnd).getTime() : 0;
      const bRegistrationEnd = b.registrationEnd ? toKoreanTime(b.registrationEnd).getTime() : 0;
      return bRegistrationEnd - aRegistrationEnd;
    }
    return a.isCompleted ? 1 : -1;
  });

  if (isLoading) return <GatheringSkeleton />;
  if (error && !fetchErrorMessage) return <div className="text-red-500">에러: {error.message}</div>;
  if (gatherings.length === 0 && !error) return <div className="text-gray-500 text-center">참여한 모임이 없습니다</div>;

  return (
    <section className='flex flex-col gap-2'>
      {sortedGatherings.map(data => (
        <article
          key={data.id}
          className="relative min-h-[100px] w-full p-4 rounded-xl flex flex-col sm:flex-row gap-4 border-1 hover:border-main-200 hover:shadow-md transition-gathering-item dark:bg-dark-2 dark:text-white"
        >
          {/* 마감 완료 및 5명 미만 */}
          <OverlayForDisabled
            filterings={getTimeRemaining(data?.registrationEnd) === '마감됨' && data?.participantCount < 5}
            notice="모집이 취소된 모임입니다"
            reason="(모집 마감 및 최소 인원 미달)"
          />

          {/* 좌측 */}
          <figure className='relative'>
            <DateReminder registrationEnd={data?.registrationEnd} />
            <ImageWithFallback
              src={data?.image}
              fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1750048546/error_fallback_icbngz.avif'
              alt='모임 썸네일'
              width={1000}
              height={1000}
              sizes="(max-width: 401px) 300px, (max-width: 801px) 500px, 1000px"
              priority
              className={`${THUMBNAIL_WIDTH} ${THUMBNAIL_CLASSNAME}`}
            />
          </figure>

          {/* 우측 */}
          <article className='flex flex-col gap-2 sm:gap-0 justify-between'>
            {/* 모임 정보 */}
            <div className='flex flex-col gap-2 sm:gap-1'>
              <div className='flex items-center gap-1'>
                {/* 마감 완료 및 5명 이상 모집 및 모임 후 '이용 완료' */}
                {getTimeRemaining(data?.registrationEnd) === '마감됨' && data?.participantCount >= 5 && data?.isCompleted && (
                  <div className={DEACTIVATED_STYLE}>이용 완료</div>)}

                {/* 마감 미완료 및 모임 전 '이용 예정' */}
                {getTimeRemaining(data?.registrationEnd) !== '마감됨' && !data?.isCompleted && (
                  <div className={`${ACTIVATED_STYLE}`}>이용 예정</div>)}

                {/* 마감 미완료 및 5명 이상 모집 '개설 확정'  */}
                {getTimeRemaining(data?.registrationEnd) !== '마감됨' && data?.participantCount >= 5 && (
                  <div className={`${ACTIVATED_STYLE} flex items-center gap-1`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                    개설 확정
                  </div>)}

                {/* 마감 미완료 및 5명 미만 시 '개설 대기' */}
                {getTimeRemaining(data?.registrationEnd) !== '마감됨' && data?.participantCount < 5 && (
                  <div className={DEACTIVATED_STYLE}>개설 대기</div>)}
              </div>
              <GatheringInformation data={data} />
            </div>

            <div className='flex text-xs sm:text-base gap-2'>
              {/* 개설 확정 모임이여야 리뷰 관련 버튼 표시*/}
              {data?.participantCount >= 5 && (
                <div>
                  {/* 리뷰 작성 완료 */}
                  {data.isReviewed ? (
                    <Button
                      variant='default'
                      text='내가 쓴 리뷰 보기'
                      onClick={() => {
                        setSelectedTab(1);
                        setMyReviewsTab(1);
                      }}
                      customClassName='w-32 sm:w-36 text-sm md:text-base'
                    />
                  ) : (
                    // 리뷰 작성 미완료 
                    <Button
                      variant='default'
                      text='리뷰 남기기'
                      onClick={() => onOpenReviewDialog({ userId, gatheringId: Number(data.id) })}
                      customClassName='w-28 sm:w-32 text-sm md:text-base'
                    />
                  )}
                </div>
              )}

              {/* 참여 취소 버튼 */}
              <Button
                variant='cancel'
                text='참여 취소하기'
                onClick={() => leaveGathering(Number(data?.id))}
                customClassName='w-28 sm:w-32 text-sm md:text-base'
              />
            </div>
          </article>
        </article>
      ))}

      <ConfirmDialog
        isOpen={isErrorDialogOpen}
        text={errorMessage}
        onClose={handleErrorDialogClose}
      />
    </section>
  );
}
