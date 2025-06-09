'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getSavedGatherings, setSavedGatherings } from '@/components/gatherings/shared/utils/savedGatherings';
import { getTimeRemaining } from '@/components/shared/utils/dateFormats';
import { apiClient } from '@/lib/api/clientFetchers';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { Gathering } from '@/types/gatherings';

/**
 * 찜한 모임 목록을 관리하는 훅 (Optimistic Update + 마감된 모임 자동 제거)
 * @returns {Object} 찜한 모임 목록 조회 및 토글 기능 제공
 * @returns {string[]} savedIds - 찜한 모임 ID 배열
 * @returns {function} toggleSaved - 찜한 모임 토글 기능
 * @returns {boolean} isToggling - 찜한 모임 토글 기능 진행 중 여부
 */
export const useToggleSavedGatherings = () => {
  const queryClient = useQueryClient();

  // 마감된 모임 자동 제거 함수
  const removeExpiredGatherings = useCallback(async (gatheringIds: string[]) => {
    if (gatheringIds.length === 0) return gatheringIds;

    try {
      const response = await apiClient.get(INTERNAL_PATHS.GATHERINGS, {
        params: { limit: 1000 }
      });

      // 타입 안전성 보장
      const gatherings = response.data as Gathering[];
      const gatheringsMap = new Map(
        gatherings.map((gathering: Gathering) => [gathering.id.toString(), gathering])
      );

      // 마감되지 않은 모임만 필터링
      const validIds = gatheringIds.filter(id => {
        const gathering = gatheringsMap.get(id);
        if (!gathering || !gathering.registrationEnd) return true;
        return getTimeRemaining(gathering.registrationEnd) !== '마감됨';
      });

      // localStorage 업데이트
      if (validIds.length !== gatheringIds.length) {
        setSavedGatherings(validIds);

        // 쿼리 캐시 업데이트
        queryClient.setQueryData(["savedGatherings"], validIds);
        queryClient.invalidateQueries({
          queryKey: ["allSavedGatherings"],
          exact: false
        });
      }

      return validIds;
    } catch (error) {
      console.error('마감된 모임 제거 중 오류:', error);
      return gatheringIds; // 에러 시 기존 데이터 유지
    }
  }, [queryClient]);

  // 찜목록 조회 (마감된 모임 자동 정리 포함)
  const { data: savedIds = [] } = useQuery({
    queryKey: ["savedGatherings"],
    queryFn: async () => {
      const currentIds = getSavedGatherings();
      // 마감된 모임 제거 후 반환
      return await removeExpiredGatherings(currentIds);
    },
  });

  // 찜하기 토글 mutation (Optimistic Update 포함)
  const toggleSavedMutation = useMutation({
    mutationFn: async (gatheringId: string) => {
      const currentSaved = getSavedGatherings();
      const isCurrentlySaved = currentSaved.includes(gatheringId);
      const newSaved = isCurrentlySaved
        ? currentSaved.filter(id => id !== gatheringId)
        : [gatheringId, ...currentSaved]; // 새로 추가된 것은 맨 앞에

      setSavedGatherings(newSaved);
      return { newSaved, gatheringId, isCurrentlySaved };
    },

    // Optimistic Update
    onMutate: async (gatheringId: string) => {
      const currentSaved = getSavedGatherings();
      const isCurrentlySaved = currentSaved.includes(gatheringId);
      const newSaved = isCurrentlySaved
        ? currentSaved.filter(id => id !== gatheringId)
        : [gatheringId, ...currentSaved];

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["savedGatherings"] });
      await queryClient.cancelQueries({
        queryKey: ["allSavedGatherings"],
        exact: false // 모든 allSavedGatherings 쿼리 취소
      });

      // 이전 데이터 백업
      const previousSavedIds = queryClient.getQueryData<string[]>(["savedGatherings"]) || [];
      const previousAllSaved = queryClient.getQueryData<Gathering[]>(["allSavedGatherings", currentSaved]) || [];

      // 찜 ID 목록 즉시 업데이트
      queryClient.setQueryData(["savedGatherings"], newSaved);

      // 찜목록 데이터 즉시 업데이트
      if (isCurrentlySaved) {
        // 기존 데이터에서 제거
        const updatedData = previousAllSaved.filter(
          gathering => gathering.id.toString() !== gatheringId
        );
        queryClient.setQueryData(["allSavedGatherings", newSaved], updatedData);
      }

      return { previousSavedIds, previousAllSaved, currentSaved };
    },

    onError: (error, _, context) => {
      console.error('찜 토글 실패:', error);

      // 에러 시 이전 상태로 롤백
      if (context?.previousSavedIds) {
        queryClient.setQueryData(["savedGatherings"], context.previousSavedIds);
        setSavedGatherings(context.previousSavedIds);
      }
      if (context?.previousAllSaved && context?.currentSaved) {
        queryClient.setQueryData(["allSavedGatherings", context.currentSaved], context.previousAllSaved);
      }

      // 모든 관련 쿼리 재실행
      queryClient.invalidateQueries({ queryKey: ["savedGatherings"] });
      queryClient.invalidateQueries({ queryKey: ["allSavedGatherings"], exact: false });
    },
  });

  return {
    savedIds,
    toggleSaved: toggleSavedMutation.mutate,
    isToggling: toggleSavedMutation.isPending,
  };
};