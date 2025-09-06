import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import { SkipLink } from '@/components/A11y'

// 폰트 설정
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

// 메타데이터 설정
export const metadata: Metadata = {
  title: {
    default: '자리매 - 소상공인을 위한 똑똑한 자리 예약',
    template: '%s | 자리매'
  },
  description: '손님과 사장님 모두 편안한 예약 시스템, 자리매입니다.',
  keywords: [
    '예약',
    '식당예약', 
    '자리예약',
    '매장예약',
    '소상공인',
    '예약시스템',
    '자리매'
  ],
  authors: [{ name: '자리매 팀' }],
  creator: '자리매',
  publisher: '자리매',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: '자리매',
    title: '자리매 - 소상공인을 위한 똑똑한 자리 예약',
    description: '손님과 사장님 모두 편안한 예약 시스템, 자리매입니다.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: '자리매 - 소상공인을 위한 똑똑한 자리 예약',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '자리매 - 소상공인을 위한 똑똑한 자리 예약',
    description: '손님과 사장님 모두 편안한 예약 시스템, 자리매입니다.',
    images: ['/images/twitter-image.png'],
    creator: '@jarimae',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/icons/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512', 
        url: '/icons/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    other: {
      'naver-site-verification': process.env.NAVER_VERIFICATION_ID || '',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        {/* Pretendard 폰트 프리로드 */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css"
        />
        {/* 네이버 지도 API 프리로드 (필요시) */}
        {process.env.NAVER_MAP_CLIENT_ID && (
          <link
            rel="preconnect"
            href="https://openapi.map.naver.com"
            crossOrigin=""
          />
        )}
      </head>
      <body className="antialiased text-brown-900 relative overflow-x-hidden">
        {/* Skip to content 링크 (접근성) */}
        <SkipLink href="#main-content">
          메인 콘텐츠로 건너뛰기
        </SkipLink>
        
        {/* 전역 배경 애니메이션 */}
        <div className="fixed inset-0 z-0 animated-bg opacity-30 pointer-events-none" />
        
        {/* 메인 콘텐츠 */}
        <div id="main-content" className="relative z-10 min-h-screen">
          <ErrorBoundary>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ErrorBoundary>
        </div>

        {/* 개발환경에서만 표시되는 환경 표시기 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 z-50 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 text-xs text-yellow-800 no-print">
            🚧 개발모드
          </div>
        )}

      </body>
    </html>
  )
}