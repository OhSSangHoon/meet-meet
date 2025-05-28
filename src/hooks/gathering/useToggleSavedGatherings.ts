import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSavedGatherings,
  setSavedGatherings,
} from '@/components/gatherings/shared/utils/savedGatherings';

/**
 * 찜한 모임 목록을 관리하는 훅
 * @returns {Object} 찜한 모임 목록 조회 및 토글 기능 제공
 * @returns {string[]} gatheringId - 찜한 모임 ID 배열
 * @returns {function} toggleSaved - 찜한 모임 토글 기능
 * @returns {boolean} isToggling - 찜한 모임 토글 기능 진행 중 여부
 */
export const useToggleSavedGatherings = () => {
  const queryClient = useQueryClient();

  // 찜목록 조회
  const { data: savedIds = [] } = useQuery({
    queryKey: ['savedGatherings'],
    queryFn: getSavedGatherings,
    staleTime: Infinity,
  });

  // 찜하기 토글 mutation
  const toggleSavedMutation = useMutation({
    mutationFn: (gatheringId: string) => {
      const currentSaved = getSavedGatherings();
      const newSaved = currentSaved.includes(gatheringId)
        ? currentSaved.filter(id => id !== gatheringId)
        : currentSaved.concat(gatheringId);

      setSavedGatherings(newSaved);
      return Promise.resolve(newSaved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedGatherings'] });
    },
  });

  return {
    savedIds,
    toggleSaved: toggleSavedMutation.mutate,
    isToggling: toggleSavedMutation.isPending,
  };
};
