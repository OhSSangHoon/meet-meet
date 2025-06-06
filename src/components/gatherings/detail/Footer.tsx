'use client';

import { Gathering } from '@/types/gatherings';

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
    setLoginDialogOpen: (open: boolean) => void;
}

/** 모임 상세 페이지 Footer */
export default function Footer({ userId, detail, isParticipated, leaveGathering, joinGathering, token, setDialogOpen, handleCopyUrl, id, setLoginDialogOpen }: FooterProps) {
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
                        <button type="button"
                            onClick={() => { setDialogOpen(true) }}
                            className='w-24 h-[60%] py-1 bg-button-text text-button border-button border-1 rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>삭제하기</button>
                        <button type="button"
                            onClick={handleCopyUrl}
                            className='w-24 h-[60%] py-1 bg-button text-button-text rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>공유하기</button>
                    </div>
                    :
                    // 모임 참가 여부 확인 (생성자가 아닌 경우)
                    isParticipated ? (
                        <button type="button"
                            onClick={() => leaveGathering(Number(id))}
                            className='max-w-36 h-[60%] py-1 px-2 bg-button-text text-button border-1 border-button rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>참여 취소하기</button>
                    ) : (
                        <button type="button"
                            onClick={() => {
                                if (!token) setLoginDialogOpen(true);
                                else joinGathering(Number(id))
                            }}
                            className='w-24 h-[60%] py-1 bg-button text-button-text rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>참여하기</button>
                    )
                }
            </div>
        </footer>
    )
}