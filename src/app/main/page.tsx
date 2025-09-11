'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, Button, Input, Map } from '@/components/ui'
import { Calendar } from '@/components/ui/Calendar'
import { Header, Footer } from '@/components/layout'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient, API_ENDPOINTS } from '@/lib/api-client'
import { useToast } from '@/components/ui/Toast'

interface SearchState {
  activeTab: 'reservation' | 'delivery' | 'waiting'
  query: string
  location: string
  selectedCategory: string
}

interface ReservationItem {
  id: string
  restaurantName: string
  restaurantId: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  guests: number
  specialRequest?: string
  phone?: string
  address?: string
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
 * 자리매 메인 대시보드 페이지 (로그인 후)
 * HTML 시안: jarimae_unified_main_final.html
 * 경로: /main
 */
export default function MainDashboardPage() {
  const { isLoggedIn, user, isLoading: authLoading } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  // 인증 상태 체크
  useEffect(() => {
    console.log('🏠 메인 페이지 - 인증 상태 체크:', { isLoggedIn, authLoading })
    
    // AuthContext 로딩이 완료되고 로그인되지 않은 상태라면 홈으로 리디렉션
    if (!authLoading && !isLoggedIn) {
      console.log('🔄 로그인이 필요함 - 홈페이지로 리디렉션')
      router.push('/')
    }
  }, [isLoggedIn, authLoading, router])
  const [searchState, setSearchState] = useState<SearchState>({
    activeTab: 'reservation',
    query: '',
    location: '서울특별시 강남구',
    selectedCategory: ''
  })
  const [isLoadingReservations, setIsLoadingReservations] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  // 카테고리 목록
  const categories = [
    { id: '', label: '전체', icon: '🍽️' },
    { id: 'korean', label: '한식', icon: '🍚' },
    { id: 'chinese', label: '중식', icon: '🥟' },
    { id: 'japanese', label: '일식', icon: '🍣' },
    { id: 'western', label: '양식', icon: '🍝' },
    { id: 'snack', label: '분식', icon: '🥞' },
    { id: 'chicken', label: '치킨', icon: '🍗' },
    { id: 'pizza', label: '피자', icon: '🍕' },
    { id: 'cafe', label: '카페', icon: '☕' }
  ]

  // 실제 예약 데이터
  const [myReservations, setMyReservations] = useState<ReservationItem[]>([])
  const [monthlyStats, setMonthlyStats] = useState({
    visitedRestaurants: 0,
    writtenReviews: 0,
    earnedPoints: 0
  })

  // 예약 목록 불러오기 (Mock 데이터)
  const fetchReservations = async () => {
    if (!isLoggedIn) return

    setIsLoadingReservations(true)
    try {
      // Mock 예약 데이터 - 지난 예약과 미래 예약 포함
      const mockReservations: ReservationItem[] = [
        // 미래 예약
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
          restaurantName: '스시 오마카세',
          restaurantId: '3',
          date: '2025-09-25',
          time: '20:00',
          status: 'confirmed',
          guests: 2,
          specialRequest: '알레르기: 새우',
          phone: '02-3456-7890',
          address: '서울특별시 강남구 역삼동 789',
          createdAt: '2025-09-07'
        },
        {
          id: '4',
          restaurantName: '프렌치 비스트로',
          restaurantId: '4',
          date: '2025-09-12',
          time: '19:30',
          status: 'pending',
          guests: 3,
          phone: '02-4567-8901',
          address: '서울특별시 서초구 반포동 101',
          createdAt: '2025-09-08'
        },
        // 지난 예약 (완료/취소)
        {
          id: '5',
          restaurantName: '중국집 금강산',
          restaurantId: '5',
          date: '2025-09-05',
          time: '18:00',
          status: 'completed',
          guests: 6,
          specialRequest: '단체석 요청',
          phone: '02-5678-9012',
          address: '서울특별시 마포구 홍대입구역',
          createdAt: '2025-09-01'
        },
        {
          id: '6',
          restaurantName: '카페 라떼',
          restaurantId: '6',
          date: '2025-09-03',
          time: '15:30',
          status: 'completed',
          guests: 2,
          phone: '02-6789-0123',
          address: '서울특별시 종로구 인사동',
          createdAt: '2025-08-28'
        },
        {
          id: '7',
          restaurantName: '바베큐 하우스',
          restaurantId: '7',
          date: '2025-09-01',
          time: '19:00',
          status: 'cancelled',
          guests: 4,
          specialRequest: '금연석 요청',
          phone: '02-7890-1234',
          address: '서울특별시 영등포구 여의도동',
          createdAt: '2025-08-25'
        }
      ]
      
      // 짧은 지연 후 데이터 설정 (로딩 시뮬레이션)
      setTimeout(() => {
        setMyReservations(mockReservations)
        setIsLoadingReservations(false)
      }, 500)
      
    } catch (error) {
      console.error('Failed to fetch reservations:', error)
      setIsLoadingReservations(false)
    }
  }

  // 월별 통계 불러오기 (Mock 데이터)
  const fetchMonthlyStats = async () => {
    if (!isLoggedIn) return

    setIsLoadingStats(true)
    try {
      // Mock 통계 데이터
      setTimeout(() => {
        setMonthlyStats({
          visitedRestaurants: 12,
          writtenReviews: 8,
          earnedPoints: 2400
        })
        setIsLoadingStats(false)
      }, 300)
      
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setIsLoadingStats(false)
    }
  }

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
    // TODO: 해당 날짜의 예약 상세 표시 또는 새 예약 생성
  }

  const handleEventClick = (event: CalendarEvent) => {
    console.log('이벤트 클릭:', event)
    // TODO: 예약 상세 정보 모달 표시
    showToast({
      type: 'info',
      title: '예약 정보',
      message: `${event.title} - ${event.time} (${event.guests}명)`
    })
  }

  // 데이터 로딩
  useEffect(() => {
    if (isLoggedIn) {
      fetchReservations()
      fetchMonthlyStats()
    }
  }, [isLoggedIn])

  const handleTabChange = (tab: 'reservation' | 'delivery' | 'waiting') => {
    setSearchState(prev => ({ ...prev, activeTab: tab }))
  }

  const handleSearch = async () => {
    if (!searchState.query.trim()) {
      showToast({
        type: 'warning',
        title: '검색어 필요',
        message: '검색어를 입력해주세요'
      })
      return
    }
    
    // 검색 결과 페이지로 이동
    const searchParams = new URLSearchParams({
      q: searchState.query,
      type: searchState.activeTab,
      location: searchState.location,
      ...(searchState.selectedCategory && { category: searchState.selectedCategory })
    })
    
    window.location.href = `/search?${searchParams.toString()}`
  }

  const handleCategorySelect = (categoryId: string) => {
    setSearchState(prev => ({ ...prev, selectedCategory: categoryId }))
  }

  const handleLocationChange = () => {
    // 지도 섹션으로 스크롤
    const mapSection = document.getElementById('map-section')
    if (mapSection) {
      mapSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const getTabContent = () => {
    switch (searchState.activeTab) {
      case 'reservation':
        return {
          placeholder: '어떤 맛집을 찾고 계세요?',
          icon: '🍽️',
          description: '예약 가능한 맛집을 찾아보세요'
        }
      case 'delivery':
        return {
          placeholder: '배달 음식을 검색하세요',
          icon: '🛵',
          description: '빠른 배달 서비스를 이용하세요'
        }
      case 'waiting':
        return {
          placeholder: '웨이팅 가능한 식당을 찾아보세요',
          icon: '⏰',
          description: '실시간 웨이팅 현황을 확인하세요'
        }
    }
  }

  const tabContent = getTabContent()

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <main className="relative overflow-hidden">
        {/* 배경 애니메이션 */}
        <div className="absolute inset-0 animated-bg opacity-30" />
        
        <div className="relative z-10">
          {/* 히어로 섹션 - 향상된 디자인 */}
          <section className="container mx-auto px-4 py-6 sm:py-8 md:py-12 text-center">
            <div className="mb-6 sm:mb-8">
              {/* 로고와 타이틀 */}
              <div className="mb-6 mt-10 sm:mt-12">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-hazelnut mb-3 sm:mb-4">
                  자리매
                </h1>
              </div>
              
              {/* 서브 타이틀과 설명 */}
              <div className="max-w-2xl mx-auto">
                <p className="text-lg sm:text-xl md:text-2xl text-brown-900 font-semibold mb-3">
                  소상공인을 위한 똑똑한 자리 예약
                </p>
                <p className="text-base sm:text-lg text-gray-600 mb-6">
                  손님과 사장님 모두 편안하게 🤝
                </p>
                
                {/* 특징 배지들 */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft border border-hazelnut/20">
                    <span className="text-sm font-medium text-hazelnut">⚡ 실시간 예약</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft border border-muted-blue/20">
                    <span className="text-sm font-medium text-muted-blue">🎯 맞춤 추천</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft border border-green-300">
                    <span className="text-sm font-medium text-green-700">💎 등급 시스템</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 검색 컨테이너 - 향상된 디자인 */}
            <div className="max-w-4xl mx-auto">
              <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 bg-white/95 backdrop-blur-sm shadow-brand-lg border border-white/50">
                {/* 탭 네비게이션 - 모바일에서 더 컴팩트하게 */}
                <div className="flex justify-center gap-1 sm:gap-2 mb-8 sm:mb-10">
                  {[
                    { id: 'reservation', label: '예약', icon: '🍽️' },
                    { id: 'delivery', label: '배달', icon: '🛵' },
                    { id: 'waiting', label: '웨이팅', icon: '⏰' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as 'reservation' | 'delivery' | 'waiting')}
                      className={`
                        flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 
                        rounded-full font-medium transition-all duration-300 text-sm sm:text-base
                        touch-manipulation min-h-[44px] transform hover:scale-105
                        ${searchState.activeTab === tab.id
                          ? 'bg-hazelnut text-white shadow-brand scale-105'
                          : 'text-brown-900 hover:bg-white/80 hover:shadow-soft active:bg-hazelnut-100 bg-white/50'
                        }
                      `}
                    >
                      <span className="text-base sm:text-lg">{tab.icon}</span>
                      <span className="hidden xs:inline sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* 검색바 - 모바일 최적화 */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-3xl sm:text-4xl mb-3">{tabContent.icon}</div>
                    <p className="text-sm sm:text-base text-gray-600">{tabContent.description}</p>
                  </div>

                  {/* 카테고리 필터 */}
                  <div className="mb-6">
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mb-6">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`
                            flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl transition-all duration-300 mobile-tap transform hover:scale-105
                            ${searchState.selectedCategory === category.id
                              ? 'bg-hazelnut text-white shadow-brand scale-105'
                              : 'bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-soft border border-gray-200/50'
                            }
                          `}
                        >
                          <span className="text-lg sm:text-xl">{category.icon}</span>
                          <span className="text-xs sm:text-sm font-medium">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder={tabContent.placeholder}
                        value={searchState.query}
                        onChange={(value) => setSearchState(prev => ({ ...prev, query: value }))}
                        onKeyDown={handleKeyPress}
                        className="text-base sm:text-lg h-12 sm:h-14"
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      size="lg"
                      className="w-full sm:w-auto sm:min-w-[120px] h-12 sm:h-14 text-base sm:text-lg font-medium bg-hazelnut hover:bg-hazelnut-600 shadow-brand hover:shadow-brand-lg transform hover:scale-105 transition-all duration-300"
                    >
                      🔍 검색
                    </Button>
                  </div>

                  {/* 위치 설정 */}
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <button
                      onClick={handleLocationChange}
                      className="text-sm text-gray-600 hover:text-hazelnut transition-colors"
                    >
                      {searchState.location} 📍
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* 오늘의 추천 매장 섹션 */}
          <section className="container mx-auto px-4 py-6 sm:py-8">
            <Card className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-brown-900 mb-2">
                  ✨ 오늘의 추천 매장
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  등급과 구독에 따라 선별된 특별한 맛집들을 만나보세요
                </p>
              </div>

              {/* 추천 매장 그리드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    id: 1,
                    name: '사랑방 한정식',
                    category: '한식',
                    rating: 4.9,
                    reviews: 127,
                    badge: '사랑방',
                    badgeColor: 'bg-blue-500',
                    image: '🍚',
                    description: '정성스런 한정식의 진수',
                    distance: '0.3km',
                    isPremium: true
                  },
                  {
                    id: 2,
                    name: '가온마루 이탈리안',
                    category: '양식',
                    rating: 4.7,
                    reviews: 89,
                    badge: '가온마루',
                    badgeColor: 'bg-yellow-500',
                    image: '🍝',
                    description: '정통 이탈리안 파스타',
                    distance: '0.7km',
                    isPremium: true
                  },
                  {
                    id: 3,
                    name: '정착자 추천 카페',
                    category: '카페',
                    rating: 4.5,
                    reviews: 56,
                    badge: '정착자 혜택',
                    badgeColor: 'bg-green-500',
                    image: '☕',
                    description: '아늑한 동네 카페',
                    distance: '0.5km',
                    isPremium: false
                  }
                ].map((restaurant) => (
                  <Card key={restaurant.id} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    {restaurant.isPremium && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-2 py-1 text-xs text-white rounded-full ${restaurant.badgeColor}`}>
                          {restaurant.badge}
                        </span>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{restaurant.image}</div>
                        <h3 className="font-semibold text-brown-900 mb-1">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{restaurant.category}</span>
                          <span className="text-gray-500">{restaurant.distance}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-medium">{restaurant.rating}</span>
                            <span className="text-sm text-gray-500">({restaurant.reviews})</span>
                          </div>
                          
                          <Button size="sm" className="text-xs">
                            예약하기
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* 더보기 버튼 */}
              <div className="text-center mt-8">
                <Button variant="outline" className="px-8">
                  더 많은 추천 매장 보기
                </Button>
              </div>

              {/* 혜택 안내 */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-dashed border-2 border-blue-200">
                <div className="text-center">
                  <h4 className="font-semibold text-brown-900 mb-2">
                    🎯 더 많은 프리미엄 매장을 원하시나요?
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    등급을 올리거나 구독을 통해 특별한 매장들을 만나보세요
                  </p>
                  <div className="flex justify-center gap-3">
                    <Link href="/ranks/user">
                      <Button variant="outline" size="sm">
                        등급 시스템 보기
                      </Button>
                    </Link>
                    <Link href="/subscription/user">
                      <Button size="sm">
                        구독하기
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* 지도 섹션 - 모든 사용자에게 표시 */}
          <section id="map-section" className="container mx-auto px-4 py-4 sm:py-6">
            <Map 
              selectedCategory={searchState.selectedCategory}
              onRestaurantClick={(restaurant) => {
                console.log('식당 클릭:', restaurant)
                // 식당 페이지로 이동
                window.location.href = `/restaurant/${restaurant.id}`
              }}
              className="mb-4 sm:mb-6"
            />
          </section>

          {/* 대시보드 섹션 (로그인한 경우) - 모바일 최적화 */}
          {isLoggedIn && (
            <section className="container mx-auto px-4 py-4 sm:py-6">
              {/* 캘린더 섹션 - 중앙 정렬 */}
              <div className="max-w-4xl mx-auto">
                <Card>
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-brown-900 mb-3 sm:mb-4">
                      📆 예약 캘린더
                    </h2>
                    <Calendar 
                      events={convertToCalendarEvents(myReservations)}
                      onDateClick={handleDateClick}
                      onEventClick={handleEventClick}
                    />
                  </div>
                </Card>
              </div>
            </section>
          )}

          {/* CTA 섹션 (로그인하지 않은 경우) */}
          {!isLoggedIn && (
            <section className="container mx-auto px-4 py-16 text-center">
              <Card className="max-w-2xl mx-auto p-8">
                <h2 className="text-2xl font-bold text-brown-900 mb-4">
                  자리매와 함께 시작해보세요
                </h2>
                <p className="text-gray-600 mb-6">
                  회원가입하고 더 많은 혜택을 받아보세요
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/type">
                    <Button size="lg" className="w-full sm:w-auto">
                      회원가입하기
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      로그인하기
                    </Button>
                  </Link>
                </div>
              </Card>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}