'use client';

import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { getSavedGatherings } from '@/components/gatherings/shared/utils/savedGatherings';
import Image from 'next/image';
import Link from 'next/link';


export default function Navbar() {
    const { token, signOut, userName, userImage } = useContext(AuthContext);

    const pathname = usePathname();

    // 찜한 모임 개수
    const { data: savedIds = [] } = useQuery({
        queryKey: ['savedGatherings'],
        queryFn: () => getSavedGatherings(),
        refetchOnWindowFocus: false,
    });

    const savedCounts = savedIds.length;

    const navLinks = [
        { href: '/gatherings', label: '모임 찾기' },
        { href: '/saved', label: '찜한 모임' },
        { href: '/reviews', label: '모든 리뷰' },
    ]

    return (
        <nav className="sticky z-50 top-0 w-full bg-white border-b-2 border-gray-300 text-xs md:text-base font-bold">
            <div className="max-w-screen-lg mx-auto h-[3.75rem] py-8 px-5 flex justify-between items-center">
                <section className='flex gap-2 sm:gap-4 items-center'>
                    <Image
                        src="/images/logo.avif"
                        alt="logo image"
                        width={100}
                        height={100}
                        className='w-[3rem] h-[3rem] md:w-[6rem] md:h-[6rem] pointer-events-none'
                    />
                    {navLinks.map(link => {
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-1 ${pathname.includes(link.href) ? 'text-main-600' : ''} over:opacity-50 duration-300 ease-in-out`}
                            >
                                <span>{link.label}</span>
                                {link.href === '/saved' && <span className='bg-main-600 px-2 rounded-md text-xs text-button-text'>{savedCounts}</span>}
                            </Link>
                        )
                    })}
                </section>
                <section className='flex items-center'>
                    {token && (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className='w-8 h-8 rounded-full border border-gray-300 overflow-hidden cursor-pointer'>
                                    <Image
                                        src={userImage && userImage !== 'null' && userImage !== '' ? userImage : '/icons/default_profile_image.svg'}
                                        alt='profile image'
                                        width={1000}
                                        height={1000}
                                        className='size-full rounded-full'
                                    />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-[9rem] mt-2 p-2 border-2 border-gray-300 rounded-md bg-white flex flex-col gap-2'>
                                <DropdownMenuLabel className='text-main-500'>{userName}</DropdownMenuLabel>
                                <DropdownMenuSeparator className='h-[0.1rem] bg-gray-300' />
                                <DropdownMenuItem ><Link href='/mypage'>마이페이지</Link></DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut()} className='cursor-pointer'>로그아웃</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {!token && <Link href='/signin' className='hover:opacity-50 duration-300 ease-in-out'>로그인</Link>}
                </section>
            </div>
        </nav>
    );
}

