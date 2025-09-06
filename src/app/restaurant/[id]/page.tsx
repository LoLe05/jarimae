'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Card, Button, Tabs } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

interface Restaurant {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  priceRange: '₩' | '₩₩' | '₩₩₩' | '₩₩₩₩'
  images: string[]
  description: string
  address: string
  phone: string
  hours: {
    [key: string]: string
  }
  tags: string[]
  facilities: string[]
}

interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  image?: string
  category: string
  isPopular?: boolean
}

interface Review {
  id: string
  userName: string
  rating: number
  content: string
  date: string
  images?: string[]
}

/**
 * 식당 상세 페이지
 * HTML 시안: jarimae_restaurant_detail.html
 * 경로: /restaurant/[id]
 */
export default function RestaurantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // 임시 식당 데이터
  const [restaurant, setRestaurant] = useState<Restaurant>({
    id: restaurantId,
    name: '맛있는 한식당',
    category: '한식',
    rating: 4.5,
    reviewCount: 127,
    priceRange: '₩₩',
    images: [
      '/placeholder-restaurant-1.jpg',
      '/placeholder-restaurant-2.jpg',
      '/placeholder-restaurant-3.jpg'
    ],
    description: '전통 한식의 깊은 맛을 현대적으로 재해석한 정통 한식당입니다. 신선한 재료와 정성스러운 조리로 최고의 맛을 선사합니다.',
    address: '서울특별시 강남구 테헤란로 123, 2층',
    phone: '02-1234-5678',
    hours: {
      '월': '11:30 - 22:00',
      '화': '11:30 - 22:00',
      '수': '11:30 - 22:00',
      '목': '11:30 - 22:00',
      '금': '11:30 - 22:00',
      '토': '11:30 - 22:30',
      '일': '11:30 - 21:30'
    },
    tags: ['가족모임', '한정식', '깔끔함', '주차가능'],
    facilities: ['주차장', 'Wi-Fi', '단체석', '예약필수', '카드결제']
  })

  // 임시 메뉴 데이터
  const [menuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: '전통 한정식',
      price: 25000,
      description: '계절 반찬과 함께하는 정통 한정식',
      category: '메인',
      isPopular: true
    },
    {
      id: '2', 
      name: '갈비찜',
      price: 35000,
      description: '부드럽게 조린 소갈비찜',
      category: '메인',
      isPopular: true
    },
    {
      id: '3',
      name: '된장찌개',
      price: 8000,
      description: '구수한 된장국물의 찌개',
      category: '국물'
    },
    {
      id: '4',
      name: '잡채',
      price: 15000,
      description: '쫄깃한 당면과 야채볶음',
      category: '사이드'
    }
  ])

  // 임시 리뷰 데이터
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      userName: '김**',
      rating: 5,
      content: '정말 맛있어요! 한정식이 이렇게 맛있을 줄 몰랐네요. 특히 갈비찜이 정말 부드럽고 맛있었습니다. 다음에 또 올게요!',
      date: '2025-09-03'
    },
    {
      id: '2',
      userName: '이**',
      rating: 4,
      content: '분위기도 좋고 음식도 정갈해요. 가족 모임하기 좋은 곳입니다. 다만 예약은 필수인 것 같아요.',
      date: '2025-09-01'
    },
    {
      id: '3',
      userName: '박**',
      rating: 5,
      content: '서비스도 친절하고 음식 퀄리티가 정말 좋네요. 가격대비 만족도가 높습니다.',
      date: '2025-08-30'
    }
  ])

  useEffect(() => {
    // 실제로는 API 호출
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [restaurantId])

  const handleReservation = () => {
    router.push(`/booking/${restaurantId}`)
  }

  const handleCall = () => {
    window.location.href = `tel:${restaurant.phone}`
  }

  const menuCategories = Array.from(new Set(menuItems.map(item => item.category)))

  if (isLoading) {
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
        
        {/* 식당 헤더 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* 이미지 갤러리 */}
          <div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-4">
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🍽️
                </div>
              </div>
              
              {/* 썸네일 */}
              <div className="flex gap-2">
                {restaurant.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-lg ${
                      selectedImageIndex === index ? 'ring-2 ring-hazelnut' : ''
                    }`}
                  >
                    🍽️
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-hazelnut-100 text-hazelnut text-sm rounded">
                  {restaurant.category}
                </span>
                <span className="text-gray-600">{restaurant.priceRange}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-brown-900 mb-2">
                {restaurant.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="font-semibold text-lg">{restaurant.rating}</span>
                  <span className="text-gray-600">({restaurant.reviewCount})</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                {restaurant.description}
              </p>

              {/* 태그 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {restaurant.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3">
                <Button
                  onClick={handleReservation}
                  size="lg"
                  className="flex-1"
                >
                  🍽️ 예약하기
                </Button>
                <Button
                  onClick={handleCall}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  📞 전화
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <Card className="mb-8">
          <div className="flex border-b">
            {[
              { id: 'info', label: '기본정보' },
              { id: 'menu', label: '메뉴' },
              { id: 'reviews', label: '리뷰', badge: reviews.length }
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
            
            {/* 기본 정보 탭 */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                
                {/* 영업시간 */}
                <div>
                  <h3 className="text-lg font-semibold text-brown-900 mb-3">
                    ⏰ 영업시간
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(restaurant.hours).map(([day, time]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-600">{day}요일</span>
                        <span className="font-medium">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 위치 정보 */}
                <div>
                  <h3 className="text-lg font-semibold text-brown-900 mb-3">
                    📍 위치
                  </h3>
                  <p className="text-gray-700 mb-3">{restaurant.address}</p>
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                    🗺️ 지도 (구현 예정)
                  </div>
                </div>

                {/* 편의시설 */}
                <div>
                  <h3 className="text-lg font-semibold text-brown-900 mb-3">
                    🏢 편의시설
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.facilities.map(facility => (
                      <span key={facility} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        ✓ {facility}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 연락처 */}
                <div>
                  <h3 className="text-lg font-semibold text-brown-900 mb-3">
                    📞 연락처
                  </h3>
                  <p className="text-gray-700">{restaurant.phone}</p>
                </div>
              </div>
            )}

            {/* 메뉴 탭 */}
            {activeTab === 'menu' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-brown-900 mb-4">
                    🍽️ 메뉴
                  </h3>
                  
                  {menuCategories.map(category => (
                    <div key={category} className="mb-6">
                      <h4 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">
                        {category}
                      </h4>
                      <div className="space-y-3">
                        {menuItems
                          .filter(item => item.category === category)
                          .map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium text-brown-900">
                                    {item.name}
                                  </h5>
                                  {item.isPopular && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                                      인기
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {item.description}
                                </p>
                              </div>
                              <div className="text-lg font-semibold text-brown-900">
                                {item.price.toLocaleString()}원
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 리뷰 탭 */}
            {activeTab === 'reviews' && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-brown-900">
                      📝 리뷰 ({reviews.length})
                    </h3>
                    <Button variant="outline" size="sm">
                      리뷰 작성하기
                    </Button>
                  </div>

                  {/* 평점 요약 */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brown-900 mb-1">
                        {restaurant.rating}
                      </div>
                      <div className="text-yellow-500 text-xl mb-1">
                        {'⭐'.repeat(Math.floor(restaurant.rating))}
                      </div>
                      <div className="text-sm text-gray-600">
                        {restaurant.reviewCount}개의 리뷰
                      </div>
                    </div>
                  </div>

                  {/* 리뷰 목록 */}
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-brown-900">
                              {review.userName}
                            </span>
                            <div className="text-yellow-500">
                              {'⭐'.repeat(review.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* 더보기 버튼 */}
                  <div className="text-center mt-6">
                    <Button variant="outline">
                      리뷰 더보기
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* 하단 예약 버튼 (고정) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 lg:hidden">
          <div className="flex gap-3">
            <Button
              onClick={handleCall}
              variant="outline"
              className="flex-1"
            >
              📞 전화
            </Button>
            <Button
              onClick={handleReservation}
              className="flex-1"
            >
              🍽️ 예약하기
            </Button>
          </div>
        </div>

        {/* 모바일에서 하단 여백 */}
        <div className="h-20 lg:hidden" />
      </main>

      <Footer />
    </div>
  )
}