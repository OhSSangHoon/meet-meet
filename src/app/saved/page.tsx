import { Metadata } from 'next';
import LikedMeetingsUI from './ui';

export const metadata: Metadata = {
  title: '찜한 모임 | Meet2',
  description: '내가 찜한 모임들을 확인할 수 있어요',
};

export default function LikedMeetingsPage() {
  return <LikedMeetingsUI />;
}