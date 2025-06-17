"use client";

import { useState } from 'react';
import { useToggleSavedGatherings } from '@/hooks/api/saved/useToggleSavedGatherings';
import { useQuery } from '@tanstack/react-query';
import { allSavedQueries } from '@/queries/saved.query';
import { internalClient } from '@/lib/api/clientFetchers';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { Gathering } from '@/types/gatherings';
import GatheringsList from '@/components/gatherings/GatheringsList';
import GatheringFilters from '@/components/shared/GatheringsFilters';
import GatheringsHeader from '@/components/shared/GatheringsHeader';

// 매직넘버 상수
const API_LIMIT = 1000; // 모임 조회 제한

export default function SavedGatheringsUI() {
    const [selectedMainType, setSelectedMainType] = useState('DALLAEMFIT');
    const [selectedSubType, setSelectedSubType] = useState('ALL');

    const { savedIds } = useToggleSavedGatherings();

    const { data: savedGatherings = [] } = useQuery({
        queryKey: allSavedQueries.idsByFilter(savedIds),
        queryFn: async () => {
            if (savedIds.length === 0) return [];

            const response = await internalClient.get(INTERNAL_PATHS.GATHERINGS, {
                params: { limit: API_LIMIT }
            });

            const gatherings = response.data;

            const gatheringsMap = new Map(
                gatherings.map((gathering: Gathering) => [gathering.id.toString(), gathering])
            );

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