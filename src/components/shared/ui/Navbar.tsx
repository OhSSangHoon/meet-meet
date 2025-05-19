'use client';

import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    const { token, signout, userName } = useContext(AuthContext);

    return (
        <nav
            className="sticky top-0 z-50 w-full h-[3.75rem] py-8 px-5 lg:px-20 bg-white border-b-2 border-gray-300 flex justify-between text-xs md:text-base font-bold"
        >
            <section className='flex gap-4 items-center'>
                <Link href="/gatherings">
                    <Image
                        src="/images/logo.avif"
                        alt="logo image"
                        width={100}
                        height={100}
                        className='w-[3rem] h-[3rem] md:w-[6rem] md:h-[6rem] pointer-events-none'
                    />
                </Link>
                <Link href="/gatherings" className='hover:opacity-50 duration-300 ease-in-out'>모임찾기</Link>
                <Link href='/saved' className='hover:opacity-50 duration-300 ease-in-out'>찜한 모임</Link>
                <Link href='/reviews' className='hover:opacity-50 duration-300 ease-in-out'>모든 리뷰</Link>
            </section>
            <section className='flex items-center'>
                {token && (
                    <div className='flex items-center gap-2'>
                        <span className='font-bold text-main-600'>{userName}</span>
                        <button onClick={() => signout()} className='cursor-pointer hover:opacity-50 duration-300 ease-in-out'>로그아웃</button>
                    </div>
                )}
                {!token && <Link href='/signin' className='hover:opacity-50 duration-300 ease-in-out'>로그인</Link>}
            </section>
        </nav>
    );
}

