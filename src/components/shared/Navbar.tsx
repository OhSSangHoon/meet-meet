'use client';

import { useToggleSavedGatherings } from '@/hooks/api/saved/useToggleSavedGatherings';
import { usePathname } from 'next/navigation';
import { useContext, useMemo } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { validateProfileImage } from '@/utils/shared/validateProfileImage';
import { shortenName } from '@/utils/shared/shortenName';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn-ui/dropdown-menu';
import DarkModeToggleButton from '@/components/shared/DarkModeToggleButton';
import TokenCountdown from '@/components/shared/TokenCountDown';
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import Link from 'next/link';

const HOVER_TRANSITION_STYLES = "hover:text-main-400 duration-300 ease-in-out";

export default function Navbar() {
    const { token, signOut, userName, userImage } = useContext(AuthContext);

    const pathname = usePathname();

    const { savedIds } = useToggleSavedGatherings();

    const savedCounts = savedIds.length;

    const profileImageSrc = useMemo(() => {
        return validateProfileImage(userImage);
    }, [userImage]);

    const navLinks = [
        { href: '/gatherings', label: '모임 찾기' },
        { href: '/saved', label: '찜한 모임' },
        { href: '/reviews', label: '모든 리뷰' },
    ]

    return (
        <nav className="sticky z-50 top-0 w-full bg-white dark:bg-dark border-b-2 border-gray-300 dark:border-gray-700 text-xs md:text-base font-bold">
            <main className="relative max-w-screen-lg mx-auto h-[3.75rem] py-8 px-5 flex justify-between items-center overflow-hidden">
                <section className='flex gap-2 sm:gap-4 items-center'>
                    <Link href='/' className='p-0 hover:scale-105 transition-transform duration-200 ease-in-out'>
                        <ImageWithFallback
                            src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749713224/logo_krdgww.avif"
                            fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1750048546/error_fallback_icbngz.avif'
                            alt="로고 이미지"
                            width={100}
                            height={100}
                            className='w-[3rem] h-[3rem] md:w-[6rem] md:h-[6rem] pointer-events-none'
                        />
                    </Link>
                    {navLinks.map(link => {
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-1 text-gray-800 dark:text-gray-200 ${pathname.includes(link.href) ? 'text-main-400 dark:text-main-400' : ''} ${HOVER_TRANSITION_STYLES}`}
                            >
                                <span>{link.label}</span>
                                {link.href === '/saved' && <span className='bg-main-600 px-2 rounded-md text-xs text-button-text'>{savedCounts}</span>}
                            </Link>
                        )
                    })}
                </section>
                <section className='flex items-center gap-3'>
                    {token && (
                        <>
                            <TokenCountdown />
                            <DropdownMenu>
                                <DropdownMenuTrigger className='rounded-full cursor-pointer'>
                                    <div className='size-10 rounded-full border border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer'>
                                        <ImageWithFallback
                                            key={userImage}
                                            src={profileImageSrc}
                                            fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1749717219/profile_image_tlr92v.svg'
                                            alt='네비게이션바 프로필 이미지'
                                            width={100}
                                            height={100}
                                            className='size-full rounded-full object-cover object-center'
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-[9rem] mt-2 border-2 border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-dark-2 flex flex-col'>
                                    <DropdownMenuLabel className='text-main-500 dark:text-main-400 p-1'>{shortenName(userName, 20)}</DropdownMenuLabel>
                                    <DropdownMenuSeparator className='h-[0.1rem] bg-gray-300' />
                                    <DropdownMenuItem className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 transition-colors duration-200'>
                                        <Link href='/mypage'>마이페이지</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => signOut()}
                                        className='cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 transition-colors duration-200'
                                    >
                                        로그아웃
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                    {!token && (
                        <Link
                            href='/auth/signin'
                            className={`text-gray-800 dark:text-gray-200 ${HOVER_TRANSITION_STYLES}`}
                        >
                            로그인
                        </Link>
                    )}
                    <DarkModeToggleButton />
                </section>
            </main>
        </nav>
    );
}