"use client";

import { useState } from 'react';
import GatheringsList from '@/components/gatherings/GatheringsList';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';
import { Gathering } from '@/types/gatherings';
import GatheringFilters from '@/components/gatherings/shared/ui/GatheringsFilters';
import { useToggleSavedGatherings } from '@/hooks/api/saved/useToggleSavedGatherings';
import GatheringsHeader from '@/components/gatherings/shared/ui/GatheringsHeader';
import { getTimeRemaining } from '@/components/shared/utils/date';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';

export default function SavedGatheringsClient() {
    const [selectedMainType, setSelectedMainType] = useState('DALLAEMFIT');
    const [selectedSubType, setSelectedSubType] = useState('ALL');

    //핵심 변경: useToggleSavedGatherings 훅 
    const { savedIds } = useToggleSavedGatherings();

    // 찜한 모임의 상세 데이터만 별도로 가져오기
    const { data: allSavedGatherings = [] } = useQuery({
        queryKey: ["allSavedGatherings", savedIds], // savedIds 자동 갱신
        queryFn: async () => {
            if (savedIds.length === 0) return [];

            const response = await apiClient.get(INTERNAL_PATHS.fetchGatherings, {
                params: {
                    limit: 1000
                }
            });

            // 찜한 ID 목록을 기반으로 필터링
            const gatheringsMap = new Map(
                response.data.map((gathering: Gathering) => [gathering.id.toString(), gathering])
            );

            const orderedGatherings = savedIds
                // 찜한 ID 목록을 기반으로 모임 데이터 가져오기
                .map(id => gatheringsMap.get(id))
                // 모임 데이터가 없는 경우 제외
                .filter((gathering): gathering is Gathering => gathering !== undefined)
                // 마감된 모임은 제외
                .filter(gathering => {
                    if (!gathering.registrationEnd) return true;
                    return getTimeRemaining(gathering.registrationEnd) !== '마감됨';
                })

            return orderedGatherings;
        },
        enabled: savedIds.length > 0, // savedIds가 있을 때만 실행
    });

    const handleTypeChange = (mainType: string, subType: string) => {
        setSelectedMainType(mainType);
        setSelectedSubType(subType);
    };

    return (
        <div className="w-full flex flex-col">
            <GatheringsHeader type="saved" />
            <GatheringFilters
                onTypeChange={handleTypeChange}
                initialMainType={selectedMainType}
                initialSubType={selectedSubType}
            />
            <GatheringsList
                gatherings={allSavedGatherings}
                fetchFromApi={false}
                selectedMainType={selectedMainType}
                selectedSubType={selectedSubType}
            />
        </div>
    );
}