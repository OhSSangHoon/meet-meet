import { Metadata } from 'next';
import MyPageUI from './ui';

export const metadata: Metadata = {
  title: `마이페이지 | Meet Meet`,
  description: `내가 참여중인 모임 페이지 입니다`,
};

export default function MyPage() {
  const teamId = process.env.TEAM_ID_DEV!;
  return <MyPageUI teamId={teamId} />;
}