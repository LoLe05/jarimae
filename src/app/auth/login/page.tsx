'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, Button, Input } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  email?: string
  password?: string
}

/**
 * 로그인 페이지
 * 경로: /auth/login
 */
export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^010-\d{4}-\d{4}$/
    
    // 이메일 또는 전화번호 형식 확인
    if (!formData.email) {
      newErrors.email = '이메일 또는 전화번호를 입력해주세요'
    } else if (!emailRegex.test(formData.email) && !phoneRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 또는 전화번호를 입력해주세요'
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 에러 메시지 초기화
    if (typeof field === 'string' && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof FormErrors]: undefined }))
    }
  }

  // 기억된 이메일 불러오기
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('jarimae_remembered_email')
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }))
    }
  }, [])

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      console.log('Login data:', formData)
      
      // 기억하기 체크박스 처리
      if (formData.rememberMe) {
        localStorage.setItem('jarimae_remembered_email', formData.email)
      } else {
        localStorage.removeItem('jarimae_remembered_email')
      }
      
      // 실제 로그인 API 호출
      await login(formData.email, formData.password, formData.rememberMe)
      
      // 로그인 성공 후 메인 대시보드로 이동
      router.push('/main')
    } catch (error) {
      console.error('Login error:', error)
      // 에러 처리 - 일반적인 로그인 실패 메시지
      setErrors({ email: '이메일 또는 비밀번호가 올바르지 않습니다' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-warm-gray relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 animated-bg opacity-30" />
      
      <div className="relative z-10 container mx-auto px-4 py-4 sm:py-8 min-h-screen flex flex-col items-center justify-center safe-area-top safe-area-bottom">
        
        {/* 헤더 - 모바일 최적화 */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block mb-4 sm:mb-6 group mobile-tap">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-hazelnut transition-transform group-hover:scale-105">
              자리매
            </h1>
          </Link>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brown-900 mb-2">
            로그인
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            자리매에서 편리한 예약을 시작하세요
          </p>
        </div>

        {/* 로그인 폼 카드 - 모바일 최적화 */}
        <Card className="w-full max-w-md p-4 sm:p-6 md:p-8">
          <div className="space-y-4 sm:space-y-6">
            <Input
              id="email"
              type="email"
              placeholder="이메일 또는 전화번호 (010-0000-0000)"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              onKeyDown={handleKeyPress}
              error={!!errors.email}
              errorMessage={errors.email}
            />

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                onKeyDown={handleKeyPress}
                error={!!errors.password}
                errorMessage={errors.password}
                className="pr-12"
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

            {/* 기억하기 체크박스 */}
            <div className="flex items-center justify-between">
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
            </div>

            <Button
              onClick={handleSubmit}
              loading={isLoading}
              size="lg"
              className="w-full"
            >
              로그인
            </Button>

            {/* 비밀번호 찾기 링크 */}
            <div className="text-center">
              <Link 
                href="/auth/forgot-password"
                className="text-sm text-gray-600 hover:text-hazelnut transition-colors"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>

            {/* 구분선 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            {/* 소셜 로그인 버튼들 - 모바일 터치 최적화 */}
            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-3 mobile-tap min-h-[48px]"
                onClick={() => console.log('카카오 로그인')}
              >
                <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-brown-900">K</span>
                </div>
                <span className="text-sm sm:text-base">카카오로 로그인</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-3 mobile-tap min-h-[48px]"
                onClick={() => console.log('구글 로그인')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path 
                    fill="#4285F4" 
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path 
                    fill="#34A853" 
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path 
                    fill="#FBBC05" 
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path 
                    fill="#EA4335" 
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm sm:text-base">구글로 로그인</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* 회원가입 링크 - 모바일 최적화 */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-sm sm:text-base text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link 
              href="/auth/type"
              className="text-hazelnut font-medium hover:text-hazelnut-600 transition-colors mobile-tap"
            >
              회원가입하기
            </Link>
          </p>
        </div>

        {/* 추가 링크들 - 모바일에서 더 터치하기 쉽게 */}
        <div className="text-center mt-4 space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-500">
            <Link href="/terms" className="hover:text-hazelnut transition-colors mobile-tap py-1 px-2">
              이용약관
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-hazelnut transition-colors mobile-tap py-1 px-2">
              개인정보처리방침
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/support" className="hover:text-hazelnut transition-colors mobile-tap py-1 px-2">
              고객센터
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}