'use client';

import { useState , useContext  } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { AuthContext } from '@/providers/AuthProvider';

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
  MINDFULNESS: '마인드풀니스',
};

export interface ReviewGathering {
  id: number;
  teamId: string;
  type: 'DALLAEMFIT' | 'OFFICE_STRETCHING' | 'MINDFULNESS' | 'WORKATION';
  name: string;
  dateTime: string;
  location: string;
  image: string;
}

export interface ReviewUser {
  id: number;
  name: string;
  image: string;
}

interface Review {
  id: number;
  score: number;
  comment: string;
  createdAt: string;
  Gathering: ReviewGathering;
  User: ReviewUser;
}

const HeartRating = ({ score }: { score: number }) => (
  <div className="flex gap-[2px]">
    {[...Array(5)].map((_, i) => (
      <Heart
        key={i}
        className={`w-4 h-4 ${
          i < score ? 'fill-main-500 stroke-main-500' : 'fill-gray-200 stroke-gray-200'
        }`}
      />
    ))}
  </div>
);

export default function ReviewPage() {
  const [filter, setFilter] = useState({
    category: Category.DALLAEMFIT,
    type: DallaemfitType.ALL,
  });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { token } = useContext(AuthContext);

  const handleCategoryChange = (category: Category) => {
    setFilter({ category, type: DallaemfitType.ALL });
  };

  const handleTypeChange = (type: DallaemfitType) => {
    setFilter((prev) => ({ ...prev, type }));
  };

  const fetchReviews = async (): Promise<Review[]> => {
    if (!token) throw new Error('로그인이 필요합니다.');

    const params: Record<string, string> = {};
    if (filter.category === Category.WORKATION) {
      params.type = 'WORKATION';
    } else if (filter.type !== DallaemfitType.ALL) {
      params.type = filter.type;
    }
    if (selectedLocation) params.location = selectedLocation;
    if (selectedDate) params.date = selectedDate;
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = 'desc';
    }

    const res = await axios.get('/api/reviews', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = res.data;
    return Array.isArray(result) ? result : result.data;
  };

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['allReviews', filter, selectedLocation, selectedDate, sortBy],
    queryFn: fetchReviews,
  });

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length
      : 0;

  const ratingCounts = {
    5: reviews.filter((r) => r.score === 5).length,
    4: reviews.filter((r) => r.score === 4).length,
    3: reviews.filter((r) => r.score === 3).length,
    2: reviews.filter((r) => r.score === 2).length,
    1: reviews.filter((r) => r.score === 1).length,
  };
  const maxCount = Math.max(...Object.values(ratingCounts));

  return (
    <main className="contents-container">
      <div className="w-full pt-10 flex items-start gap-4">
        <Image
          src="/icons/saved-logo.svg"
          alt="찜 아이콘"
          width={70}
          height={70}
          className="rounded-full border-2 border-black pointer-events-none"
          priority
        />
        <div>
          <p className="text-sm text-gray-600">모임 리뷰</p>
          <p className="text-xl font-bold text-gray-900">다른 사람들의 후기를 참고해보세요 👀</p>
        </div>
      </div>

      {/* 🔻 필터 */}
      <div className="py-6">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => handleCategoryChange(Category.DALLAEMFIT)}
            className={`px-4 py-1 text-lg font-semibold ${
              filter.category === Category.DALLAEMFIT ? 'border-b-2 border-black' : ''
            }`}
          >
            E 북적북적 Meet
          </button>
          <button
            onClick={() => handleCategoryChange(Category.WORKATION)}
            className={`px-4 py-1 text-lg font-semibold ${
              filter.category === Category.WORKATION ? 'border-b-2 border-black' : ''
            }`}
          >
            I 도란도란 Meet
          </button>
        </div>
        {filter.category === Category.DALLAEMFIT && (
          <div className="flex gap-2 border-b pb-4">
            {Object.values(DallaemfitType).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter.type === type ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {DALLAEMFIT_LABEL[type]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 🔻 지역/날짜/정렬 */}
      <div className="flex items-center gap-3 mb-10">
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">지역 전체</option>
          <option value="을지로3가">을지로3가</option>
          <option value="건대입구">건대입구</option>
          <option value="신림">신림</option>
          <option value="홍대입구">홍대입구</option>
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="ml-auto border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">정렬 선택</option>
          <option value="createdAt">최신순</option>
          <option value="score">리뷰 높은 순</option>
          <option value="participantCount">참여 인원 순</option>
        </select>
      </div>

      {/* 🔻 평균 평점 섹션 */}
     <section className="bg-white border border-gray-200 px-6 py-6 rounded-lg mb-10">
  <div className="flex items-center gap-6">
    {/* 왼쪽: 평균 점수 */}
    <div className="w-40 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-900">
        {average.toFixed(1)}<span className="text-gray-500 text-lg"> / 5</span>
      </h2>
      {average > 0 ? (
        <HeartRating score={Math.round(average)} />
      ) : (
        <>
          <HeartRating score={0} />
          <span className="text-xs text-gray-400 mt-1">리뷰가 없습니다</span>
        </>
      )}
    </div>

    {/* 오른쪽: 점수 분포 */}
    <div className="flex-1 max-w-[20rem]">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center mb-1">
          <span className="w-6 text-xs">{rating}점</span>
          <div className="flex-1 bg-gray-100 h-2 rounded-full mx-2 overflow-hidden">
            <div
              className="h-full bg-main-500 transition-all duration-300"
              style={{
                width: maxCount
                  ? `${(ratingCounts[rating as 1 | 2 | 3 | 4 | 5] / maxCount) * 100}%`
                  : '0%',
              }}
            />
          </div>
          <span className="w-6 text-xs text-right">
            {ratingCounts[rating as 1 | 2 | 3 | 4 | 5]}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* 🔻 리뷰 리스트 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-900">📝 모든 리뷰</h3>
        {isLoading && <p className="text-gray-500">리뷰 불러오는 중...</p>}
        {error && <p className="text-red-500">에러 발생: {(error as Error).message}</p>}
        {!isLoading &&
          !error &&
          reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="w-[10rem] h-[6rem] relative rounded-lg overflow-hidden">
                  <Image
                    src={review.Gathering.image || '/images/placeholder.jpg'}
                    alt="review image"
                    fill
                    className="object-cover pointer-events-none"
                  />
                </div>
                <div className="flex-1">
                  <HeartRating score={review.score} />
                  <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {/* <Image src='/images/default_profile_image.svg' alt='프로필 이미지' width={32} height={32} className='rounded-full' /> */}
                     {review.Gathering.name} · {review.Gathering.location}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                     {review.User.name} |  {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
