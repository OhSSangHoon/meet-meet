import { formatDate } from '@/utils/shared/date';
import { validateProfileImage } from '@/utils/shared/validateProfileImage';
import { ReviewItem } from '@/types/reviews';
import { Heart } from 'lucide-react';
import ImageWithFallback from '@/components/shared/ImageWithFallback';

const MAX_RATING = 5;

/** 모임 상세 페이지 리뷰 목록 */
export default function Review({ review }: { review: ReviewItem }) {
    return (
        <div className='w-full border-dotted border-b-2 border-main-300 flex flex-col gap-2'>
            <div className='flex gap-1'>
                {Array.from({ length: review.score }).map((_, index) => (
                    <Heart key={index} className="size-4 fill-main-500 text-main-500" />
                ))}
                {Array.from({ length: MAX_RATING - review.score }).map((_, index) => (
                    <Heart key={index} className="size-4 fill-gray-300 text-gray-300" />
                ))}
            </div>
            <p className='text-sm'>{review.comment}</p>
            <div className='flex items-center gap-1 text-xs'>
                <ImageWithFallback
                    src={validateProfileImage(review.User?.image)}
                    fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1749717219/profile_image_tlr92v.svg'
                    alt='프로필 이미지'
                    width={32}
                    height={32}
                    className='size-6 rounded-full'
                />
                <span>{review.User?.name}</span>
                <span>|</span>
                <span>{formatDate(review.createdAt)}</span>
            </div>
            <div className='w-full h-1'></div>
        </div>
    )
}