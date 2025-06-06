import Image from 'next/image';

export default function AuthPoster() {
    return (
        <div className='flex flex-col sm:flex-row lg:flex-col gap-2 items-center justify-center'>
            <Image
                src='/images/auth_background.avif'
                alt='로그인, 회원가입 페이지 배경 이미지'
                width={2000}
                height={2000}
                className='w-[10rem] h-[14rem] md:w-[18rem] md:h-[26rem] lg:w-[22rem] lg:h-[32rem] hover:scale-105 transtion-all duration-200 ease-in-out pointer-events-none'
            />
            <div>
                <h2 className='mb-1 text-lg lg:text-2xl font-bold'>미리 계획하지 않아도 괜찮아요.</h2>
                <p className='text-2xs sm:text-sm lg:text-base text-gray-600'>MeetMeet과 함께라면 언제든지, 어디서든지</p>
                <p className='text-2xs sm:text-sm lg:text-base text-gray-600'>누구와도 의미 있는 만남을 시작할 수 있습니다.</p>
            </div>
        </div>
    );
}

