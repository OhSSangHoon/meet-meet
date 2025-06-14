"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';

const JoinedGatherings = dynamic(() => import('@/components/mypage/JoinedGatherings'), { ssr: false });
const MyReviews = dynamic(() => import('@/components/mypage/MyReviews'), { ssr: false });
const CreatedGatherings = dynamic(() => import('@/components/mypage/CreatedGatherings'), { ssr: false });
const CreateReviewDialog = dynamic(() => import('@/components/mypage/CreateReviewDialog'), { ssr: false });

/** 마이페이지 UI */
export default function MyPageUI() {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [myReviewsTab, setMyReviewsTab] = useState(0);
  const [reviewableGathering, setReviewableGathering] = useState<{ userId: number; gatheringId: number } | null>();

  return (
    <>
      {/* 버튼바 */}
      <section className="relative py-4 flex gap-4 justify-between sm:justify-start text-sm sm:text-lg font-bold">
        {[
          { label: "참여중인 모임", value: 0 },
          { label: "나의 리뷰", value: 1 },
          { label: "내가 만든 모임", value: 2 },
        ].map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelectedTab(value)}
            className={`cursor-pointer transition-colors duration-150 ${selectedTab === value ? "text-gray-800 dark:text-main-400" : "text-slate-400 dark:text-gray-200"}`}
          >
            {label}
          </button>
        ))}
        <div
          className="absolute bottom-0 left-0 h-1 rounded-full bg-gray-800 transition-transform duration-300"
        />
      </section>

      {/* 컨텐츠 */}
      {selectedTab === 0 &&
        <JoinedGatherings
          setSelectedTab={setSelectedTab}
          setMyReviewsTab={setMyReviewsTab}
          onOpenReviewDialog={setReviewableGathering}
        />}

      {selectedTab === 1 &&
        <MyReviews
          myReviewsTab={myReviewsTab}
          setMyReviewsTab={setMyReviewsTab}
          onOpenReviewDialog={setReviewableGathering}
        />}

      {selectedTab === 2 && <CreatedGatherings />}

      {
        reviewableGathering && (
          <CreateReviewDialog
            reviewFormData={reviewableGathering}
            onClose={() => setReviewableGathering(null)}
          />
        )
      }
    </>
  );
}
