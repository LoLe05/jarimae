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
  const { isLoggedIn, user, logout, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

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
    setIsProfileDropdownOpen(false)
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  // 프로필 사진 생성 함수 (첫 글자 기반)
  const getProfileInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : '🙂'
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
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-hazelnut border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500">로딩 중...</span>
              </div>
            ) : isLoggedIn ? (
              <div className="relative">
                {/* 프로필 버튼 */}
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors mobile-tap"
                >
                  {/* 프로필 사진 */}
                  <div className="w-8 h-8 bg-hazelnut text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {getProfileInitial(user?.name)}
                  </div>
                  <span className="text-sm text-brown-900 font-medium">
                    {user?.name}님
                  </span>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 프로필 드롭다운 */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    <Link 
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 mobile-tap"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      프로필 설정
                    </Link>
                    <Link 
                      href="/profile/reservations"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 mobile-tap"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h3z" />
                      </svg>
                      내 예약
                    </Link>
                    <Link 
                      href="/profile/reviews"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 mobile-tap"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      내 리뷰
                    </Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 mobile-tap"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      로그아웃
                    </button>
                  </div>
                )}

                {/* 드롭다운 배경 오버레이 */}
                {isProfileDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                )}
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