import { Metadata } from 'next';
import { ReviewItem } from "@/types/reviews";
import Reviews from "@/components/reviews/Reviews";

export const metadata: Metadata = {
    title: `모든 리뷰 | Meet Meet`,
    description: `모임 찾기 페이지 입니다`,
};

async function getInitialReviews(): Promise<ReviewItem[]> {
    try {
        const response = await fetch(`${process.env.API_URI_DEV}/reviews?limit=3&offset=0&type=DALLAEMFIT&sortBy=createdAt&sortOrder=desc`, {
            next: { revalidate: 60 },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('리뷰 목록 데이터 SSR 실패:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            return [];
        }

        const responseData = await response.json();

        // 페이지네이션된 응답에서 data 배열 추출
        const data = responseData.data || [];

        if (Array.isArray(data)) {
            // 클라이언트 필터링
            return data.filter((review: ReviewItem) =>
                review.Gathering.type === 'OFFICE_STRETCHING' ||
                review.Gathering.type === 'MINDFULNESS'
            );
        } else {
            console.warn('리뷰 응답의 data가 배열이 아닙니다:', data);
            return [];
        }

    } catch (error) {
        console.error('리뷰 SSR 에러:', error);
        return [];
    }
}

export default async function ReviewsPage() {
    const initialReviews = await getInitialReviews();

    return (
        <div className="contents-container">
            <Reviews initialReviews={initialReviews} />
        </div>
    );
}