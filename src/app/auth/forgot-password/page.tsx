'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, Button, Input } from '@/components/ui'

interface FormData {
  contact: string
  method: 'email' | 'sms'
}

interface FormErrors {
  contact?: string
}

/**
 * 비밀번호 찾기 페이지
 * 경로: /auth/forgot-password
 */
export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1: 연락처 입력, 2: 인증 완료
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    contact: '',
    method: 'sms'
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.contact) {
      newErrors.contact = formData.method === 'email' 
        ? '이메일을 입력해주세요' 
        : '전화번호를 입력해주세요'
    } else {
      if (formData.method === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.contact)) {
          newErrors.contact = '올바른 이메일을 입력해주세요'
        }
      } else {
        const phoneRegex = /^010-\d{4}-\d{4}$/
        if (!phoneRegex.test(formData.contact)) {
          newErrors.contact = '올바른 전화번호를 입력해주세요 (010-0000-0000)'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, contact: value }))
    
    // 에러 메시지 초기화
    if (errors.contact) {
      setErrors(prev => ({ ...prev, contact: undefined }))
    }
  }

  const handleMethodChange = (method: 'email' | 'sms') => {
    setFormData(prev => ({ 
      ...prev, 
      method,
      contact: '' // 방법 변경 시 입력값 초기화
    }))
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // TODO: 실제 비밀번호 재설정 API 호출
      console.log('Reset password request:', formData)
      
      // 임시로 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 2단계로 이동 (인증 완료)
      setStep(2)
    } catch (error) {
      console.error('Password reset error:', error)
      setErrors({ 
        contact: formData.method === 'email' 
          ? '등록되지 않은 이메일입니다'
          : '등록되지 않은 전화번호입니다'
      })
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
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 group">
            <h1 className="text-4xl md:text-5xl font-bold text-hazelnut transition-transform group-hover:scale-105">
              자리매
            </h1>
          </Link>
          
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-2">
            {step === 1 ? '비밀번호 찾기' : '인증 완료'}
          </h2>
          <p className="text-gray-600">
            {step === 1 
              ? '가입 시 사용한 정보를 입력해주세요' 
              : '비밀번호 재설정 링크를 전송했습니다'
            }
          </p>
        </div>

        {/* 폼 카드 */}
        <Card className="w-full max-w-md p-8">
          {step === 1 ? (
            <div className="space-y-6">
              {/* 인증 방법 선택 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-brown-900">
                  인증 방법 선택
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleMethodChange('sms')}
                    className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.method === 'sms'
                        ? 'border-hazelnut bg-hazelnut-50 text-hazelnut'
                        : 'border-gray-300 text-gray-700 hover:border-hazelnut'
                    }`}
                  >
                    📱 SMS 인증
                  </button>
                  <button
                    onClick={() => handleMethodChange('email')}
                    className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.method === 'email'
                        ? 'border-hazelnut bg-hazelnut-50 text-hazelnut'
                        : 'border-gray-300 text-gray-700 hover:border-hazelnut'
                    }`}
                  >
                    ✉️ 이메일 인증
                  </button>
                </div>
              </div>

              <Input
                id="contact"
                type={formData.method === 'email' ? 'email' : 'tel'}
                placeholder={
                  formData.method === 'email' 
                    ? '가입 시 사용한 이메일을 입력하세요'
                    : '가입 시 사용한 전화번호를 입력하세요 (010-0000-0000)'
                }
                value={formData.contact}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                error={!!errors.contact}
                errorMessage={errors.contact}
              />

              <Button
                onClick={handleSubmit}
                loading={isLoading}
                size="lg"
                className="w-full"
              >
                {formData.method === 'email' ? '이메일 전송' : 'SMS 전송'}
              </Button>
            </div>
          ) : (
            // 2단계: 전송 완료 화면
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brown-900 mb-2">
                  전송 완료!
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {formData.method === 'email' 
                    ? `${formData.contact}으로 비밀번호 재설정 링크를 전송했습니다.`
                    : `${formData.contact}으로 인증번호를 전송했습니다.`
                  }
                  <br />
                  {formData.method === 'email' 
                    ? '이메일을 확인하고 링크를 클릭해주세요.'
                    : '인증번호를 입력하여 비밀번호를 재설정하세요.'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  다시 시도
                </Button>

                <Link href="/auth/login" className="block">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full"
                  >
                    로그인으로 돌아가기
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        {/* 하단 링크들 */}
        {step === 1 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              계정이 생각나셨나요?{' '}
              <Link 
                href="/auth/login"
                className="text-hazelnut font-medium hover:text-hazelnut-600 transition-colors"
              >
                로그인하기
              </Link>
            </p>
          </div>
        )}

        {/* 고객센터 링크 */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            문제가 계속될 경우{' '}
            <Link 
              href="/support" 
              className="text-hazelnut hover:text-hazelnut-600 transition-colors"
            >
              고객센터
            </Link>
            로 문의해주세요
          </p>
        </div>
      </div>
    </div>
  )
}