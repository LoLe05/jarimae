import React from 'react'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
}

/**
 * 접근성을 위한 Skip Link 컴포넌트
 * 키보드 사용자가 네비게이션을 건너뛰고 메인 콘텐츠로 바로 이동할 수 있게 합니다.
 */
export default function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-hazelnut text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:shadow-lg"
    >
      {children}
    </a>
  )
}