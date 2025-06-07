import { Metadata } from 'next';
import MyPageUI from '@/components/mypage/MyPageUI';

export const metadata: Metadata = {
  title: `마이페이지 | Meet Meet`,
  description: `내가 참여중인 모임 페이지 입니다`,
};

export default function MyPage() {
  return <MyPageUI />;
}