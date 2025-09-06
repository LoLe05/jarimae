'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Button, Input, Tabs } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

interface UserProfile {
  id: string
  name: string
  nickname: string
  email: string
  phone: string
  address: {
    zipCode: string
    address: string
    detailAddress: string
  }
  preferences: {
    cuisineTypes: string[]
    priceRange: string[]
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
  stats: {
    totalReservations: number
    totalReviews: number
    totalPoints: number
    favoriteRestaurants: number
  }
}

interface Reservation {
  id: string
  restaurantName: string
  restaurantImage: string
  date: string
  time: string
  guests: number
  status: 'upcoming' | 'completed' | 'cancelled'
  canReview: boolean
  canCancel: boolean
}

interface Review {
  id: string
  restaurantName: string
  rating: number
  content: string
  date: string
  images?: string[]
}

/**
 * 고객 프로필 관리 페이지
 * HTML 시안: jarimae_user_profile_creative.html
 * 경로: /profile
 */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 임시 사용자 데이터
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user123',
    name: '김고객',
    nickname: '맛집탐험가',
    email: 'customer@example.com',
    phone: '010-1234-5678',
    address: {
      zipCode: '06292',
      address: '서울특별시 강남구 테헤란로 123',
      detailAddress: '101동 502호'
    },
    preferences: {
      cuisineTypes: ['한식', '일식', '양식'],
      priceRange: ['₩₩', '₩₩₩'],
      notifications: {
        email: true,
        sms: true,
        push: false
      }
    },
    stats: {
      totalReservations: 15,
      totalReviews: 12,
      totalPoints: 2500,
      favoriteRestaurants: 8
    }
  })

  // 임시 예약 내역
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      restaurantName: '맛있는 한식당',
      restaurantImage: '/placeholder-restaurant.jpg',
      date: '2025-09-15',
      time: '19:00',
      guests: 4,
      status: 'upcoming',
      canReview: false,
      canCancel: true
    },
    {
      id: '2',
      restaurantName: '이탈리안 레스토랑',
      restaurantImage: '/placeholder-restaurant.jpg', 
      date: '2025-09-03',
      time: '18:30',
      guests: 2,
      status: 'completed',
      canReview: true,
      canCancel: false
    },
    {
      id: '3',
      restaurantName: '스시마스터',
      restaurantImage: '/placeholder-restaurant.jpg',
      date: '2025-08-20',
      time: '20:00',
      guests: 3,
      status: 'completed',
      canReview: false,
      canCancel: false
    }
  ])

  // 임시 리뷰 데이터
  const [userReviews, setUserReviews] = useState<Review[]>([
    {
      id: '1',
      restaurantName: '스시마스터',
      rating: 5,
      content: '정말 신선하고 맛있었어요! 특히 참치가 입에서 녹더라고요. 서비스도 훌륭했습니다.',
      date: '2025-08-22'
    },
    {
      id: '2',
      restaurantName: '맛있는 피자집',
      rating: 4,
      content: '분위기 좋고 피자도 맛있어요. 다만 조금 짜긴 했지만 전반적으로 만족합니다.',
      date: '2025-08-15'
    }
  ])

  useEffect(() => {
    // 실제로는 API에서 사용자 정보를 가져옴
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleProfileSave = async () => {
    setIsLoading(true)
    
    try {
      // TODO: 실제 프로필 업데이트 API 호출
      console.log('Updated profile:', userProfile)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsEditing(false)
      alert('프로필이 성공적으로 업데이트되었습니다!')
    } catch (error) {
      console.error('Profile update error:', error)
      alert('프로필 업데이트 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm('정말 예약을 취소하시겠습니까?')) return

    try {
      // TODO: 실제 예약 취소 API 호출
      console.log('Cancel reservation:', reservationId)
      
      setReservations(prev =>
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status: 'cancelled' as const, canCancel: false }
            : res
        )
      )
      
      alert('예약이 취소되었습니다.')
    } catch (error) {
      console.error('Cancel reservation error:', error)
      alert('예약 취소 중 오류가 발생했습니다.')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setUserProfile(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof UserProfile] as object || {}),
          [child]: value
        }
      }))
    } else {
      setUserProfile(prev => ({ ...prev, [field]: value }))
    }
  }

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: Reservation['status']) => {
    switch (status) {
      case 'upcoming': return '예정'
      case 'completed': return '완료'
      case 'cancelled': return '취소'
      default: return '알 수 없음'
    }
  }

  if (isLoading && !isEditing) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">로딩 중...</p>
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
        
        {/* 프로필 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brown-900">
                안녕하세요, {userProfile.nickname}님! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                자리매와 함께하는 맛집 여행을 관리해보세요
              </p>
            </div>
            <div className="w-20 h-20 bg-hazelnut-100 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
          </div>

          {/* 통계 요약 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: '총 예약', value: userProfile.stats.totalReservations, icon: '📅' },
              { label: '작성한 리뷰', value: userProfile.stats.totalReviews, icon: '⭐' },
              { label: '적립 포인트', value: userProfile.stats.totalPoints, icon: '🪙' },
              { label: '즐겨찾기', value: userProfile.stats.favoriteRestaurants, icon: '❤️' }
            ].map((stat, index) => (
              <Card key={index} className="p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-hazelnut mb-1">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* 탭 메뉴 */}
        <Card className="mb-8">
          <div className="flex border-b">
            {[
              { id: 'overview', label: '개요' },
              { id: 'reservations', label: '예약내역', badge: reservations.filter(r => r.status === 'upcoming').length },
              { id: 'reviews', label: '내 리뷰', badge: userReviews.length },
              { id: 'settings', label: '설정' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-colors relative
                  ${activeTab === tab.id
                    ? 'text-hazelnut border-b-2 border-hazelnut'
                    : 'text-gray-600 hover:text-hazelnut'
                  }
                `}
              >
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className="bg-hazelnut text-white text-xs px-2 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            
            {/* 개요 탭 */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 다가오는 예약 */}
                <div>
                  <h3 className="text-lg font-semibold text-brown-900 mb-4">
                    📅 다가오는 예약
                  </h3>
                  
                  {reservations.filter(r => r.status === 'upcoming').length > 0 ? (
                    <div className="space-y-3">
                      {reservations
                        .filter(r => r.status === 'upcoming')
                        .slice(0, 3)
                        .map(reservation => (
                          <Card key={reservation.id} className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                🍽️
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-brown-900">
                                  {reservation.restaurantName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {reservation.date} {reservation.time} • {reservation.guests}명
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {reservation.canCancel && (
                                  <Button
                                    onClick={() => handleCancelReservation(reservation.id)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    취소
                                  </Button>
                                )}
                                <Button size="sm">상세보기</Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center text-gray-500">
                      <div className="text-4xl mb-4">📅</div>
                      <p>예정된 예약이 없습니다</p>
                      <Link href="/search" className="inline-block mt-4">
                        <Button>맛집 찾아보기</Button>
                      </Link>
                    </Card>
                  )}
                </div>

                {/* 최근 활동 */}
                <div>
                  <h3 className="text-lg font-semibold text-brown-900 mb-4">
                    🎯 최근 활동
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600">✅</span>
                      <span className="text-sm">스시마스터에서 식사를 완료했어요</span>
                      <span className="text-xs text-gray-500 ml-auto">2일 전</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600">⭐</span>
                      <span className="text-sm">맛있는 피자집에 리뷰를 작성했어요</span>
                      <span className="text-xs text-gray-500 ml-auto">5일 전</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-hazelnut-50 rounded-lg">
                      <span className="text-hazelnut">🪙</span>
                      <span className="text-sm">포인트 500점을 적립했어요</span>
                      <span className="text-xs text-gray-500 ml-auto">1주 전</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 예약내역 탭 */}
            {activeTab === 'reservations' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-brown-900">
                    📅 예약 내역
                  </h3>
                  <div className="text-sm text-gray-600">
                    총 {reservations.length}건의 예약
                  </div>
                </div>

                <div className="space-y-4">
                  {reservations.map(reservation => (
                    <Card key={reservation.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          🍽️
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg font-semibold text-brown-900">
                              {reservation.restaurantName}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                              {getStatusLabel(reservation.status)}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-3">
                            📅 {reservation.date} {reservation.time} • 👥 {reservation.guests}명
                          </div>

                          <div className="flex gap-2">
                            {reservation.canReview && (
                              <Button variant="outline" size="sm">
                                리뷰 작성
                              </Button>
                            )}
                            {reservation.canCancel && (
                              <Button
                                onClick={() => handleCancelReservation(reservation.id)}
                                variant="outline"
                                size="sm"
                              >
                                예약 취소
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              상세 보기
                            </Button>
                            {reservation.status === 'completed' && (
                              <Button variant="outline" size="sm">
                                재예약
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 리뷰 탭 */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-brown-900">
                    ⭐ 내가 쓴 리뷰
                  </h3>
                  <div className="text-sm text-gray-600">
                    총 {userReviews.length}개의 리뷰
                  </div>
                </div>

                <div className="space-y-4">
                  {userReviews.map(review => (
                    <Card key={review.id} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-brown-900 mb-1">
                            {review.restaurantName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="text-yellow-500">
                              {'⭐'.repeat(review.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {review.date}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          수정
                        </Button>
                      </div>
                      
                      <p className="text-gray-700">{review.content}</p>
                    </Card>
                  ))}
                  
                  {userReviews.length === 0 && (
                    <Card className="p-8 text-center text-gray-500">
                      <div className="text-4xl mb-4">⭐</div>
                      <p>아직 작성한 리뷰가 없습니다</p>
                      <p className="text-sm mt-2">맛집을 방문하고 리뷰를 남겨보세요!</p>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* 설정 탭 */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                
                {/* 개인정보 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-brown-900">
                      👤 개인정보
                    </h3>
                    <Button
                      onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
                      loading={isLoading && isEditing}
                      size="sm"
                    >
                      {isEditing ? '저장' : '수정'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="이름"
                      value={userProfile.name}
                      onChange={(value) => handleInputChange('name', value)}
                      disabled={!isEditing}
                    />
                    <Input
                      label="닉네임"
                      value={userProfile.nickname}
                      onChange={(value) => handleInputChange('nickname', value)}
                      disabled={!isEditing}
                    />
                    <Input
                      label="이메일"
                      value={userProfile.email}
                      onChange={(value) => handleInputChange('email', value)}
                      disabled={!isEditing}
                    />
                    <Input
                      label="전화번호"
                      value={userProfile.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* 주소 정보 */}
                <div>
                  <h3 className="text-lg font-semibold text-brown-900 mb-4">
                    📍 주소 정보
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label="우편번호"
                        value={userProfile.address.zipCode}
                        onChange={(value) => handleInputChange('address.zipCode', value)}
                        disabled={!isEditing}
                      />
                      <div className="col-span-2">
                        <Input
                          label="기본주소"
                          value={userProfile.address.address}
                          onChange={(value) => handleInputChange('address.address', value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <Input
                      label="상세주소"
                      value={userProfile.address.detailAddress}
                      onChange={(value) => handleInputChange('address.detailAddress', value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* 알림 설정 */}
                <div>
                  <h3 className="text-lg font-semibold text-brown-900 mb-4">
                    🔔 알림 설정
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: '이메일 알림', desc: '예약 확인, 취소 등의 정보를 이메일로 받습니다' },
                      { key: 'sms', label: 'SMS 알림', desc: '예약 확인, 취소 등의 정보를 문자로 받습니다' },
                      { key: 'push', label: '푸시 알림', desc: '앱 내 푸시 알림을 받습니다' }
                    ].map(notification => (
                      <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-brown-900">
                            {notification.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {notification.desc}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userProfile.preferences.notifications[notification.key as keyof typeof userProfile.preferences.notifications]}
                            onChange={(e) => handleInputChange(`preferences.notifications.${notification.key}`, e.target.checked)}
                            className="sr-only peer"
                            disabled={!isEditing}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hazelnut-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hazelnut"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 계정 관리 */}
                <div>
                  <h3 className="text-lg font-semibold text-brown-900 mb-4">
                    ⚙️ 계정 관리
                  </h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      🔒 비밀번호 변경
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      📧 이메일 변경
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      📱 전화번호 변경
                    </Button>
                    <hr />
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      🗑️ 계정 탈퇴
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}