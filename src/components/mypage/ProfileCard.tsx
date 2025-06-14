'use client';

import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { SquarePen } from 'lucide-react';
import dynamic from 'next/dynamic';
import ImageWithFallback from '@/components/shared/ui/ImageWithFallback';

const ProfileEditDialog = dynamic(() => import('@/components/shared/ui/ProfileEditDialog'), { ssr: false });

/** 마이페이지 프로필 카드 */
export default function ProfileCard() {
  const { userName, userCompanyName, userEmail, userImage } = useContext(AuthContext)

  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);

  return (
    <section className='flex flex-col gap-2'>
      {/* 배경 헤더 */}
      <section className="relative px-4 py-6 flex justify-between items-center bg-main-350 ">
        <div className="text-sm sm:text-base md:text-lg font-bold text-white">PROFILE</div>
        <button
          type="button"
          onClick={() => setIsProfileEditDialogOpen(true)}
          className='size-8 sm:size-10 rounded-full flex items-center justify-center hover-button'>
          <SquarePen className="text-white" />
        </button>
      </section>

      {/* 프로필 정보 */}
      <section className="h-full flex items-center gap-4 bg-white p-4 dark:bg-dark-2">
        {/* 이미지 */}
        <div className="size-12 sm:size-18 z-1 -mt-20 rounded-full border border-gray-400">
          <ImageWithFallback
            src={userImage}
            fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1749717219/profile_image_tlr92v.svg'
            alt="프로필 이미지"
            width={1000}
            height={1000}
            className="size-12 sm:size-full border-gray-400 rounded-full pointer-events-none"
          />
        </div>
        {/* 스펙 */}
        <div>
          <span className="text-sm sm:text-md font-bold text-main-500 dark:text-main-300">{userName}</span>
          <div className="flex gap-2 text-sm text-gray-800 dark:text-white">
            <span className="text-xs sm:text-base font-bold">COMPANY</span>
            <span className='text-xs sm:text-base'>{userCompanyName}</span>
          </div>
          <div className="flex gap-2 text-gray-800 dark:text-white text-xs sm:text-base">
            <span className="font-bold">E-MAIL</span>
            <span>{userEmail}</span>
          </div>
        </div>
      </section>

      {isProfileEditDialogOpen && <ProfileEditDialog setIsProfileEditDialogOpen={setIsProfileEditDialogOpen} />}
    </section>
  );
}
