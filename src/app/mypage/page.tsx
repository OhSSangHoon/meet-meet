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
      <section className="flex flex-col gap-2 dark:text-white">
        <h1 className="pt-10 pb-2 text-2xl font-bold text-gray-700 dark:text-main-300">마이 페이지</h1>
        <section className="overflow-hidden border-2 border-gray-200 rounded-lg">
          <ProfileCard />
        </section>
        <MyPageUI />
      </section>
    </main>
  );
}