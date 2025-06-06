"use client";

import { useState } from "react";
import ProfileCard from "@/components/mypage/ProfileCard";
import JoinedGatherings from "@/components/mypage/JoinedGatherings";
import MyReviews from "@/components/mypage/MyReviews";
import CreatedGatherings from "@/components/mypage/CreatedGatherings";

enum MypageTab {
  JoinedGatherings = 0,
  MyReviews = 1,
  CreatedGatherings = 2,
}

/** 마이페이지 UI */
export default function MyPageUI({ teamId }: { teamId: string }) {
  const [selectedTab, setSelectedTab] = useState<MypageTab>(MypageTab.JoinedGatherings);

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
              { label: "참여중인 모임", value: MypageTab.JoinedGatherings },
              { label: "나의 리뷰", value: MypageTab.MyReviews },
              { label: "내가 만든 모임", value: MypageTab.CreatedGatherings },
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

          {/* 탭에 따른 내용 */}
          {selectedTab === MypageTab.JoinedGatherings && <JoinedGatherings />}
          {selectedTab === MypageTab.MyReviews && <MyReviews teamId={teamId} />}
          {selectedTab === MypageTab.CreatedGatherings && <CreatedGatherings />}
        </div>
      </div>
    </main>
  );
}
