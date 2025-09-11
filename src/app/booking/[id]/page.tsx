'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, Button, Input } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

export default function BookingPage() {
  const params = useParams()
  const restaurantId = params.id as string
  
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    guests: 2,
    name: '',
    phone: '',
    email: '',
    specialRequest: ''
  })

  // 더미 식당 정보
  const restaurant = {
    id: restaurantId,
    name: '맛있는 한식당',
    address: '서울특별시 강남구 테헤란로 123',
    phone: '02-1234-5678'
  }

  const handleBooking = async () => {
    console.log('예약 데이터:', bookingData)
    // TODO: 실제 예약 API 호출
    alert('예약이 완료되었습니다!')
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 뒤로가기 */}
        <div className="mb-6">
          <Link href={`/restaurant/${restaurantId}`} className="text-hazelnut hover:text-muted-blue transition-colors">
            ← 식당으로 돌아가기
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 예약 폼 */}
          <Card>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-brown-900 mb-6">🍽️ 예약하기</h1>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                    <Input
                      type="date"
                      value={bookingData.date}
                      onChange={(value) => setBookingData({...bookingData, date: value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                    <Input
                      type="time"
                      value={bookingData.time}
                      onChange={(value) => setBookingData({...bookingData, time: value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">인원</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>{num}명</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <Input
                    value={bookingData.name}
                    onChange={(value) => setBookingData({...bookingData, name: value})}
                    placeholder="예약자 이름"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                  <Input
                    value={bookingData.phone}
                    onChange={(value) => setBookingData({...bookingData, phone: value})}
                    placeholder="010-1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <Input
                    type="email"
                    value={bookingData.email}
                    onChange={(value) => setBookingData({...bookingData, email: value})}
                    placeholder="이메일 주소"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">특별 요청사항</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none"
                    value={bookingData.specialRequest}
                    onChange={(e) => setBookingData({...bookingData, specialRequest: e.target.value})}
                    placeholder="알레르기, 자리 요청 등"
                  />
                </div>

                <Button 
                  onClick={handleBooking}
                  className="w-full py-4 text-lg"
                  disabled={!bookingData.date || !bookingData.time || !bookingData.name || !bookingData.phone}
                >
                  예약하기
                </Button>
              </div>
            </div>
          </Card>

          {/* 식당 정보 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-brown-900 mb-4">📍 식당 정보</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                  <p className="text-gray-600">{restaurant.address}</p>
                  <p className="text-gray-600">{restaurant.phone}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">📝 예약 안내</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 예약 확정까지 최대 1시간 소요</li>
                    <li>• 노쇼 시 향후 예약이 제한될 수 있습니다</li>
                    <li>• 예약 변경은 방문 2시간 전까지 가능합니다</li>
                    <li>• 단체 예약(8명 이상)은 전화 문의 바랍니다</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">💳 결제 안내</h4>
                  <p className="text-sm text-gray-600">
                    현장 결제 또는 예약 시 선결제를 선택하실 수 있습니다.
                    취소 시 결제 수단에 따라 환불 처리됩니다.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}