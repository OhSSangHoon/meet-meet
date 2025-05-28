'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import GatheringsList from '@/components/gatherings/GatheringsList';
import { Gathering } from '@/types/gatherings';
import { useToggleSavedGatherings } from '@/hooks/gathering/useToggleSavedGatherings';
import axios from 'axios';

export enum Category {
  DALLAEMFIT = 'DALLAEMFIT',
  WORKATION = 'WORKATION',
}

export enum DallaemfitType {
  ALL = 'ALL',
  OFFICE_STRETCHING = 'OFFICE_STRETCHING',
  MINDFULNESS = 'MINDFULNESS',
}

const DALLAEMFIT_LABEL: Record<DallaemfitType, string> = {
  ALL: '전체',
  OFFICE_STRETCHING: '오피스 스트레칭',
  MINDFULNESS: '마인드풀',
};

const ITEMS_PER_PAGE = 10;

export default function LikedMeetingsPage() {
  const { savedIds: likedList, toggleSaved } = useToggleSavedGatherings();

  const { data: allGatherings = [] } = useQuery<Gathering[]>({
    queryKey: ['allGatherings'],
    queryFn: async () => {
      const res = await axios.get('/api/gatherings');
      return res.data;
    },
  });

  const [filter, setFilter] = useState({
    category: Category.DALLAEMFIT,
    type: DallaemfitType.ALL,
  });

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const filteredGatherings = allGatherings.filter((g) => {
    if (!likedList.includes(String(g.id))) return false;

    if (filter.category === Category.DALLAEMFIT) {
      if (filter.type === DallaemfitType.ALL) {
        return g.type === 'OFFICE_STRETCHING' || g.type === 'MINDFULNESS';
      } else {
        return g.type === filter.type;
      }
    } else {
      return g.type === 'WORKATION';
    }
  });

  const visibleGatherings = filteredGatherings.slice(0, visibleCount);

  useEffect(() => {
    if (visibleCount >= filteredGatherings.length) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      }
    }, { threshold: 1 });

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [visibleCount, filteredGatherings.length]);

  const handleCategoryChange = (category: Category) => {
    setFilter({ category, type: DallaemfitType.ALL });
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleTypeChange = (type: DallaemfitType) => {
    setFilter((prev) => ({ ...prev, type }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <main className="contents-container">
      <div className="w-full flex flex-col">
        <div className="w-full pt-10 flex flex-row justify-between items-center">
          <Image src="/icons/saved-logo.svg" alt="찜 아이콘" width={70} height={70} className="rounded-full border-2 border-black mr-1 pointer-events-none" priority />
          <div className="w-full flex flex-col justify-start px-2">
            <p className="text-[#374151] text-sm font-medium mb-2">찜한 모임</p>
            <p className="text-gray-900 text-lg font-semibold">마감되기 전에 지금 바로 참여해보세요 👀</p>
          </div>
        </div>

        <div className="w-full flex flex-col justify-start py-5">
          <div className="flex flex-row">
            <button onClick={() => handleCategoryChange(Category.DALLAEMFIT)} className={`text-gray-900 text-lg font-semibold px-4 py-1 ${filter.category === 'DALLAEMFIT' ? 'border-b-2 border-gray-900' : ''}`}>주제1</button>
            <button onClick={() => handleCategoryChange(Category.WORKATION)} className={`text-gray-900 text-lg font-semibold px-4 py-1 ${filter.category === 'WORKATION' ? 'border-b-2 border-gray-900' : ''}`}>주제2</button>
          </div>

          {filter.category === Category.DALLAEMFIT && (
            <div className="w-full flex flex-col justify-start py-5 border-b-2 border-gray-200">
              <div className="flex flex-row items-center gap-2">
                {Object.values(DallaemfitType).map((type) => (
                  <button key={type} onClick={() => handleTypeChange(type)} className={`${filter.type === type ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} text-sm font-medium px-4 py-2 rounded-lg`}>
                    {DALLAEMFIT_LABEL[type]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <GatheringsList
        gatherings={visibleGatherings}
        savedGatheringIds={likedList}
        onToggleSaved={toggleSaved}
      />

      {visibleGatherings.length < filteredGatherings.length && (
        <div ref={observerRef} className="h-4" />
      )}
    </main>
  );
}
