'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button, Card } from '@/components/ui'

/**
 * 자리매 등급 시스템 소개 페이지
 * 경로: /levels
 */
export default function LevelsPage() {
  const [activeTab, setActiveTab] = useState<'store' | 'user'>('user')

  // 매장 등급 시스템 (어울림터)
  const storeLevels = [
    {
      name: '공터',
      color: '#b0b0aa',
      bgColor: 'bg-gray-400',
      icon: '🚫',
      description: '신뢰를 잃은 매장',
      criteria: [
        '평균 리뷰 점수 2.5점 미만',
        '노쇼 신고 누적 3회 이상'
      ],
      benefits: '검색 순위 하락, 경고 배지 노출',
      penalty: true
    },
    {
      name: '하제마당',
      color: '#b1967b',
      bgColor: 'bg-hazelnut',
      icon: '🏠',
      description: '자리매와 함께 더 나은 내일을 준비하는 매장',
      criteria: [
        '공터에 해당하지 않는 모든 신규/기존 매장'
      ],
      benefits: '기본 서비스 이용 가능',
      isDefault: true
    },
    {
      name: '가온마루',
      color: '#dda464',
      bgColor: 'bg-yellow-500',
      icon: '⭐',
      description: '고객과 자리매의 중심에서 신뢰를 쌓아가는 매장',
      criteria: [
        '평균 리뷰 점수 4.0점 이상 ~ 4.4점 이하',
        '월간 순 방문객 30명 이상'
      ],
      benefits: '검색 순위 상위 노출, 우수 파트너 배지 제공'
    },
    {
      name: '사랑방',
      color: '#557c9f',
      bgColor: 'bg-muted-blue',
      icon: '👑',
      description: '모두가 믿고 찾아와 마음 편히 쉬어가는 최고의 매장',
      criteria: [
        '평균 리뷰 점수 4.5점 이상',
        '월간 순 방문객 기준 달성'
      ],
      benefits: '자리매 메인 페이지 노출, 신규 기능 우선 적용, 맞춤형 서비스 지원',
      premium: true
    }
  ]

  // 사용자 등급 시스템 (매김이)
  const userLevels = [
    {
      name: '불청객',
      scoreRange: '-100점 ~ -1점',
      color: '#dc2626',
      bgColor: 'bg-red-600',
      icon: '😡',
      description: '자리매 이용 신뢰도가 낮은 사용자',
      benefits: '모든 예약 시 매장 승인 필수, 프리미엄 기능 이용 제한',
      penalty: true,
      actions: [
        { action: '노쇼 (No-Show)', points: -20 },
        { action: '예약 직전 취소 (2시간 이내)', points: -5 },
        { action: '부적절한 행동', points: -30 }
      ]
    },
    {
      name: '방랑자',
      scoreRange: '0점 ~ 30점',
      color: '#6b7280',
      bgColor: 'bg-gray-500',
      icon: '🚶',
      description: '기본 서비스를 이용하는 일반 사용자',
      benefits: '기본 서비스 이용 가능, 특별한 혜택/페널티 없음',
      isDefault: true
    },
    {
      name: '정착자',
      scoreRange: '30점 ~ 99점',
      color: '#059669',
      bgColor: 'bg-green-600',
      icon: '🏡',
      description: '자리매에서 활발하게 활동하는 사용자',
      benefits: '칭호 제공, 특별 프로모션 추가 제공, 동행인 구독 1개월 무료 체험',
      actions: [
        { action: '예약 완료 (방문 후 정상 이용)', points: 5 },
        { action: '정성스러운 리뷰 작성', points: 3 },
        { action: '친구 초대 (첫 예약 완료 시)', points: 10 },
        { action: '프로필 완성 (최초 1회)', points: 5 }
      ]
    },
    {
      name: '땅지기',
      scoreRange: '100점 이상',
      color: '#7c3aed',
      bgColor: 'bg-purple-600',
      icon: '🛡️',
      description: '자리매의 충성 고객',
      benefits: '칭호 제공, 벗 구독 1개월 무료 체험, 특별 프로필 테두리',
      premium: true
    },
    {
      name: '터줏대감',
      scoreRange: '매달 서버 상위 24명',
      color: '#b91c1c',
      bgColor: 'bg-red-700',
      icon: '👸',
      description: '자리매 최고 등급의 VIP 사용자',
      benefits: '특별 프리미엄 구독 제공, 프리미엄 체험권 선물 기능(5명), 특별 스티커/뱃지, 영구 프로필 테두리',
      ultimate: true
    }
  ]

  const getScoreActions = () => [
    { action: '예약 완료 (방문 후 정상 이용)', points: 5, type: 'positive' },
    { action: '정성스러운 리뷰 작성', points: 3, type: 'positive' },
    { action: '베스트 리뷰 선정 (주간)', points: 10, type: 'positive' },
    { action: '친구 초대 (가입 및 첫 예약 완료 시)', points: 10, type: 'positive' },
    { action: '프로필 완성 (최초 1회)', points: 5, type: 'positive' },
    { action: '노쇼 (No-Show)', points: -20, type: 'negative' },
    { action: '예약 직전 취소 (매장 이용 2시간 이내)', points: -5, type: 'negative' },
    { action: '부적절한 행동 (리뷰, 신고 누적 등)', points: -30, type: 'negative' }
  ]

  return (
    <div className="min-h-screen bg-warm-gray">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brown-900">자리매 등급 시스템</h1>
              <p className="text-lg text-gray-600 mt-2">함께 성장하는 자리매 생태계</p>
            </div>
            <Link href="/" className="text-hazelnut hover:text-muted-blue transition-colors">
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 탭 네비게이션 */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-2 shadow-sm">
            <button
              onClick={() => setActiveTab('user')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'user'
                  ? 'bg-hazelnut text-white shadow-sm'
                  : 'text-gray-600 hover:text-hazelnut'
              }`}
            >
              👤 사용자 등급 (매김이)
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'store'
                  ? 'bg-muted-blue text-white shadow-sm'
                  : 'text-gray-600 hover:text-muted-blue'
              }`}
            >
              🏪 매장 등급 (어울림터)
            </button>
          </div>
        </div>

        {/* 사용자 등급 시스템 */}
        {activeTab === 'user' && (
          <div>
            {/* 소개 섹션 */}
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold text-brown-900 mb-4">매김이 시스템</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
                자리매에서의 활동에 따라 점수가 쌓이고, 등급이 올라가면서 더 많은 혜택을 받을 수 있어요. 
                신뢰할 수 있는 사용자가 되어 자리매 커뮤니티를 함께 만들어가요.
              </p>
            </div>

            {/* 점수 획득/차감 방법 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
              <h3 className="text-xl font-bold text-brown-900 mb-6 text-center">점수 획득/차감 방법</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-600 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    점수 올리기
                  </h4>
                  <div className="space-y-3">
                    {getScoreActions().filter(action => action.type === 'positive').map((action, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">{action.action}</span>
                        <span className="font-bold text-green-600">+{action.points}점</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    점수 차감
                  </h4>
                  <div className="space-y-3">
                    {getScoreActions().filter(action => action.type === 'negative').map((action, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">{action.action}</span>
                        <span className="font-bold text-red-600">{action.points}점</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 사용자 등급 카드들 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {userLevels.map((level) => (
                <Card
                  key={level.name}
                  className={`relative transition-all duration-300 hover:scale-105 ${
                    level.penalty ? 'border-2 border-red-300' :
                    level.ultimate ? 'border-2 border-red-400 shadow-lg' :
                    level.premium ? 'border-2 border-purple-300' : ''
                  }`}
                >
                  {level.penalty && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        페널티
                      </span>
                    </div>
                  )}
                  
                  {level.ultimate && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-red-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        최고 등급
                      </span>
                    </div>
                  )}

                  {level.isDefault && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        기본
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-full ${level.bgColor} mx-auto mb-4 flex items-center justify-center`}>
                      <span className="text-2xl">{level.icon}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-brown-900 mb-2">{level.name}</h3>
                    <p className="text-sm font-medium" style={{ color: level.color }}>{level.scoreRange}</p>
                    <p className="text-gray-600 mt-2 text-sm">{level.description}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-brown-900 mb-3">혜택</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{level.benefits}</p>
                  </div>

                  {level.actions && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-brown-900 mb-2">주요 활동</h4>
                      <div className="space-y-2">
                        {level.actions.map((action, index) => (
                          <div key={index} className="text-xs text-gray-600 flex justify-between">
                            <span>{action.action}</span>
                            <span className={action.points > 0 ? 'text-green-600' : 'text-red-600'}>
                              {action.points > 0 ? '+' : ''}{action.points}점
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 매장 등급 시스템 */}
        {activeTab === 'store' && (
          <div>
            {/* 소개 섹션 */}
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold text-brown-900 mb-4">어울림터 등급 시스템</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
                매장의 서비스 품질과 고객 만족도에 따라 등급이 결정됩니다. 
                높은 등급의 매장일수록 더 많은 노출 기회와 특별한 혜택을 받을 수 있어요.
              </p>
            </div>

            {/* 매장 등급 카드들 */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {storeLevels.map((level) => (
                <Card
                  key={level.name}
                  className={`relative transition-all duration-300 hover:scale-105 ${
                    level.penalty ? 'border-2 border-red-300' :
                    level.premium ? 'border-2 border-blue-300 shadow-lg' : ''
                  }`}
                >
                  {level.penalty && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        페널티
                      </span>
                    </div>
                  )}
                  
                  {level.premium && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-muted-blue text-white px-3 py-1 rounded-full text-xs font-medium">
                        최고 등급
                      </span>
                    </div>
                  )}

                  {level.isDefault && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-hazelnut text-white px-3 py-1 rounded-full text-xs font-medium">
                        기본
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-6">
                    <div className={`w-20 h-20 rounded-full ${level.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-3xl">{level.icon}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-brown-900 mb-2">{level.name}</h3>
                      <p className="text-gray-600 mb-4">{level.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-brown-900 mb-2">달성 조건</h4>
                        <ul className="space-y-1">
                          {level.criteria.map((criterion, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-hazelnut rounded-full flex-shrink-0"></div>
                              {criterion}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-brown-900 mb-2">
                          {level.penalty ? '페널티' : '혜택'}
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{level.benefits}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 공통 FAQ */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-brown-900 mb-8 text-center">자주 묻는 질문</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. 등급은 어떻게 변경되나요?</h4>
              <p className="text-gray-600 mb-6">
                {activeTab === 'user' 
                  ? '활동에 따라 점수가 실시간으로 반영되며, 점수 구간에 따라 등급이 자동으로 변경됩니다.'
                  : '매장의 리뷰 점수와 방문객 수가 기준을 충족하면 등급이 자동으로 승급됩니다.'
                }
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. 등급이 내려갈 수도 있나요?</h4>
              <p className="text-gray-600 mb-6">
                {activeTab === 'user'
                  ? '네, 부적절한 행동이나 노쇼 등으로 점수가 차감되면 등급이 하락할 수 있습니다.'
                  : '네, 서비스 품질이 떨어지거나 고객 불만이 증가하면 등급이 하락할 수 있습니다.'
                }
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. 등급별 혜택은 언제부터 적용되나요?</h4>
              <p className="text-gray-600 mb-6">
                등급 변경과 동시에 새로운 혜택이 즉시 적용됩니다. 일부 혜택은 다음 결제 주기부터 반영될 수 있습니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brown-900 mb-3">Q. 등급 정보는 다른 사용자에게 보이나요?</h4>
              <p className="text-gray-600">
                {activeTab === 'user'
                  ? '프로필에서 등급 표시를 선택할 수 있으며, 터줏대감 등급은 특별 배지로 표시됩니다.'
                  : '매장 등급은 검색 결과와 매장 상세 페이지에서 배지 형태로 표시됩니다.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* 문의하기 섹션 */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">등급 시스템에 대해 더 궁금한 점이 있으신가요?</p>
          <Button className="bg-hazelnut hover:bg-amber-600 text-white px-8 py-3 rounded-xl">
            고객센터 문의하기
          </Button>
        </div>
      </div>
    </div>
  )
}