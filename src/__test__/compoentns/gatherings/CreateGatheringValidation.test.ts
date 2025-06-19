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

const validateCapacity = (capacity: number): boolean => {
  return Number.isInteger(capacity) && capacity >= 5 && capacity <= 20;
};

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
    it('유효한 모임 이름은 통과해야 함', () => {
      expect(validateGatheringName('오피스 스트레칭')).toBe(true);
      expect(validateGatheringName('개발자 모임-2024')).toBe(true);
      expect(validateGatheringName('Team Building')).toBe(true);
    });

    it('빈 문자열이나 공백만 있는 경우 실패해야 함', () => {
      expect(validateGatheringName('')).toBe(false);
      expect(validateGatheringName('   ')).toBe(false);
      expect(validateGatheringName('\t\n')).toBe(false);
    });

    it('20자 초과 시 실패해야 함', () => {
      const longName = 'a'.repeat(21);
      expect(validateGatheringName(longName)).toBe(false);
    });

    it('허용되지 않은 특수문자 포함 시 실패해야 함', () => {
      expect(validateGatheringName('모임@#$%')).toBe(false);
      expect(validateGatheringName('모임<script>')).toBe(false);
    });
  });

  describe('이미지 파일 검증', () => {
    it('파일이 없으면 실패해야 함', () => {
      const result = validateImageFile(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('이미지를 첨부해주세요.');
    });

    it('5MB 초과 파일은 실패해야 함', () => {
      const largeFile = new File([''], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });
      
      const result = validateImageFile(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('5MB 이하');
    });

    it('허용된 이미지 타입은 통과해야 함', () => {
      const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(validFile, 'size', { value: 1024 });
      
      const result = validateImageFile(validFile);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('SVG 파일은 차단되어야 함', () => {
      const svgFile = new File(['<svg></svg>'], 'test.svg', { type: 'image/svg+xml' });
      
      const result = validateImageFile(svgFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('SVG 파일은 보안상 업로드할 수 없습니다');
    });
  });

  describe('모집 정원 검증', () => {
    it('5-20 범위의 정수는 통과해야 함', () => {
      expect(validateCapacity(5)).toBe(true);
      expect(validateCapacity(10)).toBe(true);
      expect(validateCapacity(20)).toBe(true);
    });

    it('범위를 벗어나면 실패해야 함', () => {
      expect(validateCapacity(4)).toBe(false);
      expect(validateCapacity(21)).toBe(false);
    });

    it('정수가 아니면 실패해야 함', () => {
      expect(validateCapacity(5.5)).toBe(false);
      expect(validateCapacity(NaN)).toBe(false);
    });
  });

  describe('날짜 시간 검증', () => {
    it('미래 날짜는 통과해야 함', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(validateDateTime(futureDate)).toBe(true);
    });

    it('과거 날짜는 실패해야 함', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(validateDateTime(pastDate)).toBe(false);
    });

    it('null은 실패해야 함', () => {
      expect(validateDateTime(null)).toBe(false);
    });
  });

  describe('장소 검증', () => {
    it('유효한 장소는 통과해야 함', () => {
      expect(validateLocation('을지로3가')).toBe(true);
      expect(validateLocation('건대입구')).toBe(true);
      expect(validateLocation('신림')).toBe(true);
      expect(validateLocation('홍대입구')).toBe(true);
    });

    it('유효하지 않은 장소는 실패해야 함', () => {
      expect(validateLocation('강남역')).toBe(false);
      expect(validateLocation('')).toBe(false);
      expect(validateLocation('서울역')).toBe(false);
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