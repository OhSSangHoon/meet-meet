"use client"

import { useState } from "react";
import CreateMeetingModal from "@/components/gatherings/CreateMeetingModal";
import GatheringsList from "@/components/gatherings/GatheringsList";
import Image from "next/image";
import { Gathering } from "@/types/gatherings";

interface PageProps {
    initialGatherings?: Gathering[];
}

export default function Gatherings({ initialGatherings = [] }: PageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            {isModalOpen && <CreateMeetingModal onClose={closeModal} />}
            <div className="w-full">
                {/* 모임 목록 헤더 */}
                <div className="w-full flex flex-col">
                    <div className=" w-full pt-10 flex flex-row justify-between items-center">
                        <Image src="/images/logo.avif" alt="logo" width={70} height={70} className="rounded-full border-2 border-black mr-1" priority />
                        <div className="w-full flex flex-col justify-start px-2">
                            <p className=" text-[#374151] text-sm font-medium mb-2">함께 할 사람이 없나요</p>
                            <p className=" text-gray-900 text-lg font-semibold">지금 모임에 참여해보세요</p>
                        </div>
                    </div>
                    {/* 모임 주제 선택 및 모임 만들기 */}
                    <div className="w-full flex flex-col justify-start py-5">
                        <div className="flex flex-row">
                            <button className="text-gray-900 text-lg font-semibold px-4 py-1 border-b-2 border-gray-900">
                                주제1
                            </button>
                            <button className="text-gray-900 text-lg font-semibold px-4 py-1">
                                주제2
                            </button>
                            <button onClick={openModal} className="bg-main-500 text-white font-semibold text-sm px-4 py-1 rounded-lg ml-auto">
                                모임 만들기
                            </button>
                        </div>
                        <div className="w-full flex flex-col justify-start py-5 border-b-2 border-gray-200">
                            <div className="flex flex-row items-center gap-2">
                                <button className="bg-gray-800 text-white text-sm font-medium px-3 py-2 rounded-lg">전체</button>
                                <button className="bg-gray-200 text-gray-900 text-sm font-medium px-3 py-2 rounded-lg">오피스 스트레칭</button>
                                <button className="bg-gray-200 text-gray-900 text-sm font-medium px-3 py-2 rounded-lg">마인드풀니스</button>
                            </div>
                        </div>
                    </div>
                    {/* 모임 목록 */}
                    <div className="w-full flex flex-col justify-start mb-10">
                        <div className="flex flex-row items-center gap-3 text-sm text-gray-900 font-medium">
                            <select name="" id="" className="w-[110px] border-2 border-gray-100 rounded-lg px-3 py-2 appearance-none bg-[url('/icons/polygon_down.svg')] bg-[length:13px_13px] bg-[right_13px_center] bg-no-repeat">
                                <option value="" >지역 전체</option>
                                <option value="">을지로3가</option>
                                <option value="">건대입구</option>
                                <option value="">신림</option>
                                <option value="">홍대입구</option>
                            </select>
                            <input type="date" name="" id="" className="w-[110px] border-2 border-gray-100 rounded-lg px-3 py-2 appearance-none bg-[url('/icons/polygon_down.svg')] bg-[length:13px_13px] bg-[right_13px_center] bg-no-repeat" />
                            <div className="ml-auto">
                                <button className="border-2 border-gray-200 text-gray-900 font-semibold px-3 py-2 rounded-lg tracking-2 md:hidden block">
                                    ↑↓
                                </button>
                                <button className="border-2 border-gray-200 text-gray-900 font-semibold px-3 py-2 rounded-lg tracking-1 md:block hidden">
                                    ↑↓ 마감 임박
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* SSR 데이터를 GatheringsList에 전달 */}
                <GatheringsList
                    gatherings={initialGatherings}
                    fetchFromApi={true}
                />
            </div>
        </>
    );
}