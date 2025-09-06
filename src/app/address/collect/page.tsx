'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, Button, Input } from '@/components/ui'

interface AddressData {
  zipCode: string
  address: string
  detailAddress: string
  latitude?: number
  longitude?: number
}

interface FormErrors {
  zipCode?: string
  address?: string
  detailAddress?: string
}

/**
 * 주소 수집 페이지 (고객 회원가입 후)
 * HTML 시안: jarimae_address_collection.html
 * 경로: /address/collect
 */
export default function AddressCollectionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  const [addressData, setAddressData] = useState<AddressData>({
    zipCode: '',
    address: '',
    detailAddress: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!addressData.zipCode) {
      newErrors.zipCode = '우편번호를 입력해주세요'
    } else if (!/^\d{5}$/.test(addressData.zipCode)) {
      newErrors.zipCode = '올바른 우편번호를 입력해주세요 (5자리 숫자)'
    }

    if (!addressData.address) {
      newErrors.address = '주소를 입력해주세요'
    } else if (addressData.address.length < 10) {
      newErrors.address = '정확한 주소를 입력해주세요'
    }

    if (!addressData.detailAddress) {
      newErrors.detailAddress = '상세주소를 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof AddressData, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }))
    
    // 에러 메시지 초기화
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // 현재 위치 기반 주소 검색
  const handleLocationSearch = async () => {
    setIsSearchingLocation(true)
    
    try {
      if (!navigator.geolocation) {
        alert('위치 서비스를 지원하지 않는 브라우저입니다.')
        return
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      })

      const { latitude, longitude } = position.coords

      // TODO: 실제 역지오코딩 API 호출 (예: Kakao Map API)
      console.log('Current location:', { latitude, longitude })
      
      // 임시로 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 임시 주소 데이터 (실제로는 API에서 받아옴)
      setAddressData(prev => ({
        ...prev,
        zipCode: '06292',
        address: '서울특별시 강남구 테헤란로 123',
        latitude,
        longitude
      }))

      alert('현재 위치 기반으로 주소를 찾았습니다!')

    } catch (error) {
      console.error('Location error:', error)
      alert('위치를 찾을 수 없습니다. 수동으로 입력해주세요.')
    } finally {
      setIsSearchingLocation(false)
    }
  }

  // 우편번호 검색
  const handleZipCodeSearch = () => {
    // TODO: Daum 우편번호 서비스 연동
    console.log('우편번호 검색')
    alert('우편번호 검색 기능은 준비 중입니다.')
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // TODO: 실제 주소 등록 API 호출
      console.log('Address data:', addressData)
      
      // 임시로 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 회원가입 완료 후 메인 페이지로 이동
      router.push('/')
    } catch (error) {
      console.error('Address save error:', error)
      alert('주소 등록 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    // 주소 등록을 건너뛰고 메인 페이지로 이동
    router.push('/')
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
            주소 등록
          </h2>
          <p className="text-gray-600">
            맞춤 맛집 추천을 위해 주소를 등록해주세요
          </p>
        </div>

        {/* 진행 표시 */}
        <div className="max-w-md mx-auto w-full mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                ✓
              </div>
              <div className="w-16 h-1 bg-green-500 mx-2" />
              <div className="w-8 h-8 bg-hazelnut rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
              <div className="w-16 h-1 bg-gray-200 mx-2" />
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                3
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            2단계 / 3단계 - 거의 다 끝났어요!
          </p>
        </div>

        {/* 주소 입력 카드 */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md p-8">
            <div className="space-y-6">
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-hazelnut-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-hazelnut" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-brown-900 mb-2">
                  어디에 살고 계신가요?
                </h3>
                <p className="text-sm text-gray-600">
                  내 위치 기반으로 맛집을 추천해드려요
                </p>
              </div>

              {/* 현재 위치 찾기 버튼 */}
              <Button
                onClick={handleLocationSearch}
                loading={isSearchingLocation}
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {isSearchingLocation ? '위치 찾는 중...' : '현재 위치로 주소 찾기'}
              </Button>

              {/* 구분선 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는 직접 입력</span>
                </div>
              </div>

              {/* 우편번호 */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    id="zipCode"
                    placeholder="우편번호"
                    value={addressData.zipCode}
                    onChange={(value) => handleInputChange('zipCode', value)}
                    error={!!errors.zipCode}
                    errorMessage={errors.zipCode}
                    maxLength={5}
                  />
                </div>
                <Button
                  onClick={handleZipCodeSearch}
                  variant="outline"
                  className="px-6"
                >
                  검색
                </Button>
              </div>

              {/* 기본 주소 */}
              <Input
                id="address"
                placeholder="기본 주소 (예: 서울특별시 강남구 테헤란로 123)"
                value={addressData.address}
                onChange={(value) => handleInputChange('address', value)}
                error={!!errors.address}
                errorMessage={errors.address}
              />

              {/* 상세 주소 */}
              <Input
                id="detailAddress"
                placeholder="상세 주소 (예: 101동 502호)"
                value={addressData.detailAddress}
                onChange={(value) => handleInputChange('detailAddress', value)}
                error={!!errors.detailAddress}
                errorMessage={errors.detailAddress}
              />

              {/* 버튼들 */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  나중에 하기
                </Button>
                <Button
                  onClick={handleSubmit}
                  loading={isLoading}
                  size="lg"
                  className="flex-1"
                >
                  완료
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 안내 메시지 */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-gray-600">
            💡 주소를 등록하면 주변 맛집을 더 정확히 추천해드려요
          </p>
          <p className="text-xs text-gray-500">
            개인정보는 안전하게 보호되며, 언제든지 수정할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  )
}