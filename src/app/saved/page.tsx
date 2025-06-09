import { Metadata } from 'next';
import SavedGatheringsClient from '@/components/saved/SavedGatheringUI';

export const metadata: Metadata = {
  title: `찜한 모임 | Meet Meet`,
  description: `모임 찾기 페이지 입니다`,
};

export default function SavedPage() {
  return (
    <div className="contents-container">
      <SavedGatheringsClient />
    </div>
  );
}