'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button, Card } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

export default function UserRanksPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const userRanks = [
    {
      id: 'unwelcome_guest',
      name: '불청객',
      scoreRange: '-100점 ~ -1점',
      color: '#dc2626',
      bgColor: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
      description: '약속을 지키지 못해 신뢰를 잃은 상태',
      penalties: [
        '모든 예약 시 매장 승인 필수 (선결제/예치금 포함)',
        '매장 주인에게 경고 표시',
        '프리미엄 기능 이용 제한',
        '-50점 초과 시 접속 시마다 경고 배너 노출'
      ],
      icon: '🚫',
      iconColor: '#dc2626',
      textColor: '#dc2626',
      penalty: true
    },
    {
      id: 'wanderer',
      name: '방랑자',
      scoreRange: '0점 ~ 30점',
      color: '#666666',
      bgColor: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      description: '자리매와 함께 시작하는 첫걸음',
      features: [
        '기본 서비스 이용 가능',
        '특별한 혜택이나 페널티 없음',
        '점수를 올려 다음 등급을 노려보세요!'
      ],
      icon: '🚶',
      iconColor: '#868e96',
      textColor: '#343a40'
    },
    {
      id: 'settler',
      name: '정착자',
      scoreRange: '30점 ~ 99점',
      color: '#8b7355',
      bgColor: 'linear-gradient(135deg, #fff8e7 0%, #f4e4bc 100%)',
      description: '자리매에 정착하여 신뢰를 쌓아가는 단계',
      features: [
        '🏷️ 정착자 칭호 제공',
        '🎁 특별 프로모션 추가 제공',
        '🎫 "동행인" 구독 1개월 무료 체험권 제공',
        '📱 더 나은 예약 우선순위'
      ],
      icon: '🏠',
      iconColor: '#8b7355',
      textColor: '#5d4e37'
    },
    {
      id: 'landkeeper',
      name: '땅지기',
      scoreRange: '100점 이상',
      color: '#b8860b',
      bgColor: 'linear-gradient(135deg, #fff9c4 0%, #f7e98e 100%)',
      description: '높은 신뢰도로 특별한 혜택을 받는 우수 회원',
      features: [
        '👑 땅지기 칭호 제공',
        '🎫 "벗" 구독 1개월 무료 체험권 제공',
        '✨ 특별 프로필 테두리 제공',
        '🌟 VIP 고객 지원 서비스',
        '📞 우선 예약 처리'
      ],
      icon: '🌱',
      iconColor: '#b8860b',
      textColor: '#8b6914',
      premium: true
    },
    {
      id: 'master',
      name: '터줏대감',
      scoreRange: '매달 서버 상위 24명',
      color: '#4a90e2',
      bgColor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      description: '자리매의 최고 등급! 특별한 권한과 혜택',
      features: [
        '🏆 터줏대감 칭호 제공 (최고 영예)',
        '💎 터줏대감 유지 기간 동안 특별 "벗" 구독권 제공',
        '🎁 벗 한 달 체험권 선물 기능 (5명에게 제공)',
        '⭐ "같이 갈 사람" 기능 내 특별 스티커/뱃지',
        '👑 프로필 특별 테두리 및 뱃지 (영구 보존)',
        '🎪 향후 인플루언서 활동 기회 (SNS 기능 출시 시)'
      ],
      icon: '👑',
      iconColor: '#4a90e2',
      textColor: '#1565c0',
      legendary: true
    }
  ]

  const scoreActions = [
    { action: '예약 완료 (방문 후 정상 이용)', score: '+5점', type: 'positive' },
    { action: '정성스러운 리뷰 작성', score: '+3점', type: 'positive' },
    { action: '베스트 리뷰 (일주일에 한번)', score: '+10점', type: 'positive' },
    { action: '친구 초대 (가입 및 첫 예약 완료 시)', score: '+10점', type: 'positive' },
    { action: '프로필 완성 (최초 1회)', score: '+5점', type: 'positive' },
    { action: '노쇼 (No-Show)', score: '-20점', type: 'negative' },
    { action: '예약 직전 취소 (매장 이용 2시간 이내)', score: '-5점', type: 'negative' },
    { action: '부적절한 행동 (리뷰, 신고 누적 등)', score: '-30점', type: 'negative' }
  ]

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-20 pt-24">
        <div className="bg-white shadow-sm rounded-lg mb-20">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-brown-900">자리매 매김이 시스템</h1>
                  <p className="text-lg text-gray-600 mt-2">사용자 등급과 혜택을 확인해보세요</p>
                </div>
                
                {/* 등급 시스템 선택 드롭다운 */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-hazelnut text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    <span className="text-sm font-medium">사용자 등급</span>
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
                          className="block px-4 py-2 text-sm text-brown-900 bg-hazelnut/10 font-medium"
                        >
                          👤 사용자 등급 (현재)
                        </Link>
                        <Link 
                          href="/ranks/partner"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          🏪 매장 등급
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
            자리매 이용 신뢰도에 따른 등급 시스템
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            사용자의 활동에 따라 점수가 변동되며, 이는 '자리매' 이용 신뢰도의 지표가 됩니다.
            등급에 따라 다양한 혜택과 특별한 기능을 이용할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-8 mb-16">
          {userRanks.map((rank, index) => (
            <Card
              key={rank.id}
              className={`relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                rank.legendary ? 'border-2 border-blue-300 shadow-xl animate-pulse' : 
                rank.premium ? 'border-2 border-yellow-400 shadow-lg' : 
                rank.penalty ? 'border-2 border-red-300 shadow-lg' :
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
              {rank.premium && !rank.legendary && (
                <div className="absolute -top-3 right-4 z-10">
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    🌟 프리미엄
                  </span>
                </div>
              )}
              {rank.penalty && (
                <div className="absolute -top-3 right-4 z-10">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
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
                  <div 
                    className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 relative z-10"
                  >
                    <p className="text-sm font-medium">{rank.scoreRange}</p>
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
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 text-sm">!</span>
                          </div>
                          <h4 className="text-xl font-bold text-red-700">페널티</h4>
                        </div>
                        <div className="space-y-4">
                          {rank.penalties.map((penalty, penaltyIndex) => (
                            <div 
                              key={penaltyIndex} 
                              className="flex items-start gap-4 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                              style={{ 
                                animationDelay: `${(index * 100) + (penaltyIndex * 50)}ms`,
                                opacity: 0,
                                animation: `fadeInLeft 0.5s ease-out ${(index * 100) + (penaltyIndex * 50)}ms forwards`
                              }}
                            >
                              <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                              <span className="text-gray-700 text-sm leading-relaxed">{penalty}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : null}
                    
                    {/* 점수 도달 가이드 */}
                    {!rank.penalty && index < userRanks.length - 1 && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center">
                          💡 다음 등급까지 {index === 0 ? '30점' : index === 1 ? '69점' : index === 2 ? '1점' : '상위 24명'} 남음
                        </p>
                      </div>
                    )}
                    
                    {/* 등급별 프로모션 링크 */}
                    {rank.features && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <Link 
                          href="/promotions" 
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
          <h3 className="text-2xl font-bold text-brown-900 mb-8 text-center">점수 변동 기준</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-green-600 mb-6 flex items-center gap-2">
                <span>📈</span> 점수 올리기
              </h4>
              <div className="space-y-4">
                {scoreActions.filter(action => action.type === 'positive').map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-800">{action.action}</span>
                    <span className="font-semibold text-green-600">{action.score}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-red-600 mb-6 flex items-center gap-2">
                <span>📉</span> 점수 내리기
              </h4>
              <div className="space-y-4">
                {scoreActions.filter(action => action.type === 'negative').map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-gray-800">{action.action}</span>
                    <span className="font-semibold text-red-600">{action.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-hazelnut to-muted-blue text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">현재 내 등급 확인하기</h3>
          <p className="text-lg opacity-90 mb-6">
            로그인하여 현재 내 등급과 점수를 확인해보세요!
          </p>
          <div className="space-x-4">
            <Link href="/auth/login" className="inline-block">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-hazelnut font-semibold px-8 py-3 rounded-xl transition-colors">
                로그인하기
              </Button>
            </Link>
            <Link href="/auth/signup" className="inline-block">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-hazelnut font-semibold px-8 py-3 rounded-xl transition-colors">
                회원가입하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}