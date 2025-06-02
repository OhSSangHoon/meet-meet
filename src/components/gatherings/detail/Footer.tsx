import { Gathering } from '@/types/gatherings';

export default function Footer({ userId, detail, isParticipated, leaveGathering, joinGathering, token, setDeleteModalOpen, handleCopyUrl, id, setLoginModalOpen }: { userId: number, detail: Gathering, isParticipated: boolean, leaveGathering: (id: number) => void, joinGathering: (id: number) => void, token: string, setDeleteModalOpen: (open: boolean) => void, handleCopyUrl: () => void, id: string, setLoginModalOpen: (open: boolean) => void }) {
    return (
        <footer className='sticky bottom-0 w-full h-16 border-t border-gray-300 bg-white' >
            <div className='max-w-screen-lg h-full mx-auto px-4 md:px-20 flex justify-between items-center'>
                <div className='hidden sm:flex flex-col gap-1'>
                    <span className='font-semibold'>Meet Meet Together</span>
                    <span className='text-xs font-medium'>모임은 여러분을 기다리고 있어요!</span>
                </div>
                {userId === detail?.createdBy ?
                    <div className='flex justify-between sm:justify-end gap-2'>
                        <button type="button"
                            onClick={() => { setDeleteModalOpen(true) }}
                            className='w-24 h-[60%] py-1 bg-button-text text-button border-button border-1 rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>삭제하기</button>
                        <button type="button"
                            onClick={handleCopyUrl}
                            className='w-24 h-[60%] py-1 bg-button text-button-text rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>공유하기</button>
                    </div>
                    :
                    isParticipated ? (
                        <button type="button"
                            onClick={() => leaveGathering(Number(id))}
                            className='max-w-36 h-[60%] py-1 px-2 bg-button-text text-button border-1 border-button rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>참여 취소하기</button>
                    ) : (
                        <button type="button"
                            onClick={() => {
                                if (!token) setLoginModalOpen(true);
                                else joinGathering(Number(id))
                            }}
                            className='w-24 h-[60%] py-1 bg-button text-button-text rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>참여하기</button>
                    )
                }
            </div>
        </footer>
    )
}