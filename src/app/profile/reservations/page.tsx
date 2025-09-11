'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { Calendar } from '@/components/ui/Calendar'
import { Header, Footer } from '@/components/layout'
import { useAuth } from '@/contexts/AuthContext'

interface ReservationItem {
  id: string
  restaurantName: string
  restaurantId: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  guests: number
  specialRequest?: string
  phone: string
  address: string
  createdAt: string
}

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  guests: number
}

/**
 * 내 예약 페이지
 * 경로: /profile/reservations
 */
export default function MyReservationsPage() {
  const { user, isLoggedIn } = useAuth()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  // 예약 데이터를 캘린더 이벤트로 변환
  const convertToCalendarEvents = (reservations: ReservationItem[]): CalendarEvent[] => {
    return reservations.map(reservation => ({
      id: reservation.id,
      title: reservation.restaurantName,
      date: reservation.date,
      time: reservation.time,
      status: reservation.status,
      guests: reservation.guests
    }))
  }

  // 캘린더 이벤트 핸들러
  const handleDateClick = (date: Date) => {
    console.log('날짜 클릭:', date.toDateString())
  }

  const handleEventClick = (event: CalendarEvent) => {
    console.log('이벤트 클릭:', event)
  }

  // 임시 예약 데이터
  const [reservations] = useState<ReservationItem[]>([
    {
      id: '1',
      restaurantName: '맛있는 한식당',
      restaurantId: '1',
      date: '2025-09-15',
      time: '19:00',
      status: 'confirmed',
      guests: 4,
      specialRequest: '창가 자리로 부탁드립니다',
      phone: '02-1234-5678',
      address: '서울특별시 강남구 테헤란로 123',
      createdAt: '2025-09-06'
    },
    {
      id: '2',
      restaurantName: '이탈리안 레스토랑',
      restaurantId: '2',
      date: '2025-09-20',
      time: '18:30',
      status: 'pending',
      guests: 2,
      phone: '02-2345-6789',
      address: '서울특별시 강남구 강남대로 456',
      createdAt: '2025-09-05'
    },
    {
      id: '3',
      restaurantName: '스시마스터',
      restaurantId: '3',
      date: '2025-08-30',
      time: '20:00',
      status: 'completed',
      guests: 3,
      phone: '02-3456-7890',
      address: '서울특별시 강남구 압구정로 789',
      createdAt: '2025-08-25'
    },
    {
      id: '4',
      restaurantName: '브런치 카페',
      restaurantId: '4',
      date: '2025-08-25',
      time: '11:30',
      status: 'cancelled',
      guests: 2,
      phone: '02-4567-8901',
      address: '서울특별시 서초구 서초대로 321',
      createdAt: '2025-08-20'
    }
  ])

  // 예약 상태별 필터링
  const upcomingReservations = reservations.filter(
    r => r.status === 'confirmed' || r.status === 'pending'
  )
  const pastReservations = reservations.filter(
    r => r.status === 'completed' || r.status === 'cancelled'
  )

  const getStatusColor = (status: ReservationItem['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: ReservationItem['status']) => {
    switch (status) {
      case 'confirmed':
        return '예약 확정'
      case 'pending':
        return '승인 대기'
      case 'cancelled':
        return '예약 취소'
      case 'completed':
        return '방문 완료'
      default:
        return '알 수 없음'
    }
  }

  const handleCancelReservation = (reservationId: string) => {
    if (confirm('정말 예약을 취소하시겠습니까?')) {
      console.log('Cancel reservation:', reservationId)
      // TODO: API 호출로 예약 취소
    }
  }

  const currentReservations = activeTab === 'upcoming' ? upcomingReservations : pastReservations

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <Card className="max-w-md mx-auto p-8">
            <h1 className="text-2xl font-bold text-brown-900 mb-4">
              로그인이 필요합니다
            </h1>
            <p className="text-gray-600 mb-6">
              내 예약을 확인하려면 먼저 로그인해주세요
            </p>
            <Link href="/auth/login">
              <Button size="lg" className="w-full">
                로그인하기
              </Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <main className="container mx-auto px-4 py-20 space-y-6">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-brown-900 mb-2">
            내 예약
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {user?.name}님의 예약 내역을 확인하세요
          </p>
        </div>

        {/* 캘린더 섹션 */}
        <div className="mb-6">
          <Calendar
            events={convertToCalendarEvents(reservations)}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`
              flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 mobile-tap
              ${activeTab === 'upcoming'
                ? 'bg-hazelnut text-white shadow-md'
                : 'text-gray-600 hover:text-hazelnut'
              }
            `}
          >
            예정된 예약 ({upcomingReservations.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`
              flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 mobile-tap
              ${activeTab === 'past'
                ? 'bg-hazelnut text-white shadow-md'
                : 'text-gray-600 hover:text-hazelnut'
              }
            `}
          >
            지난 예약 ({pastReservations.length})
          </button>
        </div>

        {/* 예약 목록 */}
        <div className="space-y-4">
          {currentReservations.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-brown-900 mb-2">
                {activeTab === 'upcoming' ? '예정된 예약이 없습니다' : '지난 예약이 없습니다'}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'upcoming' 
                  ? '새로운 예약을 만들어보세요!' 
                  : '아직 완료된 예약이 없습니다'}
              </p>
              {activeTab === 'upcoming' && (
                <Link href="/search">
                  <Button>
                    맛집 찾아보기
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            currentReservations.map((reservation) => (
              <Card key={reservation.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* 레스토랑 정보 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/restaurant/${reservation.restaurantId}`}
                          className="text-lg sm:text-xl font-semibold text-brown-900 hover:text-hazelnut transition-colors mobile-tap line-clamp-1"
                        >
                          {reservation.restaurantName}
                        </Link>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1">
                          📍 {reservation.address}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h3z" />
                        </svg>
                        {reservation.date} {reservation.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {reservation.guests}명
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {reservation.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        예약일: {reservation.createdAt}
                      </div>
                    </div>

                    {reservation.specialRequest && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">특별 요청:</span> {reservation.specialRequest}
                        </div>
                      </div>
                    )}

                    {/* 액션 버튼들 */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none mobile-tap">
                        📞 매장 전화
                      </Button>
                      
                      {reservation.status === 'confirmed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 sm:flex-none text-red-600 hover:text-red-700 mobile-tap"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          예약 취소
                        </Button>
                      )}
                      
                      {reservation.status === 'completed' && (
                        <Button 
                          size="sm" 
                          className="flex-1 sm:flex-none mobile-tap"
                        >
                          리뷰 작성
                        </Button>
                      )}
                      
                      <Link href={`/restaurant/${reservation.restaurantId}`} className="flex-1 sm:flex-none">
                        <Button size="sm" className="w-full mobile-tap">
                          매장 보기
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* 빠른 액션 */}
        <Card className="p-6 bg-gradient-to-r from-hazelnut/5 to-muted-blue/5 border-hazelnut/20">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-brown-900 mb-2">
              새로운 예약을 원하시나요?
            </h3>
            <p className="text-gray-600 mb-4">
              자리매에서 더 많은 맛집을 발견해보세요
            </p>
            <Link href="/search">
              <Button size="lg" className="mobile-tap">
                🍽️ 맛집 찾아보기
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}