'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSavedGatherings,
  setSavedGatherings,
} from '@/components/gatherings/shared/utils/savedGatherings';
import { Gathering } from '@/types/gatherings';

/**
 * 찜한 모임 목록을 관리하는 훅 (Optimistic Update 포함)
 * @returns {Object} 찜한 모임 목록 조회 및 토글 기능 제공
 * @returns {string[]} savedIds - 찜한 모임 ID 배열
 * @returns {function} toggleSaved - 찜한 모임 토글 기능
 * @returns {boolean} isToggling - 찜한 모임 토글 기능 진행 중 여부
 * @returns {function} invalidateQueries - 찜한 모임 목록 조회 쿼리 무효화
 */
export const useToggleSavedGatherings = () => {
  const queryClient = useQueryClient();

  // 찜목록 조회
  const { data: savedIds = [] } = useQuery({
    queryKey: ["savedGatherings"],
    queryFn: getSavedGatherings,
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

      // 1. 찜 ID 목록 즉시 업데이트
      queryClient.setQueryData(["savedGatherings"], newSaved);

      // 2. 찜목록 데이터 즉시 업데이트
      if (isCurrentlySaved) {
        // 찜 해제: 기존 데이터에서 제거
        const updatedData = previousAllSaved.filter(
          gathering => gathering.id.toString() !== gatheringId
        );
        queryClient.setQueryData(["allSavedGatherings", newSaved], updatedData);
      } else {
        // 찜 추가: 새로운 쿼리가 실행되도록 invalidate
        // queryKey가 변경되므로 자동으로 새 쿼리 실행됨
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