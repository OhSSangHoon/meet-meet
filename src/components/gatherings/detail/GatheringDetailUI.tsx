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
import { gatheringsQuery } from '@/queries/gatherings.query';
import { ConfirmDialogState, openConfirmDialog } from '@/utils/shared/confirmDialog';
import { ReviewItem, Reviews } from '@/types/reviews';
import dynamic from 'next/dynamic';
import Thumbnail from '@/components/gatherings/detail/Thumbnail';
import Information from '@/components/gatherings/detail/Information';
import PageConverter from '@/components/gatherings/detail/PageConverter';
import Review from '@/components/gatherings/detail/Review';
import Footer from '@/components/gatherings/detail/Footer';

const InformationLoading = dynamic(() => import('@/components/gatherings/detail/InformationLoading'), { ssr: false });
const ThumbnailLoading = dynamic(() => import('@/components/gatherings/detail/ThumbnailLoading'), { ssr: false });
const ReviewLoading = dynamic(() => import('@/components/gatherings/detail/ReviewLoading'), { ssr: false });
const ConfirmDialog = dynamic(() => import('@/components/shared/ConfirmDialog'), { ssr: false });

const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
};

const LIMIT = 4;
const UPPER_SECTIONS_STYLE = 'flex flex-col sm:flex-row gap-4';

/** 모임 상세 페이지 UI */
export default function GatheringsDetailUI({ id, detailReviews }: { id: string, detailReviews: Reviews }) {
    const { token, userId, signInDialogOpen, setSignInDialogOpen, signOut } = useContext(AuthContext);

    const [page, setPage] = useState(detailReviews?.currentPage ?? 1);
    const [reviews, setReviews] = useState<ReviewItem[]>(detailReviews.data);
    const [dialog, setDialog] = useState<ConfirmDialogState>({ isOpen: false, text: '' });

    const router = useRouter();

    const offset = (page - 1) * LIMIT;

    const { detail, participants, isLoading: detailLoading } = useFetchGatheringDetail(Number(id));
    const { data: isParticipated, errorMessage } = useCheckJoined(Number(id), token);
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
        if (page === 1) setReviews(detailReviews.data);
        else if (nextPageData) setReviews(nextPageData.data);
    }, [page, nextPageData, detailReviews.data]);

    useEffect(() => {
        if (errorMessage) {
            if (errorMessage === '로그인이 만료되었습니다') {
                openConfirmDialog(setDialog, errorMessage, () => {
                    signOut()
                    router.push('/auth/signin')
                });
            }
        }
    }, [router, errorMessage, setSignInDialogOpen, signOut]);

    const queryClient = useQueryClient();

    const handleDeleteConfirm = () => {
        cancelGathering(Number(id));
        queryClient.invalidateQueries({ queryKey: gatheringsQuery.all() });
        setDialog((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <>
            <main className='contents-container'>
                {/* 모임 썸네일과 정보 */}
                {detailLoading ? (
                    <section className={UPPER_SECTIONS_STYLE}>
                        <ThumbnailLoading />
                        <InformationLoading />
                    </section>
                ) : (
                    <section className={UPPER_SECTIONS_STYLE}>
                        <Thumbnail detail={detail} id={id} />
                        <Information detail={detail} id={id} participants={participants} />
                    </section>
                )}
                {/* 모임 리뷰 목록 */}
                <section className='w-full h-full p-4 flex flex-col gap-4 bg-white rounded-lg dark:bg-dark-2 dark:text-white'>
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
            </main >

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

            {/* 확인 다이얼로그 */}
            <ConfirmDialog
                isOpen={signInDialogOpen}
                text='로그인이 필요합니다'
                onClose={() => setSignInDialogOpen(false)}
                onCallback={() => router.push('/auth/signin')} />
            <ConfirmDialog
                isOpen={dialog.isOpen}
                text={dialog.text}
                onClose={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={dialog.onConfirm}
            />
        </>
    );
}