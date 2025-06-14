'use client';

import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import ImageWithFallback from '@/components/shared/ui/ImageWithFallback';
import Link from 'next/link';
import { useToggleSavedGatherings } from '@/hooks/api/saved/useToggleSavedGatherings';
import DarkModeToggle from '@/components/shared/ui/DarkModeToggle';

const FALLBACK_IMAGE_URL = "https://res.cloudinary.com/dbvzbdffi/image/upload/v1749802823/fallback_otg1es.avif";
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
        <nav className="sticky z-50 top-0 w-full bg-white dark:bg-dark border-b-2 border-gray-300 dark:border-gray-700 text-xs md:text-base font-bold transition-colors duration-200">
            <div className="max-w-screen-lg mx-auto h-[3.75rem] py-8 px-5 flex justify-between items-center">
                <section className='flex gap-2 sm:gap-4 items-center'>
                    <ImageWithFallback
                        src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749713224/logo_krdgww.avif"
                        fallbackSrc={FALLBACK_IMAGE_URL}
                        alt="로고 이미지"
                        width={100}
                        height={100}
                        className='w-[3rem] h-[3rem] md:w-[6rem] md:h-[6rem] pointer-events-none'
                    />
                    {navLinks.map(link => {
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-1 text-gray-800 dark:text-gray-200 ${pathname.includes(link.href) ? 'text-main-600 dark:text-main-400' : ''} ${HOVER_TRANSITION_STYLES}`}
                            >
                                <span>{link.label}</span>
                                {link.href === '/saved' && <span className='bg-main-600 px-2 rounded-md text-xs text-button-text'>{savedCounts}</span>}
                            </Link>
                        )
                    })}
                </section>
                <section className='flex items-center gap-3'>                    
                    {token && (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className='w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer'>
                                    <ImageWithFallback  
                                        src={userImage && userImage !== 'null' && userImage !== '' ? userImage : FALLBACK_IMAGE_URL}
                                        fallbackSrc={FALLBACK_IMAGE_URL}
                                        alt='네비게이션바 프로필 이미지'
                                        width={32}
                                        height={32}
                                        className='size-full rounded-full'
                                    />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-[9rem] mt-2 border-2 border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-dark-2 flex flex-col text-center'>
                                <DropdownMenuLabel className='text-main-500 dark:text-main-400 p-1'>{userName}</DropdownMenuLabel>
                                {/* <DropdownMenuSeparator className='h-[0.1rem] bg-gray-300' /> */}
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
                    )}
                    {!token && (
                        <Link 
                            href='/auth/signin' 
                            className={`text-gray-800 dark:text-gray-200 ${HOVER_TRANSITION_STYLES}`}
                        >
                            로그인
                        </Link>
                    )}
                </section>
                <DarkModeToggle />
            </div>
        </nav>
    );
}