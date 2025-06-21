import { describe, it, expect } from 'vitest';

// 모임 필터링 관련 함수들
const handleMainTypeSelection = (type: string): { mainType: string; subType: string } => {
  if (type === 'DORANDORAN') {
    return { mainType: type, subType: 'WORKATION' };
  } else {
    return { mainType: type, subType: 'ALL' };
  }
};

// 서브타입 선택 함수
const handleSubTypeSelection = (mainType: string, subType: string): boolean => {
  if (mainType === 'DALLAEMFIT') {
    return ['ALL', 'OFFICE_STRETCHING', 'MINDFULNESS'].includes(subType);
  } else if (mainType === 'DORANDORAN') {
    return subType === 'ALL' || subType === 'WORKATION';
  }
  return false;
};

// 서브타입 옵션 생성 함수
const getSubTypeOptions = (mainType: string) => {
  if (mainType === 'DALLAEMFIT') {
    return [
      { id: 'ALL', label: '전체' },
      { id: 'OFFICE_STRETCHING', label: '엔터테인먼트' },
      { id: 'MINDFULNESS', label: '액티비티' }
    ];
  } else if (mainType === 'DORANDORAN') {
    return [
      { id: 'ALL', label: '전체' }
    ];
  }
  return [];
};

// 모임 만들기 버튼 표시 로직
const shouldShowCreateButton = (showCreateButton: boolean, hasToken: boolean): boolean => {
  return showCreateButton && hasToken;
};

describe('GatheringFilters 컴포넌트 로직', () => {
  describe('메인 타입 선택', () => {
    it('DALLAEMFIT 선택 시 서브타입이 ALL로 설정되어야 함', () => {
      const result = handleMainTypeSelection('DALLAEMFIT');
      expect(result).toEqual({ mainType: 'DALLAEMFIT', subType: 'ALL' });
    });

    it('DORANDORAN 선택 시 서브타입이 WORKATION으로 설정되어야 함', () => {
      const result = handleMainTypeSelection('DORANDORAN');
      expect(result).toEqual({ mainType: 'DORANDORAN', subType: 'WORKATION' });
    });
  });

  describe('서브 타입 선택 검증', () => {
    it('DALLAEMFIT에서 유효한 서브타입들이 허용되어야 함', () => {
      expect(handleSubTypeSelection('DALLAEMFIT', 'ALL')).toBe(true);
      expect(handleSubTypeSelection('DALLAEMFIT', 'OFFICE_STRETCHING')).toBe(true);
      expect(handleSubTypeSelection('DALLAEMFIT', 'MINDFULNESS')).toBe(true);
    });

    it('DALLAEMFIT에서 유효하지 않은 서브타입은 거부되어야 함', () => {
      expect(handleSubTypeSelection('DALLAEMFIT', 'WORKATION')).toBe(false);
      expect(handleSubTypeSelection('DALLAEMFIT', 'INVALID')).toBe(false);
    });

    it('DORANDORAN에서는 ALL과 WORKATION만 허용되어야 함', () => {
      expect(handleSubTypeSelection('DORANDORAN', 'ALL')).toBe(true);
      expect(handleSubTypeSelection('DORANDORAN', 'WORKATION')).toBe(true);
      expect(handleSubTypeSelection('DORANDORAN', 'OFFICE_STRETCHING')).toBe(false);
    });
  });

  describe('서브타입 옵션 생성', () => {
    it('DALLAEMFIT에 대한 올바른 서브타입 옵션들을 반환해야 함', () => {
      const options = getSubTypeOptions('DALLAEMFIT');
      expect(options).toEqual([
        { id: 'ALL', label: '전체' },
        { id: 'OFFICE_STRETCHING', label: '엔터테인먼트' },
        { id: 'MINDFULNESS', label: '액티비티' }
      ]);
    });

    it('DORANDORAN에 대한 올바른 서브타입 옵션을 반환해야 함', () => {
      const options = getSubTypeOptions('DORANDORAN');
      expect(options).toEqual([
        { id: 'ALL', label: '전체' }
      ]);
    });

    it('잘못된 메인타입에 대해 빈 배열을 반환해야 함', () => {
      const options = getSubTypeOptions('INVALID');
      expect(options).toEqual([]);
    });
  });

  describe('모임 만들기 버튼 표시 로직', () => {
    it('버튼 표시 플래그가 true이고 토큰이 있으면 true를 반환해야 함', () => {
      expect(shouldShowCreateButton(true, true)).toBe(true);
    });

    it('버튼 표시 플래그가 false이면 토큰과 무관하게 false를 반환해야 함', () => {
      expect(shouldShowCreateButton(false, true)).toBe(false);
      expect(shouldShowCreateButton(false, false)).toBe(false);
    });

    it('토큰이 없으면 버튼 표시 플래그와 무관하게 false를 반환해야 함', () => {
      expect(shouldShowCreateButton(true, false)).toBe(false);
    });
  });
});