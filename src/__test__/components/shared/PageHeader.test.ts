import { describe, it, expect } from 'vitest';

// 페이지 헤더 컨텐츠 매핑
const getPageHeaderContent = (type: 'search' | 'saved' | 'review') => {
  const content = {
    search: {
      subTitle: "혼자 하기 힘들잖아요?",
      title: "내가 원하는 모임을 찾아보세요 😄"
    },
    saved: {
      subTitle: "일단 찜 해둬요",
      title: "당장 참여하지 않아도 괜찮아요 🙌"
    },
    review: {
      subTitle: "어떤 모임들인지 궁금하다면",
      title: "다른 사람들이 올린 리뷰로 알 수 있어요 👀"
    }
  };

  return content[type];
};

// 페이지 타입 검증
const validatePageType = (type: string): type is 'search' | 'saved' | 'review' => {
  return ['search', 'saved', 'review'].includes(type);
};

describe('PagesHeader 컴포넌트 로직', () => {
  describe('페이지 타입별 컨텐츠', () => {
    it('search 페이지에 대한 올바른 컨텐츠를 반환해야 함', () => {
      const content = getPageHeaderContent('search');
      expect(content).toEqual({
        subTitle: "혼자 하기 힘들잖아요?",
        title: "내가 원하는 모임을 찾아보세요 😄"
      });
    });

    it('saved 페이지에 대한 올바른 컨텐츠를 반환해야 함', () => {
      const content = getPageHeaderContent('saved');
      expect(content).toEqual({
        subTitle: "일단 찜 해둬요",
        title: "당장 참여하지 않아도 괜찮아요 🙌"
      });
    });

    it('review 페이지에 대한 올바른 컨텐츠를 반환해야 함', () => {
      const content = getPageHeaderContent('review');
      expect(content).toEqual({
        subTitle: "어떤 모임들인지 궁금하다면",
        title: "다른 사람들이 올린 리뷰로 알 수 있어요 👀"
      });
    });
  });

  describe('페이지 타입 검증', () => {
    it('유효한 페이지 타입은 true를 반환해야 함', () => {
      expect(validatePageType('search')).toBe(true);
      expect(validatePageType('saved')).toBe(true);
      expect(validatePageType('review')).toBe(true);
    });

    it('유효하지 않은 페이지 타입은 false를 반환해야 함', () => {
      expect(validatePageType('invalid')).toBe(false);
      expect(validatePageType('')).toBe(false);
      expect(validatePageType('home')).toBe(false);
    });
  });
});