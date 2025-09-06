'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, Button, Input } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

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
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || 'reservation'

  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [showFilters, setShowFilters] = useState(false)
  
  const [filterState, setFilterState] = useState<FilterState>({
    category: '',
    priceRange: [],
    rating: 0,
    distance: 5,
    sortBy: 'popular'
  })

  // 임시 레스토랑 데이터
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: '1',
      name: '맛있는 한식당',
      category: '한식',
      rating: 4.5,
      reviewCount: 127,
      distance: 0.3,
      priceRange: '₩₩',
      image: '/placeholder-restaurant.jpg',
      tags: ['가족모임', '한정식', '깔끔함'],
      availableTime: '18:00, 19:30 예약 가능',
      address: '서울특별시 강남구 테헤란로 123',
      phone: '02-1234-5678'
    },
    {
      id: '2',
      name: '이탈리안 레스토랑 비스트로',
      category: '양식',
      rating: 4.8,
      reviewCount: 89,
      distance: 0.5,
      priceRange: '₩₩₩',
      image: '/placeholder-restaurant.jpg',
      tags: ['데이트', '파스타', '와인바'],
      availableTime: '19:00, 20:30 예약 가능',
      address: '서울특별시 강남구 강남대로 456',
      phone: '02-2345-6789'
    },
    {
      id: '3',
      name: '스시마스터',
      category: '일식',
      rating: 4.7,
      reviewCount: 203,
      distance: 0.8,
      priceRange: '₩₩₩₩',
      image: '/placeholder-restaurant.jpg',
      tags: ['초밥', '고급', '접대'],
      availableTime: '18:30, 20:00 예약 가능',
      address: '서울특별시 강남구 압구정로 789',
      phone: '02-3456-7890'
    }
  ])

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

  useEffect(() => {
    // 실제로는 API 호출
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [query, filterState])

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
      
      <main className="container mx-auto px-4 py-8">
        
        {/* 검색 헤더 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-brown-900 mb-2">
                {getServiceIcon()} '{query}' {getServiceLabel()} 검색 결과
              </h1>
              <p className="text-gray-600">
                총 {restaurants.length}개의 맛집을 찾았어요
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* 보기 모드 전환 */}
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-hazelnut text-white' : 'text-gray-600 hover:text-hazelnut'}`}
                >
                  📋
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded ${viewMode === 'map' ? 'bg-hazelnut text-white' : 'text-gray-600 hover:text-hazelnut'}`}
                >
                  🗺️
                </button>
              </div>
              
              {/* 필터 토글 */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2"
              >
                🎛️ 필터
              </Button>
            </div>
          </div>

          {/* 검색바 (재검색용) */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <Input
                placeholder={`${getServiceLabel()} 가능한 맛집을 검색하세요`}
                defaultValue={query}
              />
            </div>
            <Button>검색</Button>
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
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                {restaurants.length}개 결과
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

            {/* 레스토랑 카드 리스트 */}
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
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link 
                              href={`/restaurant/${restaurant.id}`}
                              className="text-lg font-semibold text-brown-900 hover:text-hazelnut transition-colors"
                            >
                              {restaurant.name}
                            </Link>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <span>{restaurant.category}</span>
                              <span>•</span>
                              <span>{restaurant.priceRange}</span>
                              <span>•</span>
                              <span>📍 {restaurant.distance}km</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">⭐</span>
                              <span className="font-medium">{restaurant.rating}</span>
                              <span className="text-gray-500 text-sm">({restaurant.reviewCount})</span>
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

                        <div className="text-sm text-gray-600 mb-3">
                          📍 {restaurant.address}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-green-600 font-medium">
                              {restaurant.availableTime}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              📞 전화
                            </Button>
                            <Link href={`/restaurant/${restaurant.id}`}>
                              <Button size="sm">
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

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled>이전</Button>
                <Button className="w-8 h-8 p-0">1</Button>
                <Button variant="outline" className="w-8 h-8 p-0">2</Button>
                <Button variant="outline" className="w-8 h-8 p-0">3</Button>
                <Button variant="outline">다음</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}