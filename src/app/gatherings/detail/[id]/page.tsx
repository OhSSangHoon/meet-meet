import { Reviews } from '@/types/reviews';
import GatheringsDetailUI from './ClientPage';

export interface PageProps {
    params: { id: string };
}

async function getDetailReview(id: string): Promise<Reviews> {
    try {
        const response = await fetch(`${process.env.API_URI_DEV}/reviews?gatheringId=${id}&limit=4&offset=0`, {
            next: { revalidate: 60 },
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

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

    return <GatheringsDetailUI id={id} detailReviews={detailReviews} />
}