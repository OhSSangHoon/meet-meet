'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchGatheringDetail } from '@/hooks/api/useFetchGatheringDetail';
import { useFetchDetailReview } from '@/hooks/api/useFetchDetailReview';
import { useCheckJoined } from '@/hooks/api/useCheckJoined';
import { useJoinGathering } from '@/hooks/api/useJoinGathering';
import { useCancelGathering } from '@/hooks/api/useCancelGathering';
import { useLeaveGathering } from '@/hooks/api/useLeaveGathering';
import { AuthContext } from '@/providers/AuthProvider';
import { ReviewItem, Reviews } from '@/types/reviews';
import ConfirmDialog from '@/components/shared/ui/ConfirmDialog';
import InformationLoading from '@/components/gatherings/detail/loading/InformationLoading';
import ThumbnailLoading from '@/components/gatherings/detail/loading/ThumbnailLoading';
import ReviewLoading from '@/components/gatherings/detail/loading/ReviewLoading';
import Thumbnail from '@/components/gatherings/detail/Thumbnail';
import Information from '@/components/gatherings/detail/Information';
import Review from '@/components/gatherings/detail/Review';
import PageConverter from '@/components/gatherings/detail/PageConverter';
import Footer from '@/components/gatherings/detail/Footer';

export interface Participant {
    teamId: number;
    userId: number;
    gatheringId: number;
    joinedAt: string;
    User: {
        id: number;
        email: string;
        name: string;
        companyName: string;
        image: string;
    }
}

const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
};

const LIMIT = 4;

export default function GatheringsDetailUI({ id, detailReviews }: { id: string, detailReviews: Reviews }) {
    const { token, userId, loginModalOpen, setLoginModalOpen } = useContext(AuthContext);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [page, setPage] = useState(detailReviews?.currentPage ?? 1);
    const [reviews, setReviews] = useState<ReviewItem[]>(detailReviews.data);

    const router = useRouter();

    const offset = (page - 1) * LIMIT;

    const { detail, participants, isLoading: detailLoading } = useFetchGatheringDetail(Number(id));
    const { data: isParticipated, } = useCheckJoined(Number(id), token);
    const { data: nextPageData, isLoading: reviewsLoading } = useFetchDetailReview(
        Number(id),
        LIMIT,
        offset,
        page > 1
    );

    const { joinGathering } = useJoinGathering({
        token,
        onErrorCallback: (message) => {
            setErrorMessage(message);
            setErrorModalOpen(true);
        }
    });
    const { leaveGathering } = useLeaveGathering(
        {
            token,
            onErrorCallback: (message) => {
                setErrorMessage(message);
                setErrorModalOpen(true);
            }
        });
    const { cancelGathering } = useCancelGathering({
        token,
        onErrorCallback: (message) => {
            setErrorMessage(message);
            setErrorModalOpen(true);
        }
    });

    // 1페이지는 SSR 데이터만, 2페이지부터 useFetchDetailReview로 데이터 추가
    useEffect(() => {
        if (page === 1) return;
        if (nextPageData) setReviews(detailReviews.data.concat(nextPageData.data));
    }, [page, nextPageData, detailReviews.data]);

    const handleDeleteConfirm = () => {
        cancelGathering(Number(id));
        router.replace('/gatherings');
        setDeleteModalOpen(false);
    };

    return (
        <>
            <main className='contents-container'>
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
            </main >
            {/* 모임 참가 Footer */}
            <Footer userId={userId} detail={detail} isParticipated={isParticipated} leaveGathering={leaveGathering} joinGathering={joinGathering} token={token!} setDeleteModalOpen={setDeleteModalOpen} handleCopyUrl={handleCopyUrl} id={id} setLoginModalOpen={setLoginModalOpen} />
            <ConfirmDialog open={loginModalOpen} onClose={() => setLoginModalOpen(false)} text='로그인이 필요합니다.' needLogin={true} />
            <ConfirmDialog
                open={deleteModalOpen}
                text="모임을 삭제 하시겠습니까?"
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
            <ConfirmDialog
                open={errorModalOpen}
                text={errorMessage}
                onClose={() => setErrorModalOpen(false)}
            />
        </>
    );
}
