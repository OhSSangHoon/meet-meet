"use client";

import { Suspense, useState } from "react";
import ProfileCard from "@/components/mypage/ProfileCard";
import JoinedGatherings from "@/components/mypage/JoinedGatherings";
import MyReviews from "@/components/mypage/MyReviews";
import CreatedGatherings from "@/components/mypage/CreatedGatherings";

enum MypageTab {
  JoinedGatherings = 0,
  MyReviews = 1,
  CreatedGatherings = 2,
}

export default function MyPageUI() {
  const [selectedTab, setSelectedTab] = useState<MypageTab>(MypageTab.JoinedGatherings);

  return (
    <main className="contents-container">
      <div className="pt-10 px-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">마이 페이지</h1>

        {/* 프로필 카드 */}
        <div className="border-2 rounded-lg overflow-hidden mb-4">
          <ProfileCard />
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white border-t-[3px] border-gray-800">
          <div className="pt-8 flex gap-4 text-lg font-bold p-5">
            {[
              { label: "참여중인 모임", value: MypageTab.JoinedGatherings },
              { label: "나의 리뷰", value: MypageTab.MyReviews },
              { label: "내가 만든 모임", value: MypageTab.CreatedGatherings },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSelectedTab(value)}
                className={`relative pb-2 transition-colors duration-150
                  ${selectedTab === value
                    ? "text-gray-800 after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-[2px] after:bg-gray-800"
                    : "text-gray-400"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 탭에 따른 내용 */}
          <Suspense fallback={<div>로딩 중...</div>}>
            <JoinedGatherings />
          </Suspense>
          {selectedTab === MypageTab.MyReviews && <MyReviews />}
          {selectedTab === MypageTab.CreatedGatherings && <CreatedGatherings />}
        </div>
      </div>
    </main>
  );
}
