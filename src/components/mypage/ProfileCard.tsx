'use client';

import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ProfileEditDialog = dynamic(() => import('@/components/mypage/ProfileEditDialog'), { ssr: false });

/** 마이페이지 프로필 카드 */
export default function ProfileCard() {
  const { userName, userCompanyName, userEmail, userImage } = useContext(AuthContext)

  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);

  return (
    <section className="overflow-hidden border-2 border-gray-200 rounded-lg">
      {/* 배경 헤더 */}
      <section className="bg-main-350 relative px-4 py-6">
        <div className="mb-1 text-lg font-bold text-white">내 프로필</div>
        <div className="absolute top-4 right-4">
          <button type="button" onClick={() => setIsProfileEditDialogOpen(true)} className='rounded-full hover-button'>
            <Image
              src="/icons/edit.svg"
              alt="프로필 수정"
              width={36}
              height={36}
              className="pointer-events-none"
            />
          </button>
        </div>
      </section>

      {/* 프로필 정보 */}
      <section className="h-full flex items-center gap-4 bg-white p-4">
        {/* 이미지 */}
        <div className="w-16 h-16 z-1 -mt-20 rounded-full border border-gray-400">
          <Image
            src={userImage || '/icons/default_profile_image.svg'}
            alt="프로필"
            width={1000}
            height={1000}
            className="w-full h-full border-gray-400 rounded-full pointer-events-none"
          />
        </div>
        {/* 스펙 */}
        <div>
          <div className="text-md font-bold text-main-500">{userName}</div>
          <div className="flex gap-2 text-sm text-gray-800">
            <div className="font-bold">COMPANY</div>
            <div>{userCompanyName}</div>
          </div>
          <div className="flex gap-2 text-sm text-gray-800">
            <div className="font-bold">E-MAIL</div>
            <div>{userEmail}</div>
          </div>
        </div>
      </section>

      {isProfileEditDialogOpen && <ProfileEditDialog setIsProfileEditDialogOpen={setIsProfileEditDialogOpen} />}
    </section>
  );
}
