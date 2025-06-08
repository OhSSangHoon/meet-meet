import { ReviewItem } from '@/types/reviews';
import { formatDate, formatTime } from '@/components/shared/utils/dateFormats';
import { Heart } from 'lucide-react';
import Image from 'next/image';

/** 나의 리뷰 - 작성한 리뷰 */
export default function CreatedReview({ review }: { review: ReviewItem }) {
    return (
        <section className='flex flex-col sm:flex-row gap-4'>
            <div className="flex-shrink-0">
                <Image
                    src={review?.Gathering?.image ?? ''}
                    alt="모임 이미지"
                    width={1000}
                    height={1000}
                    className="w-[17.5rem] h-[10rem] rounded-xl object-cover"
                />
            </div>
            <div className="flex flex-col gap-1">
                <div className='flex items-center gap-1'>
                    {Array.from({ length: review?.score }).map((_, index) => (
                        <Heart key={index} className="w-4 h-4 text-main-500 fill-main-500" />
                    ))}
                </div>
                <p className='text-sm sm:text-base'>{review?.comment}</p>
                <span className="text-sm sm:text-xl font-semibold">{review?.Gathering?.name}</span>
                <div className="flex flex-wrap gap-2 text-xs sm:text-base text-gray-400">
                    <span className={`inline-flex items-center rounded-md`}>
                        {formatDate(review?.Gathering?.dateTime ?? '')}
                    </span>
                    <span className={`inline-flex items-center rounded-md`}>
                        {formatTime(review?.Gathering?.dateTime ?? '')}
                    </span>
                </div>
            </div>
        </section>
    );
}

