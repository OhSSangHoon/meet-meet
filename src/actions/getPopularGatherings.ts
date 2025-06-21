import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { serverFetcher } from '@/lib/api/serverFetcher';
import { Gathering } from '@/types/gatherings';
import { toKoreanTime } from '@/utils/shared/date';

export async function getPopularGatherings(): Promise<Gathering[]> {
    try {
        let data: Gathering[] = [];
        const response = await serverFetcher(`${EXTERNAL_PATHS.GATHERINGS}?sortBy=participantCount&sortOrder=desc`, { cache: 'force-cache', next: { revalidate: 60 * 60 } });
        if (Array.isArray(response)) data = response as Gathering[];

        const now = new Date();
        const koreanNow = toKoreanTime(now);
        const filteredByDate = data.filter((gathering) => new Date(gathering.registrationEnd) > koreanNow);

        return filteredByDate.slice(0, 4);
    } catch (error) {
        console.error('인기 모임 4개 조회 실패:', error);
        return [];
    }
} 