'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchGatheringDetail } from '@/hooks/api/gatherings/detail/useFetchGatheringDetail';
import { useFetchGatheringDetailReview } from '@/hooks/api/gatherings/detail/useFetchGatheringDetailReview';
import { useCheckJoined } from '@/hooks/api/gatherings/detail/useCheckJoined';
import { useJoinGathering } from '@/hooks/api/gatherings/detail/useJoinGathering';
import { useCancelGathering } from '@/hooks/api/gatherings/detail/useCancelGathering';
import { useLeaveGathering } from '@/hooks/api/gatherings/detail/useLeaveGathering';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/providers/AuthProvider';
import { ConfirmDialogState, openConfirmDialog } from '@/components/shared/utils/confirmDialog';
import { ReviewItem, Reviews } from '@/types/reviews';
import dynamic from 'next/dynamic';

const InformationLoading = dynamic(() => import('@/components/gatherings/detail/loading/InformationLoading'), { ssr: false });
const ThumbnailLoading = dynamic(() => import('@/components/gatherings/detail/loading/ThumbnailLoading'), { ssr: false });
const ReviewLoading = dynamic(() => import('@/components/gatherings/detail/loading/ReviewLoading'), { ssr: false });
const Thumbnail = dynamic(() => import('@/components/gatherings/detail/Thumbnail'), { ssr: false });
const Information = dynamic(() => import('@/components/gatherings/detail/Information'), { ssr: false });
const PageConverter = dynamic(() => import('@/components/gatherings/detail/PageConverter'), { ssr: false });
const Review = dynamic(() => import('@/components/gatherings/detail/Review'), { ssr: false });
const ConfirmDialog = dynamic(() => import('@/components/shared/ui/ConfirmDialog'), { ssr: false });
const Footer = dynamic(() => import('@/components/gatherings/detail/Footer'), { ssr: false });

const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
};

const LIMIT = 4;

/** 모임 상세 페이지 UI */
export default function GatheringsDetailUI({ id, detailReviews }: { id: string, detailReviews: Reviews }) {
    const { token, userId, signInDialogOpen, setSignInDialogOpen } = useContext(AuthContext);

    const [page, setPage] = useState(detailReviews?.currentPage ?? 1);
    const [reviews, setReviews] = useState<ReviewItem[]>(detailReviews.data);
    const [dialog, setDialog] = useState<ConfirmDialogState>({ isOpen: false, text: '' });

    const router = useRouter();

    const offset = (page - 1) * LIMIT;

    const { detail, participants, isLoading: detailLoading } = useFetchGatheringDetail(Number(id));
    const { data: isParticipated, } = useCheckJoined(Number(id), token);
    const { data: nextPageData, isLoading: reviewsLoading } = useFetchGatheringDetailReview(
        Number(id),
        LIMIT,
        offset,
        page > 1
    );

    const { joinGathering } = useJoinGathering({
        token,
        onCallback: (message) => openConfirmDialog(setDialog, message)
    });
    const { leaveGathering } = useLeaveGathering({
        token,
        onCallback: (message) => openConfirmDialog(setDialog, message)
    });
    const { cancelGathering } = useCancelGathering({
        token,
        onCallback: (message, onConfirm) => openConfirmDialog(setDialog, message, onConfirm)
    });

    useEffect(() => {
        if (page === 1) return;
        if (nextPageData) setReviews(detailReviews.data.concat(nextPageData.data));
    }, [page, nextPageData, detailReviews.data]);

    const queryClient = useQueryClient();

    const handleDeleteConfirm = () => {
        cancelGathering(Number(id));

        queryClient.invalidateQueries({ queryKey: ['gatherings'] });

        setDialog((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <main>
            <section className='contents-container'>
                {/* 모임 썸네일과 정보 */}
                {detailLoading ? (
                    <section className='flex flex-col sm:flex-row gap-4'>
                        <ThumbnailLoading />
                        <InformationLoading />
                    </section>
                ) : (
                    <section className='flex flex-col sm:flex-row gap-4'>
                        <Thumbnail detail={detail} id={id} />
                        <Information detail={detail} id={id} participants={participants} />
                    </section>
                )}
                {/* 모임 리뷰 목록 */}
                <section className='w-full h-full px-4 py-4 flex flex-col gap-4 bg-white rounded-lg'>
                    <h1 className='text-lg font-semibold'>다른 참여자들은 이렇게 느꼈어요!</h1>
                    {reviewsLoading ? (
                        <ReviewLoading width='w-full' height='h-32' />
                    ) : (
                        reviews?.map((review: ReviewItem) => (
                            <Review
                                key={review?.id} review={review} />
                        ))
                    )}
                    {detailReviews?.totalPages >= 1 ? (
                        <PageConverter page={page} setPage={setPage} totalPages={detailReviews?.totalPages} />
                    ) : (<p className='p-4 sm:p-20 mx-auto text-sm text-gray-500'>아직 리뷰가 없습니다.</p>)}
                </section>
            </section >
            {/* 모임 참가 Footer */}
            <Footer
                token={token!}
                userId={userId}
                id={id}
                detail={detail}
                isParticipated={isParticipated}
                handleCopyUrl={handleCopyUrl}
                leaveGathering={leaveGathering}
                joinGathering={joinGathering}
                setSignInDialogOpen={setSignInDialogOpen}
                setDialogOpen={(open: boolean) => {
                    if (open) openConfirmDialog(setDialog, '모임을 삭제 하시겠습니까?', handleDeleteConfirm);
                    else setDialog((prev) => ({ ...prev, isOpen: false }));
                }}
            />
            <ConfirmDialog
                isOpen={signInDialogOpen}
                text='로그인이 필요합니다'
                onClose={() => setSignInDialogOpen(false)}
                onCallback={() => router.push('/signin')} />
            <ConfirmDialog
                isOpen={dialog.isOpen}
                text={dialog.text}
                onClose={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={dialog.onConfirm}
            />
        </main>
    );
}
