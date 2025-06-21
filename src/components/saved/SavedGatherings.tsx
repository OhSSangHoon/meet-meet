"use client";

import { useState } from 'react';
import { useToggleSavedGatherings } from '@/hooks/api/saved/useToggleSavedGatherings';
import { useSavedGatherings } from '@/hooks/api/saved/useSavedGatherings';
import GatheringsList from '@/components/gatherings/GatheringsList';
import GatheringFilters from '@/components/shared/GatheringsFilters';
import PagesHeader from '@/components/shared/PagesHeader';

export default function SavedGatherings() {
    const [selectedMainType, setSelectedMainType] = useState('DALLAEMFIT');
    const [selectedSubType, setSelectedSubType] = useState('ALL');

    const { savedIds } = useToggleSavedGatherings();
    const { data: savedGatherings = [] } = useSavedGatherings(savedIds);

    const handleTypeChange = (mainType: string, subType: string) => {
        setSelectedMainType(mainType);
        setSelectedSubType(subType);
    };

    return (
        <div className="w-full flex flex-col">
            <PagesHeader type="saved" />

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