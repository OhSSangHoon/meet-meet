import type { Metadata } from 'next'
import { serverFetcher } from '@/lib/api/serverFetcher';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { Gathering } from '@/types/gatherings';
import { Reviews } from '@/types/reviews';
import GatheringsDetailUI from '@/components/gatherings/detail/GatheringDetailUI';

export interface PageProps {
    params: { id: string };
}

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * 모임 상세 페이지의 메타데이터 생성
 * @param params - 모임 ID
 * @returns 모임 상세 페이지 타이틀, 디스크립션
 */
export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { id } = await params;

    let detail;

    try {
        detail = await serverFetcher<Gathering>(`${EXTERNAL_PATHS.fetchGatheringDetail(Number(id))}`, { next: { revalidate: 60 } });
    } catch (error) {
        console.error('모임 상세 페이지 메타데이터 생성 실패:', error);
        detail = null;
    }

    return {
        title: `${detail?.name} 상세 정보 | Meet Meet`,
        description: `${detail?.name}의 상세 정보 페이지입니다.`,
    };
}

/**
 * 모임 상세 페이지의 리뷰 데이터 조회
 * @param id - 모임 ID
 * @returns 모임 리뷰 데이터
 */
async function getDetailReview(id: string): Promise<Reviews> {
    try {
        const data = await serverFetcher<Reviews>(`/reviews?gatheringId=${id}&limit=4&offset=0`, { next: { revalidate: 60 } });

        if (
            data &&
            Array.isArray(data.data) &&
            typeof data.totalItemCount === 'number' &&
            typeof data.currentPage === 'number' &&
            typeof data.totalPages === 'number'
        ) {
            return data as Reviews;
        } else {
            console.warn('응답이 Review 타입이 아닙니다:', data);
            return {
                data: [],
                totalItemCount: 0,
                currentPage: 0,
                totalPages: 0,
            };
        }
    } catch (error) {
        console.error('모임 리뷰 조회 Server Error:', error);
        return {
            data: [],
            totalItemCount: 0,
            currentPage: 0,
            totalPages: 0,
        };
    }
}

export default async function GatheringsDetailPage({ params }: PageProps) {
    const { id } = await params;
    const detailReviews = await getDetailReview(id);

    return (
        <GatheringsDetailUI id={id} detailReviews={detailReviews} />
    )
}