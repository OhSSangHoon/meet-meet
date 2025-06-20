import { describe, it, expect } from 'vitest';

// 찜목록 처리 함수
const processSavedGatherings = (savedIds: string[], allGatherings: Array<{ id: string }>) => {
  return savedIds
    .map(id => allGatherings.find(gathering => gathering.id === id))
    .filter(gathering => gathering !== undefined);
};

// 찜 ID 유효성 검사
const validateSavedIds = (savedIds: string[]): boolean => {
  return Array.isArray(savedIds) && savedIds.every(id => typeof id === 'string' && id.length > 0);
};

// 찜 ID 업데이트 함수
const updateSavedIds = (currentIds: string[], gatheringId: string): string[] => {
  if (currentIds.includes(gatheringId)) {
    return currentIds.filter(id => id !== gatheringId);
  } else {
    return [gatheringId, ...currentIds];
  }
};

// 찜목록 관리 테스트
describe('찜목록 관리', () => {
  const mockGatherings = [
    { id: '1', name: '모임1' },
    { id: '2', name: '모임2' },
    { id: '3', name: '모임3' }
  ];

  describe('찜목록 처리', () => {
    it('유효한 찜 ID들에 해당하는 모임들을 반환해야 함', () => {
      const savedIds = ['1', '3'];
      const result = processSavedGatherings(savedIds, mockGatherings);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: '1', name: '모임1' });
      expect(result[1]).toEqual({ id: '3', name: '모임3' });
    });

    it('존재하지 않는 ID는 필터링되어야 함', () => {
      const savedIds = ['1', '999', '2'];
      const result = processSavedGatherings(savedIds, mockGatherings);
      
      expect(result).toHaveLength(2);
      expect(result.map(g => g.id)).toEqual(['1', '2']);
    });
  });

  describe('찜 ID 검증', () => {
    it('유효한 문자열 배열은 true를 반환해야 함', () => {
      expect(validateSavedIds(['1', '2', '3'])).toBe(true);
      expect(validateSavedIds([])).toBe(true);
    });

    it('유효하지 않은 형식은 false를 반환해야 함', () => {
      expect(validateSavedIds(['1', '', '3'])).toBe(false);
      expect(validateSavedIds([1, 2, 3] as unknown as string[])).toBe(false);
      expect(validateSavedIds('not-array' as unknown as string[])).toBe(false);
    });
  });

  describe('찜 상태 업데이트', () => {
    it('새로운 모임을 찜목록에 추가해야 함', () => {
      const currentIds = ['1', '2'];
      const result = updateSavedIds(currentIds, '3');
      
      expect(result).toEqual(['3', '1', '2']);
    });

    it('이미 찜한 모임을 제거해야 함', () => {
      const currentIds = ['1', '2', '3'];
      const result = updateSavedIds(currentIds, '2');
      
      expect(result).toEqual(['1', '3']);
    });
  });
});