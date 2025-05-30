import { UserRoundCheck } from 'lucide-react';
import Image from 'next/image';

export default function DetailInformationLoading() {
    return (
        <article className='max-w-screen-lg sm:w-[30rem] h-[14rem] px-6 py-5 border-2 border-gray-300 bg-white rounded-lg flex flex-col justify-between gap-4 animate-pulse'
        >
            {/* 상단 */}
            <div className='flex justify-between gap-8'>
                {/* LEFT */}
                <div className='flex flex-col'>
                    {/* 제목, 주소 */}
                    <div className="flex flex-col min-w-0">
                        <h2 className="text-xl font-bold max-w-full">
                            로딩 중
                        </h2>
                        <span className="text-gray-500">장소</span>
                    </div>
                    {/* 날짜 시간 */}
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                        <span>DAY</span>
                        <span>·</span>
                        <span>TIME</span>
                    </div>
                </div>
                {/* RIGHT 찜하기 버튼 */}
                <button
                    type='button'
                    className={`flex-shrink-0 w-12 h-12 rounded-full border-2 border-main-300 text-main-600 transition-all duration-200`}
                >
                    <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 23" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>
            </div>
            <div className="w-full border-t-2 border-dotted border-gray-300"></div>
            {/* 하단 */}
            <div className='flex flex-col gap-1'>
                {/* 모집정원, 개설확정 */}
                <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className='flex items-center gap-1'>
                            <UserRoundCheck className='w-4 h-4 text-main-500' />
                            <span>-명 참여 중</span>
                        </div>
                        {/* 참여자들의 프로필 이미지 */}
                        <div className="flex items-center">
                            <Image
                                src='/icons/default_profile_image.svg'
                                alt="프로필 이미지"
                                width={100}
                                height={100}
                                className='w-8 h-8 rounded-full border-2 border-white'
                            />
                        </div>
                    </div>
                </div>
                {/* 프로그레스 바 */}
                <div className="w-full bg-gray-200 rounded-full h-2"></div>
                {/* 최소인원, 최대인원 */}
                <div className="flex justify-between text-sm">
                    <span>최소 명</span>
                    <span>최대 명</span>
                </div>
            </div>
        </article>
    );
}

