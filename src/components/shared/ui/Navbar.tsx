'use client';

import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import ImageWithFallback from '@/components/shared/ui/ImageWithFallback';
import Link from 'next/link';
import { useToggleSavedGatherings } from '@/hooks/api/saved/useToggleSavedGatherings';

// 스타일 상수
const FALLBACK_IMAGE_URL = "https://res.cloudinary.com/dbvzbdffi/image/upload/v1749779026/fallback_thumbnail_ssf66o.avif";
const HOVER_TRANSITION_STYLES = "hover:opacity-50 duration-300 ease-in-out";

export default function Navbar() {
    const { token, signOut, userName, userImage } = useContext(AuthContext);
    const pathname = usePathname();
    const { savedIds } = useToggleSavedGatherings();
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
                    <ImageWithFallback
                        src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749713224/logo_krdgww.avif"
                        fallbackSrc={FALLBACK_IMAGE_URL}
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
                                className={`flex items-center gap-1 ${pathname.includes(link.href) ? 'text-main-600' : ''} ${HOVER_TRANSITION_STYLES}`}
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
                                    <ImageWithFallback  
                                        src={userImage && userImage !== 'null' && userImage !== '' ? userImage : FALLBACK_IMAGE_URL}
                                        fallbackSrc={FALLBACK_IMAGE_URL}
                                        alt='profile image'
                                        width={32}
                                        height={32}
                                        className='size-full rounded-full'
                                    />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-[9rem] mt-2 p-2 border-2 border-gray-300 rounded-md bg-white flex flex-col gap-2'>
                                <DropdownMenuLabel className='text-main-500'>{userName}</DropdownMenuLabel>
                                <DropdownMenuSeparator className='h-[0.1rem] bg-gray-300' />
                                <DropdownMenuItem><Link href='/mypage'>마이페이지</Link></DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut()} className='cursor-pointer'>로그아웃</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {!token && <Link href='/auth/signin' className={HOVER_TRANSITION_STYLES}>로그인</Link>}
                </section>
            </div>
        </nav>
    );
}