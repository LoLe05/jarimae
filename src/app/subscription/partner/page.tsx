'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button, Card } from '@/components/ui'

/**
 * 매장 관리자를 위한 구독 플랜 페이지
 * 경로: /subscription/partner
 */
export default function PartnerSubscriptionPage() {
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === 'true'
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(isWelcome)
  
  const plans = [
    {
      id: 'free',
      name: '무료',
      price: 0,
      priceText: '0원',
      description: '기본적인 매장 관리를 시작하세요',
      features: [
        '기본 예약 관리',
        '간단한 예약 현황 조회',
        '매장 기본 정보 등록',
        '고객 리뷰 확인'
      ],
      limitations: [
        '고급 분석 기능 제한',
        '프로모션 알림 제한',
        '기본 고객 지원만 제공'
      ],
      color: 'bg-gray-100',
      textColor: 'text-gray-700',
      recommended: false
    },
    {
      id: 'shortcut',
      name: '지름길',
      price: 19900,
      priceText: '19,900원',
      description: '효율적인 매장 운영을 위한 필수 도구들',
      features: [
        '기본 기능 +',
        '🔍 고급 데이터 분석 리포트',
        '💳 예치금 결제 시스템 연동',
        '📢 월 1회 프로모션 알림',
        '🚫 블랙리스트 관리 시스템',
        '📊 매출 통계 및 트렌드 분석'
      ],
      color: 'bg-hazelnut',
      textColor: 'text-white',
      recommended: true
    },
    {
      id: 'premium',
      name: '꽃길',
      price: 39900,
      priceText: '39,900원',
      description: 'AI 비서와 함께하는 스마트한 매장 운영',
      features: [
        '지름길 기능 +',
        '🤖 AI 기반 사장님 비서 (주모)',
        '⏱️ 실시간 웨이팅 시스템',
        '⭐ 메인 페이지 노출 기회',
        '👥 전담 고객 지원팀',
        '🎯 맞춤형 마케팅 제안',
        '📈 경쟁사 분석 리포트',
        '🔔 실시간 알림 시스템'
      ],
      color: 'bg-muted-blue',
      textColor: 'text-white',
      recommended: false,
      premium: true
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
              <h1 className="text-3xl font-bold text-brown-900">매장 관리자 구독</h1>
              <p className="text-lg text-gray-600 mt-2">자리매와 함께 매장을 더욱 스마트하게 운영하세요</p>
            </div>
            <Link href="/" className="text-hazelnut hover:text-muted-blue transition-colors">
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 매장 가입 환영 배너 */}
        {showWelcomeBanner && (
          <div className="bg-gradient-to-r from-muted-blue to-hazelnut text-white rounded-2xl p-8 mb-12 relative overflow-hidden">
            <button
              onClick={() => setShowWelcomeBanner(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🎉 자리매 파트너로 오신 것을 환영합니다!</h2>
              <p className="text-xl mb-6 opacity-90">
                매장 등록 신청이 완료되었습니다. 승인 완료까지 1-2일 소요됩니다.
              </p>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">🎁 신규 파트너 혜택</h3>
                <p className="text-sm opacity-90">
                  첫 구독 시 <strong>3개월 50% 할인</strong> + <strong>AI 비서 무료 체험</strong> 혜택!
                </p>
              </div>
              <p className="text-sm opacity-80">
                승인 완료 후 바로 자리매의 강력한 매장 관리 도구들을 사용해보세요. 
                수수료는 최소화하고, 매장 운영 효율은 최대화할 수 있습니다.
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
            매장 규모와 목표에 맞는 플랜을 선택하세요
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            자리매의 구독 서비스는 수수료를 최소화하고, 
            매장주님께 정말 필요한 기능들에 집중합니다. 
            작은 카페부터 대형 레스토랑까지, 모든 규모의 매장을 지원합니다.
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
                    추천
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
                  <span className={`text-2xl font-bold ${plan.textColor}`}>
                    {plan.name.charAt(0)}
                  </span>
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

        {/* FAQ 섹션 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-brown-900 mb-8 text-center">자주 묻는 질문</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. 구독 해지는 언제든 가능한가요?</h4>
              <p className="text-gray-600 mb-6">
                네, 언제든 구독을 해지할 수 있습니다. 해지 후에도 해당 월 말일까지는 유료 기능을 이용할 수 있습니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. 플랜 변경은 어떻게 하나요?</h4>
              <p className="text-gray-600 mb-6">
                매장 관리 페이지에서 언제든 플랜을 업그레이드하거나 다운그레이드할 수 있습니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. AI 비서는 어떤 도움을 주나요?</h4>
              <p className="text-gray-600 mb-6">
                매출 분석, 고객 트렌드 파악, 운영 개선 제안 등 데이터 기반의 인사이트를 제공합니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. 결제 방법은 무엇인가요?</h4>
              <p className="text-gray-600">
                신용카드, 계좌이체, 가상계좌 등 다양한 결제 수단을 지원합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 문의하기 섹션 */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">더 궁금한 것이 있으시거나 맞춤 상담이 필요하시면</p>
          <Button className="bg-muted-blue hover:bg-blue-600 text-white px-8 py-3 rounded-xl">
            전문 상담 받기
          </Button>
        </div>
      </div>
    </div>
  )
}