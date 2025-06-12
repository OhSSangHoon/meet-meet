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

    // useToggleSavedGatherings 훅
    const { savedIds } = useToggleSavedGatherings();

    // 찜한 모임의 상세 데이터만 별도로 가져오기
    const { data: allSavedGatherings = [] } = useQuery({
        queryKey: ["allSavedGatherings", savedIds], // savedIds 자동 갱신
        queryFn: async () => {
            if (savedIds.length === 0) return [];

            try {
                const response = await internalClient.get(INTERNAL_PATHS.GATHERINGS, {
                    params: {
                        limit: 1000
                    }
                });

                // API 응답 구조 확인
                const gatherings = Array.isArray(response.data) 
                    ? response.data 
                    : response.data?.data || response.data?.gatherings || [];

                // 찜한 ID 목록을 기반으로 필터링
                const gatheringsMap = new Map(
                    gatherings.map((gathering: Gathering) => [gathering.id.toString(), gathering])
                );

                const orderedGatherings = savedIds
                    // 찜한 ID 목록을 기반으로 모임 데이터 가져오기
                    .map(id => gatheringsMap.get(id))
                    // 모임 데이터가 없는 경우 제외
                    .filter((gathering): gathering is Gathering => gathering !== undefined);

                return orderedGatherings;
            } catch (error) {
                console.error('찜한 모임 데이터 로드 실패:', error);
                return [];
            }
        },
        enabled: savedIds.length > 0, // savedIds가 있을 때만 실행
        retry: 2,
        refetchOnWindowFocus: false,
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
                ssrGatherings={allSavedGatherings}
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