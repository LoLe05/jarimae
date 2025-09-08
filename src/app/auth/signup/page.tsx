'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, Button, Input } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient, API_ENDPOINTS } from '@/lib/api-client'
import { useToast } from '@/components/ui/Toast'
import type { UserType } from '@/types'

interface FormData {
  name: string
  nickname: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  termsAgreed: boolean
  privacyAgreed: boolean
  marketingAgreed: boolean
  // 사장님 전용 필드
  storeName?: string
  storeAddress?: string
  storePhone?: string
  storeCategory?: string
  storeDescription?: string
}

interface FormErrors {
  name?: string
  nickname?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  terms?: string
  // 사장님 전용 에러 필드
  storeName?: string
  storeAddress?: string
  storePhone?: string
  storeCategory?: string
}

/**
 * 회원가입 페이지 (고객/사장님)
 * HTML 시안: jarimae_customer_signup.html, jarimae_partner_signup.html
 * 경로: /auth/signup?type=customer|owner
 */
export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { showToast } = useToast()
  const userType = searchParams.get('type') as UserType | null

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
    privacyAgreed: false,
    marketingAgreed: false
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // URL에 type이 없거나 올바르지 않은 경우 유형 선택 페이지로 리디렉션
  useEffect(() => {
    if (!userType || !['customer', 'owner'].includes(userType.toLowerCase())) {
      router.push('/auth/type')
    }
  }, [userType, router])

  const isCustomer = userType?.toLowerCase() === 'customer'
  const totalSteps = isCustomer ? 2 : 3 // 사장님은 추가 단계 필요

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      // 1단계: 기본 정보
      if (!formData.name.trim()) {
        newErrors.name = '이름을 입력해주세요'
      } else if (formData.name.length < 2) {
        newErrors.name = '이름은 2글자 이상 입력해주세요'
      }

      if (isCustomer && !formData.nickname.trim()) {
        newErrors.nickname = '닉네임을 입력해주세요'
      } else if (isCustomer && formData.nickname.length < 2) {
        newErrors.nickname = '닉네임은 2글자 이상 입력해주세요'
      }

      const phoneRegex = /^010-\d{4}-\d{4}$/
      if (!formData.phone) {
        newErrors.phone = '휴대폰 번호를 입력해주세요'
      } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = '올바른 휴대폰 번호를 입력해주세요'
      }
    } else if (step === 2) {
      // 2단계: 계정 정보
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.email) {
        newErrors.email = '이메일을 입력해주세요'
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = '올바른 이메일을 입력해주세요'
      }

      if (!formData.password) {
        newErrors.password = '비밀번호를 입력해주세요'
      } else if (formData.password.length < 8) {
        newErrors.password = '비밀번호는 8자 이상 입력해주세요'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호를 다시 입력해주세요'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
      }

      if (!formData.termsAgreed || !formData.privacyAgreed) {
        newErrors.terms = '필수 약관에 동의해주세요'
      }
    } else if (step === 3) {
      // 3단계: 매장 정보 (사장님만)
      if (!isCustomer) {
        if (!formData.storeName?.trim()) {
          newErrors.storeName = '매장명을 입력해주세요'
        } else if (formData.storeName.length < 2) {
          newErrors.storeName = '매장명은 2글자 이상 입력해주세요'
        }

        if (!formData.storeAddress?.trim()) {
          newErrors.storeAddress = '매장 주소를 입력해주세요'
        }

        if (!formData.storePhone?.trim()) {
          newErrors.storePhone = '매장 전화번호를 입력해주세요'
        } else {
          const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/
          if (!phoneRegex.test(formData.storePhone)) {
            newErrors.storePhone = '올바른 전화번호를 입력해주세요 (예: 02-1234-5678)'
          }
        }

        if (!formData.storeCategory?.trim()) {
          newErrors.storeCategory = '업종을 선택해주세요'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 에러 메시지 초기화
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    
    try {
      // 회원가입 API 호출
      const signupData = {
        name: formData.name,
        nickname: formData.nickname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userType: userType?.toUpperCase() || 'CUSTOMER',
        termsAgreed: formData.termsAgreed,
        privacyAgreed: formData.privacyAgreed,
        marketingAgreed: formData.marketingAgreed
      }

      // Mock 회원가입 (항상 성공)
      console.log('🔐 Mock 회원가입 성공:', signupData)
      
      // 회원가입 성공 Toast 표시
      showToast({
        type: 'success',
        title: '회원가입 성공',
        message: `환영합니다, ${formData.name}님!`
      })

      // 회원가입 성공 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/auth/login?email=' + encodeURIComponent(formData.email))
      }, 1500) // 토스트 메시지를 볼 수 있도록 1.5초 대기
    } catch (error: any) {
      console.error('Signup error:', error)
      
      // 에러 Toast 표시
      showToast({
        type: 'error',
        title: '회원가입 실패',
        message: error.message || '회원가입 중 오류가 발생했습니다'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-warm-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-gray relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 animated-bg opacity-30" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 group">
            <h1 className="text-4xl md:text-5xl font-bold text-hazelnut transition-transform group-hover:scale-105">
              자리매
            </h1>
          </Link>
          
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-2">
            {isCustomer ? '고객' : '사장님'} 회원가입
          </h2>
          <p className="text-gray-600">
            {isCustomer ? '맛집 탐험을 시작해보세요' : '매장을 등록하고 관리해보세요'}
          </p>
        </div>

        {/* 진행 단계 */}
        <div className="max-w-md mx-auto w-full mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${i + 1 <= currentStep 
                    ? 'bg-hazelnut text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`
                    flex-1 h-1 mx-2
                    ${i + 1 < currentStep ? 'bg-hazelnut' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            {currentStep}단계 / {totalSteps}단계
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md p-8">
            
            {/* 1단계: 기본 정보 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-brown-900 mb-2">
                    기본 정보를 입력해주세요
                  </h3>
                  <p className="text-sm text-gray-600">
                    실명으로 정확히 입력해주세요
                  </p>
                </div>

                <Input
                  id="name"
                  placeholder="실명을 입력하세요"
                  value={formData.name}
                  onChange={(value) => handleInputChange('name', value)}
                  error={!!errors.name}
                  errorMessage={errors.name}
                />

                {isCustomer && (
                  <Input
                    id="nickname"
                    placeholder="닉네임을 입력하세요"
                    value={formData.nickname}
                    onChange={(value) => handleInputChange('nickname', value)}
                    error={!!errors.nickname}
                    errorMessage={errors.nickname}
                  />
                )}

                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  error={!!errors.phone}
                  errorMessage={errors.phone}
                />

                <Button
                  onClick={handleNext}
                  size="lg"
                  className="w-full"
                >
                  다음
                </Button>
              </div>
            )}

            {/* 2단계: 계정 정보 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-brown-900 mb-2">
                    계정 정보를 설정해주세요
                  </h3>
                  <p className="text-sm text-gray-600">
                    로그인에 사용할 정보입니다
                  </p>
                </div>

                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  error={!!errors.email}
                  errorMessage={errors.email}
                />

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호 (8자 이상)"
                    value={formData.password}
                    onChange={(value) => handleInputChange('password', value)}
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

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="비밀번호 확인"
                    value={formData.confirmPassword}
                    onChange={(value) => handleInputChange('confirmPassword', value)}
                    error={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* 약관 동의 */}
                <div className="space-y-3">
                  {errors.terms && (
                    <p className="text-sm text-red-600 mb-2">{errors.terms}</p>
                  )}
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAgreed}
                      onChange={(e) => handleInputChange('termsAgreed', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-hazelnut rounded border-gray-300 focus:ring-hazelnut"
                    />
                    <span className="text-sm text-brown-900">
                      <strong className="text-hazelnut">[필수]</strong> 이용약관에 동의합니다
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.privacyAgreed}
                      onChange={(e) => handleInputChange('privacyAgreed', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-hazelnut rounded border-gray-300 focus:ring-hazelnut"
                    />
                    <span className="text-sm text-brown-900">
                      <strong className="text-hazelnut">[필수]</strong> 개인정보 처리방침에 동의합니다
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.marketingAgreed}
                      onChange={(e) => handleInputChange('marketingAgreed', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-hazelnut rounded border-gray-300 focus:ring-hazelnut"
                    />
                    <span className="text-sm text-brown-900">
                      [선택] 마케팅 정보 수신에 동의합니다
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    size="lg"
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={isCustomer && currentStep === totalSteps ? handleSubmit : handleNext}
                    loading={isLoading}
                    size="lg"
                    className="flex-1"
                  >
                    {isCustomer ? '가입완료' : '다음'}
                  </Button>
                </div>
              </div>
            )}

            {/* 3단계: 매장 정보 (사장님만) */}
            {currentStep === 3 && !isCustomer && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-brown-900 mb-2">
                    매장 정보를 입력해주세요
                  </h3>
                  <p className="text-sm text-gray-600">
                    자리매에서 관리할 매장 정보입니다
                  </p>
                </div>

                <Input
                  id="storeName"
                  placeholder="매장명을 입력하세요"
                  value={formData.storeName || ''}
                  onChange={(value) => handleInputChange('storeName', value)}
                  error={!!errors.storeName}
                  errorMessage={errors.storeName}
                />

                <Input
                  id="storeAddress"
                  placeholder="매장 주소를 입력하세요"
                  value={formData.storeAddress || ''}
                  onChange={(value) => handleInputChange('storeAddress', value)}
                  error={!!errors.storeAddress}
                  errorMessage={errors.storeAddress}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    id="storePhone"
                    type="tel"
                    placeholder="매장 전화번호"
                    value={formData.storePhone || ''}
                    onChange={(value) => handleInputChange('storePhone', value)}
                    error={!!errors.storePhone}
                    errorMessage={errors.storePhone}
                  />
                  
                  <div>
                    <select
                      value={formData.storeCategory || ''}
                      onChange={(e) => handleInputChange('storeCategory', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-hazelnut focus:outline-none"
                    >
                      <option value="">업종 선택</option>
                      <option value="korean">한식</option>
                      <option value="chinese">중식</option>
                      <option value="japanese">일식</option>
                      <option value="western">양식</option>
                      <option value="cafe">카페</option>
                      <option value="chicken">치킨</option>
                      <option value="pizza">피자</option>
                      <option value="etc">기타</option>
                    </select>
                    {errors.storeCategory && (
                      <p className="text-red-600 text-sm mt-1">{errors.storeCategory}</p>
                    )}
                  </div>
                </div>

                <textarea
                  placeholder="매장 소개 및 특징을 간단히 작성해주세요 (선택)"
                  value={formData.storeDescription || ''}
                  onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-hazelnut focus:outline-none resize-none h-20"
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">📋 다음 단계</h4>
                  <p className="text-sm text-blue-800">
                    회원가입 완료 후 매장 승인 심사가 진행됩니다.<br />
                    승인까지 1-2일 소요되며, 승인 결과는 이메일로 안내드립니다.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    loading={isLoading}
                    size="lg"
                    className="flex-1"
                  >
                    매장 등록 신청
                  </Button>
                </div>
              </div>
            )}

          </Card>
        </div>

        {/* 로그인 링크 */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link 
              href="/auth/login"
              className="text-hazelnut font-medium hover:text-hazelnut-600 transition-colors"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}