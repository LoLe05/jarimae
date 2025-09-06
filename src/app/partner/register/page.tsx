'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, Button, Input } from '@/components/ui'

interface StoreFormData {
  storeName: string
  storePhone: string
  storeAddress: string
  storeDetailAddress: string
  storeCategory: string
  storeDescription: string
  businessNumber: string
  ownerName: string
  ownerPhone: string
  ownerEmail: string
}

interface StoreFormErrors {
  [key: string]: string
}

/**
 * 매장 등록 신청 페이지
 * HTML 시안: jarimae_partner_signup.html
 * 경로: /partner/register
 */
export default function PartnerRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<StoreFormData>({
    storeName: '',
    storePhone: '',
    storeAddress: '',
    storeDetailAddress: '',
    storeCategory: '',
    storeDescription: '',
    businessNumber: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: ''
  })
  const [errors, setErrors] = useState<StoreFormErrors>({})

  const categories = [
    '한식', '중식', '일식', '양식', '치킨', '피자', '햄버거', '카페', '디저트', '술집', '기타'
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: StoreFormErrors = {}

    if (step === 1) {
      // 매장 기본 정보
      if (!formData.storeName.trim()) {
        newErrors.storeName = '매장명을 입력해주세요'
      }
      if (!formData.storePhone.trim()) {
        newErrors.storePhone = '매장 전화번호를 입력해주세요'
      }
      if (!formData.storeAddress.trim()) {
        newErrors.storeAddress = '매장 주소를 입력해주세요'
      }
      if (!formData.storeCategory) {
        newErrors.storeCategory = '매장 카테고리를 선택해주세요'
      }
    } else if (step === 2) {
      // 사업자 정보
      if (!formData.businessNumber.trim()) {
        newErrors.businessNumber = '사업자등록번호를 입력해주세요'
      }
      if (!formData.ownerName.trim()) {
        newErrors.ownerName = '대표자명을 입력해주세요'
      }
      if (!formData.ownerPhone.trim()) {
        newErrors.ownerPhone = '대표자 전화번호를 입력해주세요'
      }
      if (!formData.ownerEmail.trim()) {
        newErrors.ownerEmail = '이메일을 입력해주세요'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof StoreFormData, value: string) => {
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

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return

    setIsLoading(true)
    
    try {
      // TODO: 실제 매장 등록 API 호출
      console.log('Store registration data:', formData)
      
      // 임시로 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 신청 완료 페이지로 이동
      router.push('/partner/application/success')
    } catch (error) {
      console.error('Store registration error:', error)
      setErrors({ submit: '매장 등록 중 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-brown-900 mb-2">
                매장 정보를 입력해주세요
              </h2>
              <p className="text-gray-600">
                자리매에서 사용할 매장 기본 정보를 등록합니다
              </p>
            </div>

            <Input
              placeholder="매장명"
              value={formData.storeName}
              onChange={(value) => handleInputChange('storeName', value)}
              error={!!errors.storeName}
              errorMessage={errors.storeName}
            />

            <Input
              placeholder="매장 전화번호 (예: 02-1234-5678)"
              value={formData.storePhone}
              onChange={(value) => handleInputChange('storePhone', value)}
              error={!!errors.storePhone}
              errorMessage={errors.storePhone}
            />

            <Input
              placeholder="매장 주소"
              value={formData.storeAddress}
              onChange={(value) => handleInputChange('storeAddress', value)}
              error={!!errors.storeAddress}
              errorMessage={errors.storeAddress}
            />

            <Input
              placeholder="상세 주소 (선택사항)"
              value={formData.storeDetailAddress}
              onChange={(value) => handleInputChange('storeDetailAddress', value)}
            />

            <div>
              <label className="block text-sm font-medium text-brown-900 mb-2">
                매장 카테고리
              </label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleInputChange('storeCategory', category)}
                    className={`p-3 rounded-lg border transition-colors text-sm font-medium ${
                      formData.storeCategory === category
                        ? 'bg-hazelnut text-white border-hazelnut'
                        : 'bg-white text-brown-900 border-gray-200 hover:border-hazelnut'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {errors.storeCategory && (
                <p className="mt-1 text-sm text-red-600">{errors.storeCategory}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-900 mb-2">
                매장 소개 (선택사항)
              </label>
              <textarea
                rows={4}
                placeholder="매장의 특징이나 메뉴에 대해 간단히 소개해주세요"
                value={formData.storeDescription}
                onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hazelnut focus:border-transparent resize-none"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-brown-900 mb-2">
                사업자 정보를 입력해주세요
              </h2>
              <p className="text-gray-600">
                매장 승인을 위한 사업자 정보를 등록합니다
              </p>
            </div>

            <Input
              placeholder="사업자등록번호 (예: 123-45-67890)"
              value={formData.businessNumber}
              onChange={(value) => handleInputChange('businessNumber', value)}
              error={!!errors.businessNumber}
              errorMessage={errors.businessNumber}
            />

            <Input
              placeholder="대표자명"
              value={formData.ownerName}
              onChange={(value) => handleInputChange('ownerName', value)}
              error={!!errors.ownerName}
              errorMessage={errors.ownerName}
            />

            <Input
              type="tel"
              placeholder="대표자 전화번호 (예: 010-1234-5678)"
              value={formData.ownerPhone}
              onChange={(value) => handleInputChange('ownerPhone', value)}
              error={!!errors.ownerPhone}
              errorMessage={errors.ownerPhone}
            />

            <Input
              type="email"
              placeholder="이메일 주소"
              value={formData.ownerEmail}
              onChange={(value) => handleInputChange('ownerEmail', value)}
              error={!!errors.ownerEmail}
              errorMessage={errors.ownerEmail}
            />

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-brown-900 mb-2">📋 필요 서류 안내</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 사업자등록증 사본</li>
                <li>• 매장 사진 (외관, 내부)</li>
                <li>• 메뉴판 또는 메뉴 리스트</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                ※ 추가 서류는 승인 과정에서 개별 안내드립니다
              </p>
            </div>

            {errors.submit && (
              <p className="text-sm text-red-600 text-center">{errors.submit}</p>
            )}
          </div>
        )

      default:
        return null
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
          
          {/* 진행 상태 */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-hazelnut text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`h-0.5 w-12 ${currentStep >= 2 ? 'bg-hazelnut' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-hazelnut text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* 폼 카드 */}
        <Card className="w-full max-w-2xl p-8">
          {renderStepContent()}

          {/* 버튼 영역 */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <Button
                onClick={handlePrev}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                이전
              </Button>
            )}
            
            {currentStep < 2 ? (
              <Button
                onClick={handleNext}
                size="lg"
                className="flex-1"
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isLoading}
                size="lg"
                className="flex-1"
              >
                매장 등록 신청
              </Button>
            )}
          </div>
        </Card>

        {/* 뒤로가기 링크 */}
        <div className="text-center mt-6">
          <Link 
            href="/auth/type"
            className="text-sm text-gray-600 hover:text-hazelnut transition-colors"
          >
            ← 회원 유형 선택으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}