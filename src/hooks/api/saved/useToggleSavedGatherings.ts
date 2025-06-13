'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { getSavedGatherings, setSavedGatherings } from '@/components/gatherings/shared/utils/savedGatherings';
import { getTimeRemaining } from '@/components/shared/utils/dateFormats';
import { internalClient } from '@/lib/api/clientFetchers';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { Gathering } from '@/types/gatherings';

// 매직넘버 상수
const CLEANUP_INTERVAL = 30000; // 마감된 모임 정리 주기
const REFETCH_INTERVAL = 60000; // 찜 목록 재조회 주기
const API_LIMIT = 1000; // 모임 조회 제한


export const useToggleSavedGatherings = () => {
  const queryClient = useQueryClient();

  const cleanupExpiredGatherings = useCallback(async () => {
    const currentIds = getSavedGatherings();
    if (currentIds.length === 0) return currentIds;
    
    try {
      const response = await internalClient.get(INTERNAL_PATHS.GATHERINGS, {
        params: { limit: API_LIMIT }
      });

      const gatherings = response.data as Gathering[];
      const gatheringsMap = new Map(
        gatherings.map((gathering: Gathering) => [gathering.id.toString(), gathering])
      );

      const validIds = currentIds.filter(id => {
        const gathering = gatheringsMap.get(id);
        if (!gathering) return false;
        if (!gathering.registrationEnd) return true;
        return getTimeRemaining(gathering.registrationEnd) !== '마감됨';
      });

      if (validIds.length !== currentIds.length) {
        setSavedGatherings(validIds);
        queryClient.setQueryData(["savedGatherings"], validIds);
        
        const currentSavedData = queryClient.getQueryData<Gathering[]>(["allSavedGatherings", currentIds]);
        if (currentSavedData) {
          const updatedSavedData = currentSavedData.filter(gathering => 
            validIds.includes(gathering.id.toString())
          );
          queryClient.setQueryData(["allSavedGatherings", validIds], updatedSavedData);
        }
      }

      return validIds;
    } catch (error) {
      console.error('localStorage 정리 중 오류:', error);
      return currentIds;
    }
  }, [queryClient]);

  useEffect(() => {
    cleanupExpiredGatherings();
    
    const interval = setInterval(cleanupExpiredGatherings, CLEANUP_INTERVAL);
    
    const handleFocus = () => cleanupExpiredGatherings();
    const handleVisibilityChange = () => {
      if (!document.hidden) cleanupExpiredGatherings();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cleanupExpiredGatherings]);

  const { data: savedIds = [] } = useQuery({
    queryKey: ["savedGatherings"],
    queryFn: cleanupExpiredGatherings,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  const toggleSavedMutation = useMutation({
    mutationFn: async (gatheringId: string) => {
      const currentSaved = getSavedGatherings();
      const isCurrentlySaved = currentSaved.includes(gatheringId);
      const newSaved = isCurrentlySaved
        ? currentSaved.filter(id => id !== gatheringId)
        : [gatheringId, ...currentSaved];

      setSavedGatherings(newSaved);
      return { newSaved, gatheringId, isCurrentlySaved };
    },

    onMutate: async (gatheringId: string) => {
      await queryClient.cancelQueries({ queryKey: ["savedGatherings"] });
      await queryClient.cancelQueries({ queryKey: ["allSavedGatherings"], exact: false });

      const currentSaved = getSavedGatherings();
      const isCurrentlySaved = currentSaved.includes(gatheringId);
      const newSaved = isCurrentlySaved
        ? currentSaved.filter(id => id !== gatheringId)
        : [gatheringId, ...currentSaved];

      const previousSavedIds = queryClient.getQueryData<string[]>(["savedGatherings"]) || [];
      const previousAllSavedData = queryClient.getQueryData<Gathering[]>(["allSavedGatherings", currentSaved]) || [];

      queryClient.setQueryData(["savedGatherings"], newSaved);

      if (previousAllSavedData.length > 0) {
        if (isCurrentlySaved) {
          const updatedData = previousAllSavedData.filter(
            gathering => gathering.id.toString() !== gatheringId
          );
          queryClient.setQueryData(["allSavedGatherings", newSaved], updatedData);
        }
      }

      return { 
        previousSavedIds, 
        previousAllSavedData, 
        currentSaved,
        isCurrentlySaved 
      };
    },

    onSuccess: () => {
    },

    onError: (error, _gatheringId, context) => {
      console.error('찜 토글 실패:', error);

      if (context?.previousSavedIds) {
        queryClient.setQueryData(["savedGatherings"], context.previousSavedIds);
        setSavedGatherings(context.previousSavedIds);
      }
      
      if (context?.previousAllSavedData && context?.currentSaved) {
        queryClient.setQueryData(["allSavedGatherings", context.currentSaved], context.previousAllSavedData);
      }
    },
  });

  return {
    savedIds,
    toggleSaved: toggleSavedMutation.mutate,
    isToggling: toggleSavedMutation.isPending,
    cleanupExpiredGatherings,
  };
};
