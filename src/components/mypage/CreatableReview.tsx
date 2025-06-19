import { useGatheringsStore } from '@/store/gatheringsStore';
import { Gathering } from '@/types/gatherings';
import { THUMBNAIL_CLASSNAME, THUMBNAIL_WIDTH } from '@/utils/mypage/constants/thumbnailConstants';
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import GatheringInformation from '@/components/mypage/GatheringInformation';
import Button from '@/components/shared/Button';

/** 나의 리뷰 - 작성 가능한 리뷰 */
export default function CreatableReview({ gathering, myReviewsTab, userId, onOpenReviewDialog }: { gathering: Gathering, myReviewsTab: number, userId: number, onOpenReviewDialog: (gathering: { userId: number, gatheringId: number }) => void }) {
    const setCurrentGatheringId = useGatheringsStore(state => state.setCurrentGatheringId);

    return (
        <article className="relative min-h-[100px] w-full p-4 rounded-xl flex flex-col sm:flex-row gap-4 border-1 hover:border-main-200 hover:shadow-md transition-gathering-item dark:bg-dark-2">
            {/* 이미지 */}
            <div className="flex-shrink-0">
                <ImageWithFallback
                    src={gathering.image}
                    fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1750048546/error_fallback_icbngz.avif'
                    alt="모임 썸네일"
                    width={1000}
                    height={1000}
                    sizes="(max-width: 401px) 300px, (max-width: 801px) 500px, 1000px"
                    priority
                    className={`${THUMBNAIL_WIDTH} ${THUMBNAIL_CLASSNAME}`}
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
        </article>
    );
}

