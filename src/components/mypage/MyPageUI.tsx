"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';

const ProfileCard = dynamic(() => import('@/components/mypage/ProfileCard'), { ssr: false });
const JoinedGatherings = dynamic(() => import('@/components/mypage/JoinedGatherings'), { ssr: false });
const MyReviews = dynamic(() => import('@/components/mypage/MyReviews'), { ssr: false });
const CreatedGatherings = dynamic(() => import('@/components/mypage/CreatedGatherings'), { ssr: false });
const CreateReviewDialog = dynamic(() => import('@/components/mypage/shared/ui/CreateReviewDialog'), { ssr: false });

/** 마이페이지 UI */
export default function MyPageUI() {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [myReviewsTab, setMyReviewsTab] = useState(0);
  const [reviewableGathering, setReviewableGathering] = useState<{ userId: number; gatheringId: number } | null>();

  return (
    <main className="contents-container">
      <div className="pt-10 px-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-700">마이 페이지</h1>

        {/* 프로필 카드 */}
        <ProfileCard />

        {/* 탭 네비게이션 */}
        <div className=" border-t-[3px] border-gray-800">
          <div className="px-4 py-4 flex gap-4 text-lg font-bold">
            {[
              { label: "참여중인 모임", value: 0 },
              { label: "나의 리뷰", value: 1 },
              { label: "내가 만든 모임", value: 2 },
            ].map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedTab(value)}
                className={`relative pb-2 cursor-pointer transition-colors duration-150
                  ${selectedTab === value
                    ? "text-gray-800 after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-[2px] after:bg-gray-800"
                    : "text-gray-400"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

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
        </div>
      </div>

      {reviewableGathering && (
        <CreateReviewDialog
          reviewFormData={reviewableGathering}
          onClose={() => setReviewableGathering(null)}
        />
      )}
    </main>
  );
}
