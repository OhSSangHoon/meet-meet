import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { serverFetcher } from '@/lib/api/serverFetcher';
import { Gathering } from '@/types/gatherings';
import { getTimeRemaining, toKoreanTime } from '@/utils/shared/date';
import { Metadata } from 'next';
import * as m from "motion/react-m";
import Image from 'next/image';
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import Link from 'next/link';
import RollingNumber from '@/components/shared/RollingNumber';

export const metadata: Metadata = {
  title: 'Meet Meet - 특별한 만남',
  description: 'Meet Meet 홈페이지 입니다.',
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

interface GatheringCardProps {
  link: string;
  title: string;
  schedule: string;
  category: 'MINDFULNESS' | 'WORKATION' | 'OFFICE_STRETCHING';
  participants: number;
  image: string;
}

const SOCIAL_PROOF_STYLE = `size-10 rounded-full border-2 border-white flex items-center justify-center`;
const FOOTER_TEXT_BUTTON_STYLE = `hover:text-white transition-colors`;

const GATHERING_TYPES = [
  {
    id: 'OFFICE_STRETCHING',
    title: '엔터테인먼트',
  },
  {
    id: 'MINDFULNESS',
    title: '액티비티',
  },
  {
    id: 'WORKATION',
    title: '도란도란',
  }
];

async function getFourMostPopularGatherings(): Promise<Gathering[]> {
  try {
    let data: Gathering[] = [];
    const response = await serverFetcher(`${EXTERNAL_PATHS.GATHERINGS}?sortBy=participantCount&sortOrder=desc`, { cache: 'force-cache', next: { revalidate: 60 * 60 } });
    if (Array.isArray(response)) data = response as Gathering[];

    const now = new Date();
    const koreanNow = toKoreanTime(now);

    // 모집 마감 안 지난 모임만 필터링
    const filtered = data.filter((gathering) => new Date(gathering.registrationEnd) > koreanNow);

    // 상위 4개만 반환
    return filtered.slice(0, 4);
  } catch (error) {
    console.error('인기 모임 4개 조회 실패:', error);
    return [];
  }
}

/** 피처 카드 */
const FeatureCard = ({ icon, title, description, gradient }: FeatureCardProps) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all group dark:bg-dark-2 dark:text-white">
    <div className="space-y-6">
      <div className={`size-16 ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <span className="text-2xl text-white">{icon}</span>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold dark:text-white">{title}</h3>
        <p className="text-gray-500 leading-relaxed dark:text-white">{description}</p>
      </div>
    </div>
  </div>
);

/** 지금 핫한 모임 카드  */
const GatheringCard = ({
  link,
  title,
  schedule,
  category,
  participants,
  image
}: GatheringCardProps) => (
  <Link href={link}>
    <m.div
      className="space-y-4 group h-full p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-300 bg-white dark:bg-dark-2 hover:shadow-md hover:border-main-300 dark:hover:border-main-400 transition-all"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 모임 썸네일 위치 */}
      <ImageWithFallback
        src={image}
        fallbackSrc='https://res.cloudinary.com/dbvzbdffi/image/upload/v1750048546/error_fallback_icbngz.avif'
        alt={title}
        width={148}
        height={148}
        quality={60}
        priority
        className="w-full h-32 object-cover rounded-xl pointer-events-none" />
      <div className="space-y-2">
        <h3 className="font-semibold group-hover:text-main-500 dark:text-white dark:group-hover:text-main-500 transition-all">{title}</h3>
        <div className='flex items-center gap-1'>
          <span className="text-sm text-gray-500 dark:text-white">{schedule}</span>
          <span className='text-gray-500 dark:text-white'>|</span>
          <span className="text-sm text-gray-500 dark:text-white">
            <RollingNumber value={participants} duration={1000} interval={250} />
            명 참여
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full bg-main-400 text-xs text-white text-center`}>
          {category}
        </span>
      </div>
    </m.div>
  </Link>
);

export default async function MainPage() {
  const fourMostPopularGatherings = await getFourMostPopularGatherings();

  return (
    // 색상 경계를 없애기 위해 
    <main className="bg-transparent contents-container">
      {/* Hero Section */}
      <header
        id="hero"
        className="flex-1 flex flex-col lg:flex-row items-center gap-12 px-6 py-12">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="dark:text-white">가볍게 시작하는</span><br />
              특별한<span className="bg-gradient-to-r from-[#8B5CF6] to-[#F472B6] bg-clip-text text-transparent"> 만남</span><br />
            </h1>
            <p className="text-sm sm:text-xl text-gray-500 dark:text-white leading-relaxed max-w-md whitespace-nowrap">
              서울의 2030이라면 <strong className="text-[#8B5CF6]">Meet Meet</strong>에서 모임을 만들고<br />
              새로운 친구를 만들어보세요!
            </p>
          </div>

          <Link href="/gatherings" className='inline-block'>
            <div className="padding-button hover-button bg-button rounded-lg text-button-text text-sm sm:text-base font-semibold hover:bg-main-600 shadow-lg hover:shadow-xl">
              지금 시작하기
            </div>
          </Link>

          {/* Social Proof */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-2">
              <div className={`${SOCIAL_PROOF_STYLE} bg-[#F6D55C]`}>
                <span className="text-sm font-semibold">😊</span>
              </div>
              <div className={`${SOCIAL_PROOF_STYLE} bg-[#6EE7B7]`}>
                <span className="text-sm font-semibold">🎨</span>
              </div>
              <div className={`${SOCIAL_PROOF_STYLE} bg-[#F472B6]`}>
                <span className="text-sm font-semibold">🏃</span>
              </div>
              <div className={`${SOCIAL_PROOF_STYLE} bg-gray-200`}>
                <span className="text-xs font-bold text-gray-500">+99</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-white">
              <strong className="text-[#8B5CF6]">12,000+</strong> 명이 이미 만남을 시작했어요
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          {/* 메인 히어로 이미지 */}
          <div className="w-full max-w-md mx-auto h-96 bg-gradient-to-br from-main-100 to-pink-200 rounded-3xl shadow-2xl flex items-center justify-center">
            <Image src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1750301404/logo_hero_zeiiec.avif"
              alt="메인 히어로 이미지"
              width={317}
              height={317}
              priority
              fetchPriority='high'
              className="w-2/3 mx-auto pointer-events-none" />
          </div>
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-[#F6D55C] rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-2xl">💛</span>
          </div>
          <div className="absolute bottom-8 left-4 w-12 h-12 bg-[#6EE7B7] rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-xl">🌟</span>
          </div>
        </div>
      </header>

      {/* 피쳐 */}
      <section
        id="features"
        className="px-6 py-16 space-y-16"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-bold dark:text-white">
            왜 <span className="bg-gradient-to-r from-[#8B5CF6] to-[#F472B6] bg-clip-text text-transparent">Meet Meet</span>일까요?
          </h2>
          <p className="text-sm sm:text-lg text-gray-500 dark:text-white max-w-2xl mx-auto">
            내가 찾는 모임을 쉽게 조건에 따라 찾을 수 있어요
          </p>
        </div>

        <m.article className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20, }}
          whileInView={{ opacity: 1, y: 0, }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 1, }}
        >
          <FeatureCard
            icon="👥"
            title="북적북적/도란도란"
            description="모임의 성격을 기준으로 구분했어요"
            gradient="bg-gradient-to-r from-main-jade to-main-apricot"
          />
          <FeatureCard
            icon="🎯"
            title="찜해두기"
            description="찜해두기 기능으로 원하는 모임을 쉽게 찾을 수 있어요"
            gradient="bg-gradient-to-r from-main-apricot to-main-pink"
          />
          <FeatureCard
            icon="💬"
            title="리뷰 시스템"
            description="실제 이용자들이 남긴 리뷰로 모임의 소감을 알 수 있어요"
            gradient="bg-gradient-to-r from-main-pink to-main-500"
          />
        </m.article>
      </section>

      {/* 지금 핫한 모임 */}
      <section
        id="community"
        className="px-6 py-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-dark-2 dark:to-dark-2 rounded-3xl"
      >
        <div className="space-y-12">
          <div
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-bold dark:text-white">
              지금 <span className="bg-gradient-to-r from-main-apricot via-main-pink to-main-500 bg-clip-text text-transparent">HOT한</span> 모임들
            </h2>
            <m.p
              className="text-lg text-gray-500 dark:text-white"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              다양한 사람들이 만나고 있는 인기 모임에 참여해보시는 건 어떤가요?
            </m.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fourMostPopularGatherings.map((gathering) => {
              return (
                <GatheringCard
                  key={`${gathering.id} - ${gathering.dateTime}`}
                  title={gathering.name}
                  link={`/gatherings/detail/${gathering.id}`}
                  schedule={getTimeRemaining(gathering.registrationEnd)}
                  category={GATHERING_TYPES.find(type => type.id === gathering.type)?.title as 'MINDFULNESS' | 'WORKATION' | 'OFFICE_STRETCHING'}
                  participants={gathering.participantCount}
                  image={gathering.image}
                />
              )
            })}
          </div>

          <div className="text-center">
            <Link href="/gatherings" className='inline-block'>
              <m.div
                className="px-8 py-3 rounded-xl shadow-sm hover:shadow-md border border-main-300 bg-button-text dark:bg-dark-2 hover:bg-button dark:hover:bg-button text-button hover:text-button-text font-semibold transition-all"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, amount: 0.5, }}
              >
                더 많은 모임 보기
              </m.div>
            </Link>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-800 rounded-3xl text-white">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* 로고 이미지 위치 */}
              <div className='size-10 bg-gray-50 rounded-lg hover:scale-110 transition-transform cursor-pointer'>
                <Image
                  src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1750301404/logo_hero_zeiiec.avif"
                  alt="로고 이미지"
                  width={42.5}
                  height={42.5}
                  className="size-full object-cover object-center pointer-events-none" />
              </div>
              <span className="text-xl font-bold">Meet Meet</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              혼자보다 함께<br />
              평범한 일상 속 특별한 만남<br />
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">찾아보기</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/gatherings" className={FOOTER_TEXT_BUTTON_STYLE}>모임 찾기</Link></li>
              <li><Link href="/saved" className={FOOTER_TEXT_BUTTON_STYLE}>찜한 모임</Link></li>
              <li><Link href="/reviews" className={FOOTER_TEXT_BUTTON_STYLE}>모든 리뷰</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">고객지원</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://forms.gle/AR1iMjGXZVEpN7df8" target="_blank" className={FOOTER_TEXT_BUTTON_STYLE}>문의하기</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">팔로우</h3>
            <div className="flex gap-3">
              <a href="https://www.github.com/window-ook/meet-meet" target="_blank">
                <div title='Github 링크' className="size-8 bg-black border border-slate-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <Image
                    src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749972038/github_oqdvnr.svg"
                    alt="깃허브 로고"
                    width={21.25}
                    height={21.25}
                    className="size-5 object-cover object-center pointer-events-none" />
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 Meet Meet All rights reserved
          </p>
          <div className="flex gap-2 text-sm text-gray-400">
            <Link href='https://github.com/window-ook' target='_blank' className={FOOTER_TEXT_BUTTON_STYLE}>window-ook</Link>
            <span>&</span>
            <Link href='https://github.com/OhSSangHoon' target='_blank' className={FOOTER_TEXT_BUTTON_STYLE}>OhSSang</Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

