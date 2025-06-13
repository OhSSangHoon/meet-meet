'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useCreateReview } from '@/hooks/api/mypage/useCreateReview';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cleanXSS } from '@/components/shared/utils/cleanXSS';
import { Heart } from 'lucide-react';
import dynamic from 'next/dynamic';
import Button from '@/components/shared/ui/Button';

const ConfirmDialog = dynamic(() => import('@/components/shared/ui/ConfirmDialog'), { ssr: false });

const reviewFormSchema = z.object({
  score: z.number().min(1).max(5),
  comment: z.string().min(1),
});

type ReviewFormSchemaType = z.infer<typeof reviewFormSchema>;

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

  const { register, handleSubmit, watch, setValue } = useForm<ReviewFormSchemaType>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      score: 5,
      comment: '',
    },
  });

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

  const score = watch('score')

  const openConfirmDialog = (text: string, onConfirm?: () => void) => setConfirmDialog({ open: true, text, onConfirm });

  const onSubmit = (data: ReviewFormSchemaType) => {
    createReview({ gatheringId: reviewFormData.gatheringId, score: data.score, comment: cleanXSS(data.comment) });
  };

  return (
    <section className="dialog-background">
      <div className="w-full max-w-md p-6 rounded-md bg-white shadow-md flex flex-col gap-4">
        <h2 className="text-xl font-semibold">리뷰 남기기</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label className="block">만족스러운 경험이었나요?</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setValue('score', val)}
                className="focus:outline-none cursor-pointer"
                aria-label={`${val}점`}
              >
                <Heart
                  className={`size-8 transition-colors ${score >= val ? "text-main-500 fill-main-500" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
          <label className="block">다른 사람들에게 알려주세요😄</label>
          <textarea
            {...register('comment')}
            className="w-full border p-2"
            required={true}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant='cancel'
              text='취소'
              onClick={onClose}
              customClassName="w-full"
            />
            <Button
              type="submit"
              variant='default'
              text='제출'
              customClassName="w-full"
            />
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        text={confirmDialog.text}
        onClose={() => setConfirmDialog({ open: false, text: '' })}
        onConfirm={confirmDialog.onConfirm}
        onCallback={() => onClose()}
      />
    </section>
  );
}
