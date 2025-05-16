import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <div
            className="fixed z-50 w-full h-[3.75rem] py-8 px-20 bg-white border-b-2 border-gray-300 flex justify-between font-bold"
        >
            <div className='flex gap-4 items-center'>
                <Link href="/">
                    <Image
                        src="/images/logo.avif"
                        alt="logo image"
                        width={100}
                        height={100}
                        className='w-[6rem] h-[6rem] hover:opacity-50 duration-300 ease-in-out'
                    />
                </Link>
                <Link href="/gatherings" className='hover:opacity-50 duration-300 ease-in-out'>모임찾기</Link>
                <Link href='/saved' className='hover:opacity-50 duration-300 ease-in-out'>찜한 모임</Link>
                <Link href='/reviews' className='hover:opacity-50 duration-300 ease-in-out'>모든 리뷰</Link>
            </div>
            <div className='flex items-center'>
                <Link href='/signin' className='hover:opacity-50 duration-300 ease-in-out'>로그인</Link>
            </div>
        </div>
    );
}

