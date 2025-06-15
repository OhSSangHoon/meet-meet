import { Metadata } from 'next';
import MyPageUI from '@/components/mypage/MyPageUI';
import ProfileCard from '@/components/mypage/ProfileCard';

export const metadata: Metadata = {
  title: `마이페이지 | Meet Meet`,
  description: `내가 참여중인 모임 페이지 입니다`,
};

export default function MyPage() {
  return (
    <main className="contents-container dark:bg-dark">
      <section className="pt-20 flex flex-col gap-4 dark:text-white">
        <ProfileCard />
        <MyPageUI />
      </section>
    </main>
  );
}