import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Meet Meet - 특별한 만남`,
  description: `Meet Meet 홈페이지 입니다.`,
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

interface GatheringCardProps {
  title: string;
  schedule: string;
  category: string;
  participants: number;
  categoryColor: string;
  image: string;
}

/** 피처 카드 */
const FeatureCard = ({ icon, title, description, gradient }: FeatureCardProps) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group dark:bg-dark-2 dark:text-white">
    <div className="space-y-6">
      <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <span className="text-2xl text-white">{icon}</span>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
        <p className="text-gray-600 leading-relaxed dark:text-white">{description}</p>
      </div>
    </div>
  </div>
);

/** 지금 핫한 모임 카드  */
const GatheringCard = ({
  title,
  schedule,
  category,
  participants,
  categoryColor,
  image
}: GatheringCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
    <div className="space-y-4">
      {/* 모임 썸네일 위치 */}
      <Image src={image} alt={title} width={300} height={128} className="w-full h-32 object-cover rounded-xl" />
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{schedule}</p>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${categoryColor} text-white px-2 py-1 rounded-full`}>
            {category}
          </span>
          <span className="text-xs text-gray-500">{participants}명 참여</span>
        </div>
      </div>
    </div>
  </div>
);

export default async function MainPage() {
  return (
    <div className="min-h-screen dark:bg-dark ">
      <div className="bg-white contents-container dark:bg-dark dark:text-white">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col lg:flex-row items-center gap-12 px-6 py-12">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-800 dark:text-white">가볍게 시작하는</span><br />
                특별한<span className="bg-gradient-to-r from-[#8B5CF6] to-[#F472B6] bg-clip-text text-transparent"> 만남</span><br />
              </h1>
              <p className="text-sm sm:text-xl text-gray-600 dark:text-white leading-relaxed max-w-md whitespace-nowrap">
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
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#F6D55C] flex items-center justify-center">
                  <span className="text-sm font-semibold">😊</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#6EE7B7] flex items-center justify-center">
                  <span className="text-sm font-semibold">🎨</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#F472B6] flex items-center justify-center">
                  <span className="text-sm font-semibold">🏃</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">+99</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-white">
                <strong className="text-[#8B5CF6]">12,000+</strong> 명이 이미 만남을 시작했어요
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            {/* 메인 히어로 이미지 */}
            <div className="w-full max-w-md mx-auto h-96 bg-gradient-to-br from-main-100 to-pink-200 rounded-3xl shadow-2xl flex items-center justify-center">
              <Image src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749713054/logo_hero_lp6zw5.avif"
                alt="메인 히어로 이미지"
                width={1000}
                height={1000}
                className="w-2/3 mx-auto" />
            </div>
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-[#F6D55C] rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-2xl">💛</span>
            </div>
            <div className="absolute bottom-8 left-4 w-12 h-12 bg-[#6EE7B7] rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-xl">🌟</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="px-6 py-16 space-y-16"
        >
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white">
              왜 <span className="bg-gradient-to-r from-[#8B5CF6] to-[#F472B6] bg-clip-text text-transparent">Meet Meet</span>일까요?
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-white max-w-2xl mx-auto">
              내가 찾는 모임을 쉽게 조건에 따라 찾을 수 있어요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="👥"
              title="북적북적/도란도란"
              description="외향적인 성격의 모임, 내향적인 성격의 모임을 구분했어요"
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
          </div>
        </section>

        {/* Mock Community Section */}
        <section
          id="community"
          className="px-6 py-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-dark-2 dark:to-dark-2 rounded-3xl"
        >
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
                지금 <span className="bg-gradient-to-r from-main-apricot to-[#F472B6] bg-clip-text text-transparent">핫한</span> 모임들
              </h2>
              <p className="text-lg text-gray-600 dark:text-white">
                다양한 사람들이 만나고 있는 인기 모임을 확인해보세요
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GatheringCard
                title="반포 러닝 크루 모집합니다!"
                schedule="13일 후 마감"
                category="액티비티"
                participants={10}
                categoryColor="bg-[#6EE7B7]"
                image="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749715783/running_p79a4b.avif"
              />
              <GatheringCard
                title="원데이 클래스 같이 들어요"
                schedule="곧 마감"
                category="액티비티"
                participants={4}
                categoryColor="bg-[#F6D55C]"
                image="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749715783/oneday_class_kwsiry.avif"
              />
              <GatheringCard
                title="축구 보면서 맥주 고고고"
                schedule="3시간 후 마감"
                category="도란도란"
                participants={6}
                categoryColor="bg-[#8B5CF6]"
                image="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749715783/pub_vqo6b7.avif"
              />
              <GatheringCard
                title="더 현대 팝업 가실 분?!"
                schedule="6일 2시간 후 마감"
                category="엔터테인먼트"
                participants={5}
                categoryColor="bg-[#F472B6]"
                image="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749715783/popup_wcwq04.avif"
              />
            </div>

            <div className="text-center">
              <Link href="/gatherings" className='inline-block'>
                <div className="px-8 py-3 rounded-xl shadow-sm hover:shadow-md border border-gray-200 bg-button-text text-button font-semibold transition-all">
                  더 많은 모임 보기
                </div>
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
                <div className='w-10 h-10 bg-gray-50 rounded-lg hover:scale-110 transition-transform cursor-pointer'>
                  <Image src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749713054/logo_hero_lp6zw5.avif" alt="로고 이미지" width={1000} height={1000} className="w-full h-full" />
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
                <li><Link href="/gatherings" className="hover:text-white transition-colors">모임 찾기</Link></li>
                <li><Link href="/saved" className="hover:text-white transition-colors">찜한 모임</Link></li>
                <li><Link href="/reviews" className="hover:text-white transition-colors">모든 리뷰</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">고객지원</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://forms.gle/AR1iMjGXZVEpN7df8" target="_blank" className="hover:text-white transition-colors">문의하기</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">팔로우</h3>
              <div className="flex gap-3">
                <a href="https://www.github.com/window-ook/meet-meet" target="_blank" className="hover:text-white transition-colors">
                  <div title='Github 링크' className="size-8 bg-main-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <Image src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1749972038/github_oqdvnr.svg" alt="인스타그램 로고" width={500} height={500} className="size-5" />
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
              <Link href='https://github.com/window-ook' target='_blank' className="hover:text-white transition-colors">window-ook</Link>
              <span>&</span>
              <Link href='https://github.com/OhSSangHoon' target='_blank' className="hover:text-white transition-colors">OhSSang</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

