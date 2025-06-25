import Image from 'next/image';

const DESCRIPTION_STYLE = 'text-sm lg:text-base text-gray-600 dark:text-gray-200';

/** 로그인 폼, 회원가입 폼 배경 이미지 */
export default function AuthPoster() {
    return (
        <figure className='flex flex-col sm:flex-row lg:flex-col gap-2 items-center justify-center dark:text-white hover:scale-105 transition-all duration-200 ease-in-out'>
            <div className="relative w-[320px] h-[480px] hidden md:block">
                <Image
                    src='https://res.cloudinary.com/dbvzbdffi/image/upload/v1749713004/auth_background_dyr3yy.avif'
                    alt='로그인, 회원가입 페이지 배경 이미지'
                    className='object-cover pointer-events-none'
                    fill
                    priority
                    fetchPriority='high'
                    sizes="320px"
                    placeholder="blur"
                    blurDataURL="data:image/avif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
                />
            </div>
            <figcaption className='flex flex-col items-center justify-center'>
                <h2 className='mb-1 text-lg lg:text-2xl font-bold'>미리 계획하지 않아도 괜찮아요.</h2>
                <p className={`${DESCRIPTION_STYLE}`}>MeetMeet과 함께라면 언제든지, 어디서든지</p>
                <p className={`${DESCRIPTION_STYLE}`}>누구와도 의미 있는 만남을 시작할 수 있습니다.</p>
            </figcaption>
        </figure>
    );
}