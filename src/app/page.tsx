'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

/**
 * 자리매 시작 페이지 (로그인 전 랜딩)
 * HTML 시안: jarimae_unique_login_main_responsive.html
 * 경로: /
 */
export default function LandingPage() {
  const { isLoggedIn, login, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // 인증 상태 확인 후 로그인된 상태라면 메인 대시보드로 리디렉션
  useEffect(() => {
    console.log('🏠 Root 페이지 - 인증 상태 체크:', { isLoggedIn, authLoading })
    
    // AuthContext 로딩이 완료되고 로그인된 상태라면 리디렉션
    if (!authLoading && isLoggedIn) {
      console.log('🔄 메인 페이지로 리디렉션')
      router.push('/main')
    }
  }, [isLoggedIn, authLoading, router])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // 에러 메시지 초기화
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요')
      return
    }
    
    if (!formData.password.trim()) {
      setError('비밀번호를 입력해주세요')
      return
    }

    setIsLoading(true)
    
    try {
      // 기억하기 체크박스 처리
      if (formData.rememberMe) {
        localStorage.setItem('jarimae_remembered_email', formData.email)
      } else {
        localStorage.removeItem('jarimae_remembered_email')
      }

      // AuthContext의 login 메서드 사용 (API 연동 포함)
      await login(formData.email, formData.password, formData.rememberMe)
      
      // 성공 시 메인 대시보드로 이동 (AuthContext에서 자동으로 처리됨)
      router.push('/main')
    } catch (error) {
      console.error('Login error:', error)
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  // 기억된 이메일 불러오기
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('jarimae_remembered_email')
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }))
    }
  }, [])

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`)
    // TODO: 소셜 로그인 구현
  }

  return (
    <div className="antialiased text-brown-900 flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Animation Layer */}
      <div className="absolute inset-0 z-0 animated-bg opacity-30" />

      {/* Main Content Container (Responsive) */}
      <div className="main-container relative z-10 container mx-auto px-4 py-8 flex">
        
        {/* Catchphrase and Logo */}
        <div className="text-section flex-1">
          <h1 className="text-6xl font-bold text-hazelnut md:text-8xl">자리매</h1>
          <p className="mt-4 text-xl md:text-2xl font-bold text-brown-900 leading-snug">
            소상공인을 위한<br className="md:hidden" />똑똑한 자리 예약
          </p>
          <p className="mt-2 text-lg md:text-xl text-brown-900 opacity-80">
            손님과 사장님 모두 편안하게
          </p>
        </div>
        
        {/* Login Card */}
        <div className="flex-1 bg-white p-8 rounded-3xl login-card border border-gray-100 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">이메일</label>
              <Input
                id="email"
                type="email"
                placeholder="이메일 주소 입력"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">비밀번호</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호 입력"
                  value={formData.password}
                  onChange={(value) => handleInputChange('password', value)}
                  disabled={isLoading}
                  className="w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="mb-6 flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-hazelnut rounded border-gray-300 focus:ring-hazelnut"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">아이디 기억하기</span>
              </label>
              
              <Link href="/auth/forgot-password" className="text-sm text-brown-900 hover:underline">
                비밀번호 찾기
              </Link>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full bg-hazelnut hover:bg-muted-blue text-white font-bold py-3 rounded-full transition-colors"
            >
              로그인
            </Button>
          </form>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">또는</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => handleSocialLogin('kakao')}
              className="w-full bg-muted-blue text-white font-bold py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-opacity-80 transition-opacity"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.9 20A9.3 9.3 0 0 1 4 16.1L2 22l5.9-2.1c2-.4 4.1-.6 6.1-.5 5.5.3 10.3-4.1 10.3-9.5S19.5 2.5 14 2.5 3.7 7 4.2 12.5" />
              </svg>
              <span>카카오로 시작하기</span>
            </button>
            
            <button 
              onClick={() => handleSocialLogin('naver')}
              className="w-full bg-gray-500 text-white font-bold py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-opacity-80 transition-opacity"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
              <span>네이버로 시작하기</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              아직 계정이 없으신가요?{' '}
              <Link href="/auth/type" className="text-hazelnut font-medium hover:underline">
                회원가입하기
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-brown-900 opacity-60">
        <p>Copyright © 2025 자리매. All Rights Reserved.</p>
      </footer>

      <style jsx>{`
        .main-container {
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .text-section {
          margin-bottom: 2.5rem;
        }
        .login-card {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        @media (min-width: 768px) {
          .main-container {
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 4rem;
          }
          .text-section {
            margin-bottom: 0;
            text-align: left;
          }
        }
      `}</style>
    </div>
  )
}