"use client"

import Image from 'next/image';
import React from 'react';

interface MeetingProps {
  data: {
    id: number | string;
    name: string;
    image?: string;
    location?: string;
    type?: string;
    participantCount?: number;
    capacity?: number;
    dateTime?: string;
    isCompleted?: boolean;
    isReviewed?: boolean;
  };
}

export default function Meeting({ data }: MeetingProps) {
  const {
    name,
    image,
    location,
    type,
    participantCount,
    capacity,
    dateTime,
    isCompleted,
    isReviewed,
  } = data;

  return (
    <div className="w-full min-h-[100px] flex flex-col p-4 border-2 border-gray-200 rounded-lg hover:shadow-md transition">
      <h1 className="text-lg font-semibold text-gray-800">{name}</h1>

      {image && (
        <Image
          src={image}
          alt={`${name} 이미지`}
          width={100}
          height={100}
          className="rounded-lg object-cover my-2"
        />
      )}

      {location && <p className="text-gray-600">위치: {location}</p>}
      {type && <p className="text-gray-600">종류: {type}</p>}

      {participantCount != null && capacity != null && (
        <p className="text-gray-600">
          참여자: {participantCount}/{capacity}명
        </p>
      )}

      {dateTime && (
        <p className="text-gray-600">
          날짜: {new Date(dateTime).toLocaleDateString()}{' '}
          {isCompleted && <span className="text-green-600">(종료됨)</span>}
        </p>
      )}

      {isReviewed && (
        <p className="text-sm text-violet-600">✅ 리뷰 작성 완료</p>
      )}
    </div>
  );
}
