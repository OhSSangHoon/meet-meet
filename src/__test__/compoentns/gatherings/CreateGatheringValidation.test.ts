import { describe, it, expect } from 'vitest';

// 모임 이름 검증
const validateGatheringName = (name: string): boolean => {
  const trimmedName = name.trim();
  if (!trimmedName || trimmedName.length === 0) return false;
  if (trimmedName.length > 20) return false;
  
  // 특수문자 허용 패턴
  const allowedPattern = /^[가-힣a-zA-Z0-9\s\-_.,!?()[\]{}'"]+$/;
  return allowedPattern.test(trimmedName);
};

// 이미지 파일 검증
const validateImageFile = (file: File | null): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: '이미지를 첨부해주세요.' };
  }

  // SVG 차단을 먼저 체크 (파일 확장자와 MIME 타입 모두 확인)
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    return { isValid: false, error: 'SVG 파일은 보안상 업로드할 수 없습니다.' };
  }

  // 파일 크기 체크 (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: '이미지 파일 크기가 너무 큽니다. 5MB 이하로 첨부해주세요.' };
  }

  // 파일 타입 체크
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/bmp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'JPG, PNG, GIF, WebP, AVIF, BMP 파일만 업로드 가능합니다.' };
  }

  return { isValid: true };
};

/** 모집 정원 유효성 검증 */
const validateCapacity = (capacity: number): boolean => {
  return Number.isInteger(capacity) && capacity >= 5 && capacity <= 20;
};

/** 모집 정원 입력 핸들러 */
const handleCapacityInput = (value: string): number => {
  if(value === ''){
    return 5;
  }

  const numValue = Number(value);
  return isNaN(numValue) ? 5 : numValue;
}

/** 기본 모집 정원 반환 */
const getDefaultCapacity = (): number => {
  return 5;
}

const validateDateTime = (dateTime: Date | null): boolean => {
  if (!dateTime) return false;
  const now = new Date();
  return dateTime > now;
};

const validateLocation = (location: string): boolean => {
  const validLocations = ['을지로3가', '건대입구', '신림', '홍대입구'];
  return validLocations.includes(location);
};

describe('모임 생성 검증', () => {
  describe('모임 이름 검증', () => {
    it('모임 이름 검증 통합 테스트', () => {
      const testCases = [
        // 성공 케이스
        { input: '오피스 스트레칭', valid: true, desc: '일반적인 이름' },
        { input: '개발자 모임-2024', valid: true, desc: '하이픈과 숫자' },
        { input: 'Team Building', valid: true, desc: '영문' },
        
        // 실패 케이스
        { input: '', valid: false, desc: '빈 문자열' },
        { input: '   ', valid: false, desc: '공백만' },
        { input: '\t\n', valid: false, desc: '탭과 개행' },
        { input: 'a'.repeat(21), valid: false, desc: '20자 초과' },
        { input: '모임@#$%', valid: false, desc: '특수문자' },
        { input: '모임<script>', valid: false, desc: 'HTML 태그' }
      ];

      testCases.forEach(({ input, valid }) => {
        expect(validateGatheringName(input)).toBe(valid);
      });
    });
  });

  describe('이미지 파일 검증', () => {
    it('이미지 파일 검증 통합 테스트', () => {
      // null 체크
      expect(validateImageFile(null).isValid).toBe(false);
      
      // 크기 초과 파일
      const largeFile = new File([''], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });
      expect(validateImageFile(largeFile).isValid).toBe(false);
      
      // 유효한 파일
      const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(validFile, 'size', { value: 1024 });
      expect(validateImageFile(validFile).isValid).toBe(true);
      
      // SVG 차단
      const svgFile = new File(['<svg></svg>'], 'test.svg', { type: 'image/svg+xml' });
      expect(validateImageFile(svgFile).isValid).toBe(false);
    });
  });

  describe('모집 정원 검증', () => {
    it('기본값은 5여야 함', () => {
      expect(getDefaultCapacity()).toBe(5);
    });

    it('입력 처리 및 검증 통합 테스트', () => {
      const testCases = [
        // 정상 케이스
        { input: '', expected: 5, valid: true, desc: '빈 값 → 기본값' },
        { input: '5', expected: 5, valid: true, desc: '최소값' },
        { input: '10', expected: 10, valid: true, desc: '중간값' },
        { input: '20', expected: 20, valid: true, desc: '최대값' },
        
        // 범위 초과/미만
        { input: '0', expected: 0, valid: false, desc: '0' },
        { input: '4', expected: 4, valid: false, desc: '최소값-1' },
        { input: '21', expected: 21, valid: false, desc: '최대값+1' },
        { input: '100', expected: 100, valid: false, desc: '큰 수' },
        { input: '-5', expected: -5, valid: false, desc: '음수' },
        
        // 특수 케이스
        { input: '10.5', expected: 10.5, valid: false, desc: '소수점' },
        { input: 'abc', expected: 5, valid: true, desc: '문자열 → 기본값' },
        { input: 'null', expected: 5, valid: true, desc: 'null 문자열 → 기본값' }
      ];

      testCases.forEach(({ input, expected, valid }) => {
        const processedValue = handleCapacityInput(input);
        const isValid = validateCapacity(processedValue);
        
        expect(processedValue).toBe(expected);
        expect(isValid).toBe(valid);
      });
    });

    it('특수 값 검증', () => {
      expect(validateCapacity(NaN)).toBe(false);
      expect(validateCapacity(Infinity)).toBe(false);
      expect(validateCapacity(-Infinity)).toBe(false);
    });
  });

  describe('날짜 시간 검증', () => {
    it('날짜 시간 검증 통합 테스트', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      expect(validateDateTime(futureDate)).toBe(true);
      expect(validateDateTime(pastDate)).toBe(false);
      expect(validateDateTime(null)).toBe(false);
    });
  });

  describe('장소 검증', () => {
    it('장소 검증 통합 테스트', () => {
      const validLocations = ['을지로3가', '건대입구', '신림', '홍대입구'];
      const invalidLocations = ['강남역', '', '서울역'];
      
      validLocations.forEach(location => {
        expect(validateLocation(location)).toBe(true);
      });
      
      invalidLocations.forEach(location => {
        expect(validateLocation(location)).toBe(false);
      });
    });
  });

  describe('전체 모임 생성 검증 통합 테스트', () => {
    it('모든 필드가 유효할 때 성공해야 함', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(validFile, 'size', { value: 1024 });
      
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      expect(validateGatheringName('테스트 모임')).toBe(true);
      expect(validateImageFile(validFile).isValid).toBe(true);
      expect(validateCapacity(10)).toBe(true);
      expect(validateDateTime(futureDate)).toBe(true);
      expect(validateLocation('건대입구')).toBe(true);
    });
  });
});