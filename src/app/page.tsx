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
    <div className="antialiased text-brown-900 min-h-screen relative overflow-hidden" style={{ backgroundColor: '#f3f2f1' }}>
      {/* Background Animation Layer */}
      <div className="absolute inset-0 z-0 animated-bg opacity-30" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* 큰 곡선 면 */}
        <div className="floating-curve absolute -top-20 -left-40 w-80 h-80 bg-hazelnut opacity-8 curve-shape-1"></div>
        <div className="floating-curve absolute top-1/4 -right-32 w-96 h-64 bg-muted-blue opacity-6 curve-shape-2"></div>
        <div className="floating-curve absolute -bottom-32 left-1/4 w-72 h-96 bg-hazelnut opacity-10 curve-shape-3"></div>
        
        {/* 중간 크기 곡선 */}
        <div className="floating-curve absolute top-1/3 left-1/5 w-48 h-32 bg-brown-900 opacity-4 curve-shape-4"></div>
        <div className="floating-curve absolute bottom-1/4 right-1/4 w-64 h-40 bg-muted-blue opacity-8 curve-shape-5"></div>
        
        {/* 작은 장식 곡선 */}
        <div className="floating-curve absolute top-1/2 right-1/3 w-32 h-24 bg-hazelnut opacity-12 curve-shape-6"></div>
      </div>

      {/* Main Content Container (Responsive) */}
      <div className="main-container relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        
        {/* Left Section - Brand & Value Proposition */}
        <div className="text-section flex-1 max-w-2xl">
          {/* Main Logo & Tagline */}
          <div className="mb-8">
            <h1 className="text-7xl md:text-9xl font-bold text-hazelnut mb-6 tracking-tight">자리매</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-brown-900 leading-relaxed mb-4">
              소상공인을 위한 <span className="text-hazelnut">스마트</span> 예약 솔루션
            </h2>
            <p className="text-lg md:text-xl text-brown-900 opacity-80 leading-relaxed">
              손님과 사장님 모두를 위한<br className="md:hidden" /> 
              편안하고 직관적인 예약 경험
            </p>
          </div>

          {/* Value Propositions */}
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-hazelnut"></div>
              <span className="text-brown-900">실시간 예약 관리와 웨이팅 시스템</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-muted-blue"></div>
              <span className="text-brown-900">소상공인 친화적인 간편한 매장 관리</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-hazelnut"></div>
              <span className="text-brown-900">한국적 정서를 담은 따뜻한 서비스</span>
            </div>
          </div>

          {/* CTA for visitors */}
          <div className="hidden md:block">
            <Link href="/auth/type" className="inline-flex items-center gap-2 text-muted-blue hover:text-hazelnut font-medium transition-colors">
              지금 시작하기 →
            </Link>
          </div>
        </div>
        
        {/* Login Card */}
        <div className="flex-1 bg-white p-8 rounded-3xl login-card border border-gray-100 max-w-md w-full shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brown-900 mb-2">로그인</h2>
            <p className="text-sm text-gray-600">자리매에 오신 것을 환영합니다</p>
          </div>

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
              <Input
                id="password"
                type="password"
                placeholder="비밀번호 입력"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                disabled={isLoading}
                className="w-full"
              />
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
              className="w-full bg-yellow-400 text-brown-900 font-semibold py-3.5 rounded-2xl flex items-center justify-center space-x-3 hover:bg-yellow-300 transition-all duration-200 shadow-sm"
              disabled={isLoading}
            >
              <div className="w-5 h-5 bg-brown-900 rounded-full flex items-center justify-center">
                <span className="text-yellow-400 text-xs font-bold">K</span>
              </div>
              <span>카카오로 시작하기</span>
            </button>
            
            <button 
              onClick={() => handleSocialLogin('naver')}
              className="w-full bg-green-500 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center space-x-3 hover:bg-green-400 transition-all duration-200 shadow-sm"
              disabled={isLoading}
            >
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-500 text-xs font-bold">N</span>
              </div>
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
      <footer className="absolute bottom-0 left-0 right-0 py-6 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-brown-900 opacity-60">
              <span>© 2025 자리매</span>
              <span className="hidden md:inline">|</span>
              <span>소상공인과 함께하는 스마트 예약</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-brown-900 opacity-50">
              <span>서비스 이용약관</span>
              <span>•</span>
              <span>개인정보처리방침</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .animated-bg {
          background: linear-gradient(-45deg, #f3f2f1, #e8e6e3, #f0efec, #f5f4f2);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .floating-curve {
          animation: curveFlow 25s ease-in-out infinite;
        }
        
        .floating-curve:nth-child(1) { animation-delay: 0s; }
        .floating-curve:nth-child(2) { animation-delay: 4s; }
        .floating-curve:nth-child(3) { animation-delay: 8s; }
        .floating-curve:nth-child(4) { animation-delay: 12s; }
        .floating-curve:nth-child(5) { animation-delay: 16s; }
        .floating-curve:nth-child(6) { animation-delay: 20s; }

        @keyframes curveFlow {
          0%, 100% { 
            transform: translateX(0px) translateY(0px) rotate(0deg) scaleX(1) scaleY(1); 
            opacity: 0.8;
          }
          25% { 
            transform: translateX(-15px) translateY(-25px) rotate(5deg) scaleX(1.1) scaleY(0.9); 
            opacity: 0.6;
          }
          50% { 
            transform: translateX(20px) translateY(-10px) rotate(-3deg) scaleX(0.9) scaleY(1.2); 
            opacity: 1;
          }
          75% { 
            transform: translateX(-8px) translateY(-35px) rotate(8deg) scaleX(1.15) scaleY(0.85); 
            opacity: 0.7;
          }
        }

        /* 각 곡선 면의 모양 정의 */
        .curve-shape-1 {
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }
        .curve-shape-2 {
          border-radius: 30% 70% 60% 40% / 50% 30% 70% 50%;
        }
        .curve-shape-3 {
          border-radius: 50% 50% 80% 20% / 60% 40% 60% 40%;
        }
        .curve-shape-4 {
          border-radius: 60% 40% 30% 70% / 30% 60% 40% 70%;
        }
        .curve-shape-5 {
          border-radius: 70% 30% 50% 50% / 40% 70% 30% 60%;
        }
        .curve-shape-6 {
          border-radius: 80% 20% 60% 40% / 50% 50% 80% 20%;
        }

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
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 
            0 25px 50px -12px rgba(74, 44, 32, 0.15),
            0 0 0 1px rgba(177, 150, 123, 0.1);
        }

        @media (min-width: 768px) {
          .main-container {
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 5rem;
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