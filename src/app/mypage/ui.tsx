"use client";

import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import ProfileCard from "@/components/mypage/ProfileCard";
import Meeting from "@/components/mypage/MyMeetingList";
import MyReviewList from "@/components/mypage/MyReviewList";
import CreatedMeetingList from "@/components/mypage/CreatedMeetingList";
import { AuthContext } from "@/providers/AuthProvider";

enum MypageTab {
  JoinedMeetings = 0,
  MyReviews = 1,
  CreatedMeetings = 2,
}

interface MeetingData {
  id: string;
  name: string;
  image: string;
  location: string;
  type: string;
  participantCount: number;
  capacity: number;
  dateTime: string;
  isCompleted?: boolean;
  isReviewed?: boolean;
}

export const fetchJoinedMeetings = async (token: string, queries: string): Promise<MeetingData[]> => {
  const { data } = await axios.get(`/api/gatherings/joined?${queries}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log(`/api/gatherings/joined?${queries}`);
  return data;
};

export default function MyPageUI() {
  const [selectedTab, setSelectedTab] = useState<MypageTab>(MypageTab.JoinedMeetings);
  const searchParams = useSearchParams();
  const queries = searchParams.toString();
  const { token } = useContext(AuthContext);

  const {
    data: meetings = [],
    isLoading,
    error,
  } = useQuery<MeetingData[], Error>({
    queryKey: ["joinedMeetings", queries, token],
    queryFn: () => fetchJoinedMeetings(token!, queries),
    enabled: selectedTab === MypageTab.JoinedMeetings && !!token,
  });

  return (
      <main className="contents-container">
        <div className="pt-10 px-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">마이 페이지</h1>

          <div className="border-2 rounded-lg overflow-hidden mb-4">
            <ProfileCard />
          </div>

          {/* 탭 네비게이션 */}
          <div className="bg-white border-t-[3px] border-gray-800">
            <div className="pt-8 flex gap-4 text-lg font-bold p-5">
              {[
                { label: "나의 모임", value: MypageTab.JoinedMeetings },
                { label: "나의 리뷰", value: MypageTab.MyReviews },
                { label: "내가 만든 모임", value: MypageTab.CreatedMeetings },
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

            {!token && (
              <div className="w-full h-[100px] flex justify-center items-center text-main-500">
                토큰 없음
              </div>
            )}

            {token && selectedTab === MypageTab.JoinedMeetings && (
              <div className="w-full flex flex-col gap-5">
                {isLoading && (
                  <div className="w-full h-[100px] flex justify-center items-center border-2 border-blue-500">
                    <h1>로딩 중...</h1>
                  </div>
                )}
                {error && (
                  <div className="w-full h-[100px] flex justify-center items-center border-2 border-red-500">
                    <h1 className="text-red-500">{error.message || "오류 발생"}</h1>
                  </div>
                )}
                {!isLoading &&
                  !error &&
                  meetings.map((meeting) => (
                    <Meeting key={meeting.id} data={meeting} />
                  ))}
                {!isLoading && !error && meetings.length === 0 && (
                  <div className="w-full h-[100px] flex justify-center items-center border-2 border-gray-500">
                    <h1>참석한 모임이 없습니다.</h1>
                  </div>
                )}
              </div>
            )}

            {token && selectedTab === MypageTab.MyReviews && <MyReviewList />}
            {token && selectedTab === MypageTab.CreatedMeetings && <CreatedMeetingList />}
          </div>
        </div>
      </main>
  );
}