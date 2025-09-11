'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Button, Input, Tabs } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { useAuth } from '@/contexts/AuthContext'

interface UserProfile {
  id: string
  name: string
  nickname: string
  email: string
  phone: string
  avatar: string
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
    score: number
    rank: 'unguest' | 'wanderer' | 'settler' | 'landlord' | 'patriarch'
  }
  selectedTitle: {
    id: string
    name: string
    icon: string
    description: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }
  availableTitles: Array<{
    id: string
    name: string
    icon: string
    description: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    unlocked: boolean
  }>
  achievements: Array<{
    id: string
    name: string
    icon: string
    description: string
    unlockedAt: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }>
  subscription: {
    type: 'free' | 'companion' | 'friend'
    expiresAt?: string
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
 * 마이페이지 - 고객 정보 관리 페이지
 * HTML 시안: jarimae_user_profile_creative.html
 * 경로: /profile
 */
export default function MyPage() {
  const { updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showTitleModal, setShowTitleModal] = useState(false)
  const [showScoreChart, setShowScoreChart] = useState(false)

  // 임시 사용자 데이터
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user123',
    name: '김고객',
    nickname: '정착자',
    email: 'customer@example.com',
    phone: '010-1234-5678',
    avatar: '🙋‍♂️',
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
      favoriteRestaurants: 8,
      score: 75,
      rank: 'settler'
    },
    selectedTitle: {
      id: 'loyal_customer',
      name: '단골손님',
      icon: '🏠',
      description: '자리매에서 꾸준히 활동하는 믿음직한 단골',
      rarity: 'rare'
    },
    availableTitles: [
      {
        id: 'newbie',
        name: '새내기',
        icon: '🌱',
        description: '자리매에 첫 발을 내딛은 새내기',
        rarity: 'common',
        unlocked: true
      },
      {
        id: 'loyal_customer',
        name: '단골손님',
        icon: '🏠',
        description: '자리매에서 꾸준히 활동하는 믿음직한 단골',
        rarity: 'rare',
        unlocked: true
      },
      {
        id: 'food_critic',
        name: '미식 평론가',
        icon: '📝',
        description: '깐깐한 기준으로 리뷰를 작성하는 평론가',
        rarity: 'epic',
        unlocked: false
      },
      {
        id: 'local_guide',
        name: '동네 안내자',
        icon: '🗺️',
        description: '지역 맛집을 누구보다 잘 아는 안내자',
        rarity: 'epic',
        unlocked: false
      }
    ],
    achievements: [
      {
        id: 'first_review',
        name: '첫 리뷰어',
        icon: '⭐',
        description: '첫 리뷰를 작성했습니다',
        unlockedAt: '2025-08-01',
        rarity: 'common'
      },
      {
        id: 'reservation_streak',
        name: '예약 연속 달성',
        icon: '📅',
        description: '연속으로 예약을 완료했습니다',
        unlockedAt: '2025-08-20',
        rarity: 'rare'
      },
      {
        id: 'point_collector',
        name: '포인트 수집가',
        icon: '🪙',
        description: '많은 포인트를 모았습니다',
        unlockedAt: '2025-08-15',
        rarity: 'rare'
      }
    ],
    subscription: {
      type: 'free'
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // 아바타 아이콘 목록
  const avatarOptions = [
    '🙋‍♂️', '🙋‍♀️', '👨‍💼', '👩‍💼', '👨‍🍳', '👩‍🍳',
    '🤵', '👰', '👨‍🎓', '👩‍🎓', '🧑‍💻', '👨‍⚕️',
    '👩‍⚕️', '👨‍🌾', '👩‍🌾', '🦸‍♂️', '🦸‍♀️', '🥷',
    '👑', '🎭', '🐱', '🐶', '🐸', '🐧'
  ]

  // 매김이 등급 정보
  const getRankInfo = (rank: string) => {
    switch (rank) {
      case 'unguest': return { name: '불청객', color: 'bg-red-100 text-red-700 border-red-200', icon: '🚫', range: '-100점 ~ -1점' }
      case 'wanderer': return { name: '방랑자', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '🚶', range: '0점 ~ 30점' }
      case 'settler': return { name: '정착자', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🏠', range: '30점 ~ 99점' }
      case 'landlord': return { name: '땅지기', color: 'bg-green-100 text-green-700 border-green-200', icon: '🌱', range: '100점 이상' }
      case 'patriarch': return { name: '터줏대감', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '👑', range: '상위 24명' }
      default: return { name: '방랑자', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '🚶', range: '0점 ~ 30점' }
    }
  }

  // 구독 정보
  const getSubscriptionInfo = (type: string) => {
    switch (type) {
      case 'companion': return { name: '동행인', color: 'bg-blue-500', price: '1,900원' }
      case 'friend': return { name: '벗', color: 'bg-purple-500', price: '3,900원' }
      default: return { name: '무료', color: 'bg-gray-500', price: '0원' }
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
      
      <main className="container mx-auto px-4 py-8 pt-24">
        
        {/* 프로필 헤더 */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 pr-6">
              {/* 매김이 등급 및 칭호 */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getRankInfo(userProfile.stats.rank).color}`}>
                  <span className="text-sm">{getRankInfo(userProfile.stats.rank).icon}</span>
                  <span className="text-sm font-medium">{getRankInfo(userProfile.stats.rank).name}</span>
                  <span className="text-xs text-gray-500">({userProfile.stats.score}점)</span>
                </div>
                <button
                  onClick={() => setShowTitleModal(true)}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getRarityColor(userProfile.selectedTitle.rarity)} hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  <span className="text-sm">{userProfile.selectedTitle.icon}</span>
                  <span className="text-sm font-medium">{userProfile.selectedTitle.name}</span>
                  <span className="text-xs">⚙️</span>
                </button>
                {userProfile.subscription.type !== 'free' && (
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs ${getSubscriptionInfo(userProfile.subscription.type).color}`}>
                    <span>✨</span>
                    <span>{getSubscriptionInfo(userProfile.subscription.type).name}</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-brown-900">
                안녕하세요, {userProfile.nickname}님! 👋
              </h1>
              <p className="text-gray-600 mt-1 mb-3">
                {userProfile.selectedTitle.description}
              </p>
              
              {/* 창의적인 점수 시각화 */}
              <div className="max-w-lg">
                {/* 점수 온도계 스타일 */}
                <div className="relative bg-gray-100 rounded-full p-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2 px-2">
                    <span>불청객</span>
                    <span>방랑자</span>
                    <span>정착자</span>
                    <span>땅지기</span>
                    <span>터줏대감</span>
                  </div>
                  
                  {/* 점수 바 */}
                  <div className="relative h-8 bg-gradient-to-r from-red-200 via-gray-200 via-blue-200 via-green-200 to-yellow-200 rounded-full overflow-hidden">
                    {/* 현재 위치 마커 */}
                    <div 
                      className="absolute top-0 h-full w-1 bg-hazelnut shadow-lg transition-all duration-1000 ease-out score-pulse"
                      style={{ 
                        left: `${Math.max(5, Math.min(95, ((userProfile.stats.score + 100) / 200) * 100))}%`
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="bg-hazelnut text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                          {userProfile.stats.score}점
                        </div>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-hazelnut mx-auto"></div>
                      </div>
                    </div>
                    
                    {/* 등급 구분선 */}
                    <div className="absolute top-0 h-full w-px bg-gray-400 opacity-50" style={{ left: '10%' }}></div>
                    <div className="absolute top-0 h-full w-px bg-gray-400 opacity-50" style={{ left: '30%' }}></div>
                    <div className="absolute top-0 h-full w-px bg-gray-400 opacity-50" style={{ left: '60%' }}></div>
                    <div className="absolute top-0 h-full w-px bg-gray-400 opacity-50" style={{ left: '80%' }}></div>
                  </div>
                </div>

                {/* 점수 상세 정보 카드 */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border">
                    <div className="text-lg font-bold text-green-600">+{userProfile.stats.score > 0 ? userProfile.stats.score : 0}</div>
                    <div className="text-xs text-gray-600">적립 점수</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border">
                    <div className="text-lg font-bold text-orange-600">
                      {userProfile.stats.rank === 'patriarch' ? '👑' : 
                       userProfile.stats.rank === 'landlord' ? 'TOP 24' :
                       userProfile.stats.rank === 'settler' ? '25pt' :
                       userProfile.stats.rank === 'wanderer' ? '70pt' : '1pt'}
                    </div>
                    <div className="text-xs text-gray-600">다음 목표</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border">
                    <div className="text-lg font-bold text-purple-600">
                      #{userProfile.stats.rank === 'patriarch' ? 'TOP' : 
                        userProfile.stats.rank === 'landlord' ? '25+' :
                        userProfile.stats.rank === 'settler' ? '100+' :
                        userProfile.stats.rank === 'wanderer' ? '1000+' : '?'}
                    </div>
                    <div className="text-xs text-gray-600">예상 순위</div>
                  </div>
                </div>

                {/* 점수 획득/차감 히스토리 (미니 차트) - 토글 가능 */}
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setShowScoreChart(!showScoreChart)}
                    className="w-full p-3 text-left hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      <span>📊 최근 7일 점수 변화</span>
                      <span className="text-xs text-gray-400">(클릭하여 보기)</span>
                    </div>
                    <div className={`transform transition-transform duration-200 ${showScoreChart ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {showScoreChart && (
                    <div className="px-3 pb-3 border-t border-gray-200">
                      <div className="pt-3">
                        <div className="flex items-end gap-1 justify-center h-16 mb-2">
                          {[3, 5, -2, 8, 3, 5, 0].map((change, index) => (
                            <div key={index} className="flex flex-col items-center gap-1">
                              <div 
                                className={`w-4 rounded-sm transition-all duration-500 ${
                                  change > 0 ? 'bg-green-400' : 
                                  change < 0 ? 'bg-red-400' : 'bg-gray-300'
                                }`}
                                style={{ 
                                  height: `${Math.max(8, Math.abs(change) * 6)}px`,
                                  marginBottom: change < 0 ? '0' : '0'
                                }}
                                title={`${change > 0 ? '+' : ''}${change}점`}
                              ></div>
                              <div className="text-xs text-gray-500">
                                {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).getDate()}일
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">일별 점수 변화량</div>
                          <div className="flex items-center justify-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded"></div>
                              <span className="text-gray-600">증가</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-red-400 rounded"></div>
                              <span className="text-gray-600">감소</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-gray-300 rounded"></div>
                              <span className="text-gray-600">변화없음</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 격려 메시지 */}
                <div className="text-center mt-3">
                  <div className="text-sm text-gray-600">
                    {userProfile.stats.rank === 'patriarch' 
                      ? '🎉 터줏대감 등급을 유지하고 있어요! 최고예요!' 
                      : userProfile.stats.rank === 'landlord'
                      ? '🌟 땅지기시네요! 터줏대감까지 상위 24명에 도전해보세요!'
                      : userProfile.stats.rank === 'settler'
                      ? '🏠 정착자 등급이에요! 25점 더 모으면 땅지기 승급!'
                      : userProfile.stats.rank === 'wanderer'
                      ? '🚶 방랑자 등급이에요! 70점 더 모으면 정착자 승급!'
                      : '💪 함께 점수를 쌓아나가요!'}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowAvatarModal(true)}
              className="w-20 h-20 bg-hazelnut-100 rounded-full flex items-center justify-center text-3xl ml-4 hover:bg-hazelnut-200 transition-colors cursor-pointer border-2 border-transparent hover:border-hazelnut shadow-lg"
            >
              {userProfile.avatar}
            </button>
          </div>

          {/* 통계 요약 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: '총 예약', value: userProfile.stats.totalReservations, icon: '📅' },
              { label: '작성한 리뷰', value: userProfile.stats.totalReviews, icon: '⭐' },
              { label: '적립 포인트', value: userProfile.stats.totalPoints, icon: '🪙' },
              { label: '즐겨찾기', value: userProfile.stats.favoriteRestaurants, icon: '❤️' },
              { label: '달성한 업적', value: userProfile.achievements.length, icon: '🏆' }
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

          {/* 구독 프로모션 배너 (무료 사용자만) */}
          {userProfile.subscription.type === 'free' && (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-dashed border-2 border-blue-200 mb-6">
              <div className="flex items-center gap-4">
                <div className="text-3xl">✨</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brown-900 mb-1">
                    더 편리한 자리매를 경험해보세요!
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    동행인(1,900원) · 벗(3,900원) 구독으로 특별한 혜택을 누려보세요
                  </p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>🤖 AI 도우미</span>
                    <span>📱 실시간 추천</span>
                    <span>🎟️ 할인 쿠폰</span>
                    <span>👥 공동 계획</span>
                  </div>
                </div>
                <Link href="/subscription/user">
                  <Button size="sm" className="whitespace-nowrap">
                    구독하기
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* 탭 메뉴 */}
        <Card className="mb-8">
          <div className="flex border-b">
            {[
              { id: 'overview', label: '개요' },
              { id: 'reservations', label: '예약내역', badge: reservations.filter(r => r.status === 'upcoming').length },
              { id: 'reviews', label: '내 리뷰', badge: userReviews.length },
              { id: 'achievements', label: '업적', badge: userProfile.achievements.length },
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
                      <span className="text-sm">스시마스터에서 식사를 완료했어요 (+5점)</span>
                      <span className="text-xs text-gray-500 ml-auto">2일 전</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600">⭐</span>
                      <span className="text-sm">맛있는 피자집에 정성스러운 리뷰를 작성했어요 (+3점)</span>
                      <span className="text-xs text-gray-500 ml-auto">5일 전</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-hazelnut-50 rounded-lg">
                      <span className="text-hazelnut">🏆</span>
                      <span className="text-sm">'단골손님' 칭호를 획득했어요!</span>
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

            {/* 업적 탭 */}
            {activeTab === 'achievements' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-brown-900">
                    🏆 나의 업적
                  </h3>
                  <div className="text-sm text-gray-600">
                    총 {userProfile.achievements.length}개 달성
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {userProfile.achievements.map(achievement => (
                    <Card key={achievement.id} className={`p-4 border-2 ${getRarityColor(achievement.rarity)}`}>
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-brown-900">{achievement.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <div className="text-xs text-gray-500">
                            획득일: {achievement.unlockedAt}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* 진행 중인 도전과제 */}
                <div>
                  <h4 className="font-semibold text-brown-900 mb-4">🎯 진행 중인 도전과제</h4>
                  <div className="space-y-3">
                    <Card className="p-4 bg-gray-50 border-dashed border-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl opacity-50">🌱</div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-700">땅지기 승급</h5>
                          <p className="text-sm text-gray-500 mb-2">100점을 달성하여 땅지기 등급에 도전하세요</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-hazelnut h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">75/100 점수</div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 bg-gray-50 border-dashed border-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl opacity-50">📝</div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-700">미식 평론가 칭호</h5>
                          <p className="text-sm text-gray-500 mb-2">정성스러운 리뷰를 30개 작성하세요</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-hazelnut h-2 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">12/30 작성</div>
                        </div>
                      </div>
                    </Card>
                  </div>
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

      {/* 아바타 선택 모달 */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brown-900">아바타 선택</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-6 gap-3 mb-6">
              {avatarOptions.map((avatar, index) => (
                <button
                  key={index}
                  onClick={async () => {
                    setUserProfile(prev => ({ ...prev, avatar }))
                    await updateUser({ avatar })
                    setShowAvatarModal(false)
                  }}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-xl
                    transition-all duration-200 border-2
                    ${userProfile.avatar === avatar 
                      ? 'bg-hazelnut border-hazelnut text-white' 
                      : 'bg-gray-100 border-gray-200 hover:bg-hazelnut-100 hover:border-hazelnut'
                    }
                  `}
                >
                  {avatar}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAvatarModal(false)}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 칭호 선택 모달 */}
      {showTitleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brown-900">칭호 선택</h3>
              <button
                onClick={() => setShowTitleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {userProfile.availableTitles.map((title) => (
                <button
                  key={title.id}
                  onClick={() => {
                    if (title.unlocked) {
                      setUserProfile(prev => ({ ...prev, selectedTitle: title }))
                      setShowTitleModal(false)
                    }
                  }}
                  disabled={!title.unlocked}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all duration-200
                    ${userProfile.selectedTitle.id === title.id 
                      ? 'border-hazelnut bg-hazelnut-50' 
                      : title.unlocked
                      ? 'border-gray-200 hover:border-hazelnut hover:bg-hazelnut-50'
                      : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{title.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-brown-900">{title.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRarityColor(title.rarity)}`}>
                          {title.rarity}
                        </span>
                        {!title.unlocked && (
                          <span className="text-xs text-gray-500">🔒 잠김</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{title.description}</p>
                    </div>
                    {userProfile.selectedTitle.id === title.id && (
                      <div className="text-hazelnut">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowTitleModal(false)}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}