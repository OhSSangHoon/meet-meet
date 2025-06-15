/**
 * 모임 목록 헤더 컴포넌트 속성
 * @param type 모임 목록 타입
 */
interface GatheringsHeaderProps {
  type: 'search' | 'saved' | 'review';
}

// 모임 목록 헤더 컨텐츠
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

export default function GatheringsHeader({ type }: GatheringsHeaderProps) {
  return (
    <div className="w-full flex flex-col dark:text-main-300">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="w-full flex flex-col justify-start gap-2">
          <p className="text-[#374151] dark:text-main-100 text-base font-medium">
            {content[type].subTitle}
          </p>
          <p className="text-2xl font-semibold">
            {content[type].title}
          </p>
        </div>
      </div>
    </div>
  );
}