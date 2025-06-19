import { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local';
import Providers from "@/providers/Providers";

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://meet-meet-psi.vercel.app'),
  title: "Meet Meet",
  description: "서울 2030을 위한 모임",
  keywords: [
    '밋밋',
    '밋밋 모임 앱',
    '밋밋 모임',
    'Meet Meet',
    'meet meet',
    'MeetMeet',
    'meetmeet',
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: 'Meet Meet',
    siteName: 'Meet Meet',
    description: '서울 2030을 위한 모임 플랫폼',
    images: ['https://meet-meet-psi.vercel.app/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meet Meet',
    description: '서울 2030을 위한 모임 플랫폼',
    images: ['https://meet-meet-psi.vercel.app/opengraph-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//meet-meet-psi.vercel.app" />
        <link rel="preconnect" href="https://meet-meet-psi.vercel.app" />
      </head>
      <body
        className={`${pretendard.variable} font-pretendard text-global-text`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
