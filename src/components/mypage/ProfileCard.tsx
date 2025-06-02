'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function ProfileCard() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const NAME = localStorage.getItem('user_name') || '';
    const COMPANY_NAME = localStorage.getItem('user_company_name') || '';
    const EMAIL = localStorage.getItem('user_email') || '';

    setName(NAME);
    setCompany(COMPANY_NAME);
    setEmail(EMAIL);
  }, []);

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Card Header with Orange Background */}
      <div className="bg-main-350 pd-4 relative p-4">
        <div className="mb-1 text-lg font-bold text-white">내 프로필</div>
        <div className="absolute top-4 right-4">
          <button>
            <Image
              src="/icons/edit.svg"
              alt="프로필 수정"
              width={36}
              height={36}
              className="pointer-events-none"
            />
          </button>
        </div>
        {/*Background */}
        <div className="relative mt-2 h-2">
          <div className="absolute right-20 bottom-0 flex h-full w-[120px] items-end justify-end">
            <Image
              src="/icons/bg.svg"
              alt="배경"
              width={120}
              height={120}
              className="w-auto h-auto pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex h-full items-center bg-white p-4">
        <div className="z-1 -mt-16 mr-4 rounded-full border-gray-100 p-0.5">
          <button>
            <Image
              src="/icons/profile.svg"
              alt="프로필"
              width={63}
              height={63}
              className="pointer-events-none"
            />
          </button>
        </div>
        <div>
          <div className="text-md font-bold text-gray-800">{name}</div>
          <div className="flex gap-2 text-sm text-gray-800">
            <div className="font-bold">COMPANY</div>
            <div>{company}</div>
          </div>
          <div className="flex gap-2 text-sm text-gray-800">
            <div className="font-bold">E-MAIL</div>
            <div>{email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
