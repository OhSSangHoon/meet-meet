import { useGatheringsStore } from '@/store/gatheringsStore';
import { Gathering } from '@/types/gatherings';
import dynamic from 'next/dynamic';
import ImageWithFallback from '../shared/ui/ImageWithFallback';

const GatheringInformation = dynamic(() => import('@/components/mypage/shared/ui/GatheringInformation'), { ssr: false });
const Button = dynamic(() => import('@/components/shared/ui/Button'), { ssr: false });

/** 나의 리뷰 - 작성 가능한 리뷰 */
export default function CreatableReview({ gathering, myReviewsTab, userId, onOpenReviewDialog }: { gathering: Gathering, myReviewsTab: number, userId: number, onOpenReviewDialog: (gathering: { userId: number, gatheringId: number }) => void }) {
    const setCurrentGatheringId = useGatheringsStore(state => state.setCurrentGatheringId);

    return (
        <div
            key={gathering.id}
            className="relative min-h-[100px] w-full p-4 rounded-xl flex flex-col sm:flex-row gap-4 border-1 hover:border-main-200 hover:shadow-md transition-gathering-item dark:bg-dark-2"
        >
            {/* 이미지 */}
            <div className="flex-shrink-0">
                <ImageWithFallback
                    src={gathering.image}
                    fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1749802823/fallback_otg1es.avif'
                    alt="모임 썸네일"
                    width={1000}
                    height={1000}
                    className="w-[17.5rem] h-[10rem] rounded-xl object-cover pointer-events-none"
                />
            </div>
            {/* 정보 */}
            <GatheringInformation data={gathering}>
                {myReviewsTab === 0 && (
                    <Button
                        variant='default'
                        text='리뷰 남기기'
                        onClick={() => {
                            setCurrentGatheringId(Number(gathering.id))
                            onOpenReviewDialog({ userId, gatheringId: Number(gathering.id) })
                        }}
                        customClassName='w-28 sm:w-32 text-xs sm:text-base'
                    />
                )}
            </GatheringInformation>
        </div>
    );
}

