'use client';

import Image from 'next/image';
import { Heart } from "lucide-react"


export default function LikedMeetingsPage() {
  return (
    <main className="max-w-3xl mx-auto p-4">
    {/* ✅ 로고 + 텍스트 묶음 */}
      <div className="flex items-center gap-[13px] h-[72px]">
        <div className="w-[72px] h-[72px]">
           <img src="/icons/saved-logo.svg" alt="찜 아이콘" width={72} height={72} />
        </div>
        <div className="flex flex-col justify-center gap-[4px]">
          <h1 className="text-[24px] font-semibold leading-[32px] text-gray-900">
            찜한 모임
          </h1>
          <p className="text-[14px] font-medium leading-[20px] text-gray-700">
            마감되기 전에 지금 바로 참여해보세요 👀
          </p>
        </div>
      </div>
      <div className="">
      <div className="flex items-center justify-between  ">
        <div className=" flex ">
          <button className="px-4 py-2 border-b-2 border-[#A864E4] font-medium text-[#] flex items-center">
            달램핏 <span className="ml-1">☪️</span>
          </button>
        </div>
        <div className="flex-1 flex ">
          <button className="px-4 py-2 text-gray-500 flex items-center">
            위케이션 <span className="ml-1">⭐</span>
          </button>
        </div>
      </div>
    </div>
      
      {/* 필터 탭 */}
       <div className="flex gap-2 py-3 border-b border-gray-200">
          <button className="px-4 py-1.5 bg-gray-800 text-white rounded-full text-sm">전체</button>
          <button className="px-4 py-1.5 bg-white border border-gray-300 rounded-full text-sm">오피스 스트레칭</button>
          <button className="px-4 py-1.5 bg-white border border-gray-300 rounded-full text-sm">마인드풀니스</button>
      </div>

      {/* 모임 카드 리스트 */}
      <div className="space-y-6 pt-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-sm flex flex-col md:flex-row">
            {/* Left - 이미지 */}
            <div className="relative w-full md:w-1/3 h-48">
              <div className="absolute top-2 left-2 bg-white/80 rounded-full px-3 py-1 flex items-center z-10 text-xs">
                <span className="text-main-600 mr-1">🔔</span>
                <span className="font-medium text-gray-700">오늘 21시 마감</span>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60"
                alt="Office space"
                fill
                className="object-cover"
              />
            </div>

            {/* Right - 정보 */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <h2 className="font-bold">달팽핏 오피스 스트레칭</h2>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">을지로 3가</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">1월 7일 · 17:30</div>
                </div>
                <button className="text-main-500">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1 text-main-500">
                  <span>18/20</span>
                  <span>개설확정</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-main-500 h-2 rounded-full w-[90%]"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}