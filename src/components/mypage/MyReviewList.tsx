"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import Image from "next/image";

interface Gathering {
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

export default function MyReviewList() {
  const [reviews, setReviews] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchGatherings = async () => {
    if (!token) throw new Error("토큰 없음");
    const { data } = await axios.get("/api/gatherings/joined", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const {
    data: gatherings = [],
    isLoading,
    error,
  } = useQuery<Gathering[], Error>({
    queryKey: ["myReviewGatherings"],
    queryFn: fetchGatherings,
    enabled: isClient && !!token,
  });

  const reviewedGatherings = gatherings.filter((g) => g.isReviewed);
  const writableGatherings = gatherings.filter((g) => !g.isReviewed);

  const isEmpty =
    (reviews === 0 && writableGatherings.length === 0) ||
    (reviews === 1 && reviewedGatherings.length === 0);

  const list = reviews === 0 ? writableGatherings : reviewedGatherings;

  return (
    <div className="w-full flex flex-col justify-start gap-5">
      {/* 탭 버튼 */}
      <div className="mx-5 flex items-center gap-2">
        <button
          onClick={() => setReviews(0)}
          className={`rounded-lg px-4 py-2 text-sm transition-colors
            ${reviews === 0 ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          작성 가능한 리뷰
        </button>
        <button
          onClick={() => setReviews(1)}
          className={`rounded-lg px-4 py-2 text-sm transition-colors
            ${reviews === 1 ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          작성한 리뷰
        </button>
      </div>

      {/* 상태 처리 */}
      {isLoading && (
        <div className="w-full h-[100px] flex justify-center items-center text-gray-500">
          로딩 중...
        </div>
      )}
      {error && (
        <div className="w-full h-[100px] flex justify-center items-center text-red-500">
          에러 발생: {(error as Error).message}
        </div>
      )}

      {/* 리뷰 없음 안내 */}
      {!isLoading && !error && isEmpty ? (
        <div className="w-full h-[100px] flex justify-center items-center text-gray-700">
          <h1>
            {reviews === 0
              ? "작성 가능한 리뷰가 없어요"
              : "아직 작성한 리뷰가 없어요"}
          </h1>
        </div>
      ) : (
        // 리뷰 목록
        <div className="flex flex-col gap-4">
          {list.map((g) => (
            <button
              key={g.id}
              className="w-full min-h-[100px] flex flex-col text-left p-4 border-2 border-blue-500 rounded-lg cursor-pointer hover:opacity-60"
              onClick={() => router.push(`/gatherings/detail/${g.id}`)}
            >
              <h1 className="text-lg font-semibold">{g.name}</h1>
              <Image
                src={g.image}
                alt="모임 이미지"
                className="rounded-lg"
                width={100}
                height={100}
              />
              <p className="text-gray-600">위치: {g.location}</p>
              <p className="text-gray-600">종류: {g.type}</p>
              <p className="text-gray-600">
                참여자: {g.participantCount}/{g.capacity}명
              </p>
              {g.dateTime && (
                <p className="text-gray-600">
                  날짜: {new Date(g.dateTime).toLocaleDateString()}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
