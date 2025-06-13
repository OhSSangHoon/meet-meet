import HeartRating from '@/components/reviews/HeartRating';
import { ReviewItem } from '@/types/reviews';

// 매직넘버 상수
const MAX_RATING = 5; // 최대 평점

interface ReviewsStatsProps {
    reviews: ReviewItem[];
}

export default function ReviewStats({ reviews }: ReviewsStatsProps) {
    const average = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length
        : 0;

    const ratingCounts = {
        5: reviews.filter((r) => r.score === 5).length,
        4: reviews.filter((r) => r.score === 4).length,
        3: reviews.filter((r) => r.score === 3).length,
        2: reviews.filter((r) => r.score === 2).length,
        1: reviews.filter((r) => r.score === 1).length,
    };

    const totalReviews = reviews.length;

    return (
        <section className="bg-white border border-gray-200 px-6 py-6 rounded-lg mb-10">
            <div className="flex items-center gap-6">
                <div className="w-40 flex flex-col items-center">
                    <h2 className="text-2xl font-bold">
                        {average.toFixed(1)}
                        <span className="text-gray-500 text-lg">
                            {" / "}{MAX_RATING}
                        </span>
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

                <div className="flex-1 max-w-[20rem]">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center mb-1">
                            <span className="w-6 text-xs">{rating}점</span>
                            <div className="flex-1 bg-gray-100 h-2 rounded-full mx-2 overflow-hidden">
                                <div
                                    className="h-full bg-main-500 transition-all duration-300"
                                    style={{
                                        width: totalReviews > 0
                                            ? `${(ratingCounts[rating as 1 | 2 | 3 | 4 | 5] / totalReviews) * 100}%`
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
    );
}