'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button, Card } from '@/components/ui'

/**
 * 일반 사용자를 위한 구독 플랜 페이지
 * 경로: /subscription/user
 */
export default function UserSubscriptionPage() {
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === 'true'
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [showGroupFeature, setShowGroupFeature] = useState(false)
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(isWelcome)
  
  const plans = [
    {
      id: 'free',
      name: '무료',
      price: 0,
      priceText: '0원',
      description: '자리매와 함께 맛있는 여행을 시작하세요',
      features: [
        '기본 예약 기능',
        '매장 검색 및 리뷰 확인',
        '예약 내역 관리',
        '기본 알림 서비스'
      ],
      limitations: [
        'AI 도우미 기능 제한',
        '할인 혜택 제한',
        '고급 기능 이용 불가'
      ],
      icon: '🍽️',
      color: 'bg-gray-100',
      textColor: 'text-gray-700',
      recommended: false
    },
    {
      id: 'companion',
      name: '동행인',
      price: 1900,
      priceText: '1,900원',
      description: 'AI 도우미와 함께하는 스마트한 식사 경험',
      features: [
        '기본 기능 +',
        '🤖 예약 처리 AI 도우미 (돌쇠)',
        '📍 실시간 맞춤 식당 추천',
        '🎫 월간 할인 쿠폰 제공',
        '🔔 관심매장 알림 시스템',
        '⭐ 우선 예약 기회',
        '📊 개인 취향 분석'
      ],
      icon: '🤝',
      color: 'bg-hazelnut',
      textColor: 'text-white',
      recommended: true
    },
    {
      id: 'friend',
      name: '벗',
      price: 3900,
      priceText: '3,900원',
      description: '친구들과 함께하는 특별한 모임 플래너',
      features: [
        '동행인 기능 +',
        '👥 \'같이 갈 사람\' 공동 계획 기능',
        '🎉 특별 이벤트 우선 신청',
        '✨ 프로필 꾸미기 기능',
        '💎 단골 매장 특별 혜택',
        '🎁 친구 초대 보상',
        '🏆 특별 칭호 및 뱃지',
        '📱 프리미엄 앱 테마'
      ],
      icon: '👑',
      color: 'bg-muted-blue',
      textColor: 'text-white',
      recommended: false,
      premium: true,
      groupFeature: true
    }
  ]

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleSubscribe = (planId: string) => {
    // TODO: 구독 처리 로직
    console.log('구독 신청:', planId)
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brown-900">자리매 프리미엄</h1>
              <p className="text-lg text-gray-600 mt-2">더 특별한 식사 경험을 위한 맞춤 서비스</p>
            </div>
            <Link href="/" className="text-hazelnut hover:text-muted-blue transition-colors">
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 신규 가입 환영 배너 */}
        {showWelcomeBanner && (
          <div className="bg-gradient-to-r from-hazelnut to-muted-blue text-white rounded-2xl p-8 mb-12 relative overflow-hidden">
            <button
              onClick={() => setShowWelcomeBanner(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🎉 자리매에 오신 것을 환영합니다!</h2>
              <p className="text-xl mb-6 opacity-90">
                회원가입을 완료하셨네요! 이제 자리매만의 특별한 기능들을 경험해보세요.
              </p>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">🎁 신규 가입 혜택</h3>
                <p className="text-sm opacity-90">
                  첫 구독 시 <strong>20% 할인</strong> + <strong>첫 달 무료</strong> 혜택을 받으세요!
                </p>
              </div>
              <p className="text-sm opacity-80">
                무료 플랜으로도 충분히 자리매를 경험할 수 있지만, 
                프리미엄 기능들로 더욱 편리한 식사 경험을 만들어보세요.
              </p>
            </div>
            {/* 배경 장식 */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          </div>
        )}

        {/* 소개 섹션 */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-brown-900 mb-4">
            나에게 맞는 식사 스타일을 선택하세요
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            혼자 먹어도 맛있게, 함께 먹으면 더 맛있게! 
            자리매 프리미엄으로 일상의 식사가 특별한 경험이 됩니다.
          </p>
        </div>

        {/* 플랜 카드들 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all duration-300 hover:scale-105 cursor-pointer ${
                selectedPlan === plan.id ? 'ring-4 ring-hazelnut ring-opacity-50' : ''
              } ${plan.premium ? 'border-2 border-muted-blue' : ''}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-hazelnut text-white px-4 py-1 rounded-full text-sm font-medium">
                    인기
                  </span>
                </div>
              )}
              
              {plan.premium && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-muted-blue text-white px-3 py-1 rounded-full text-xs font-medium">
                    PREMIUM
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-full ${plan.color} mx-auto mb-4 flex items-center justify-center`}>
                  <span className="text-3xl">{plan.icon}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-brown-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-brown-900">{plan.priceText}</span>
                  {plan.price > 0 && <span className="text-gray-500 ml-1">/월</span>}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-hazelnut rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations && (
                <div className="border-t pt-4 mb-6">
                  <p className="text-sm text-gray-500 mb-2">제한사항:</p>
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center gap-3 mb-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              {plan.groupFeature && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-muted-blue font-medium mb-2">👥 그룹 혜택</p>
                  <p className="text-xs text-gray-600">
                    '벗' 구독자 1명만 있어도 그룹 전체가 '같이 갈 사람' 기능을 이용할 수 있어요!
                  </p>
                </div>
              )}

              <Button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full ${
                  plan.id === 'free' 
                    ? 'bg-gray-500 hover:bg-gray-600' 
                    : plan.premium 
                      ? 'bg-muted-blue hover:bg-blue-600'
                      : 'bg-hazelnut hover:bg-amber-600'
                } text-white font-semibold py-3 rounded-xl transition-colors`}
              >
                {plan.id === 'free' ? '무료로 시작하기' : '구독하기'}
              </Button>
            </Card>
          ))}
        </div>

        {/* 특별 기능 소개 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
          <h3 className="text-2xl font-bold text-brown-900 mb-8 text-center">특별한 기능들</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-hazelnut rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-semibold text-brown-900 mb-2">AI 도우미 돌쇠</h4>
              <p className="text-sm text-gray-600">
                예약부터 추천까지, 스마트한 AI가 당신의 식사를 도와드려요
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="font-semibold text-brown-900 mb-2">같이 갈 사람</h4>
              <p className="text-sm text-gray-600">
                친구들과 함께 계획하고 예약하는 공동 계획 기능
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-hazelnut rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h4 className="font-semibold text-brown-900 mb-2">단골 시스템</h4>
              <p className="text-sm text-gray-600">
                자주 가는 매장에서 특별한 혜택과 개인 맞춤 서비스
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-semibold text-brown-900 mb-2">등급 시스템</h4>
              <p className="text-sm text-gray-600">
                활동할수록 더 많은 혜택! 방랑자부터 터줏대감까지
              </p>
            </div>
          </div>
        </div>

        {/* 사용자 후기 */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-brown-900 mb-8 text-center">사용자 후기</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-hazelnut rounded-full flex items-center justify-center text-white font-bold">
                  김
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-brown-900">김민지님</p>
                  <p className="text-sm text-gray-500">동행인 구독자</p>
                </div>
              </div>
              <p className="text-gray-600">
                "돌쇠가 추천해주는 맛집이 정말 취향 저격이에요! 
                매번 어디 갈지 고민하지 않아도 되니까 너무 편해요."
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-muted-blue rounded-full flex items-center justify-center text-white font-bold">
                  이
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-brown-900">이서준님</p>
                  <p className="text-sm text-gray-500">벗 구독자</p>
                </div>
              </div>
              <p className="text-gray-600">
                "친구들과 '같이 갈 사람' 기능 쓰면서 모임 계획하기가 훨씬 쉬워졌어요. 
                다들 만족도 높아요!"
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-hazelnut rounded-full flex items-center justify-center text-white font-bold">
                  박
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-brown-900">박지원님</p>
                  <p className="text-sm text-gray-500">벗 구독자</p>
                </div>
              </div>
              <p className="text-gray-600">
                "단골 매장에서 제가 좋아하는 메뉴가 바로 위에 뜨고, 
                사장님도 저를 기억해주셔서 기분 좋아요."
              </p>
            </Card>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-brown-900 mb-8 text-center">자주 묻는 질문</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. '같이 갈 사람' 기능은 어떻게 작동하나요?</h4>
              <p className="text-gray-600 mb-6">
                '벗' 구독자가 그룹을 만들면, 그룹 멤버들이 함께 식당을 선택하고 예약할 수 있어요. 
                투표 기능도 지원합니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. AI 도우미는 얼마나 정확한가요?</h4>
              <p className="text-gray-600 mb-6">
                개인 취향과 이용 패턴을 학습해서 점점 더 정확해져요. 
                만족도 95% 이상의 추천 정확도를 자랑합니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. 구독 해지 후 데이터는 어떻게 되나요?</h4>
              <p className="text-gray-600 mb-6">
                기본적인 예약 내역은 유지되고, 프리미엄 데이터는 30일간 보관 후 삭제됩니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. 가족 요금제는 있나요?</h4>
              <p className="text-gray-600">
                현재 개인 요금제만 제공하지만, 가족 요금제를 준비 중이에요. 
                곧 만나보실 수 있을 거예요!
              </p>
            </div>
          </div>
        </div>

        {/* 문의하기 섹션 */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">더 궁금한 것이 있으시면 언제든 문의하세요</p>
          <div className="space-x-4">
            <Button className="bg-hazelnut hover:bg-amber-600 text-white px-6 py-3 rounded-xl">
              카카오톡 상담
            </Button>
            <Button className="bg-muted-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl">
              이메일 문의
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}