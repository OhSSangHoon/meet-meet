import { ReviewItem } from '@/types/reviews';
import { formatDate, formatTime } from '@/utils/shared/date';
import { Heart } from 'lucide-react';
import ImageWithFallback from '@/components/shared/ImageWithFallback';

/** 나의 리뷰 - 작성한 리뷰 */
export default function CreatedReview({ review }: { review: ReviewItem }) {
    return (
        <article className='flex flex-col sm:flex-row gap-4'>
            <div className="flex-shrink-0">
                <ImageWithFallback
                    src={review.Gathering.image!}
                    fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1750048546/error_fallback_icbngz.avif'
                    alt="모임 썸네일"
                    width={1000}
                    height={1000}
                    className="w-full sm:w-[17.5rem] h-[10rem] rounded-xl object-cover pointer-events-none"
                />
            </div>
            <div className="flex flex-col gap-1">
                <div className='flex items-center gap-1'>
                    {Array.from({ length: review.score }).map((_, index) => (
                        <Heart key={index} className="size-4 text-main-500 fill-main-500" />
                    ))}
                </div>
                <p className='text-sm sm:text-base'>{review.comment}</p>
                <span className="text-sm sm:text-xl font-semibold">{review.Gathering.name}</span>
                <div className="flex flex-wrap gap-2 text-xs sm:text-base text-gray-400">
                    <span className={`inline-flex items-center rounded-md`}>
                        {formatDate(review.Gathering.dateTime!)}
                    </span>
                    <span className={`inline-flex items-center rounded-md`}>
                        {formatTime(review.Gathering.dateTime!)}
                    </span>
                </div>
            </div>
        </article>
    );
}

