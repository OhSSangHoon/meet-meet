"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function ProfileCard() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("user_name") || "";
    const storedCompany = localStorage.getItem("user_company_name") || "";
    const storedEmail = localStorage.getItem("user_email") || "";

    setName(storedName);
    setCompany(storedCompany);
    setEmail(storedEmail);
  }, []);

  return (
    <div className="rounded-lg overflow-hidden border">
      {/* Card Header with Orange Background */}
      <div className="bg-main-350 p-4 relative pd-4">
        <div className="text-gray-800 text-lg font-bold mb-1">내 프로필</div>
        <div className="absolute right-4 top-4">
          <button>
            <Image src="/icons/edit.svg" alt="프로필 수정" width={36} height={36} />
          </button>
        </div>
        {/*Background */}
        <div className="h-2 mt-2 relative">
          <div className="absolute bottom-0 right-20 flex items-end justify-end w-[120px] h-full">
            <Image src="/icons/bg.svg" alt="배경" width={120} height={120} />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white p-4 flex items-center h-full">
        <div className="border-gray-100 rounded-full p-0.5 mr-4 -mt-16 z-1">
          <button>
            <Image src="/icons/profile.svg" alt="프로필" width={63} height={63} />
          </button>
        </div>
        <div>
          <div className="text-gray-800 font-bold text-md">{name}</div>
          <div className="text-sm text-gray-800 flex gap-2">
            <div className="font-bold">company.</div>
            <div>{company}</div>
          </div>
          <div className="text-sm text-gray-800 flex gap-2">
            <div className="font-bold">E-mail.</div>
            <div>{email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
