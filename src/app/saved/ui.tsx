'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import Image from "next/image";
import { Heart } from 'lucide-react';
import { Gathering } from "@/types/gatherings";
import { AuthContext } from '@/providers/AuthProvider';
import { getSavedGatherings, setSavedGatherings } from '@/lib/api/gatherings';
import axios from 'axios';

type Category = 'DALLAEMFIT' | 'WORKATION';
type DallaemfitType = 'ALL' | 'OFFICE_STRETCHING' | 'MINDFULNESS';

export default function LikedMeetingsPage() {
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();

   if (!token) {
    return <span className="text-main-500">토큰 없음</span>;
  }

  // 🔁 category + type 통합 상태
  const [filter, setFilter] = useState<{ category: Category; type: DallaemfitType }>({
    category: 'DALLAEMFIT',
    type: 'ALL',
  });

  const handleCategoryChange = (category: Category) => {
    setFilter({
      category,
      type: category === 'DALLAEMFIT' ? 'ALL' : 'ALL', // 워케이션은 서브타입 없음
    });
  };

  const handleTypeChange = (type: DallaemfitType) => {
    setFilter((prev) => ({
      ...prev,
      type,
    }));
  };

  // 찜 목록 조회
  const { data: likedList = [] } = useQuery({
    queryKey: ['savedGatherings'],
    queryFn: getSavedGatherings,
    staleTime: Infinity,
  });

  // 찜 토글 기능
  const toggleSavedMutation = useMutation({
    mutationFn: (gatheringId: string) => {
      const currentSaved = getSavedGatherings();
      const newSaved = currentSaved.includes(gatheringId)
        ? currentSaved.filter(id => id !== gatheringId)
        : [...currentSaved, gatheringId];
      setSavedGatherings(newSaved);
      return Promise.resolve(newSaved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedGatherings'] });
    },
  });

  // 전체 모임 목록 불러오기
  const { data: meetings = [] } = useQuery<Gathering[]>({
    queryKey: ['allGatherings'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/gatherings', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data;
    },
  });

  // 찜한 모임 중 필터 조건에 맞는 항목만 필터링
  const likedGatherings = meetings.filter((g) => {
    if (!likedList.includes(String(g.id))) return false;
    if (filter.category === 'DALLAEMFIT') {
      if (filter.type === 'ALL') {
        return g.type === 'OFFICE_STRETCHING' || g.type === 'MINDFULNESS';
      } else {
        return g.type === filter.type;
      }
    } else {
      return g.type === 'WORKATION';
    }
  });

  return (
    <main className="contents-container">
      {/* 헤더 */}
      <div className="w-full flex flex-col">
        <div className="w-full pt-10 flex flex-row justify-between items-center">
          <Image src="/icons/saved-logo.svg" alt="찜 아이콘" width={70} height={70} className="rounded-full border-2 border-black mr-1 pointer-events-none" priority />
          <div className="w-full flex flex-col justify-start px-2">
            <p className="text-[#374151] text-sm font-medium mb-2">찜한 모임</p>
            <p className="text-gray-900 text-lg font-semibold">마감되기 전에 지금 바로 참여해보세요 👀</p>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="w-full flex flex-col justify-start py-5">
          <div className="flex flex-row">
            <button
              onClick={() => handleCategoryChange('DALLAEMFIT')}
              className={`text-gray-900 text-lg font-semibold px-4 py-1 ${filter.category === 'DALLAEMFIT' ? 'border-b-2 border-gray-900' : ''}`}
            >
              주제1
            </button>
            <button
              onClick={() => handleCategoryChange('WORKATION')}
              className={`text-gray-900 text-lg font-semibold px-4 py-1 ${filter.category === 'WORKATION' ? 'border-b-2 border-gray-900' : ''}`}
            >
              주제2
            </button>
          </div>

          {/* 서브 타입 필터 */}
          {filter.category === 'DALLAEMFIT' && (
            <div className="w-full flex flex-col justify-start py-5 border-b-2 border-gray-200">
              <div className="flex flex-row items-center gap-2">
                {(['ALL', 'OFFICE_STRETCHING', 'MINDFULNESS'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`${filter.type === type
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-900"
                      } text-sm font-medium px-4 py-2 rounded-lg`}
                  >
                    {type === 'ALL' ? '전체' : type === 'OFFICE_STRETCHING' ? '오피스 스트레칭' : '마인드풀'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 모임 카드 목록 */}
      <div className="space-y-6 pt-4">
        {likedGatherings.map((gathering) => {
          const isLiked = likedList.includes(String(gathering.id));
          return (
            <div key={gathering.id} className="border rounded-lg overflow-hidden shadow-sm flex flex-col md:flex-row">
              {/* 이미지 영역 */}
              <div className="relative w-full md:w-[20rem] h-[14rem]">
                <div className="absolute top-2 left-2 bg-main-300 text-white text-xs font-semibold rounded-full px-3 py-1 z-10 flex items-center">
                  <span className="text-white mr-1">🔔</span>
                  <span className="font-medium">오늘 21시 마감</span>
                </div>
                <Image
                  src={gathering.image || '/placeholder.jpg'}
                  alt="모임 이미지"
                  fill
                  className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none object-cover pointer-events-none"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* 정보 영역 */}
              <div className="flex-1 p-4 flex flex-col justify-between mb-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <h1 className="text-lg font-semibold">{gathering.name}</h1>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">{gathering.location}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSavedMutation.mutate(String(gathering.id))}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isLiked ? 'bg-main-300 text-white' : 'bg-[#fff0f5] text-main-300'}`}
                  >
                    <Heart fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm font-medium mb-1 text-main-300">
                    <span><span>👤</span>18/20</span>
                    <span className="text-right">개설확정</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-main-300 h-2 rounded-full w-[90%]" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 찜한 모임이 없을 때 */}
        {likedGatherings.length === 0 && (
          <div className="w-full h-[100px] flex flex-col justify-center items-center border-2 border-gray-500">
            <p className="text-gray-600 font-medium">아직 찜한 모임이 없어요</p>
            <p className="text-gray-600 font-medium">관심있는 모임을 찜해보세요!</p>
          </div>
        )}
      </div>
    </main>
  );
}
