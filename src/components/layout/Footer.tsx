import React from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

interface FooterProps {
  className?: string
}

/**
 * 자리매 공통 푸터 컴포넌트
 * 모든 페이지 하단에 표시되는 정보
 */
export default function Footer({ className }: FooterProps) {
  const footerLinks = {
    company: {
      title: '회사',
      links: [
        { name: '회사소개', href: '/about' },
        { name: '채용정보', href: '/careers' },
        { name: '공지사항', href: '/notice' },
        { name: '언론보도', href: '/press' }
      ]
    },
    service: {
      title: '서비스',
      links: [
        { name: '이용약관', href: '/terms' },
        { name: '개인정보처리방침', href: '/privacy' },
        { name: '이용방법', href: '/guide' },
        { name: 'FAQ', href: '/faq' }
      ]
    },
    support: {
      title: '고객지원',
      links: [
        { name: '고객센터', href: '/support' },
        { name: '사장님 문의', href: '/partner/support' },
        { name: '제휴문의', href: '/partnership' },
        { name: '신고하기', href: '/report' }
      ]
    }
  }

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/jarimae',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.624 5.367 11.99 11.988 11.99s11.99-5.366 11.99-11.99C24.007 5.367 18.641.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.5 13.559 3.5 12.017s.698-2.878 1.626-3.674c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.796 1.626 2.132 1.626 3.674s-.698 2.878-1.626 3.674c-.875.807-2.026 1.297-3.323 1.297z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@jarimae',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: 'Blog',
      href: 'https://blog.jarimae.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169-.288-.43-.468-.716-.468-.287 0-.547.18-.716.468L12 12.6 7.864 8.16c-.169-.288-.43-.468-.716-.468-.287 0-.547.18-.716.468-.32.555-.32 1.26 0 1.815L10.148 15c.169.288.43.468.716.468s.547-.18.716-.468l3.716-6.44c.32-.555.32-1.26 0-1.815-.169-.288-.43-.468-.716-.468z"/>
        </svg>
      )
    }
  ]

  return (
    <footer className={clsx('bg-brown-900 text-white', className)}>
      <div className="container mx-auto px-4 py-12">
        {/* 상단 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* 브랜드 섹션 */}
          <div className="lg:col-span-1">
            <div className="text-3xl font-bold text-hazelnut mb-4">
              자리매
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              소상공인을 위한 똑똑한 자리 예약<br />
              손님과 사장님 모두 편안하게
            </p>
            
            {/* 소셜 링크 */}
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-hazelnut transition-colors duration-200"
                  aria-label={`${item.name} 페이지로 이동`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 링크 섹션들 */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 text-sm hover:text-hazelnut transition-colors duration-200 focus:text-hazelnut focus:outline-none focus:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* 회사 정보 */}
            <div className="text-sm text-gray-400 text-center md:text-left">
              <p className="mb-1">
                (주)자리매 | 대표이사: 김자리 | 사업자등록번호: 123-45-67890
              </p>
              <p className="mb-1">
                주소: 서울특별시 강남구 테헤란로 123, 자리매빌딩 10층
              </p>
              <p>
                고객센터: 1588-0000 | 이메일: support@jarimae.com
              </p>
            </div>

            {/* 저작권 */}
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} 자리매. All rights reserved.
            </div>
          </div>
        </div>

        {/* 앱 다운로드 섹션 (선택사항) */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">자리매 앱 다운로드</h3>
            <div className="flex justify-center space-x-4">
              <a
                href="#"
                className="inline-flex items-center px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="App Store에서 다운로드"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </a>

              <a
                href="#"
                className="inline-flex items-center px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Google Play에서 다운로드"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">GET IT ON</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}