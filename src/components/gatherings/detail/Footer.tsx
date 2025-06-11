'use client';

import { Gathering } from '@/types/gatherings';
import dynamic from 'next/dynamic';

const Button = dynamic(() => import('@/components/shared/ui/Button'), { ssr: false });

interface FooterProps {
    userId: number;
    detail: Gathering;
    isParticipated: boolean;
    token: string;
    id: string;
    handleCopyUrl: () => void;
    leaveGathering: (id: number) => void;
    joinGathering: (id: number) => void;
    setDialogOpen: (open: boolean) => void;
    setSignInDialogOpen: (open: boolean) => void;
}

/** 모임 상세 페이지 Footer */
export default function Footer({ userId, token, id, detail, isParticipated, leaveGathering, joinGathering, setDialogOpen, handleCopyUrl, setSignInDialogOpen }: FooterProps) {
    return (
        <footer className='sticky bottom-0 w-full h-16 border-t border-gray-300 bg-white' >
            <div className='max-w-screen-lg h-full mx-auto px-4 md:px-20 flex justify-between items-center'>
                <div className='hidden sm:flex flex-col gap-1'>
                    <span className='font-semibold'>Meet Meet Together</span>
                    <span className='text-xs font-medium'>모임은 여러분을 기다리고 있어요!</span>
                </div>
                {/* 모임 생성자 권한 확인 */}
                {userId === detail?.createdBy ?
                    <div className='flex justify-between sm:justify-end gap-2'>
                        <Button
                            variant='cancel'
                            text='삭제하기'
                            onClick={() => { setDialogOpen(true) }}
                            customClassName='w-24 h-[60%]'
                        />
                        <Button
                            onClick={handleCopyUrl}
                            text='공유하기'
                            customClassName='w-24 h-[60%]'
                        />
                    </div>
                    :
                    // 모임 참가 여부 확인 (생성자가 아닌 경우)
                    isParticipated ? (
                        <Button
                            variant='cancel'
                            text='참여 취소하기'
                            onClick={() => leaveGathering(Number(id))}
                            customClassName='max-w-36 h-[60%]'
                        />
                    ) : (
                        <Button
                            variant='default'
                            text='참여하기'
                            onClick={() => {
                                if (!token) setSignInDialogOpen(true);
                                else joinGathering(Number(id))
                            }}
                            customClassName='w-28 h-[60%]'
                        />
                    )
                }
            </div>
        </footer>
    )
}