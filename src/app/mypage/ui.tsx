"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import ProfileCard from "@/components/mypage/ProfileCard";
import Meeting from "@/components/mypage/MyMeetingList";
import MyReviewList from "@/components/mypage/MyReviewList";
import CreatedMeetingList from "@/components/mypage/CreatedMeetingList";

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

export default function MyPageUI() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isClient, setIsClient] = useState(false); 
  const searchParams = useSearchParams();
  const queries = searchParams.toString();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const fetchJoinedMeetings = async (): Promise<MeetingData[]> => {
    if (!token) throw new Error("토큰 없음");
    const { data } = await axios.get(`/api/gatherings/joined?${queries}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const {
    data: meetings = [],
    isLoading,
    error,
  } = useQuery<MeetingData[], Error>({
    queryKey: ["joinedMeetings", queries],
    queryFn: fetchJoinedMeetings,
    enabled: isClient && selectedTab === 0 && !!token, 
  });

  return (
      <div className="bg-gray-50 min-h-screen">
        <main className="contents-container">
            <div className="mx-5 pt-[4rem] px-6">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">마이 페이지</h1>

            <div className="border-2 rounded-lg overflow-hidden mb-4">
                <ProfileCard />
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-t-3 border-gray-800">
                <div className="my-5 flex gap-4 text-xl font-bold p-8">
                {["나의 모임", "나의 리뷰", "내가 만든 모임"].map((label, idx) => (
                    <button
                    key={idx}
                    onClick={() => setSelectedTab(idx)}
                    className={
                        selectedTab === idx
                        ? "border-gray-700 border-b-3 pb-2 text-gray-700 font-semibold"
                        : "text-gray-400 font-semibold"
                    }
                    >
                    {label}
                    </button>
                ))}
                </div>

                {/* Tab Content */}
                {isClient && selectedTab === 0 && (
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

                {selectedTab === 1 && <MyReviewList/>}
                {selectedTab === 2 && <CreatedMeetingList />}
            </div>
            </div>
        </main>
      </div>
  );
}
