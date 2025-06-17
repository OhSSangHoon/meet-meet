'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useFetchMyCreatedReviews } from '@/hooks/api/mypage/useFetchMyCreatedReviews';
import { JoinedGathering } from '@/types/gatherings';
import { ReviewItem } from '@/types/reviews';
import CreatedReview from '@/components/mypage/CreatedReview';
import CreatableReview from '@/components/mypage/CreatableReview';
import Button from '@/components/shared/Button';

interface MyReviewsProps {
  myReviewsTab: number;
  setMyReviewsTab: (tab: number) => void;
  onOpenReviewDialog: (gathering: { userId: number, gatheringId: number }) => void;
}

/** 마이페이지 '나의 리뷰' */
export default function MyReviews({ myReviewsTab, setMyReviewsTab, onOpenReviewDialog }: MyReviewsProps) {
  const { token, userId } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const gatherings = queryClient.getQueryData<JoinedGathering[]>(["joinedGatherings", token]) ?? [];

  // 작성 가능한 모임: 개설 확정 (5명 이상) && 작성하지 않은 모임
  const reviewableGatherings = gatherings.filter((gathering: JoinedGathering) => !gathering.isReviewed && gathering.participantCount >= 5);

  // 작성한 모임
  const reviewedGatherings = gatherings.filter((gathering: JoinedGathering) => gathering.isReviewed);

  // 작성한 리뷰 (작성한 모임의 ID와 유저 ID를 통해 조회)
  const { data: createdReviews } = useFetchMyCreatedReviews(token!, reviewedGatherings.map(gathering => gathering.id), userId);

  const FILTER_BUTTON_STYLE = 'shadow-sm text-gray-700 text-sm hover:bg-main-apricot'

  return (
    <section className="flex w-full flex-col justify-start gap-4">
      <nav className="flex justify-center sm:justify-start items-center gap-2">
        <Button
          variant='default'
          text='작성 가능한 리뷰'
          onClick={() => setMyReviewsTab(0)}
          customClassName={`${myReviewsTab === 0 ? 'bg-main-apricot' : 'bg-slate-100 dark:bg-gray-700 dark:text-white'} ${FILTER_BUTTON_STYLE}`}
        />
        <Button
          variant='default'
          text='작성한 리뷰'
          onClick={() => setMyReviewsTab(1)}
          customClassName={`${myReviewsTab === 1 ? 'bg-main-apricot' : 'bg-slate-100 dark:bg-gray-700 dark:text-white'} ${FILTER_BUTTON_STYLE}`}
        />
      </nav>

      {myReviewsTab === 0 ? (
        !reviewableGatherings || reviewableGatherings.length === 0 ?
          <span className="text-gray-500 text-center">작성 가능한 리뷰가 없어요</span>
          :
          <section className="flex flex-col gap-4">
            {reviewableGatherings.map((gathering: JoinedGathering) => (
              <CreatableReview
                key={gathering.id}
                gathering={gathering}
                myReviewsTab={myReviewsTab}
                userId={userId}
                onOpenReviewDialog={onOpenReviewDialog}
              />
            ))}
          </section>
      ) :
        (
          !createdReviews || createdReviews?.length === 0 ?
            <span className="text-gray-500 text-center">아직 작성한 리뷰가 없어요</span>
            :
            <section className='flex flex-col gap-4'>
              {createdReviews?.map((review: ReviewItem) => (
                <div key={`${review?.Gathering?.id}-${review?.id}`}
                  className={`relative w-full p-4 rounded-xl border-1 hover:border-main-200 hover:shadow-md transition-gathering-item ${myReviewsTab === 0 ? 'bg-main-apricot' : 'dark:bg-gray-700 dark:text-white'}`}
                ><CreatedReview review={review} /></div>
              ))}
            </section>
        )
      }
    </section >
  );
}
