'use client';

import { useFetchJoinedGatherings } from '@/hooks/api/useFetchJoinedGatherings';
import { useLeaveGathering } from '@/hooks/api/useLeaveGathering';
import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { formatDate, formatTime, getTimeRemaining } from '../shared/utils/format';
import { UserRoundCheck, CheckCircle, Hand } from "lucide-react"
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ConfirmDialog = dynamic(() => import('@/components/shared/ui/ConfirmDialog'), { ssr: false });

export default function JoinedGatherings() {
  const { token } = useContext(AuthContext);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: gatherings = [], isLoading, error } = useFetchJoinedGatherings(token!);

  const { leaveGathering } = useLeaveGathering({
    token,
    onCallback: (message) => {
      setErrorMessage(message);
      setErrorModalOpen(true);
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

  if (isLoading) return <div className="flex h-[100px] w-full items-center justify-center">로딩 중...</div>;
  if (error) return <div className="text-red-500">에러 발생: {error.message}</div>;
  if (gatherings.length === 0) return <div className="text-gray-500">참여한 모임이 없습니다.</div>;

  return (
    <div className='px-4 flex flex-col gap-2'>
      {sortedGatherings.map(data => (
        <div
          key={data.id}
          className="relative min-h-[100px] w-full p-4 rounded-xl flex gap-4 border-1 hover:border-main-200 hover:shadow-md transition-gathering-item"
        >
          {/* 마감된 모임 오버레이 */}
          {new Date(data.registrationEnd) < new Date() && (
            <div className="absolute bg-black/90 inset-0 z-20 flex items-center justify-center text-center rounded-xl">
              <div className="px-4 py-2 rounded-lg flex gap-1 text-sm text-white">
                <Hand className="w-4 h-4 text-main-400" />
                <span>마감되었습니다</span>
              </div>
            </div>
          )}

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
                {/* 마감 완료 및 개설 확정시 '이용 완료' */}
                {data?.isCompleted ? (
                  data.participantCount >= 5 ? (
                    <div className="px-3 py-1 rounded-full bg-gray-200 self-start text-gray-500 text-xs">
                      이용 완료
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-gray-200 self-start text-gray-500 text-xs">
                      개설대기
                    </div>
                  )
                ) : (
                  <>
                    {/* 마감 전: 이용 예정은 무조건 */}
                    <div className="px-3 py-1 rounded-full bg-main-200 self-start text-white text-xs">
                      이용 예정
                    </div>
                    {data.participantCount >= 5 ? (
                      // 마감 전 + 5명 이상: 개설확정
                      <div className="px-3 py-1 rounded-full bg-main-200 self-start text-white text-xs flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                        개설확정
                      </div>
                    ) : (
                      // 마감 전 + 5명 미만: 개설대기
                      <div className="px-3 py-1 rounded-full bg-gray-200 self-start text-gray-500 text-xs">
                        개설대기
                      </div>
                    )}
                  </>
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

            {/* 버튼  */}
            <div>
              {data?.isCompleted && data?.participantCount >= 5 ? (
                data.isReviewed ? (
                  <button
                    type="button"
                    className="max-w-36 padding-button rounded-lg bg-button text-button-text text-sm cursor-pointer hover:opacity-60 transition duration-300 ease-in"
                  >
                    내가 쓴 리뷰 보기
                  </button>
                ) : (
                  <button
                    type="button"
                    className="max-w-36 padding-button rounded-lg bg-button text-button-text text-sm cursor-pointer hover:opacity-60 transition duration-300 ease-in"
                  >
                    리뷰 작성하기
                  </button>
                )
              ) : (
                !data?.isCompleted && (
                  <button
                    type="button"
                    onClick={() => leaveGathering(Number(data?.id))}
                    className="max-w-36 padding-button rounded-lg text-button border-1 border-button text-sm cursor-pointer hover:opacity-60 transition duration-300 ease-in"
                  >
                    참여 취소하기
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={errorModalOpen}
        text={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </div>
  );
}
