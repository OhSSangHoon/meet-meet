import { describe, it, expect } from 'vitest';

// 리뷰 페이지 전용 함수들
const validateReviewFilters = (location: string, date: string): boolean => {
  // 리뷰 페이지에서는 과거 날짜도 허용
  const validLocations = ['', '건대입구', '을지로3가', '신림', '홍대입구'];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const isValidDate = date === '' || dateRegex.test(date);
  
  return validLocations.includes(location) && isValidDate;
};

// 리뷰 정렬 옵션 생성
const getReviewSortOptions = () => {
  return [
    { value: 'createdAt_desc', label: '최신순', sortBy: 'createdAt', sortOrder: 'desc' },
    { value: 'score_desc', label: '평점 높은순', sortBy: 'score', sortOrder: 'desc' },
    { value: 'participantCount_desc', label: '참여인원 많은순', sortBy: 'participantCount', sortOrder: 'desc' }
  ];
};

// 리뷰 통계 계산
const calculateReviewStats = (reviews: Array<{ score: number }>) => {
  if (reviews.length === 0) return { average: 0, total: 0 };
  
  const total = reviews.length;
  const sum = reviews.reduce((acc, review) => acc + review.score, 0);
  const average = sum / total;
  
  return { average: parseFloat(average.toFixed(1)), total };
};

describe('리뷰 페이지 필터링', () => {
  describe('리뷰 필터 검증', () => {
    it('유효한 위치와 날짜 형식은 통과해야 함', () => {
      expect(validateReviewFilters('을지로3가', '2025-06-18')).toBe(true);
      expect(validateReviewFilters('', '')).toBe(true);
      expect(validateReviewFilters('건대입구', '2020-01-01')).toBe(true); // 과거 날짜 허용
    });

    it('잘못된 날짜 형식은 실패해야 함', () => {
      expect(validateReviewFilters('건대입구', '2025-6-18')).toBe(false);
      expect(validateReviewFilters('건대입구', 'invalid-date')).toBe(false);
    });
  });

  describe('정렬 옵션', () => {
    it('리뷰 페이지에 맞는 정렬 옵션들을 반환해야 함', () => {
      const options = getReviewSortOptions();
      expect(options).toHaveLength(3);
      expect(options[0].label).toBe('최신순');
      expect(options[1].label).toBe('평점 높은순');
      expect(options[2].label).toBe('참여인원 많은순');
    });
  });

  describe('리뷰 통계 계산', () => {
    it('리뷰들의 평균 평점을 올바르게 계산해야 함', () => {
      const reviews = [
        { score: 5 },
        { score: 4 },
        { score: 3 }
      ];
      
      const stats = calculateReviewStats(reviews);
      expect(stats).toEqual({ average: 4.0, total: 3 });
    });

    it('빈 리뷰 배열에 대해 0을 반환해야 함', () => {
      const stats = calculateReviewStats([]);
      expect(stats).toEqual({ average: 0, total: 0 });
    });

    it('소수점 한 자리까지 반올림해야 함', () => {
      const reviews = [
        { score: 5 },
        { score: 4 },
        { score: 4 }
      ];
      
      const stats = calculateReviewStats(reviews);
      expect(stats.average).toBe(4.3);
    });
  });
});