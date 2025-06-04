import { Heart } from 'lucide-react';

/**
 * 하트 모양의 평점 컴포넌트
 * @param score 현재 점수 (1-5)
 */
export default function HeartRating({ score }: { score: number }) {
  return (
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
} 