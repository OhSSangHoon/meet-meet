import { Metadata } from 'next';
import { serverFetcher } from '@/lib/api/serverFetcher';
import { Gathering } from "@/types/gatherings";
import Gatherings from "@/components/gatherings/Gatherings";

export const metadata: Metadata = {
    title: `모임 찾기 | Meet Meet`,
    description: `모임 찾기 페이지 입니다`,
};

async function getInitialGatherings(): Promise<Gathering[]> {
    try {
        const data = await serverFetcher(`/gatherings?limit=10&offset=0&type=DALLAEMFIT`, { next: { revalidate: 60 } });

        if (Array.isArray(data)) {
            // DALLAEMFIT의 경우 클라이언트에서 필터링
            return data.filter((gathering: Gathering) =>
                gathering.type === 'OFFICE_STRETCHING' ||
                gathering.type === 'MINDFULNESS'
            );
        } else {
            console.warn('응답이 배열이 아닙니다:', data);
            return [];
        }

    } catch (error) {
        console.error('SSR 에러:', error);
        return [];
    }
}

export default async function GatheringsPage() {
    const initialGatherings = await getInitialGatherings();

    return (
        <div className="contents-container">
            <Gatherings initialGatherings={initialGatherings} />
        </div>
    );
}