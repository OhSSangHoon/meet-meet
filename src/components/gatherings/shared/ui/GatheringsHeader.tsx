// 모임 목록 헤더 타입
interface GatheringsHeaderProps {
  type: 'search' | 'saved' | 'review';
}

// 모임 목록 헤더 컴포넌트
export default function GatheringsHeader({ type }: GatheringsHeaderProps) {
  const content = {
    search: {
      subtitle: "함께 할 사람이 없나요?",
      title: "지금 모임에 참여해보세요"
    },
    saved: {
      subtitle: "찜한 모임",
      title: "마감되기 전에 지금 바로 참여해보세요 👀"
    },
    review: {
      subtitle: "모임 리뷰",
      title: "다른 사람들의 후기를 참고해보세요 👀"
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="w-full flex flex-col justify-start gap-2">
          <p className="text-[#374151] text-base font-medium">
            {content[type].subtitle}
          </p>
          <p className="text-2xl font-semibold">
            {content[type].title}
          </p>
        </div>
      </div>
    </div>
  );
}