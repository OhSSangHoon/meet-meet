'use client';

import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { SquarePen } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ProfileEditDialog = dynamic(() => import('@/components/shared/ui/ProfileEditDialog'), { ssr: false });

/** 마이페이지 프로필 카드 */
export default function ProfileCard() {
  const { userName, userCompanyName, userEmail, userImage } = useContext(AuthContext)

  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);

  return (
    <>
      {/* 배경 헤더 */}
      <section className="bg-main-350 relative px-4 py-6">
        <div className="mb-1 text-sm sm:text-base md:text-lg font-bold text-white">PROFILE</div>
        <div className="absolute top-4 right-4">
          <button type="button" onClick={() => setIsProfileEditDialogOpen(true)} className='size-8 sm:size-10 rounded-full flex items-center justify-center hover-button'>
            <SquarePen className="text-white" />
          </button>
        </div>
      </section>

      {/* 프로필 정보 */}
      <section className="h-full flex items-center gap-4 bg-white p-4">
        {/* 이미지 */}
        <div className="size-12 sm:size-18 z-1 -mt-20 rounded-full border border-gray-400">
          <Image
            src={userImage || 'https://res.cloudinary.com/dbvzbdffi/image/upload/v1749717219/profile_image_tlr92v.svg'}
            alt="프로필"
            width={1000}
            height={1000}
            className="size-12 sm:size-full border-gray-400 rounded-full pointer-events-none"
          />
        </div>
        {/* 스펙 */}
        <div>
          <span className="text-sm sm:text-md font-bold text-main-500">{userName}</span>
          <div className="flex gap-2 text-sm text-gray-800">
            <span className="text-xs sm:text-base font-bold">COMPANY</span>
            <span className='text-xs sm:text-base'>{userCompanyName}</span>
          </div>
          <div className="flex gap-2 text-gray-800 text-xs sm:text-base">
            <span className="font-bold">E-MAIL</span>
            <span>{userEmail}</span>
          </div>
        </div>
      </section>

      {isProfileEditDialogOpen && <ProfileEditDialog setIsProfileEditDialogOpen={setIsProfileEditDialogOpen} />}
    </>
  );
}
