'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, Button, Input } from '@/components/ui'
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
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled'
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
      // Mock 예약 데이터
      const mockReservations: ReservationItem[] = [
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
    console.log('Change location')
    // TODO: 위치 변경 모달 또는 페이지
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
          {/* 히어로 섹션 - 모바일 우선 최적화 */}
          <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 text-center">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-hazelnut mb-3 sm:mb-4">
                자리매
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-brown-900 font-medium mb-2">
                소상공인을 위한 똑똑한 자리 예약
              </p>
              <p className="text-base sm:text-lg text-gray-600">
                손님과 사장님 모두 편안하게
              </p>
            </div>

            {/* 검색 컨테이너 - 모바일 최적화 */}
            <div className="max-w-4xl mx-auto">
              <Card className="p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                {/* 탭 네비게이션 - 모바일에서 더 컴팩트하게 */}
                <div className="flex justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
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
                        rounded-full font-medium transition-all duration-200 text-sm sm:text-base
                        touch-manipulation min-h-[44px]
                        ${searchState.activeTab === tab.id
                          ? 'bg-hazelnut text-white shadow-md'
                          : 'text-brown-900 hover:bg-hazelnut-50 active:bg-hazelnut-100'
                        }
                      `}
                    >
                      <span className="text-base sm:text-lg">{tab.icon}</span>
                      <span className="hidden xs:inline sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* 검색바 - 모바일 최적화 */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="text-3xl sm:text-4xl mb-2">{tabContent.icon}</div>
                    <p className="text-sm sm:text-base text-gray-600">{tabContent.description}</p>
                  </div>

                  {/* 카테고리 필터 */}
                  <div className="mb-4">
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mb-4">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`
                            flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg transition-all duration-200 mobile-tap
                            ${searchState.selectedCategory === category.id
                              ? 'bg-hazelnut text-white shadow-md'
                              : 'bg-white hover:bg-hazelnut-50 border border-gray-200'
                            }
                          `}
                        >
                          <span className="text-lg sm:text-xl">{category.icon}</span>
                          <span className="text-xs sm:text-sm font-medium">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
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
                      className="w-full sm:w-auto sm:min-w-[120px] h-12 sm:h-14 text-base sm:text-lg font-medium"
                    >
                      검색
                    </Button>
                  </div>

                  {/* 위치 설정 */}
                  <div className="flex items-center justify-center gap-2 mt-4">
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

          {/* 대시보드 섹션 (로그인한 경우) - 모바일 최적화 */}
          {isLoggedIn && (
            <section className="container mx-auto px-4 py-6 sm:py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                
                {/* 내 예약 목록 - 모바일에서 더 컴팩트하게 */}
                <div className="lg:col-span-2">
                  <Card>
                    <div className="p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-bold text-brown-900 mb-3 sm:mb-4 flex items-center gap-2">
                        📅 내 예약
                        <span className="text-sm font-normal text-gray-500">
                          ({myReservations.length}개)
                        </span>
                      </h2>
                      
                      <div className="space-y-3 sm:space-y-4">
                        {isLoadingReservations ? (
                          <div className="text-center py-6 sm:py-8">
                            <div className="w-6 h-6 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm text-gray-500">예약 목록을 불러오는 중...</p>
                          </div>
                        ) : myReservations.length > 0 ? (
                          myReservations.map((reservation) => (
                            <div key={reservation.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow touch-manipulation">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-brown-900 text-sm sm:text-base flex-1 pr-2">
                                  {reservation.restaurantName}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                                  reservation.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-700'
                                    : reservation.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {reservation.status === 'confirmed' ? '확정' : 
                                   reservation.status === 'pending' ? '대기' : '취소'}
                                </span>
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600">
                                📅 {reservation.date} {reservation.time} • 👥 {reservation.guests}명
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                            <div className="mb-3 text-3xl">📅</div>
                            <p className="mb-2">아직 예약이 없습니다</p>
                            <p className="text-xs">맛집을 검색해서 첫 예약을 만들어보세요!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 간단한 통계 */}
                <div>
                  <Card>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-brown-900 mb-4">
                        📊 이번 달 활동
                      </h2>
                      
                      <div className="space-y-4">
                        {isLoadingStats ? (
                          <div className="text-center py-6">
                            <div className="w-6 h-6 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm text-gray-500">통계를 불러오는 중...</p>
                          </div>
                        ) : (
                          <>
                            <div className="text-center p-4 bg-hazelnut-50 rounded-lg">
                              <div className="text-2xl font-bold text-hazelnut">{monthlyStats.visitedRestaurants}</div>
                              <div className="text-sm text-gray-600">방문한 맛집</div>
                            </div>
                            
                            <div className="text-center p-4 bg-muted-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-muted-blue">{monthlyStats.writtenReviews}</div>
                              <div className="text-sm text-gray-600">작성한 리뷰</div>
                            </div>
                            
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">{monthlyStats.earnedPoints}</div>
                              <div className="text-sm text-gray-600">적립한 포인트</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
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