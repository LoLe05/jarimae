'use client'

import React from 'react'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

/**
 * 매장 신청 완료 페이지
 * HTML 시안: jarimae_partner_application_success.html
 * 경로: /partner/application/success
 */
export default function PartnerApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        
        {/* 성공 헤더 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-brown-900 mb-2">
            🎉 매장 등록 신청이 완료되었습니다!
          </h1>
          <p className="text-gray-600">
            자리매 파트너로 함께하게 되어 기쁩니다
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* 신청 완료 안내 */}
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🏪</div>
              <h2 className="text-2xl font-bold text-brown-900 mb-2">
                매장 심사가 진행됩니다
              </h2>
              <p className="text-gray-600">
                제출해주신 정보를 바탕으로 매장 승인 심사를 진행합니다
              </p>
            </div>

            {/* 심사 진행 단계 */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">서류 검토</h3>
                  <p className="text-sm text-blue-700">매장 정보 및 사업자 정보 확인</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-yellow-900">매장 승인</h3>
                  <p className="text-sm text-yellow-700">자리매 파트너 자격 심사</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-green-900">서비스 시작</h3>
                  <p className="text-sm text-green-700">매장 관리 대시보드 이용 시작</p>
                </div>
              </div>
            </div>

            {/* 예상 소요 시간 */}
            <div className="bg-hazelnut-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-hazelnut mb-2">
                ⏰ 심사 소요 시간
              </h3>
              <p className="text-hazelnut">
                <strong>1-2 영업일</strong> 내에 심사 결과를 안내해드립니다
              </p>
            </div>
          </Card>

          {/* 다음 단계 안내 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-brown-900 mb-4">
              📋 다음 단계
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>✅ 심사 결과는 등록하신 이메일로 발송됩니다</p>
              <p>✅ 승인 완료 후 매장 대시보드에 접속할 수 있습니다</p>
              <p>✅ 메뉴 등록, 예약 관리 등의 기능을 이용하실 수 있습니다</p>
              <p>✅ 문의사항은 파트너 고객센터로 연락주세요</p>
            </div>
          </Card>

          {/* 중요 안내사항 */}
          <Card className="p-6 border-l-4 border-l-orange-400">
            <h3 className="text-lg font-semibold text-brown-900 mb-4 flex items-center gap-2">
              ⚠️ 중요 안내사항
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• 심사 중 추가 서류 요청이 있을 수 있습니다</p>
              <p>• 부정확한 정보 제공 시 승인이 거부될 수 있습니다</p>
              <p>• 승인 후 매장 운영 정책을 준수해야 합니다</p>
              <p>• 서비스 이용료는 승인 후 안내드립니다</p>
            </div>
          </Card>

          {/* 연락처 정보 */}
          <Card className="p-6 bg-gradient-to-r from-hazelnut-50 to-muted-blue-50">
            <h3 className="text-lg font-semibold text-brown-900 mb-4">
              📞 파트너 고객센터
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-600">전화:</span>
                <span className="font-medium">1588-1234</span>
                <span className="text-sm text-gray-500">(평일 09:00-18:00)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">이메일:</span>
                <span className="font-medium">partner@jarimae.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">카카오톡:</span>
                <span className="font-medium">@자리매파트너</span>
              </div>
            </div>
          </Card>

          {/* 액션 버튼들 */}
          <div className="space-y-4">
            
            {/* 메인 액션 */}
            <Link href="/">
              <Button
                size="lg"
                className="w-full"
              >
                🏠 메인으로 돌아가기
              </Button>
            </Link>

            {/* 부가 액션들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                >
                  🔑 로그인하기
                </Button>
              </Link>
              <a
                href="tel:1588-1234"
                className="block"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                >
                  📞 고객센터 연결
                </Button>
              </a>
            </div>
          </div>

          {/* 추가 서비스 홍보 */}
          <Card className="p-6 bg-gradient-to-r from-muted-blue-50 to-hazelnut-50">
            <h3 className="text-lg font-semibold text-brown-900 mb-4">
              🚀 자리매 파트너 혜택
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-muted-blue">📈 매출 증대</h4>
                <p className="text-gray-600">온라인 예약을 통한 신규 고객 확보</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-muted-blue">⏰ 효율적 운영</h4>
                <p className="text-gray-600">예약 관리 자동화로 업무 효율성 향상</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-muted-blue">📊 데이터 분석</h4>
                <p className="text-gray-600">고객 분석 리포트로 매장 운영 최적화</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-muted-blue">🎯 마케팅 지원</h4>
                <p className="text-gray-600">자리매 플랫폼 내 매장 홍보 지원</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}