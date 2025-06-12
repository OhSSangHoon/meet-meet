'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { getSavedGatherings, setSavedGatherings } from '@/components/gatherings/shared/utils/savedGatherings';
import { getTimeRemaining } from '@/components/shared/utils/dateFormats';
import { internalClient } from '@/lib/api/clientFetchers';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { Gathering } from '@/types/gatherings';

/**
 * 찜한 모임 목록
 */
export const useToggleSavedGatherings = () => {
  const queryClient = useQueryClient();

  // 마감된 모임을 localStorage에서 완전히 제거하는 함수
  const cleanupExpiredGatherings = useCallback(async () => {
    const currentIds = getSavedGatherings();
    if (currentIds.length === 0) return currentIds;
    
    try {
      const response = await internalClient.get(INTERNAL_PATHS.GATHERINGS, {
        params: { limit: 1000 }
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

      // 조용한 업데이트
      if (validIds.length !== currentIds.length) {
        setSavedGatherings(validIds);
        queryClient.setQueryData(["savedGatherings"], validIds);
        
        // 찜한 모임 목록 업데이트
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
    
    const interval = setInterval(cleanupExpiredGatherings, 30000);
    
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

  // 찜목록 조회
  const { data: savedIds = [] } = useQuery({
    queryKey: ["savedGatherings"],
    queryFn: cleanupExpiredGatherings,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
  });

  // 자연스러운 찜하기 토글 mutation
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

    // 완전한 Optimistic Update
    onMutate: async (gatheringId: string) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["savedGatherings"] });
      await queryClient.cancelQueries({ queryKey: ["allSavedGatherings"], exact: false });

      const currentSaved = getSavedGatherings();
      const isCurrentlySaved = currentSaved.includes(gatheringId);
      const newSaved = isCurrentlySaved
        ? currentSaved.filter(id => id !== gatheringId)
        : [gatheringId, ...currentSaved];

      // 이전 데이터 백업
      const previousSavedIds = queryClient.getQueryData<string[]>(["savedGatherings"]) || [];
      const previousAllSavedData = queryClient.getQueryData<Gathering[]>(["allSavedGatherings", currentSaved]) || [];

      // savedIds 즉시 업데이트
      queryClient.setQueryData(["savedGatherings"], newSaved);

      // 찜한 모임 목록 업데이트
      if (previousAllSavedData.length > 0) {
        if (isCurrentlySaved) {
          // 찜 해제
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

    // 성공 시에는 아무것도 하지 않음
    onSuccess: () => {
    },

    onError: (error, _gatheringId, context) => {
      console.error('찜 토글 실패:', error);

      // 에러 시에만 롤백 (자연스럽게 원래 상태로)
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