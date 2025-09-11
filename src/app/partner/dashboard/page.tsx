'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import JumoChat from '@/components/ai/JumoChat'

export default function PartnerDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // 더미 데이터
  const restaurantInfo = {
    name: '맛있는 한식당',
    rating: 4.5,
    reviewCount: 127,
    subscription: '지름길',
    rank: '가온마루'
  }

  const todayStats = {
    reservations: 24,
    completed: 18,
    pending: 6,
    revenue: 450000
  }

  const recentReservations = [
    { id: 1, name: '김**', time: '19:00', guests: 4, status: 'confirmed' },
    { id: 2, name: '이**', time: '19:30', guests: 2, status: 'pending' },
    { id: 3, name: '박**', time: '20:00', guests:6, status: 'confirmed' }
  ]

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brown-900 mb-2">
                🏪 매장 관리 대시보드
              </h1>
              <p className="text-gray-600">
                안녕하세요, {restaurantInfo.name} 사장님!
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <JumoChat restaurantName={restaurantInfo.name} />
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: '📊 대시보드' },
              { id: 'reservations', label: '📅 예약 관리' },
              { id: 'menu', label: '🍽️ 메뉴 관리' },
              { id: 'reviews', label: '⭐ 리뷰 관리' },
              { id: 'settings', label: '⚙️ 설정' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-hazelnut border-b-2 border-hazelnut'
                    : 'text-gray-600 hover:text-hazelnut'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 대시보드 탭 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 매장 정보 카드 */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-brown-900">매장 현황</h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-hazelnut text-white px-3 py-1 rounded-full text-sm">
                      {restaurantInfo.subscription}
                    </span>
                    <span className="bg-muted-blue text-white px-3 py-1 rounded-full text-sm">
                      {restaurantInfo.rank}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{restaurantInfo.rating}</div>
                    <div className="text-sm text-gray-600">평균 평점</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{restaurantInfo.reviewCount}</div>
                    <div className="text-sm text-gray-600">총 리뷰 수</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{restaurantInfo.rank}</div>
                    <div className="text-sm text-gray-600">현재 등급</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 오늘의 통계 */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-brown-900 mb-4">📈 오늘의 현황</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-hazelnut">{todayStats.reservations}</div>
                    <div className="text-sm text-gray-600">총 예약</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{todayStats.completed}</div>
                    <div className="text-sm text-gray-600">완료</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{todayStats.pending}</div>
                    <div className="text-sm text-gray-600">대기</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {todayStats.revenue.toLocaleString()}원
                    </div>
                    <div className="text-sm text-gray-600">예상 매출</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 최근 예약 */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-brown-900 mb-4">📋 최근 예약</h2>
                <div className="space-y-3">
                  {recentReservations.map(reservation => (
                    <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{reservation.name}</span>
                        <span className="text-gray-600 ml-2">
                          {reservation.time} • {reservation.guests}명
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        reservation.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {reservation.status === 'confirmed' ? '확정' : '대기'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    모든 예약 보기
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 다른 탭들 - 간단한 플레이스홀더 */}
        {activeTab !== 'overview' && (
          <Card>
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-brown-900 mb-2">
                {activeTab === 'reservations' && '예약 관리'}
                {activeTab === 'menu' && '메뉴 관리'}
                {activeTab === 'reviews' && '리뷰 관리'}
                {activeTab === 'settings' && '설정'}
              </h2>
              <p className="text-gray-600 mb-6">
                이 기능은 곧 제공될 예정입니다.
              </p>
              <Button onClick={() => setActiveTab('overview')}>
                대시보드로 돌아가기
              </Button>
            </div>
          </Card>
        )}

        {/* 빠른 액션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Link href="/subscription/partner">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-2xl mb-2">💎</div>
                <div className="font-medium text-brown-900">구독 관리</div>
              </div>
            </Card>
          </Link>
          
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-2xl mb-2">📞</div>
              <div className="font-medium text-brown-900">고객 지원</div>
            </div>
          </Card>
          
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <div className="font-medium text-brown-900">매출 분석</div>
            </div>
          </Card>
          
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-brown-900">마케팅</div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}