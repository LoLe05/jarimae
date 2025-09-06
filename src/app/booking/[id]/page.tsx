'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Card, Button, Input } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

interface BookingData {
  restaurantId: string
  date: string
  time: string
  guests: number
  specialRequests: string
  customerInfo: {
    name: string
    phone: string
    email: string
  }
}

interface PaymentData {
  method: 'card' | 'kakaopay' | 'naverpay' | 'payco'
  amount: number
  depositAmount: number
}

interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  priceRange: string
  minDeposit: number
}

interface TimeSlot {
  time: string
  available: boolean
  remaining: number
}

/**
 * 예약 및 결제 페이지
 * HTML 시안: jarimae_booking_and_payment.html
 * 경로: /booking/[id]
 */
export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id as string
  
  const [currentStep, setCurrentStep] = useState(1) // 1: 예약정보, 2: 고객정보, 3: 결제
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  
  const [bookingData, setBookingData] = useState<BookingData>({
    restaurantId,
    date: '',
    time: '',
    guests: 2,
    specialRequests: '',
    customerInfo: {
      name: '',
      phone: '',
      email: ''
    }
  })
  
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'card',
    amount: 0,
    depositAmount: 10000
  })

  // 임시 식당 데이터
  const [restaurant] = useState<Restaurant>({
    id: restaurantId,
    name: '맛있는 한식당',
    address: '서울특별시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    priceRange: '₩₩',
    minDeposit: 10000
  })

  // 시간대별 예약 가능 현황
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: '17:00', available: true, remaining: 3 },
    { time: '17:30', available: true, remaining: 1 },
    { time: '18:00', available: true, remaining: 5 },
    { time: '18:30', available: false, remaining: 0 },
    { time: '19:00', available: true, remaining: 2 },
    { time: '19:30', available: true, remaining: 4 },
    { time: '20:00', available: true, remaining: 3 },
    { time: '20:30', available: false, remaining: 0 }
  ])

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    // 오늘 날짜를 기본값으로 설정
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    const defaultDate = tomorrow.toISOString().split('T')[0]
    setSelectedDate(defaultDate)
    setBookingData(prev => ({ ...prev, date: defaultDate }))
  }, [])

  // 다음 7일 날짜 생성
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('ko-KR', { 
          month: 'short', 
          day: 'numeric',
          weekday: 'short'
        })
      })
    }
    return dates
  }

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (step === 1) {
      if (!bookingData.date) {
        newErrors.date = '날짜를 선택해주세요'
      }
      if (!bookingData.time) {
        newErrors.time = '시간을 선택해주세요'
      }
      if (bookingData.guests < 1 || bookingData.guests > 10) {
        newErrors.guests = '인원은 1~10명까지 선택 가능합니다'
      }
    } else if (step === 2) {
      if (!bookingData.customerInfo.name) {
        newErrors.name = '이름을 입력해주세요'
      }
      if (!bookingData.customerInfo.phone) {
        newErrors.phone = '전화번호를 입력해주세요'
      } else if (!/^010-\d{4}-\d{4}$/.test(bookingData.customerInfo.phone)) {
        newErrors.phone = '올바른 전화번호를 입력해주세요 (010-0000-0000)'
      }
      if (!bookingData.customerInfo.email) {
        newErrors.email = '이메일을 입력해주세요'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.customerInfo.email)) {
        newErrors.email = '올바른 이메일을 입력해주세요'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setBookingData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof BookingData] as object || {}),
          [child]: value
        }
      }))
    } else {
      setBookingData(prev => ({ ...prev, [field]: value }))
    }
    
    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    handleInputChange('date', date)
    // 날짜 변경시 시간 초기화
    handleInputChange('time', '')
  }

  const handleTimeSelect = (time: string) => {
    handleInputChange('time', time)
  }

  const handlePaymentMethodChange = (method: PaymentData['method']) => {
    setPaymentData(prev => ({ ...prev, method }))
  }

  const handleSubmitBooking = async () => {
    if (!validateStep(2)) return

    setIsLoading(true)
    
    try {
      // TODO: 실제 예약 및 결제 API 호출
      console.log('Booking data:', bookingData)
      console.log('Payment data:', paymentData)
      
      // 임시로 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // 예약 완료 페이지로 이동
      router.push(`/booking/success?id=${restaurantId}`)
    } catch (error) {
      console.error('Booking error:', error)
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const availableDates = getAvailableDates()

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        
        {/* 식당 정보 헤더 */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brown-900 mb-2">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 text-sm">
                📍 {restaurant.address}
              </p>
            </div>
            <Link 
              href={`/restaurant/${restaurantId}`}
              className="text-hazelnut hover:text-hazelnut-600 text-sm"
            >
              식당 정보 보기 →
            </Link>
          </div>
        </Card>

        {/* 진행 단계 */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${step <= currentStep 
                    ? 'bg-hazelnut text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 3 && (
                  <div className={`
                    flex-1 h-1 mx-4
                    ${step < currentStep ? 'bg-hazelnut' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>예약 정보</span>
            <span>고객 정보</span>
            <span>결제</span>
          </div>
        </div>

        {/* 예약 폼 */}
        <div className="max-w-2xl mx-auto">
          
          {/* 1단계: 예약 정보 */}
          {currentStep === 1 && (
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-brown-900 mb-6">
                📅 예약 정보를 선택해주세요
              </h2>

              <div className="space-y-6">
                {/* 날짜 선택 */}
                <div>
                  <label className="block text-sm font-medium text-brown-900 mb-3">
                    날짜 선택
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                    {availableDates.map(date => (
                      <button
                        key={date.value}
                        onClick={() => handleDateChange(date.value)}
                        className={`
                          p-3 rounded-lg border text-sm font-medium transition-colors
                          ${selectedDate === date.value
                            ? 'border-hazelnut bg-hazelnut text-white'
                            : 'border-gray-300 hover:border-hazelnut hover:bg-hazelnut-50'
                          }
                        `}
                      >
                        {date.label}
                      </button>
                    ))}
                  </div>
                  {errors.date && (
                    <p className="text-red-600 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                {/* 시간 선택 */}
                <div>
                  <label className="block text-sm font-medium text-brown-900 mb-3">
                    시간 선택
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`
                          p-3 rounded-lg border text-sm font-medium transition-colors
                          ${!slot.available
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : bookingData.time === slot.time
                            ? 'border-hazelnut bg-hazelnut text-white'
                            : 'border-gray-300 hover:border-hazelnut hover:bg-hazelnut-50'
                          }
                        `}
                      >
                        <div>{slot.time}</div>
                        <div className="text-xs">
                          {slot.available ? `${slot.remaining}자리` : '마감'}
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.time && (
                    <p className="text-red-600 text-sm mt-1">{errors.time}</p>
                  )}
                </div>

                {/* 인원 선택 */}
                <div>
                  <label className="block text-sm font-medium text-brown-900 mb-3">
                    인원 수
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleInputChange('guests', Math.max(1, bookingData.guests - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold min-w-[3rem] text-center">
                      {bookingData.guests}명
                    </span>
                    <button
                      onClick={() => handleInputChange('guests', Math.min(10, bookingData.guests + 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  {errors.guests && (
                    <p className="text-red-600 text-sm mt-1">{errors.guests}</p>
                  )}
                </div>

                {/* 특별 요청사항 */}
                <div>
                  <label className="block text-sm font-medium text-brown-900 mb-3">
                    특별 요청사항 (선택)
                  </label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="알레르기, 축하 이벤트, 기타 요청사항을 입력해주세요"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-hazelnut focus:outline-none resize-none h-20"
                  />
                </div>

                <Button
                  onClick={handleNext}
                  size="lg"
                  className="w-full"
                >
                  다음 단계
                </Button>
              </div>
            </Card>
          )}

          {/* 2단계: 고객 정보 */}
          {currentStep === 2 && (
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-brown-900 mb-6">
                👤 고객 정보를 입력해주세요
              </h2>

              <div className="space-y-6">
                <Input
                  id="name"
                  placeholder="예약자 성함"
                  value={bookingData.customerInfo.name}
                  onChange={(value) => handleInputChange('customerInfo.name', value)}
                  error={!!errors.name}
                  errorMessage={errors.name}
                />

                <Input
                  id="phone"
                  type="tel"
                  placeholder="전화번호 (010-0000-0000)"
                  value={bookingData.customerInfo.phone}
                  onChange={(value) => handleInputChange('customerInfo.phone', value)}
                  error={!!errors.phone}
                  errorMessage={errors.phone}
                />

                <Input
                  id="email"
                  type="email"
                  placeholder="이메일 주소"
                  value={bookingData.customerInfo.email}
                  onChange={(value) => handleInputChange('customerInfo.email', value)}
                  error={!!errors.email}
                  errorMessage={errors.email}
                />

                {/* 예약 정보 요약 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-brown-900 mb-3">예약 정보 확인</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>식당</span>
                      <span>{restaurant.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>날짜</span>
                      <span>{bookingData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>시간</span>
                      <span>{bookingData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>인원</span>
                      <span>{bookingData.guests}명</span>
                    </div>
                    {bookingData.specialRequests && (
                      <div className="flex justify-between">
                        <span>요청사항</span>
                        <span className="text-right max-w-[200px]">
                          {bookingData.specialRequests}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="flex-1"
                  >
                    다음 단계
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* 3단계: 결제 */}
          {currentStep === 3 && (
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-brown-900 mb-6">
                💳 결제 정보
              </h2>

              <div className="space-y-6">
                {/* 예약 보증금 안내 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">
                    💡 예약 보증금 안내
                  </h3>
                  <p className="text-sm text-blue-800">
                    예약 확정을 위해 보증금 {restaurant.minDeposit.toLocaleString()}원이 필요합니다.<br />
                    방문 시 식사 금액에서 차감됩니다.
                  </p>
                </div>

                {/* 결제 방법 선택 */}
                <div>
                  <h3 className="font-medium text-brown-900 mb-3">결제 방법</h3>
                  <div className="space-y-3">
                    {[
                      { value: 'card', label: '신용카드', icon: '💳' },
                      { value: 'kakaopay', label: '카카오페이', icon: '💛' },
                      { value: 'naverpay', label: '네이버페이', icon: '💚' },
                      { value: 'payco', label: '페이코', icon: '🔴' }
                    ].map(method => (
                      <label key={method.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentData.method === method.value}
                          onChange={(e) => handlePaymentMethodChange(e.target.value as PaymentData['method'])}
                          className="mr-3 text-hazelnut focus:ring-hazelnut"
                        />
                        <span className="mr-2">{method.icon}</span>
                        <span>{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 결제 금액 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>결제 금액</span>
                    <span className="text-hazelnut">
                      {restaurant.minDeposit.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleSubmitBooking}
                    loading={isLoading}
                    size="lg"
                    className="flex-1"
                  >
                    {isLoading ? '결제 중...' : '결제하고 예약완료'}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}