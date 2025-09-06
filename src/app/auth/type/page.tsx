'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, Button } from '@/components/ui'
import type { UserType } from '@/types'

/**
 * 회원 유형 선택 페이지
 * HTML 시안: jarimae_user_type_selection.html
 * 경로: /auth/type
 */
export default function UserTypeSelectionPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const userTypes = [
    {
      type: 'CUSTOMER' as UserType,
      title: '고객님',
      subtitle: '맛집을 찾고 예약하고 싶어요',
      description: [
        '🔍 내 주변 맛집 검색',
        '📅 간편한 예약 시스템',
        '⭐ 리뷰 작성 및 관리',
        '🎁 멤버십 혜택'
      ],
      color: 'bg-hazelnut',
      hoverColor: 'hover:bg-hazelnut-600'
    },
    {
      type: 'OWNER' as UserType,
      title: '사장님',
      subtitle: '내 매장을 등록하고 관리하고 싶어요',
      description: [
        '🏪 매장 등록 및 관리',
        '📊 예약 현황 실시간 확인',
        '💰 매출 및 정산 관리',
        '📈 고객 분석 리포트'
      ],
      color: 'bg-muted-blue',
      hoverColor: 'hover:bg-muted-blue-600'
    }
  ]

  const handleTypeSelect = (type: UserType) => {
    setSelectedType(type)
  }

  const handleContinue = async () => {
    if (!selectedType) return

    setIsLoading(true)
    
    try {
      if (selectedType === 'OWNER') {
        // 사장님인 경우 매장 등록 페이지로 이동
        await router.push('/partner/register')
      } else {
        // 고객인 경우 일반 회원가입 페이지로 이동
        await router.push(`/auth/signup?type=${selectedType.toLowerCase()}`)
      }
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-gray relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 animated-bg opacity-30" />
      
      {/* 메인 컨테이너 */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        
        {/* 로고 및 제목 섹션 */}
        <div className="text-center mb-12">
          <Link 
            href="/"
            className="inline-block mb-8 group"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-hazelnut transition-transform group-hover:scale-105">
              자리매
            </h1>
          </Link>
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-brown-900">
              어떻게 이용하실 건가요?
            </h2>
            <p className="text-lg text-gray-600">
              자리매를 이용할 방법을 선택해주세요
            </p>
          </div>
        </div>

        {/* 회원 유형 선택 카드들 */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {userTypes.map((userType) => (
            <Card
              key={userType.type}
              clickable
              onClick={() => handleTypeSelect(userType.type)}
              className={`
                relative p-8 text-center transition-all duration-300 cursor-pointer
                ${selectedType === userType.type 
                  ? 'ring-4 ring-hazelnut ring-opacity-50 shadow-brand-lg transform scale-105' 
                  : 'hover:shadow-brand hover:transform hover:scale-102'
                }
              `}
            >
              {/* 선택 인디케이터 */}
              {selectedType === userType.type && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-hazelnut rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              )}

              {/* 아이콘 */}
              <div className={`
                inline-flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl font-bold mb-6
                ${userType.color}
              `}>
                {userType.type === 'CUSTOMER' ? '🍽️' : '🏪'}
              </div>

              {/* 제목 및 부제목 */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-brown-900 mb-2">
                  {userType.title}
                </h3>
                <p className="text-gray-600">
                  {userType.subtitle}
                </p>
              </div>

              {/* 특징 리스트 */}
              <ul className="space-y-3 text-left">
                {userType.description.map((feature, index) => (
                  <li 
                    key={index}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <span className="flex-shrink-0 w-2 h-2 bg-hazelnut rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* 선택 표시 */}
              <div className={`
                mt-6 py-2 px-4 rounded-full text-sm font-medium transition-colors
                ${selectedType === userType.type
                  ? 'bg-hazelnut text-white'
                  : 'bg-gray-100 text-gray-500'
                }
              `}>
                {selectedType === userType.type ? '✓ 선택됨' : '선택하기'}
              </div>
            </Card>
          ))}
        </div>

        {/* 계속하기 버튼 */}
        <div className="w-full max-w-md">
          <Button
            onClick={handleContinue}
            disabled={!selectedType}
            loading={isLoading}
            size="lg"
            className="w-full"
          >
            {selectedType ? '계속하기' : '유형을 선택해주세요'}
          </Button>
        </div>

        {/* 이미 계정이 있는 경우 */}
        <div className="mt-8 text-center">
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

        {/* 하단 안내 */}
        <div className="mt-12 text-center text-sm text-gray-500 max-w-2xl">
          <p>
            자리매는 소상공인과 고객 모두를 위한 서비스입니다.<br />
            언제든지 고객센터로 문의해주세요. <strong>1588-0000</strong>
          </p>
        </div>
      </div>
    </div>
  )
}