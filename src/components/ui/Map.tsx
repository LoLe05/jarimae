'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui'

interface Restaurant {
  id: string
  name: string
  address: string
  category: string
  rating: number
  distance: number
  lat: number
  lng: number
  image: string
  priceRange: string
  tags: string[]
  isOpen: boolean
}

interface MapProps {
  className?: string
  onRestaurantClick?: (restaurant: Restaurant) => void
  selectedCategory?: string
}

export default function Map({ className = '', onRestaurantClick, selectedCategory }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [userLocation, setUserLocation] = useState({ lat: 37.5665, lng: 126.9780 }) // 서울 기본값
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 더미 식당 데이터
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: '맛있는 한식당',
      address: '서울특별시 강남구 테헤란로 123',
      category: 'korean',
      rating: 4.5,
      distance: 0.3,
      lat: 37.5665 + (Math.random() - 0.5) * 0.01,
      lng: 126.9780 + (Math.random() - 0.5) * 0.01,
      image: '/api/placeholder/300/200',
      priceRange: '₩₩',
      tags: ['가족모임', '점심식사'],
      isOpen: true
    },
    {
      id: '2',
      name: '이탈리안 레스토랑',
      address: '서울특별시 강남구 강남대로 456',
      category: 'western',
      rating: 4.8,
      distance: 0.5,
      lat: 37.5665 + (Math.random() - 0.5) * 0.01,
      lng: 126.9780 + (Math.random() - 0.5) * 0.01,
      image: '/api/placeholder/300/200',
      priceRange: '₩₩₩',
      tags: ['데이트', '저녁식사', '와인'],
      isOpen: true
    },
    {
      id: '3',
      name: '스시 오마카세',
      address: '서울특별시 강남구 역삼동 789',
      category: 'japanese',
      rating: 4.9,
      distance: 0.7,
      lat: 37.5665 + (Math.random() - 0.5) * 0.01,
      lng: 126.9780 + (Math.random() - 0.5) * 0.01,
      image: '/api/placeholder/300/200',
      priceRange: '₩₩₩₩',
      tags: ['오마카세', '특별한날', '예약필수'],
      isOpen: true
    },
    {
      id: '4',
      name: '중국집 금강산',
      address: '서울특별시 마포구 홍대입구역',
      category: 'chinese',
      rating: 4.2,
      distance: 1.2,
      lat: 37.5665 + (Math.random() - 0.5) * 0.01,
      lng: 126.9780 + (Math.random() - 0.5) * 0.01,
      image: '/api/placeholder/300/200',
      priceRange: '₩₩',
      tags: ['단체모임', '배달가능'],
      isOpen: false
    },
    {
      id: '5',
      name: '카페 라떼',
      address: '서울특별시 종로구 인사동',
      category: 'cafe',
      rating: 4.6,
      distance: 0.8,
      lat: 37.5665 + (Math.random() - 0.5) * 0.01,
      lng: 126.9780 + (Math.random() - 0.5) * 0.01,
      image: '/api/placeholder/300/200',
      priceRange: '₩',
      tags: ['브런치', '디저트', 'Wi-Fi'],
      isOpen: true
    },
    {
      id: '6',
      name: '바베큐 하우스',
      address: '서울특별시 영등포구 여의도동',
      category: 'korean',
      rating: 4.4,
      distance: 1.5,
      lat: 37.5665 + (Math.random() - 0.5) * 0.01,
      lng: 126.9780 + (Math.random() - 0.5) * 0.01,
      image: '/api/placeholder/300/200',
      priceRange: '₩₩₩',
      tags: ['고기', '회식', '주차가능'],
      isOpen: true
    }
  ]

  // 카테고리별 필터링
  const getFilteredRestaurants = () => {
    if (!selectedCategory) return mockRestaurants
    return mockRestaurants.filter(r => r.category === selectedCategory)
  }

  // 현재 위치 가져오기
  useEffect(() => {
    setIsLoading(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setIsLoading(false)
        },
        (error) => {
          console.log('위치 정보를 가져올 수 없습니다:', error)
          // 기본 위치(서울) 사용
          setIsLoading(false)
        }
      )
    } else {
      setIsLoading(false)
    }
  }, [])

  // 식당 데이터 설정
  useEffect(() => {
    const filteredRestaurants = getFilteredRestaurants()
    setRestaurants(filteredRestaurants)
    setSelectedRestaurant(null)
  }, [selectedCategory])

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    if (onRestaurantClick) {
      onRestaurantClick(restaurant)
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'korean': '🍚',
      'chinese': '🥟',
      'japanese': '🍣',
      'western': '🍝',
      'snack': '🥞',
      'chicken': '🍗',
      'pizza': '🍕',
      'cafe': '☕'
    }
    return icons[category] || '🍽️'
  }

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '⭐' : '')
  }

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">주변 맛집을 찾는 중...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-brown-900 flex items-center gap-2">
            🗺️ 내 주변 맛집
            <span className="text-sm font-normal text-gray-500">
              ({restaurants.length}개)
            </span>
          </h2>
          <button
            onClick={() => setUserLocation({ lat: 37.5665, lng: 126.9780 })}
            className="text-sm text-hazelnut hover:text-muted-blue transition-colors"
          >
            📍 현재 위치
          </button>
        </div>

        {/* 지도 영역 (가상의 지도) */}
        <div 
          ref={mapRef}
          className="relative w-full h-64 sm:h-80 bg-gradient-to-br from-green-100 via-blue-50 to-green-200 rounded-lg mb-4 overflow-hidden"
        >
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-gray-300"></div>
              ))}
            </div>
          </div>

          {/* 사용자 위치 */}
          <div 
            className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
          </div>
          <div 
            className="absolute text-xs text-blue-600 font-medium whitespace-nowrap"
            style={{
              left: '50%',
              top: 'calc(50% + 20px)',
              transform: 'translateX(-50%)'
            }}
          >
            내 위치
          </div>

          {/* 식당 마커들 */}
          {restaurants.map((restaurant, index) => {
            const angle = (index / restaurants.length) * 2 * Math.PI
            const radius = 80 + Math.random() * 60
            const x = 50 + Math.cos(angle) * radius / 3
            const y = 50 + Math.sin(angle) * radius / 4
            
            return (
              <div
                key={restaurant.id}
                className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 z-20 ${
                  selectedRestaurant?.id === restaurant.id ? 'scale-125 z-30' : ''
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleRestaurantClick(restaurant)}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg border-2
                  ${restaurant.isOpen 
                    ? 'bg-hazelnut border-white text-white' 
                    : 'bg-gray-400 border-gray-200 text-gray-600'
                  }
                  ${selectedRestaurant?.id === restaurant.id 
                    ? 'ring-4 ring-muted-blue ring-opacity-50' 
                    : ''
                  }
                `}>
                  {getCategoryIcon(restaurant.category)}
                </div>
                {/* 식당 이름 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs text-gray-800 font-medium whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm border border-gray-200 max-w-24 truncate">
                  {restaurant.name}
                </div>
                {/* 거리 정보 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-7 text-xs text-gray-600 font-normal whitespace-nowrap bg-gray-50 px-1 rounded">
                  {restaurant.distance}km
                </div>
              </div>
            )
          })}
        </div>

        {/* 선택된 식당 정보 */}
        {selectedRestaurant && (
          <div className="border rounded-lg p-4 bg-hazelnut-50 border-hazelnut-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                {getCategoryIcon(selectedRestaurant.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-brown-900 mb-1">{selectedRestaurant.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedRestaurant.address}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span>{getRatingStars(selectedRestaurant.rating)}</span>
                    <span className="text-gray-600">{selectedRestaurant.rating}</span>
                  </span>
                  <span className="text-gray-600">{selectedRestaurant.priceRange}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedRestaurant.isOpen 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedRestaurant.isOpen ? '영업중' : '영업종료'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedRestaurant.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => window.location.href = `/restaurant/${selectedRestaurant.id}`}
              className="w-full mt-4 bg-hazelnut text-white py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium"
            >
              식당 상세보기
            </button>
          </div>
        )}

        {/* 식당 목록 */}
        <div className="space-y-3">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedRestaurant?.id === restaurant.id 
                    ? 'border-hazelnut bg-hazelnut-50' 
                    : 'border-gray-200 hover:border-hazelnut-200'
                }`}
                onClick={() => handleRestaurantClick(restaurant)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    {getCategoryIcon(restaurant.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-brown-900 truncate">{restaurant.name}</h4>
                      <span className="text-sm text-gray-500">{restaurant.distance}km</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{restaurant.address}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{getRatingStars(restaurant.rating)}</span>
                        <span className="text-gray-600">{restaurant.rating}</span>
                        <span className="text-gray-600">{restaurant.priceRange}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        restaurant.isOpen 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {restaurant.isOpen ? '영업중' : '영업종료'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-3xl mb-2">🏪</div>
              <p className="mb-1">해당 카테고리의 식당이 없습니다</p>
              <p className="text-sm">다른 카테고리를 선택해보세요</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export { Map }