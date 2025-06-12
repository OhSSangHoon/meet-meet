"use client";

import { useState } from 'react';
import { useToggleSavedGatherings } from '@/hooks/api/saved/useToggleSavedGatherings';
import { useQuery } from '@tanstack/react-query';
import { internalClient } from '@/lib/api/clientFetchers';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { Gathering } from '@/types/gatherings';
import GatheringsList from '@/components/gatherings/GatheringsList';
import GatheringFilters from '@/components/gatherings/shared/ui/GatheringsFilters';
import GatheringsHeader from '@/components/gatherings/shared/ui/GatheringsHeader';

export default function SavedGatheringsClient() {
    const [selectedMainType, setSelectedMainType] = useState('DALLAEMFIT');
    const [selectedSubType, setSelectedSubType] = useState('ALL');

    const { savedIds } = useToggleSavedGatherings();

    // 찜한 모임의 상세 데이터 가져오기
    const { data: savedGatherings = [] } = useQuery({
        queryKey: ["allSavedGatherings", savedIds],
        queryFn: async () => {
            if (savedIds.length === 0) return [];

            const response = await internalClient.get(INTERNAL_PATHS.GATHERINGS, {
                params: { limit: 1000 }
            });

            // 모임 데이터 가져오기
            const gatherings = response.data;

            // 모임 데이터 맵 생성
            const gatheringsMap = new Map(
                gatherings.map((gathering: Gathering) => [gathering.id.toString(), gathering])
            );

            // savedIds 순서대로 정렬된 모임 반환
            return savedIds
                .map(id => gatheringsMap.get(id))
                .filter((gathering): gathering is Gathering => gathering !== undefined);
        },
        enabled: savedIds.length > 0,
        retry: 2,
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
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
                showCreateButton={false}
            />
            
            <GatheringsList
                ssrGatherings={savedGatherings}
                activeStartIndex={0}
                selectedMainType={selectedMainType}
                selectedSubType={selectedSubType}
                filters={{ location: '', date: '' }}
                sort={{ sortBy: 'registrationEnd', sortOrder: 'desc' }}
                enableInfiniteScroll={false}
                savedGatheringIds={savedIds}
            />
        </div>
    );
}