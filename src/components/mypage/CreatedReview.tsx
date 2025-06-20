import { ReviewItem } from '@/types/reviews';
import { formatDate, formatTime } from '@/utils/shared/date';
import { THUMBNAIL_CLASSNAME, THUMBNAIL_SIZE } from '@/utils/mypage/constants/thumbnailConstants';
import { Heart } from 'lucide-react';
import * as m from "motion/react-m";
import ImageWithFallback from '@/components/shared/ImageWithFallback';

interface CreatedReviewProps {
    review: ReviewItem,
}

/** 나의 리뷰 - 작성한 리뷰 */
export default function CreatedReview({ review }: CreatedReviewProps) {
    return (
        <m.article
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ amount: 0.5, once: true }}
            className={`relative w-full p-4 rounded-xl border hover:border-main-200 hover:shadow-md flex flex-col sm:flex-row gap-4 transition-gathering-item`}>
            <div className="flex-shrink-0 h-[10rem]">
                <ImageWithFallback
                    src={review.Gathering.image!}
                    fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1750048546/error_fallback_icbngz.avif'
                    alt="모임 썸네일"
                    width={298}
                    height={170}
                    priority
                    className={`${THUMBNAIL_SIZE} ${THUMBNAIL_CLASSNAME}`}
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
        </m.article>
    );
}

