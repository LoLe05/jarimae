'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  className?: string
}

/**
 * 자리매 공통 헤더 컴포넌트
 * 모든 페이지에서 사용되는 상단 네비게이션
 */
export default function Header({ className }: HeaderProps) {
  const pathname = usePathname()
  const { isLoggedIn, user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navigation = [
    { name: '매장 찾기', href: '/search' },
    { name: '내 예약', href: '/profile/reservations' },
    { name: '사장님', href: '/partner/dashboard' }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  return (
    <header 
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-gray-100' 
          : 'bg-transparent',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* 로고 */}
          <Link 
            href="/"
            className="flex items-center space-x-2 group"
          >
            <div className="text-2xl md:text-3xl font-bold text-hazelnut transition-transform group-hover:scale-105">
              자리매
            </div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'text-sm font-medium transition-colors duration-200 relative',
                  'hover:text-hazelnut focus:text-hazelnut',
                  'focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50 rounded-md px-2 py-1',
                  isActive(item.href)
                    ? 'text-hazelnut'
                    : 'text-brown-900'
                )}
              >
                {item.name}
                {/* 활성 상태 인디케이터 */}
                {isActive(item.href) && (
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-hazelnut rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* 로그인/회원가입 버튼 (데스크톱) */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-brown-900 font-medium">
                  안녕하세요, {user?.name}님
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  로그아웃
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/auth/type">
                  <Button variant="primary" size="sm">
                    시작하기
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-brown-900 hover:bg-gray-100 transition-colors"
            aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-soft">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* 모바일 네비게이션 */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'block px-3 py-2 rounded-lg text-base font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50',
                    isActive(item.href)
                      ? 'text-hazelnut bg-hazelnut/10'
                      : 'text-brown-900 hover:bg-gray-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* 모바일 로그인/회원가입 */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <div className="text-sm text-brown-900 font-medium px-3 py-2">
                    안녕하세요, {user?.name}님
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      로그인
                    </Button>
                  </Link>
                  <Link 
                    href="/auth/type"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      시작하기
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden -z-10"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  )
}