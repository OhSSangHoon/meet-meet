import { formatDate } from '@/components/shared/utils/format';
import { ReviewItem } from '@/types/reviews';
import { Heart } from 'lucide-react';
import Image from 'next/image';

export default function Review({ review }: { review: ReviewItem }) {
    return (
        <div
            className='w-full border-dotted border-b-2 border-main-300 flex flex-col gap-2'>
            <div className='flex gap-1'>
                {Array.from({ length: review?.score }).map((_, index) => (
                    <Heart key={index} className="w-4 h-4 fill-main-500 text-main-500" />
                ))}
                {Array.from({ length: 5 - review?.score }).map((_, index) => (
                    <Heart key={index} className="w-4 h-4 fill-gray-300 text-gray-300" />
                ))}
            </div>
            <p className='text-sm'>{review?.comment}</p>
            <div className='flex items-center gap-1 text-xs'>
                <Image src={review?.User?.image || '/icons/default_profile_image.svg'} alt='프로필 이미지' width={32} height={32} className='w-6 h-6 rounded-full' />
                <span>{review?.User?.name}</span>
                <span>|</span>
                <span>{formatDate(review?.createdAt || 'OOOO-OO-OO')}</span>
            </div>
            <div className='w-full h-1'></div>
        </div>
    )
}