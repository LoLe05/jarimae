'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'

interface ReservationData {
  id: string
  customerName: string
  time: string
  guests: number
  status: 'confirmed' | 'pending' | 'completed'
  phone: string
}

interface WaitingData {
  id: string
  customerName: string
  guests: number
  waitTime: number
  phone: string
}

interface StatsData {
  todayReservations: number
  todayRevenue: number
  averageRating: number
  totalReviews: number
}

/**
 * 파트너 대시보드 페이지
 * HTML 시안: jarimae_partner_dashboard.html  
 * 경로: /partner/dashboard
 */
export default function PartnerDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'reservations' | 'waiting'>('reservations')

  // 임시 데이터
  const [stats] = useState<StatsData>({
    todayReservations: 12,
    todayRevenue: 485000,
    averageRating: 4.6,
    totalReviews: 127
  })

  const [reservations] = useState<ReservationData[]>([
    {
      id: '1',
      customerName: '김철수',
      time: '18:00',
      guests: 4,
      status: 'confirmed',
      phone: '010-1234-5678'
    },
    {
      id: '2',
      customerName: '이영희',
      time: '18:30',
      guests: 2,
      status: 'pending',
      phone: '010-2345-6789'
    },
    {
      id: '3',
      customerName: '박민수',
      time: '19:00',
      guests: 6,
      status: 'confirmed',
      phone: '010-3456-7890'
    }
  ])

  const [waitingList] = useState<WaitingData[]>([
    {
      id: '1',
      customerName: '정하나',
      guests: 2,
      waitTime: 15,
      phone: '010-4567-8901'
    },
    {
      id: '2',
      customerName: '최영수',
      guests: 4,
      waitTime: 25,
      phone: '010-5678-9012'
    }
  ])

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700'
    }
    
    const labels = {
      confirmed: '확정',
      pending: '대기',
      completed: '완료'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      {/* 상단 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-hazelnut">
                자리매
              </Link>
              <span className="text-brown-900 font-medium">파트너 대시보드</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <Button variant="outline" size="sm">
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 사이드바 네비게이션 */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              <Link
                href="/partner/dashboard"
                className="flex items-center px-4 py-3 text-brown-900 bg-hazelnut-50 rounded-lg font-medium"
              >
                <span className="mr-3">📊</span>
                대시보드
              </Link>
              <Link
                href="/partner/menu"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="mr-3">🍽️</span>
                메뉴 관리
              </Link>
              <Link
                href="/partner/store"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="mr-3">🏪</span>
                매장 정보
              </Link>
              <Link
                href="/partner/settlement"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="mr-3">💰</span>
                정산 관리
              </Link>
            </div>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          {/* 오늘의 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">오늘 예약</p>
                  <p className="text-2xl font-bold text-brown-900">{stats.todayReservations}</p>
                </div>
                <div className="text-2xl">📅</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">오늘 매출</p>
                  <p className="text-2xl font-bold text-brown-900">{formatCurrency(stats.todayRevenue)}</p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">평균 평점</p>
                  <p className="text-2xl font-bold text-brown-900">{stats.averageRating}</p>
                </div>
                <div className="text-2xl">⭐</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">총 리뷰</p>
                  <p className="text-2xl font-bold text-brown-900">{stats.totalReviews}</p>
                </div>
                <div className="text-2xl">💬</div>
              </div>
            </Card>
          </div>

          {/* 예약 & 웨이팅 관리 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 예약 관리 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-brown-900">오늘 예약 현황</h2>
                <Button size="sm" variant="outline">
                  전체보기
                </Button>
              </div>

              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-medium text-brown-900">{reservation.customerName}</span>
                        {getStatusBadge(reservation.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reservation.time} • {reservation.guests}명 • {reservation.phone}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        연락
                      </Button>
                      {reservation.status === 'pending' && (
                        <Button size="sm">
                          확인
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 웨이팅 관리 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-brown-900">실시간 웨이팅</h2>
                <span className="text-sm text-gray-600">
                  대기: {waitingList.length}팀
                </span>
              </div>

              <div className="space-y-4">
                {waitingList.length > 0 ? (
                  waitingList.map((waiting) => (
                    <div key={waiting.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="font-medium text-brown-900">{waiting.customerName}</span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                            {waiting.guests}명
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          예상 대기시간: {waiting.waitTime}분 • {waiting.phone}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          연락
                        </Button>
                        <Button size="sm">
                          입장
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    현재 대기 중인 고객이 없습니다
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 빠른 액션 버튼들 */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-brown-900 mb-4">빠른 액션</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/partner/menu">
                <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <span className="text-xl">🍽️</span>
                  <span>메뉴 관리</span>
                </Button>
              </Link>
              
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-xl">📊</span>
                <span>매출 보기</span>
              </Button>
              
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-xl">⚙️</span>
                <span>설정</span>
              </Button>
              
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <span className="text-xl">📞</span>
                <span>고객센터</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}