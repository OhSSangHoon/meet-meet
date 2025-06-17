'use client';

import { useRef, useState } from 'react';
import { Gathering } from '@/types/gatherings';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn-ui/tooltip';
import Button from '@/components/shared/Button';

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
    const [copied, setCopied] = useState(false);

    const triggerRef = useRef<HTMLDivElement>(null);

    const handleCopy = () => {
        setCopied(true);
        triggerRef.current?.focus();
        setTimeout(() => setCopied(false), 1500);
        handleCopyUrl();
    }

    return (
        <footer className='sticky bottom-0 w-full h-16 border-t border-gray-300 bg-white dark:bg-dark-2 dark:text-white dark:border-gray-600'>
            <div className='max-w-screen-lg h-full mx-auto px-4 md:px-20 flex justify-between items-center'>
                <div className='hidden sm:flex flex-col gap-1'>
                    <span className='font-semibold'>Meet Meet Together</span>
                    <span className='text-xs font-medium'>모임은 여러분을 기다리고 있어요!</span>
                </div>
                <div className='flex gap-2'>

                    {/* 모임 생성자 권한 확인 */}
                    {userId === detail?.createdBy ?
                        <div className='flex justify-between sm:justify-end gap-2'>
                            <Button
                                variant='cancel'
                                text='삭제하기'
                                onClick={() => { setDialogOpen(true) }}
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
                    <Tooltip open={copied}>
                        <TooltipTrigger asChild>
                            <div
                                ref={triggerRef}
                                role="button"
                                onClick={handleCopy}
                                className="w-28 h-[60%] flex items-center justify-center padding-button rounded-lg font-semibold bg-button hover:bg-button-hover text-button-text hover-button"
                            >
                                공유하기
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            복사되었습니다!
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </footer>
    )
}