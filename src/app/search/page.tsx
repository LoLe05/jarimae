'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, Button, Input } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { apiClient, API_ENDPOINTS } from '@/lib/api-client'
import { useToast } from '@/components/ui/Toast'

interface Restaurant {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  distance: number
  priceRange: '₩' | '₩₩' | '₩₩₩' | '₩₩₩₩'
  image: string
  tags: string[]
  availableTime: string
  address: string
  phone: string
}

interface FilterState {
  category: string
  priceRange: string[]
  rating: number
  distance: number
  sortBy: 'popular' | 'distance' | 'rating' | 'price'
}

/**
 * 식당 검색 결과 페이지
 * HTML 시안: jarimae_search_results.html
 * 경로: /search
 */
export default function SearchResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || 'reservation'
  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''

  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [showFilters, setShowFilters] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  
  const [filterState, setFilterState] = useState<FilterState>({
    category: '',
    priceRange: [],
    rating: 0,
    distance: 5,
    sortBy: 'popular'
  })

  // 검색 결과 데이터
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  const categories = ['전체', '한식', '양식', '일식', '중식', '카페', '치킨', '피자']
  const priceRanges = [
    { value: '₩', label: '1만원 이하' },
    { value: '₩₩', label: '1-3만원' },
    { value: '₩₩₩', label: '3-5만원' },
    { value: '₩₩₩₩', label: '5만원 이상' }
  ]

  const sortOptions = [
    { value: 'popular', label: '인기순' },
    { value: 'distance', label: '거리순' },
    { value: 'rating', label: '평점순' },
    { value: 'price', label: '가격순' }
  ]

  // 검색 실행 (Mock 데이터)
  const performSearch = async () => {
    setIsLoading(true)
    try {
      // Mock 레스토랑 데이터
      const mockRestaurants: Restaurant[] = [
        {
          id: '1',
          name: '맛있는 한식당',
          category: '한식',
          rating: 4.5,
          reviewCount: 128,
          distance: 0.5,
          priceRange: '₩₩',
          image: '/images/restaurant-1.jpg',
          tags: ['가족식사', '점심메뉴', '주차가능'],
          availableTime: '오늘 19:00~21:30',
          address: '서울특별시 강남구 테헤란로 123',
          phone: '02-1234-5678'
        },
        {
          id: '2',
          name: '이탈리안 레스토랑',
          category: '양식',
          rating: 4.2,
          reviewCount: 89,
          distance: 1.2,
          priceRange: '₩₩₩',
          image: '/images/restaurant-2.jpg',
          tags: ['데이트', '와인', '분위기좋은'],
          availableTime: '오늘 18:00~22:00',
          address: '서울특별시 강남구 강남대로 456',
          phone: '02-2345-6789'
        },
        {
          id: '3',
          name: '스시마스터',
          category: '일식',
          rating: 4.8,
          reviewCount: 203,
          distance: 0.8,
          priceRange: '₩₩₩₩',
          image: '/images/restaurant-3.jpg',
          tags: ['신선한재료', '오마카세', '예약필수'],
          availableTime: '오늘 17:30~20:00',
          address: '서울특별시 강남구 압구정로 789',
          phone: '02-3456-7890'
        },
        {
          id: '4',
          name: '브런치 카페',
          category: '카페',
          rating: 4.0,
          reviewCount: 156,
          distance: 1.5,
          priceRange: '₩',
          image: '/images/restaurant-4.jpg',
          tags: ['브런치', '커피맛집', '인스타감성'],
          availableTime: '오늘 09:00~17:00',
          address: '서울특별시 서초구 서초대로 321',
          phone: '02-4567-8901'
        }
      ]

      // 검색어나 필터에 따라 결과 필터링 (간단한 시뮬레이션)
      let filteredRestaurants = mockRestaurants
      
      if (query) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
          restaurant.name.includes(query) || 
          restaurant.category.includes(query) ||
          restaurant.tags.some(tag => tag.includes(query))
        )
      }

      if (filterState.category && filterState.category !== '전체') {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
          restaurant.category === filterState.category
        )
      }

      // 짧은 지연 후 데이터 설정 (로딩 시뮬레이션)
      setTimeout(() => {
        setRestaurants(filteredRestaurants)
        setTotalResults(filteredRestaurants.length)
        setIsLoading(false)
      }, 800)
      
    } catch (error) {
      console.error('Search failed:', error)
      setRestaurants([])
      setTotalResults(0)
      setIsLoading(false)
    }
  }

  // 검색 파라미터 변경 시 검색 실행 또는 페이지 로드 시 기본 데이터 표시
  useEffect(() => {
    performSearch() // 검색어가 없어도 기본 데이터 표시
  }, [query, category, location, filterState, currentPage])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilterState(prev => ({ ...prev, [key]: value }))
  }

  const handlePriceRangeToggle = (range: string) => {
    setFilterState(prev => ({
      ...prev,
      priceRange: prev.priceRange.includes(range)
        ? prev.priceRange.filter(r => r !== range)
        : [...prev.priceRange, range]
    }))
  }

  const resetFilters = () => {
    setFilterState({
      category: '',
      priceRange: [],
      rating: 0,
      distance: 5,
      sortBy: 'popular'
    })
  }

  const getServiceIcon = () => {
    switch (type) {
      case 'delivery': return '🛵'
      case 'waiting': return '⏰'
      default: return '🍽️'
    }
  }

  const getServiceLabel = () => {
    switch (type) {
      case 'delivery': return '배달'
      case 'waiting': return '웨이팅'
      default: return '예약'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">검색 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-8 sm:pt-20 sm:pb-8">
        
        {/* 검색 헤더 - 모바일 최적화 */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-brown-900 mb-2 line-clamp-2">
                {getServiceIcon()} '{query}' {getServiceLabel()} 검색 결과
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                총 {restaurants.length}개의 맛집을 찾았어요
              </p>
            </div>
            
            <div className="flex items-center justify-end gap-2 sm:gap-3">
              {/* 보기 모드 전환 */}
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded text-sm mobile-tap ${viewMode === 'list' ? 'bg-hazelnut text-white' : 'text-gray-600 hover:text-hazelnut'}`}
                >
                  📋
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded text-sm mobile-tap ${viewMode === 'map' ? 'bg-hazelnut text-white' : 'text-gray-600 hover:text-hazelnut'}`}
                >
                  🗺️
                </button>
              </div>
              
              {/* 필터 토글 */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-sm mobile-tap"
              >
                🎛️ <span className="hidden xs:inline">필터</span>
              </Button>
            </div>
          </div>

          {/* 검색바 (재검색용) - 모바일 최적화 */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <Input
                placeholder={`${getServiceLabel()} 가능한 맛집을 검색하세요`}
                defaultValue={query}
                className="text-sm sm:text-base"
              />
            </div>
            <Button size="sm" className="w-full sm:w-auto mobile-tap">
              검색
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* 필터 사이드바 */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-brown-900">필터</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-hazelnut"
                >
                  초기화
                </button>
              </div>

              <div className="space-y-6">
                {/* 카테고리 */}
                <div>
                  <h3 className="font-medium text-brown-900 mb-3">음식 종류</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filterState.category === category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="mr-2 text-hazelnut focus:ring-hazelnut"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 가격대 */}
                <div>
                  <h3 className="font-medium text-brown-900 mb-3">가격대</h3>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <label key={range.value} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterState.priceRange.includes(range.value)}
                          onChange={() => handlePriceRangeToggle(range.value)}
                          className="mr-2 text-hazelnut focus:ring-hazelnut rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {range.value} {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 평점 */}
                <div>
                  <h3 className="font-medium text-brown-900 mb-3">최소 평점</h3>
                  <select
                    value={filterState.rating}
                    onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-hazelnut focus:outline-none"
                  >
                    <option value={0}>전체</option>
                    <option value={3}>⭐ 3.0 이상</option>
                    <option value={4}>⭐ 4.0 이상</option>
                    <option value={4.5}>⭐ 4.5 이상</option>
                  </select>
                </div>

                {/* 거리 */}
                <div>
                  <h3 className="font-medium text-brown-900 mb-3">
                    거리 ({filterState.distance}km 이내)
                  </h3>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={filterState.distance}
                    onChange={(e) => handleFilterChange('distance', Number(e.target.value))}
                    className="w-full accent-hazelnut"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* 검색 결과 */}
          <div className="lg:col-span-3">
            
            {/* 정렬 옵션 */}
            {!isLoading && (
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  {totalResults > 0 ? `${totalResults}개 결과` : '검색 결과 없음'}
                </div>
                <select
                  value={filterState.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:border-hazelnut focus:outline-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">검색 중...</p>
              </div>
            )}

            {/* 검색 결과 없음 */}
            {!isLoading && restaurants.length === 0 && query && (
              <div className="text-center py-12">
                <div className="mb-4 text-4xl">🔍</div>
                <h3 className="text-lg font-medium text-brown-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600 mb-4">다른 검색어나 필터를 사용해보세요.</p>
                <Button onClick={resetFilters}>필터 초기화</Button>
              </div>
            )}

            {/* 레스토랑 카드 리스트 */}
            {!isLoading && restaurants.length > 0 && (
              <div className="space-y-4">
                {restaurants.map(restaurant => (
                <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex gap-4">
                      {/* 레스토랑 이미지 */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                        🍽️
                      </div>

                      {/* 레스토랑 정보 */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/restaurant/${restaurant.id}`}
                              className="text-base sm:text-lg font-semibold text-brown-900 hover:text-hazelnut transition-colors mobile-tap line-clamp-2"
                            >
                              {restaurant.name}
                            </Link>
                            <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 mt-1">
                              <span>{restaurant.category}</span>
                              <span>•</span>
                              <span>{restaurant.priceRange}</span>
                              <span>•</span>
                              <span>📍 {restaurant.distance}km</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">⭐</span>
                              <span className="font-medium text-sm sm:text-base">{restaurant.rating}</span>
                              <span className="text-gray-500 text-xs sm:text-sm">({restaurant.reviewCount})</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {restaurant.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                          📍 {restaurant.address}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="text-xs sm:text-sm">
                            <span className="text-green-600 font-medium">
                              {restaurant.availableTime}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none mobile-tap">
                              📞 <span className="hidden xs:inline ml-1">전화</span>
                            </Button>
                            <Link href={`/restaurant/${restaurant.id}`} className="flex-1 sm:flex-none">
                              <Button size="sm" className="w-full mobile-tap">
                                {type === 'delivery' ? '주문하기' : 
                                 type === 'waiting' ? '웨이팅' : '예약하기'}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {!isLoading && restaurants.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    이전
                  </Button>
                  <Button className="w-8 h-8 p-0">{currentPage}</Button>
                  <Button 
                    variant="outline" 
                    disabled={restaurants.length < 20}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    다음
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}