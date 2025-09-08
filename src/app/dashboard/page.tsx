'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Button, Input } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

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
 * 자리매 대시보드 페이지 (로그인 사용자용)
 * HTML 시안: jarimae_unified_main_final.html (로그인 버전)
 * 경로: /dashboard
 */
export default function DashboardPage() {
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()
  
  const [searchState, setSearchState] = useState<SearchState>({
    activeTab: 'reservation',
    query: '',
    location: '서울특별시 강남구',
    selectedCategory: ''
  })

  // 인증되지 않은 사용자는 랜딩 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/landing')
    }
  }, [isLoggedIn, router])

  // 로딩 중이거나 인증되지 않은 경우
  if (!isLoggedIn) {
    return null
  }

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

  // 임시 예약 데이터
  const myReservations: ReservationItem[] = [
    {
      id: '1',
      restaurantName: '맛있는 한식당',
      date: '2024-03-15',
      time: '18:00',
      status: 'confirmed',
      guests: 4
    },
    {
      id: '2',
      restaurantName: '이탈리안 레스토랑',
      date: '2024-03-18',
      time: '19:30',
      status: 'pending',
      guests: 2
    }
  ]

  const handleTabChange = (tab: 'reservation' | 'delivery' | 'waiting') => {
    setSearchState(prev => ({ ...prev, activeTab: tab }))
  }

  const handleCategorySelect = (categoryId: string) => {
    setSearchState(prev => ({ ...prev, selectedCategory: categoryId }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams({
      q: searchState.query,
      type: searchState.activeTab,
      category: searchState.selectedCategory,
      location: searchState.location
    })
    router.push(`/search?${params.toString()}`)
  }

  const handleLocationChange = () => {
    // 위치 변경 로직
    console.log('위치 변경')
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
                안녕하세요, {user?.name || '고객'}님! 
              </p>
              <p className="text-sm sm:text-base text-muted-gray">
                오늘은 어떤 맛집을 찾아볼까요?
              </p>
            </div>

            {/* 검색 컨테이너 - 모바일 최적화 */}
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 sm:p-8 shadow-brand">
                {/* 탭 네비게이션 - 모바일에서 더 터치하기 쉽게 */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="bg-warm-gray-100 p-1 rounded-full">
                    {(['reservation', 'delivery', 'waiting'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-200 mobile-tap ${
                          searchState.activeTab === tab
                            ? 'bg-hazelnut text-white shadow-sm'
                            : 'text-brown-900 hover:text-hazelnut'
                        }`}
                      >
                        {tab === 'reservation' ? '🍽️ 예약' : 
                         tab === 'delivery' ? '🛵 배달' : '⏰ 웨이팅'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-lg sm:text-xl text-brown-900 font-medium flex items-center justify-center gap-2">
                    <span>{tabContent.icon}</span>
                    {tabContent.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* 카테고리 선택 */}
                  <div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`
                            flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all duration-200 mobile-tap
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

          {/* 대시보드 섹션 - 모바일 최적화 */}
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
                      {myReservations.map((reservation) => (
                        <div key={reservation.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow mobile-tap">
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
                      ))}
                      
                      {myReservations.length === 0 && (
                        <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                          아직 예약이 없습니다
                        </div>
                      )}
                    </div>

                    <div className="mt-4 sm:mt-6">
                      <Link href="/profile/reservations">
                        <Button variant="outline" className="w-full mobile-tap">
                          전체 예약 관리
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 사이드바 - 빠른 액션 */}
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg font-bold text-brown-900 mb-3 sm:mb-4">빠른 액션</h2>
                    <div className="space-y-2 sm:space-y-3">
                      <Link href="/profile/reservations">
                        <Button variant="outline" className="w-full justify-start mobile-tap">
                          <span className="mr-2">📅</span>
                          내 예약 관리
                        </Button>
                      </Link>
                      <Link href="/profile/reviews">
                        <Button variant="outline" className="w-full justify-start mobile-tap">
                          <span className="mr-2">⭐</span>
                          리뷰 관리
                        </Button>
                      </Link>
                      <Link href="/profile">
                        <Button variant="outline" className="w-full justify-start mobile-tap">
                          <span className="mr-2">👤</span>
                          프로필 설정
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>

                {/* 추천 매장 */}
                <Card>
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg font-bold text-brown-900 mb-3 sm:mb-4">추천 매장</h2>
                    <div className="text-center text-gray-500 text-sm">
                      곧 추천 매장을<br />
                      만나보실 수 있습니다!
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}