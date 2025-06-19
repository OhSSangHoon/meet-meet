import { describe, it, expect } from 'vitest';

// 모임 찾기 페이지 전용 함수들
const validateSearchFilters = (location: string, date: string): boolean => {
  // 위치는 선택사항
  const validLocations = ['', '건대입구', '을지로3가', '신림', '홍대입구'];
  
  // 날짜는 미래 날짜여야 함 (search 페이지에서)
  const today = new Date().toISOString().split('T')[0];
  const isValidDate = date === '' || date >= today;
  
  return validLocations.includes(location) && isValidDate;
};

const getSearchSortOptions = () => {
  return [
    { value: 'registrationEnd_desc', label: '마감 여유순', sortBy: 'registrationEnd', sortOrder: 'desc' },
    { value: 'registrationEnd_asc', label: '마감 임박순', sortBy: 'registrationEnd', sortOrder: 'asc' }
  ];
};

const toggleSearchSort = (currentSort: string): string => {
  return currentSort === 'registrationEnd_desc' ? 'registrationEnd_asc' : 'registrationEnd_desc';
};

describe('모임 찾기 페이지 필터링', () => {
  describe('검색 필터 검증', () => {
    it('유효한 위치와 미래 날짜는 통과해야 함', () => {
      const futureDate = '2030-12-31';
      expect(validateSearchFilters('건대입구', futureDate)).toBe(true);
      expect(validateSearchFilters('', futureDate)).toBe(true);
    });

    it('과거 날짜는 실패해야 함', () => {
      const pastDate = '2020-01-01';
      expect(validateSearchFilters('건대입구', pastDate)).toBe(false);
    });

    it('유효하지 않은 위치는 실패해야 함', () => {
      expect(validateSearchFilters('강남역', '2030-12-31')).toBe(false);
    });
  });

  describe('정렬 옵션', () => {
    it('검색 페이지에 맞는 정렬 옵션들을 반환해야 함', () => {
      const options = getSearchSortOptions();
      expect(options).toHaveLength(2);
      expect(options[0].label).toBe('마감 여유순');
      expect(options[1].label).toBe('마감 임박순');
    });

    it('정렬 토글이 올바르게 작동해야 함', () => {
      expect(toggleSearchSort('registrationEnd_desc')).toBe('registrationEnd_asc');
      expect(toggleSearchSort('registrationEnd_asc')).toBe('registrationEnd_desc');
    });
  });
});