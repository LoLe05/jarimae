'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button, Card } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

export default function PartnerRanksPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const partnerRanks = [
    {
      id: 'vacant_lot',
      name: '공터',
      color: '#6b7280',
      bgColor: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
      iconColor: '#6b7280',
      textColor: '#374151',
      criteria: [
        '평균 리뷰 점수 2.5점 미만',
        '노쇼(No-Show) 신고 누적 3회 이상'
      ],
      criteriaNote: '다음 중 한 가지라도 해당하는 경우',
      description: '약속을 지키지 못해 텅 비어 있는 공터처럼, 신뢰를 잃은 매장입니다.',
      penalties: [
        '🔻 검색 순위 하락',
        '⚠️ 경고 배지 노출',
        '🚫 프로모션 참여 제한',
        '📊 매출 분석 리포트 제한'
      ],
      icon: '🚧',
      type: 'penalty',
      penalty: true
    },
    {
      id: 'haze_yard',
      name: '하제마당',
      color: '#8b7355',
      bgColor: 'linear-gradient(135deg, #f7f3e8 0%, #f0e6d2 100%)',
      iconColor: '#8b7355',
      textColor: '#6b5b42',
      criteria: [
        '공터에 해당하지 않는 모든 신규/기존 매장'
      ],
      criteriaNote: '별도 기준 없음',
      description: "'하제'는 '다음 날'을 뜻하는 순우리말로, 자리매와 함께 더 나은 내일을 준비하는 매장입니다.",
      features: [
        '🏪 기본 서비스 이용',
        '🔍 표준 검색 노출',
        '📊 기본 매장 관리 도구',
        '📞 일반 고객 지원'
      ],
      icon: '🌅',
      type: 'basic'
    },
    {
      id: 'gaon_maru',
      name: '가온마루',
      color: '#d97706',
      bgColor: 'linear-gradient(135deg, #fefcf0 0%, #fde68a 100%)',
      iconColor: '#d97706',
      textColor: '#92400e',
      criteria: [
        '평균 리뷰 점수 4.0점 이상 ~ 4.4점 이하',
        '월간 순 방문객 30명 이상'
      ],
      criteriaNote: '다음 조건을 모두 충족하는 경우',
      description: "'가온'은 '가운데'를 뜻하며, '마루'는 중심 공간을 의미합니다. 고객과 자리매의 중심에서 신뢰를 쌓아가는 매장입니다.",
      features: [
        '⬆️ 검색 순위 상위 노출',
        '🏅 "우수 파트너" 배지 제공',
        '📈 월간 매출 리포트 제공',
        '🎯 프로모션 우선 노출',
        '💼 전담 컨설턴트 배정'
      ],
      icon: '🏛️',
      type: 'premium'
    },
    {
      id: 'sarangbang',
      name: '사랑방',
      color: '#1d4ed8',
      bgColor: 'linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)',
      iconColor: '#1d4ed8',
      textColor: '#1e3a8a',
      criteria: [
        '평균 리뷰 점수 4.5점 이상',
        '월간 순 방문객 일정 수 이상 (향후 결정)'
      ],
      criteriaNote: '다음 조건을 모두 충족하는 경우',
      description: '따뜻하고 정겨운 사랑방처럼, 모두가 믿고 찾아와 마음 편히 쉬어가는 최고의 매장입니다.',
      features: [
        '🌟 자리매 메인 페이지 노출',
        '🚀 신규 기능/서비스 우선 적용',
        '🎨 맞춤형 서비스 지원 (커스텀 메뉴 페이지)',
        '👥 전용 고객 지원팀',
        '🎪 VIP 매장 전용 이벤트 참여',
        '📱 프리미엄 앱 기능 무제한 이용'
      ],
      icon: '🏠',
      type: 'legendary',
      legendary: true
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'penalty': return 'border-red-500'
      case 'basic': return 'border-gray-300'
      case 'premium': return 'border-hazelnut'
      case 'top': return 'border-muted-blue'
      default: return 'border-gray-300'
    }
  }

  const getTypeBackground = (type: string) => {
    switch (type) {
      case 'penalty': return 'bg-red-50'
      case 'basic': return 'bg-gray-50'
      case 'premium': return 'bg-orange-50'
      case 'top': return 'bg-blue-50'
      default: return 'bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-20 pt-24">
        <div className="bg-white shadow-sm rounded-lg mb-20">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-brown-900">자리매 어울림터 등급 시스템</h1>
                  <p className="text-lg text-gray-600 mt-2">매장별 등급과 혜택을 확인해보세요</p>
                </div>
                
                {/* 등급 시스템 선택 드롭다운 */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-muted-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <span className="text-sm font-medium">매장 등급</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <Link 
                          href="/ranks/user"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          👤 사용자 등급
                        </Link>
                        <Link 
                          href="/ranks/partner"
                          className="block px-4 py-2 text-sm text-brown-900 bg-muted-blue/10 font-medium"
                        >
                          🏪 매장 등급 (현재)
                        </Link>
                      </div>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                    </>
                  )}
                </div>
              </div>
              <Link href="/" className="text-hazelnut hover:text-muted-blue transition-colors">
                ← 홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-brown-900 mb-4">
            자리매에 등록된 매장을 위한 등급 시스템
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            매장의 서비스 품질과 고객 만족도에 따라 등급이 결정됩니다.
            등급에 따라 다양한 혜택과 특별한 노출 기회를 제공합니다.
          </p>
        </div>

        <div className="grid gap-8 mb-16">
          {partnerRanks.map((rank, index) => (
            <Card
              key={rank.id}
              className={`relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                rank.legendary ? 'border-2 border-blue-300 shadow-xl animate-pulse' : 
                rank.type === 'premium' ? 'border-2 border-yellow-400 shadow-lg' : 
                rank.penalty ? 'border-2 border-gray-300 shadow-lg' :
                'border border-gray-200'
              } group`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                transform: 'translateY(20px)',
                animation: `slideInUp 0.6s ease-out ${index * 100}ms forwards`
              }}
            >
              {/* 특별 배지 */}
              {rank.legendary && (
                <div className="absolute -top-3 right-4 z-10">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                    ✨ 전설 등급
                  </span>
                </div>
              )}
              {rank.type === 'premium' && !rank.legendary && (
                <div className="absolute -top-3 right-4 z-10">
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    🌟 프리미엄
                  </span>
                </div>
              )}
              {rank.penalty && (
                <div className="absolute -top-3 right-4 z-10">
                  <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    ⚠️ 페널티
                  </span>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row min-h-[280px]">
                {/* 왼쪽 아이콘 섹션 */}
                <div 
                  className="md:w-1/3 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden"
                  style={{ 
                    background: rank.bgColor,
                    color: rank.textColor || '#ffffff'
                  }}
                >
                  {/* 배경 장식 */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 text-6xl opacity-50">
                      {rank.icon}
                    </div>
                  </div>
                  
                  <div 
                    className="text-6xl mb-6 transform transition-transform duration-300 group-hover:scale-110 relative z-10"
                    style={{ color: rank.iconColor }}
                  >
                    {rank.icon}
                  </div>
                  <h3 
                    className="text-3xl font-bold mb-3 relative z-10" 
                    style={{ color: rank.color }}
                  >
                    {rank.name}
                  </h3>
                  
                  {/* 조건 표시 */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4 relative z-10">
                    <p className="text-sm font-medium mb-2">{rank.criteriaNote}</p>
                    <div className="space-y-1">
                      {rank.criteria.map((criterion, criteriaIndex) => (
                        <p key={criteriaIndex} className="text-xs opacity-90">
                          {rank.criteria.length > 1 ? `${criteriaIndex + 1}. ` : ''}{criterion}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-90 max-w-xs leading-relaxed relative z-10">
                    {rank.description}
                  </p>
                </div>
                
                {/* 오른쪽 혜택 섹션 */}
                <div className="md:w-2/3 p-8 bg-white">
                  <div className="space-y-6">
                    {rank.features ? (
                      <>
                        <div className="flex items-center gap-2 mb-6">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${rank.iconColor}20` }}
                          >
                            <span style={{ color: rank.iconColor }} className="text-sm">✓</span>
                          </div>
                          <h4 className="text-xl font-bold" style={{ color: rank.iconColor }}>혜택</h4>
                        </div>
                        <div className="space-y-4">
                          {rank.features.map((feature, featureIndex) => (
                            <div 
                              key={featureIndex} 
                              className="flex items-start gap-4 p-3 rounded-lg transition-colors"
                              style={{ 
                                backgroundColor: `${rank.iconColor}08`,
                                animationDelay: `${(index * 100) + (featureIndex * 50)}ms`,
                                opacity: 0,
                                animation: `fadeInLeft 0.5s ease-out ${(index * 100) + (featureIndex * 50)}ms forwards`
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${rank.iconColor}15`
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = `${rank.iconColor}08`
                              }}
                            >
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                style={{ backgroundColor: rank.iconColor }}
                              ></div>
                              <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : rank.penalties ? (
                      <>
                        <div className="flex items-center gap-2 mb-6">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${rank.iconColor}20` }}
                          >
                            <span style={{ color: rank.iconColor }} className="text-sm">!</span>
                          </div>
                          <h4 className="text-xl font-bold" style={{ color: rank.iconColor }}>페널티</h4>
                        </div>
                        <div className="space-y-4">
                          {rank.penalties.map((penalty, penaltyIndex) => (
                            <div 
                              key={penaltyIndex} 
                              className="flex items-start gap-4 p-3 rounded-lg transition-colors"
                              style={{ 
                                backgroundColor: `${rank.iconColor}08`,
                                animationDelay: `${(index * 100) + (penaltyIndex * 50)}ms`,
                                opacity: 0,
                                animation: `fadeInLeft 0.5s ease-out ${(index * 100) + (penaltyIndex * 50)}ms forwards`
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${rank.iconColor}15`
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = `${rank.iconColor}08`
                              }}
                            >
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                style={{ backgroundColor: rank.iconColor }}
                              ></div>
                              <span className="text-gray-700 text-sm leading-relaxed">{penalty}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            💡 <strong>개선 방법:</strong> 고객 서비스 품질 향상과 예약 준수를 통해 등급을 올릴 수 있습니다.
                          </p>
                        </div>
                      </>
                    ) : null}
                    
                    {/* 등급별 프로모션 링크 */}
                    {rank.features && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <Link 
                          href="/promotions/partner" 
                          className="block text-center py-2 px-4 rounded-lg transition-all hover:shadow-sm"
                          style={{ 
                            backgroundColor: `${rank.iconColor}08`,
                            color: rank.iconColor 
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${rank.iconColor}15`
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = `${rank.iconColor}08`
                          }}
                        >
                          <span className="text-sm font-medium">
                            🎁 {rank.name} 등급 전용 프로모션 보기
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
          <h3 className="text-2xl font-bold text-brown-900 mb-8 text-center">등급 상승을 위한 가이드</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="text-lg font-semibold text-brown-900 mb-3">리뷰 점수 관리</h4>
              <p className="text-gray-600 text-sm">
                고객 만족도 향상을 통해 높은 리뷰 점수를 유지하세요. 
                친절한 서비스와 깨끗한 매장 환경이 핵심입니다.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="text-lg font-semibold text-brown-900 mb-3">방문객 증대</h4>
              <p className="text-gray-600 text-sm">
                지속적인 마케팅과 프로모션을 통해 월간 방문객 수를 늘려보세요. 
                단골 고객 확보가 중요합니다.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="text-lg font-semibold text-brown-900 mb-3">예약 관리</h4>
              <p className="text-gray-600 text-sm">
                노쇼를 최소화하고 예약 시스템을 체계적으로 관리하세요. 
                고객과의 약속 준수가 신뢰도를 높입니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-brown-900 mb-4">매장주님을 위한 팁</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-hazelnut font-bold">•</span>
                <span>정기적으로 매장 정보와 메뉴를 업데이트하세요</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-hazelnut font-bold">•</span>
                <span>고객 리뷰에 적극적으로 응답하고 피드백을 반영하세요</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-hazelnut font-bold">•</span>
                <span>예약 확정/취소를 신속하게 처리하세요</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-hazelnut font-bold">•</span>
                <span>특별 이벤트나 프로모션을 활용해 고객을 유치하세요</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold text-brown-900 mb-4">등급 혜택 활용법</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-muted-blue font-bold">•</span>
                <span>높은 등급의 배지를 매장 소개에 적극 활용하세요</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-blue font-bold">•</span>
                <span>메인 페이지 노출 기회를 최대한 활용하세요</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-blue font-bold">•</span>
                <span>전용 고객 지원팀의 조언을 적극 수용하세요</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-blue font-bold">•</span>
                <span>신규 기능을 먼저 체험하여 경쟁 우위를 확보하세요</span>
              </li>
            </ul>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-hazelnut to-muted-blue text-white rounded-2xl p-8 text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">매장 등록하기</h3>
          <p className="text-lg opacity-90 mb-6">
            자리매와 함께 매장을 성장시켜보세요!
          </p>
          <div className="space-x-4">
            <Link href="/partner/register">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-hazelnut font-semibold px-8 py-3 rounded-xl transition-colors">
                매장 등록하기
              </Button>
            </Link>
            <Link href="/subscription/partner">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-hazelnut font-semibold px-8 py-3 rounded-xl transition-colors">
                구독 플랜 보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}