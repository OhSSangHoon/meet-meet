'use client';

import { use, useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { formatDate, formatTime, getTimeRemaining } from '@/components/shared/utils/format';
import { Gathering, JoinedGathering } from '@/types/gatherings';
import { Heart, Check } from "lucide-react"
import { PageProps } from '@/types/pageprops';
import axios from 'axios';
import Image from 'next/image';

export default function GatheringsDetailPageUI({ params }: PageProps) {
    const { id } = use(params);
    const { token } = useContext(AuthContext);

    const [gatheringDetail, setGatheringDetail] = useState<Gathering | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isParticipated, setIsParticipated] = useState(false);
    const [loading, setLoading] = useState(true)

    const router = useRouter();
    const searchParams = useSearchParams();
    const queries = searchParams.toString();

    useEffect(() => {
        if (!token) return;

        const fetchGathering = async (id: number) => {
            try {
                const response = await axios.get(`/api/gatherings/detail?id=${id}`);
                if (response) setGatheringDetail(response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const serverError = error?.response?.data?.error;
                    console.error(serverError?.message);
                }
            }
        }

        const fetchParticipate = async () => {
            try {
                const response = await axios.get(`/api/gatherings/joined?${queries}`, { headers: { Authorization: `Bearer ${token}` } },);
                if (response) setIsParticipated(response.data.some((gathering: JoinedGathering) => gathering.id === Number(id)));
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const serverError = error?.response?.data?.error;
                    console.error(serverError?.message);
                }
            }
        }

        Promise.all([
            fetchGathering(Number(id)),
            fetchParticipate()
        ]);

        const currentUserId = localStorage.getItem('user_id');
        if (currentUserId) setCurrentUserId(Number(currentUserId));
    }, [id, queries, token])

    const handleJoin = async (id: number) => {
        try {
            if (token === null || token === undefined) {
                alert('로그인이 필요합니다.')
                router.push('/login');
                return;
            }
            const response = await axios.post(`/api/gatherings/join?id=${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            if (response) alert('참여 완료했습니다.');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                alert(serverError?.message);
            }
        }
    }

    const handleLeave = async (id: number) => {
        try {
            const response = await axios.delete(`/api/gatherings/leave?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (response) alert('참여 취소했습니다.');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                console.error(serverError?.message);
            }
        }
    }

    const handleCancel = async (id: number) => {
        try {
            const response = await axios.put(`/api/gatherings/cancel?id=${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            if (response) {
                alert('모임을 삭제했습니다.');
                router.replace('/gatherings');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                console.error(serverError?.message);
            }
        }
    }

    const handleCopyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
    };

    const percent =
        gatheringDetail?.participantCount
            ? Math.min((gatheringDetail.participantCount / 20) * 100, 100)
            : 0;

    return (
        <>
            <main className='contents-container'>
                {/* 이미지, 모임 정보 카드 */}
                <section className='flex gap-4'>
                    <div className='w-[30rem] h-[14rem]'>
                        <div className="relative px-3 bg-white/80 rounded-full flex items-center text-xs">
                            <div className="absolute top-0 right-0 bg-main-600 rounded-bl-lg rounded-tr-lg px-3 py-1 flex justify-center items-center gap-2 z-10">
                                <Image src={"/icons/Alarm.svg"} alt="시간" width={24} height={24} />
                                <span className="font-medium text-white">{getTimeRemaining(gatheringDetail?.registrationEnd || '')}</span>
                            </div>
                        </div>
                        {loading && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                        )}
                        <Image src={gatheringDetail?.image || 'https://images.unsplash.com/photo-1615793927044-600a1ec42466?q=80&w=2129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                            alt='모임 이미지'
                            width={1000}
                            height={1000}
                            onLoad={() => setLoading(false)}
                            className='w-full h-full object-cover rounded-lg'
                        />
                    </div>
                    <article className='w-[30rem] h-[14rem] px-8 py-10 border-2 border-gray-300 bg-white rounded-lg'
                    >
                        {/* 상단 박스 */}
                        <div className='w-full h-[80%] flex justify-between gap-8'>
                            {/* LEFT */}
                            <div className='flex flex-col'>
                                {/* 제목, 주소 */}
                                <div className="flex flex-col text-sm">
                                    <h2 className="text-xl font-bold overflow-hidden text-ellipsis">{gatheringDetail?.name || '로딩 중...'}</h2>
                                    <span className="text-gray-500">{gatheringDetail?.location || '장소'}</span>
                                </div>
                                {/* 날짜 시간 */}
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <span>{formatDate(gatheringDetail?.dateTime || 'OOOO-OO-OO')}</span>
                                    <span>·</span>
                                    <span>{formatTime(gatheringDetail?.dateTime || 'OO:OO')}</span>
                                </div>
                                {/* 여백 */}
                                <div className='w-full h-[3rem]'></div>
                            </div>
                            {/* RIGHT 찜하기 버튼 */}
                            <button className="w-[2.5rem] h-[2.5rem] border-2 border-gray-300 rounded-full flex items-center justify-center text-main-500 cursor-pointer">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>
                        {/* 하단 박스 */}
                        <div className='flex flex-col gap-1'>
                            {/* 모집정원, 개설확정 */}
                            <div className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span>모집 정원</span>
                                    <span>{gatheringDetail?.participantCount}명</span>
                                    {/* 정원들의 프로필 이미지 */}
                                </div>
                                {gatheringDetail && gatheringDetail?.participantCount > 0 ? (
                                    <div className='flex items-center gap-2'>
                                        <div className='p-1 bg-main-300 rounded-full'>
                                            <Check className='text-white w-3 h-3' />
                                        </div>
                                        <span>개설확정</span>
                                    </div>
                                ) : null}
                            </div>
                            {/* 프로그레스 바 */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className='bg-main-500 h-2 rounded-full transition-all duration-300' style={{ width: `${percent}%` }}></div>
                            </div>
                            {/* 최소인원, 최대인원 */}
                            <div className="flex justify-between text-sm">
                                <span>최소인원 5명</span>
                                <span>최대인원 20명</span>
                            </div>
                        </div>
                    </article>
                </section>
                {/* 모임 리뷰 목록 */}
                <section className='w-full h-full px-4 py-4 flex flex-col gap-4 bg-white rounded-lg'>
                    <h1 className='text-lg font-semibold'>다른 참여자들은 이렇게 느꼈어요!</h1>
                    {/* 아이템 */}
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className='w-full border-dotted border-b-2 border-main-300 flex flex-col gap-2'>
                            <div className='flex gap-1'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Heart key={index} className="w-4 h-4 fill-main-500 text-main-500" />
                                ))}
                            </div>
                            <p className='text-sm'>재밌는 모임이었어요! 다음에도 만나기로 했습니다 ㅋㅋㅋ</p>
                            <div className='flex items-center gap-1 text-xs'>
                                <Image src='/images/default_profile_image.svg' alt='프로필 이미지' width={32} height={32} className='rounded-full' />
                                <span>닉네임</span>
                                <span>|</span>
                                <span>2025.05.22</span>
                            </div>
                            <div className='w-full h-1'></div>
                        </div>
                    ))}
                    {/* 페이지 컨버터 */}
                    <div className="flex justify-center items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 transition">〈</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-main-500 bg-main-500 text-white font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-main-100 transition">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-main-100 transition">3</button>
                        <span className="mx-1 text-gray-400">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-main-100 transition">10</button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 transition">〉</button>
                    </div>
                </section>
            </main >
            {/* 모임 참가 Footer */}
            <footer className='sticky bottom-0 w-full h-16 border-t border-gray-300 bg-white'>
                <div className='max-w-screen-lg h-full mx-auto flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <span className='font-semibold'>모임에 참여해보세요!</span>
                        <span className='text-xs font-medium'>당신은 모임에 참여해야 합니다.</span>
                    </div>
                    {currentUserId === gatheringDetail?.createdBy ?
                        <div className='flex gap-2'>
                            <button type="button"
                                onClick={() => handleCancel(Number(id) || 0)}
                                className='w-24 h-[60%] py-1 bg-button-text text-button border-button border-1 rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>삭제하기</button>
                            <button type="button"
                                onClick={handleCopyUrl}
                                className='w-24 h-[60%] py-1 bg-button text-button-text rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>공유하기</button>
                        </div>
                        :
                        isParticipated ? (
                            <button type="button"
                                onClick={() => handleLeave(Number(id) || 0)}
                                className='max-w-36 h-[60%] py-1 px-2 bg-button-text text-button border-1 border-button rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>참여 취소하기</button>
                        ) : (
                            <button type="button"
                                onClick={() => handleJoin(Number(id) || 0)}
                                className='w-24 h-[60%] py-1 bg-button text-button-text rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>참여하기</button>
                        )
                    }
                </div>
            </footer>
        </>
    );
}
