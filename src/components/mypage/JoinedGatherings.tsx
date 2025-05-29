'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import Image from 'next/image';
import axios from 'axios';

export interface GatheringData {
  id: string;
  name: string;
  image?: string;
  location?: string;
  type?: string;
  participantCount?: number;
  capacity?: number;
  dateTime?: string;
  isCompleted?: boolean;
  isReviewed?: boolean;
}

const fetchJoinedGatherings = async (
  token: string,
  queries: string,
): Promise<GatheringData[]> => {
  const { data } = await axios.get(
    `/api/gatherings/joined?${queries}&limit=1000`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data;
};

export default function JoinedGatherings() {
  const searchParams = useSearchParams();
  const queries = searchParams.toString();
  const { token } = useContext(AuthContext);

  console.log('queries:', queries);

  const {
    data: gatherings = [],
    isLoading,
    error,
  } = useQuery<GatheringData[], Error>({
    queryKey: ['joinedGatherings', token],
    queryFn: () => fetchJoinedGatherings(token!, queries),
    enabled: !!token,
  });

  if (!token) {
    return (
      <div className="text-main-500 flex h-[100px] w-full items-center justify-center">
        토큰 없음
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[100px] w-full items-center justify-center border-2 border-blue-500">
        <h1>로딩 중...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[100px] w-full items-center justify-center border-2 border-red-500">
        <h1 className="text-red-500">{error.message || '오류 발생'}</h1>
      </div>
    );
  }

  if (gatherings.length === 0) {
    return (
      <div className="flex h-[100px] w-full items-center justify-center border-2 border-gray-500">
        <h1>참석한 모임이 없습니다.</h1>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {gatherings.map(data => (
        <div
          key={data.id}
          className="flex min-h-[100px] w-full flex-col rounded-lg border-2 border-gray-200 p-4 transition hover:shadow-md"
        >
          <h1 className="text-lg font-semibold text-gray-800">{data.name}</h1>

          {data.image && (
            <Image
              src={data.image}
              alt={`${data.name} 이미지`}
              width={100}
              height={100}
              className="pointer-events-none my-2 rounded-lg object-cover"
            />
          )}

          {data.location && (
            <p className="text-gray-600">위치: {data.location}</p>
          )}
          {data.type && <p className="text-gray-600">종류: {data.type}</p>}

          {data.participantCount != null && data.capacity != null && (
            <p className="text-gray-600">
              참여자: {data.participantCount}/{data.capacity}명
            </p>
          )}

          {data.dateTime && (
            <p className="text-gray-600">
              날짜: {new Date(data.dateTime).toLocaleDateString()}{' '}
              {data.isCompleted && (
                <span className="text-green-600">(종료됨)</span>
              )}
            </p>
          )}

          {data.isReviewed && (
            <p className="text-sm text-violet-600">✅ 리뷰 작성 완료</p>
          )}
        </div>
      ))}
    </div>
  );
}
