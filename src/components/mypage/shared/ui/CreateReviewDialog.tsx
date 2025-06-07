'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useCreateReview } from '@/hooks/api/mypage/useCreateReview';
import { Heart } from 'lucide-react';
import dynamic from 'next/dynamic';
import Button from '@/components/shared/ui/Button';

const ConfirmDialog = dynamic(() => import('@/components/shared/ui/ConfirmDialog'), { ssr: false });

interface ReviewDialogProps {
  reviewFormData: {
    gatheringId: number;
    userId: number;
  };
  onClose: () => void;
}

/** 마이페이지 리뷰 생성 다이얼로그 */
export default function CreateReviewDialog({
  reviewFormData,
  onClose,
}: ReviewDialogProps) {
  const { token } = useContext(AuthContext);

  const [score, setScore] = useState(1);
  const [comment, setComment] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    text: string;
    onConfirm?: () => void;
  }>({
    open: false,
    text: '',
  });

  const { createReview } = useCreateReview({
    token,
    onCallback: (message) => openConfirmDialog(message)
  });

  const openConfirmDialog = (text: string, onConfirm?: () => void) => setConfirmDialog({ open: true, text, onConfirm });

  const handleSubmit = () => createReview({ gatheringId: reviewFormData.gatheringId, score, comment, });

  return (
    <div className="dialog-background">
      <div className="w-full max-w-md p-6 rounded-md bg-white shadow-md flex flex-col gap-4">
        <h2 className="text-xl font-semibold">리뷰 남기기</h2>
        <label className="block">만족스러운 경험이었나요?</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setScore(val)}
              className="focus:outline-none cursor-pointer"
              aria-label={`${val}점`}
            >
              <Heart
                className={`w-8 h-8 transition-colors ${score >= val ? "text-main-500 fill-main-500" : "text-gray-300"}`}
              />
            </button>
          ))}
        </div>

        <label className="block">경험에 대해 알려주세요!</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full border p-2"
        />

        <div className="flex gap-2">
          <Button
            variant='cancel'
            text='취소'
            onClick={onClose}
            customClassName="w-full"
          />
          <Button
            variant='default'
            text='제출'
            onClick={handleSubmit}
            customClassName="w-full"
          />

        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.open}
        text={confirmDialog.text}
        onClose={() => setConfirmDialog({ open: false, text: '' })}
        onConfirm={confirmDialog.onConfirm}
      />
    </div>
  );
}
