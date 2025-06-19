'use client';

import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { shortenName } from '@/utils/shared/shortenName';
import { validateProfileImage } from '@/utils/shared/validateProfileImage';
import { SquarePen } from 'lucide-react';
import dynamic from 'next/dynamic';
import ImageWithFallback from '@/components/shared/ImageWithFallback';

const ProfileEditDialog = dynamic(() => import('@/components/shared/ProfileEditDialog'), { ssr: false });

/** 마이페이지 프로필 카드 */
export default function ProfileCard() {
  const { userName, userCompanyName, userEmail, userImage, userId } = useContext(AuthContext)

  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);

  return (
    <section className="relative pt-16 pb-8 px-6 sm:px-10 max-w-md mx-auto flex flex-col items-center bg-white dark:bg-dark-2 rounded-2xl shadow-lg">
      {/* 프로필 이미지 오버레이 */}
      <figure className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
        <div className="relative">
          <ImageWithFallback
            src={validateProfileImage(userImage)}
            fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1749717219/profile_image_tlr92v.svg'
            alt="프로필 이미지"
            width={120}
            height={120}
            className="size-24 sm:size-28 border-4 border-white dark:border-dark-2 rounded-full object-cover object-center shadow-md"
          />

          {/* 수정 버튼 - 이미지 우측 하단 */}
          <button
            type="button"
            onClick={() => setIsProfileEditDialogOpen(true)}
            className="absolute -bottom-2 -right-2 size-9 sm:size-10 rounded-full shadow-lg border-2 border-white dark:border-dark-2 bg-main-500 hover:bg-main-600 flex items-center justify-center text-white cursor-pointer transition-colors duration-200">
            <SquarePen className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </figure>

      {/* 프로필 정보 */}
      <article className="flex flex-col items-center gap-2 mt-4">
        <span className="text-xl sm:text-2xl font-bold text-main-500 dark:text-main-300">{shortenName(userName, 20)}</span>

        <div className="flex items-center gap-2 text-gray-700 dark:text-white text-sm sm:text-base">
          <span className="px-2 py-0.5 rounded flex-shrink-0 bg-main-100 dark:bg-main-400/20 font-semibold">ID</span>
          <span>{userId}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-white text-sm sm:text-base">
          <span className="px-2 py-0.5 rounded flex-shrink-0 bg-main-100 dark:bg-main-400/20 font-semibold">크루</span>
          <span>{shortenName(userCompanyName, 20)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-white text-sm sm:text-base">
          <span className="px-2 py-0.5 rounded flex-shrink-0 bg-main-100 dark:bg-main-400/20 font-semibold">E-MAIL</span>
          <span>{userEmail}</span>
        </div>
      </article>

      {/* 프로필 수정 다이얼로그 */}
      {isProfileEditDialogOpen && <ProfileEditDialog setIsProfileEditDialogOpen={setIsProfileEditDialogOpen} />}
    </section>
  );
}
