'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, Button, Input } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'

interface PartnerFormData {
  // 개인 정보
  ownerName: string
  ownerPhone: string
  email: string
  password: string
  confirmPassword: string
  
  // 매장 정보
  storeName: string
  storePhone: string
  storeAddress: string
  storeDetailAddress: string
  storeCategory: string
  storeDescription: string
  businessNumber: string
  
  // 약관 동의
  termsAgreed: boolean
  privacyAgreed: boolean
  marketingAgreed: boolean
}

interface FormErrors {
  [key: string]: string
}

/**
 * 매장 파트너 등록 페이지
 * 경로: /partner/register
 */
export default function PartnerRegisterPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<PartnerFormData>({
    ownerName: '',
    ownerPhone: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    storePhone: '',
    storeAddress: '',
    storeDetailAddress: '',
    storeCategory: '',
    storeDescription: '',
    businessNumber: '',
    termsAgreed: false,
    privacyAgreed: false,
    marketingAgreed: false
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  
  const totalSteps = 3

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      // 개인 정보 검증
      if (!formData.ownerName.trim()) newErrors.ownerName = '대표자명을 입력해주세요'
      if (!formData.ownerPhone.trim()) newErrors.ownerPhone = '연락처를 입력해주세요'
      if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '올바른 이메일 형식이 아닙니다'
      }
      if (!formData.password) newErrors.password = '비밀번호를 입력해주세요'
      else if (formData.password.length < 8) newErrors.password = '비밀번호는 8자 이상이어야 합니다'
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
      }
    } else if (step === 2) {
      // 매장 정보 검증
      if (!formData.storeName.trim()) newErrors.storeName = '매장명을 입력해주세요'
      if (!formData.storePhone.trim()) newErrors.storePhone = '매장 연락처를 입력해주세요'
      if (!formData.storeAddress.trim()) newErrors.storeAddress = '매장 주소를 입력해주세요'
      if (!formData.storeCategory) newErrors.storeCategory = '업종을 선택해주세요'
      if (!formData.businessNumber.trim()) newErrors.businessNumber = '사업자 등록번호를 입력해주세요'
    } else if (step === 3) {
      // 약관 동의 검증
      if (!formData.termsAgreed) newErrors.terms = '이용약관에 동의해주세요'
      if (!formData.privacyAgreed) newErrors.privacy = '개인정보처리방침에 동의해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof PartnerFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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
      // Mock API 호출
      console.log('매장 등록 신청:', formData)
      
      showToast({
        type: 'success',
        title: '등록 신청 완료',
        message: '매장 등록 신청이 완료되었습니다. 승인까지 1-2일 소요됩니다.'
      })

      // 구독 프로모션 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/subscription/partner?welcome=true')
      }, 1500)

    } catch (error: any) {
      showToast({
        type: 'error',
        title: '등록 실패',
        message: error.message || '등록 중 오류가 발생했습니다'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: 'korean', label: '한식' },
    { value: 'chinese', label: '중식' },
    { value: 'japanese', label: '일식' },
    { value: 'western', label: '양식' },
    { value: 'cafe', label: '카페/디저트' },
    { value: 'chicken', label: '치킨/패스트푸드' },
    { value: 'pizza', label: '피자' },
    { value: 'pub', label: '술집/호프' },
    { value: 'etc', label: '기타' }
  ]

  return (
    <div className="min-h-screen bg-warm-gray">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-hazelnut hover:text-muted-blue transition-colors mb-4 inline-block">
                <h1 className="text-2xl font-bold">자리매</h1>
              </Link>
              <h2 className="text-xl font-bold text-brown-900">매장 파트너 등록</h2>
              <p className="text-gray-600 mt-1">자리매와 함께 매장을 성장시켜보세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 진행 단계 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${i + 1 <= currentStep ? 'bg-hazelnut text-white' : 'bg-gray-200 text-gray-500'}
                `}>
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`
                    flex-1 h-1 mx-4
                    ${i + 1 < currentStep ? 'bg-hazelnut' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {currentStep}단계 / {totalSteps}단계 - 
              {currentStep === 1 && ' 개인 정보'}
              {currentStep === 2 && ' 매장 정보'}
              {currentStep === 3 && ' 약관 동의'}
            </p>
          </div>
        </div>

        <Card className="p-8">
          {/* 1단계: 개인 정보 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-brown-900 mb-2">개인 정보</h3>
                <p className="text-gray-600">대표자 정보를 입력해주세요</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="대표자명"
                  placeholder="대표자명을 입력하세요"
                  value={formData.ownerName}
                  onChange={(value) => handleInputChange('ownerName', value)}
                  error={!!errors.ownerName}
                  errorMessage={errors.ownerName}
                />

                <Input
                  label="연락처"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.ownerPhone}
                  onChange={(value) => handleInputChange('ownerPhone', value)}
                  error={!!errors.ownerPhone}
                  errorMessage={errors.ownerPhone}
                />
              </div>

              <Input
                label="이메일"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={!!errors.email}
                errorMessage={errors.email}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="비밀번호"
                  type="password"
                  placeholder="8자 이상 입력하세요"
                  value={formData.password}
                  onChange={(value) => handleInputChange('password', value)}
                  error={!!errors.password}
                  errorMessage={errors.password}
                />

                <Input
                  label="비밀번호 확인"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={(value) => handleInputChange('confirmPassword', value)}
                  error={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext} className="px-8">
                  다음
                </Button>
              </div>
            </div>
          )}

          {/* 2단계: 매장 정보 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-brown-900 mb-2">매장 정보</h3>
                <p className="text-gray-600">운영하실 매장 정보를 입력해주세요</p>
              </div>

              <Input
                label="매장명"
                placeholder="매장명을 입력하세요"
                value={formData.storeName}
                onChange={(value) => handleInputChange('storeName', value)}
                error={!!errors.storeName}
                errorMessage={errors.storeName}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="매장 연락처"
                  type="tel"
                  placeholder="02-0000-0000"
                  value={formData.storePhone}
                  onChange={(value) => handleInputChange('storePhone', value)}
                  error={!!errors.storePhone}
                  errorMessage={errors.storePhone}
                />

                <div>
                  <label className="block text-sm font-medium text-brown-900 mb-2">
                    업종 *
                  </label>
                  <select
                    value={formData.storeCategory}
                    onChange={(e) => handleInputChange('storeCategory', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-hazelnut focus:outline-none"
                  >
                    <option value="">업종을 선택하세요</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.storeCategory && (
                    <p className="text-red-600 text-sm mt-1">{errors.storeCategory}</p>
                  )}
                </div>
              </div>

              <Input
                label="매장 주소"
                placeholder="도로명 주소를 입력하세요"
                value={formData.storeAddress}
                onChange={(value) => handleInputChange('storeAddress', value)}
                error={!!errors.storeAddress}
                errorMessage={errors.storeAddress}
              />

              <Input
                label="상세 주소"
                placeholder="상세 주소를 입력하세요 (선택)"
                value={formData.storeDetailAddress}
                onChange={(value) => handleInputChange('storeDetailAddress', value)}
              />

              <Input
                label="사업자 등록번호"
                placeholder="000-00-00000"
                value={formData.businessNumber}
                onChange={(value) => handleInputChange('businessNumber', value)}
                error={!!errors.businessNumber}
                errorMessage={errors.businessNumber}
              />

              <div>
                <label className="block text-sm font-medium text-brown-900 mb-2">
                  매장 소개 (선택)
                </label>
                <textarea
                  placeholder="매장의 특징이나 메뉴를 간단히 소개해주세요"
                  value={formData.storeDescription}
                  onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-hazelnut focus:outline-none resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePrevious} className="flex-1">
                  이전
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  다음
                </Button>
              </div>
            </div>
          )}

          {/* 3단계: 약관 동의 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-brown-900 mb-2">약관 동의</h3>
                <p className="text-gray-600">서비스 이용을 위한 약관에 동의해주세요</p>
              </div>

              <div className="space-y-4">
                {errors.terms && (
                  <p className="text-red-600 text-sm">{errors.terms}</p>
                )}
                
                <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.termsAgreed}
                    onChange={(e) => handleInputChange('termsAgreed', e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-hazelnut rounded border-gray-300 focus:ring-hazelnut"
                  />
                  <div>
                    <span className="text-brown-900 font-medium">
                      <span className="text-hazelnut">[필수]</span> 자리매 이용약관에 동의
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      서비스 이용에 관한 기본 약관입니다.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.privacyAgreed}
                    onChange={(e) => handleInputChange('privacyAgreed', e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-hazelnut rounded border-gray-300 focus:ring-hazelnut"
                  />
                  <div>
                    <span className="text-brown-900 font-medium">
                      <span className="text-hazelnut">[필수]</span> 개인정보 처리방침에 동의
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      개인정보 수집 및 이용에 관한 동의입니다.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.marketingAgreed}
                    onChange={(e) => handleInputChange('marketingAgreed', e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-hazelnut rounded border-gray-300 focus:ring-hazelnut"
                  />
                  <div>
                    <span className="text-brown-900 font-medium">
                      [선택] 마케팅 정보 수신 동의
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      새로운 서비스나 이벤트 소식을 받아보실 수 있습니다.
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">📋 다음 단계</h4>
                <p className="text-sm text-blue-800">
                  등록 신청 완료 후 자리매 운영팀에서 매장 정보를 검토합니다.<br />
                  승인까지 1-2영업일이 소요되며, 승인 결과는 이메일로 안내드립니다.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePrevious} className="flex-1">
                  이전
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  loading={isLoading}
                  className="flex-1 bg-hazelnut hover:bg-amber-600"
                >
                  매장 등록 신청
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* 로그인 링크 */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/" className="text-hazelnut font-medium hover:underline">
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}