'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, Button } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

interface BookingDetails {
  bookingId: string
  restaurantName: string
  restaurantAddress: string
  restaurantPhone: string
  date: string
  time: string
  guests: number
  customerName: string
  customerPhone: string
  customerEmail: string
  specialRequests?: string
  depositAmount: number
  paymentMethod: string
  status: 'confirmed' | 'pending'
}

/**
 * 예약 완료 페이지
 * HTML 시안: jarimae_booking_success.html
 * 경로: /booking/success
 */
export default function BookingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get('id')
  
  const [isLoading, setIsLoading] = useState(true)
  
  // 임시 예약 상세 데이터
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    bookingId: 'JM-20250905-001',
    restaurantName: '맛있는 한식당',
    restaurantAddress: '서울특별시 강남구 테헤란로 123',
    restaurantPhone: '02-1234-5678',
    date: '2025-09-10',
    time: '19:00',
    guests: 4,
    customerName: '김고객',
    customerPhone: '010-1234-5678',
    customerEmail: 'customer@example.com',
    specialRequests: '창가 자리 부탁드려요',
    depositAmount: 10000,
    paymentMethod: '신용카드',
    status: 'confirmed'
  })

  useEffect(() => {
    // 실제로는 API에서 예약 정보를 가져옴
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [restaurantId])

  const handleAddToCalendar = () => {
    const { date, time, restaurantName } = bookingDetails
    const startDate = new Date(`${date}T${time}:00`)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2시간 후

    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render')
    googleCalendarUrl.searchParams.set('action', 'TEMPLATE')
    googleCalendarUrl.searchParams.set('text', `${restaurantName} 예약`)
    googleCalendarUrl.searchParams.set('dates', 
      `${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
    )
    googleCalendarUrl.searchParams.set('details', 
      `예약번호: ${bookingDetails.bookingId}\n인원: ${bookingDetails.guests}명\n연락처: ${bookingDetails.restaurantPhone}`
    )
    googleCalendarUrl.searchParams.set('location', bookingDetails.restaurantAddress)

    window.open(googleCalendarUrl.toString(), '_blank')
  }

  const handleShare = () => {
    const shareText = `자리매에서 ${bookingDetails.restaurantName} 예약했어요! 📅 ${bookingDetails.date} ${bookingDetails.time}`
    
    if (navigator.share) {
      navigator.share({
        title: '자리매 예약 완료',
        text: shareText,
        url: window.location.href
      })
    } else {
      // Fallback: 클립보드 복사
      navigator.clipboard.writeText(shareText).then(() => {
        alert('예약 정보가 클립보드에 복사되었습니다!')
      })
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">예약 처리 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

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
            🎉 예약이 완료되었습니다!
          </h1>
          <p className="text-gray-600">
            예약 확정 알림을 문자와 이메일로 발송해드렸어요
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* 예약 정보 카드 */}
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🍽️</div>
              <h2 className="text-2xl font-bold text-brown-900 mb-2">
                {bookingDetails.restaurantName}
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bookingDetails.status === 'confirmed' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {bookingDetails.status === 'confirmed' ? '✅ 예약 확정' : '⏳ 확인 중'}
                </span>
              </div>
            </div>

            {/* 예약 상세 정보 */}
            <div className="space-y-4">
              
              {/* 예약번호 */}
              <div className="bg-hazelnut-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">예약번호</div>
                <div className="text-lg font-bold text-hazelnut">
                  {bookingDetails.bookingId}
                </div>
              </div>

              {/* 예약 정보 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-6">📅</span>
                    <div>
                      <div className="text-sm text-gray-600">날짜</div>
                      <div className="font-medium">{formatDate(bookingDetails.date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-6">⏰</span>
                    <div>
                      <div className="text-sm text-gray-600">시간</div>
                      <div className="font-medium">{bookingDetails.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-6">👥</span>
                    <div>
                      <div className="text-sm text-gray-600">인원</div>
                      <div className="font-medium">{bookingDetails.guests}명</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-6">📍</span>
                    <div>
                      <div className="text-sm text-gray-600">주소</div>
                      <div className="font-medium text-sm">{bookingDetails.restaurantAddress}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-6">📞</span>
                    <div>
                      <div className="text-sm text-gray-600">연락처</div>
                      <div className="font-medium">{bookingDetails.restaurantPhone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-6">💳</span>
                    <div>
                      <div className="text-sm text-gray-600">보증금</div>
                      <div className="font-medium">{bookingDetails.depositAmount.toLocaleString()}원</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 특별 요청사항 */}
              {bookingDetails.specialRequests && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">특별 요청사항</div>
                  <div className="font-medium">{bookingDetails.specialRequests}</div>
                </div>
              )}
            </div>
          </Card>

          {/* 예약자 정보 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-brown-900 mb-4">
              👤 예약자 정보
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">이름</span>
                <span className="font-medium">{bookingDetails.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">전화번호</span>
                <span className="font-medium">{bookingDetails.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">이메일</span>
                <span className="font-medium">{bookingDetails.customerEmail}</span>
              </div>
            </div>
          </Card>

          {/* 중요 안내사항 */}
          <Card className="p-6 border-l-4 border-l-yellow-400">
            <h3 className="text-lg font-semibold text-brown-900 mb-4 flex items-center gap-2">
              ⚠️ 중요 안내사항
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• 예약 시간 10분 전까지 도착해주세요</p>
              <p>• 예약 변경/취소는 방문 2시간 전까지 가능합니다</p>
              <p>• 노쇼 시 보증금은 환불되지 않습니다</p>
              <p>• 문의사항은 식당으로 직접 연락해주세요</p>
            </div>
          </Card>

          {/* 액션 버튼들 */}
          <div className="space-y-4">
            
            {/* 주요 액션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleAddToCalendar}
                variant="outline"
                size="lg"
                className="flex items-center justify-center gap-2"
              >
                📅 캘린더에 추가
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="lg"
                className="flex items-center justify-center gap-2"
              >
                📤 공유하기
              </Button>
            </div>

            {/* 식당 관련 액션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href={`/restaurant/${restaurantId}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                >
                  🍽️ 식당 정보 보기
                </Button>
              </Link>
              <Button
                onClick={() => window.location.href = `tel:${bookingDetails.restaurantPhone}`}
                variant="outline"
                size="lg"
                className="flex items-center justify-center gap-2"
              >
                📞 식당에 전화하기
              </Button>
            </div>

            {/* 메인 액션 */}
            <Link href="/">
              <Button
                size="lg"
                className="w-full"
              >
                🏠 메인으로 돌아가기
              </Button>
            </Link>
          </div>

          {/* 추가 서비스 홍보 */}
          <Card className="p-6 bg-gradient-to-r from-hazelnut-50 to-muted-blue-50">
            <h3 className="text-lg font-semibold text-brown-900 mb-4">
              🎁 자리매 더 활용하기
            </h3>
            <div className="space-y-3 text-sm">
              <Link 
                href="/profile" 
                className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
              >
                <span className="text-2xl">👤</span>
                <div>
                  <div className="font-medium">내 예약 관리하기</div>
                  <div className="text-gray-600">예약 내역을 확인하고 관리해보세요</div>
                </div>
              </Link>
              
              <Link 
                href="/search" 
                className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
              >
                <span className="text-2xl">🔍</span>
                <div>
                  <div className="font-medium">다른 맛집 찾아보기</div>
                  <div className="text-gray-600">새로운 맛집을 발견해보세요</div>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}