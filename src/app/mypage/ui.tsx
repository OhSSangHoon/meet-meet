"use client";

import { useEffect, useState } from "react";
import ProfileCard from "../../components/mypage/ProfileCard"
import axios from "axios";
import GatheringsList from "@/components/gatherings/GatheringsList";
import MyReviewList from "@/components/mypage/MyReviewList";
import CreatedMeetingList from "@/components/mypage/CreatedMeetingList";



export default function MyPageUI() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [gatherings, setGatherings] = useState([]);

    useEffect(() => {
        const getGatherings = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/gatherings/joined`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGatherings(response.data);
        };
        getGatherings();
    }, []);


    return (
        <>
            <main className='contents-container'>
                <div className="bg-gray-50 min-h-screen">
                    <div className="mx-5 pt-[4rem] px-6">
                        <h1 className="my-10 text-2xl font-bold text-gray-700 mb-4">마이 페이지</h1>

                        <div className="border-2 rounded-lg overflow-hidden mb-4">
                            <ProfileCard />
                        </div>

                        {/* Tab Navigation */}
                        <div className="bg-white border-t-3 border-gray-800">
                            <div className="my-5 flex gap-4 text-xl font-bold p-8">
                                {["나의 모임", "나의 리뷰", "내가 만든 모임"].map((label, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedTab(index)}
                                        className={
                                            selectedTab === index
                                                ? "border-gray-700 border-b-3 pb-2 text-gray-700 font-semibold"
                                                : "text-gray-400 font-semibold"
                                        }
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* 탭에 따라 목록 컴포넌트 변경 */}
                            {selectedTab === 0 && (
                                <>
                                    {gatherings.map((gathering) => (
                                        <div key={gathering.id}>
                                            <GatheringsList />
                                        </div>
                                    ))}
                                </>
                            )}

                            {selectedTab === 1 && <MyReviewList gatherings={gatherings} />}

                            {selectedTab === 2 && <CreatedMeetingList />}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
