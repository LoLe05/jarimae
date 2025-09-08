'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

/**
 * 자리매 랜딩 페이지 (비로그인 사용자용)
 * HTML 시안: jarimae_unified_main_final.html (비로그인 버전)
 * 경로: /landing
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <main className="relative overflow-hidden">
        {/* 배경 애니메이션 */}
        <div className="absolute inset-0 animated-bg opacity-30" />
        
        <div className="relative z-10">
          {/* 히어로 섹션 - 브랜드 소개 */}
          <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
            <div className="max-w-4xl mx-auto">
              {/* 브랜드 로고 */}
              <div className="mb-8 sm:mb-12">
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-hazelnut mb-4 sm:mb-6 animate-float">
                  자리매
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl text-brown-900 font-medium mb-3 sm:mb-4">
                  소상공인을 위한 똑똑한 자리 예약
                </p>
                <p className="text-base sm:text-lg text-muted-gray max-w-2xl mx-auto">
                  한 번의 클릭으로 예약하고, 배달받고, 웨이팅하세요.<br className="hidden sm:block" />
                  자리매와 함께 더 편리한 식사 경험을 시작하세요.
                </p>
              </div>

              {/* 서비스 소개 카드 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 mobile-tap">
                  <div className="text-4xl sm:text-5xl mb-4">🍽️</div>
                  <h3 className="text-lg sm:text-xl font-bold text-brown-900 mb-2">예약</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    실시간 예약 시스템으로<br />
                    원하는 시간에 바로 예약
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 mobile-tap animate-delay-100">
                  <div className="text-4xl sm:text-5xl mb-4">🛵</div>
                  <h3 className="text-lg sm:text-xl font-bold text-brown-900 mb-2">배달</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    빠르고 신선한<br />
                    배달 서비스 경험
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 mobile-tap animate-delay-200">
                  <div className="text-4xl sm:text-5xl mb-4">⏰</div>
                  <h3 className="text-lg sm:text-xl font-bold text-brown-900 mb-2">웨이팅</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    실시간 대기 현황으로<br />
                    스마트한 웨이팅 관리
                  </p>
                </div>
              </div>

              {/* CTA 버튼 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold mobile-tap">
                    자리매 시작하기
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold mobile-tap">
                    로그인
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-6 sm:mt-8">
                이미 계정이 있으신가요? <Link href="/auth/login" className="text-hazelnut hover:underline mobile-tap">로그인하기</Link>
              </p>
            </div>
          </section>

          {/* 추가 정보 섹션 */}
          <section className="container mx-auto px-4 py-12 sm:py-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brown-900 mb-4">
                  왜 자리매일까요?
                </h2>
                <p className="text-base sm:text-lg text-muted-gray max-w-2xl mx-auto">
                  소상공인과 고객 모두를 위한 스마트한 예약 솔루션을 제공합니다
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-hazelnut text-white rounded-full flex items-center justify-center text-xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brown-900 mb-2">간편한 예약 관리</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      복잡한 전화 예약은 그만! 몇 번의 터치만으로 예약부터 결제까지 완료하세요.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-muted-blue text-white rounded-full flex items-center justify-center text-xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brown-900 mb-2">실시간 현황 확인</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      실시간으로 매장 현황을 확인하고, 정확한 대기시간을 알 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-hazelnut text-white rounded-full flex items-center justify-center text-xl font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brown-900 mb-2">소상공인 지원</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      매장 운영에 필요한 모든 도구를 제공하여 소상공인의 성공을 돕습니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-muted-blue text-white rounded-full flex items-center justify-center text-xl font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brown-900 mb-2">편리한 모바일 최적화</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      언제 어디서나 스마트폰으로 쉽게 이용할 수 있는 모바일 퍼스트 설계입니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 최종 CTA */}
          <section className="bg-gradient-brand text-white py-12 sm:py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                지금 바로 시작해보세요!
              </h2>
              <p className="text-base sm:text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                자리매와 함께 더 스마트한 식사 경험을 만나보세요.<br className="hidden sm:block" />
                회원가입하고 첫 예약 시 특별 혜택을 받으세요.
              </p>
              <Link href="/auth/signup">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white text-hazelnut border-white hover:bg-gray-50 px-8 py-4 text-lg font-semibold mobile-tap"
                >
                  무료로 시작하기
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}