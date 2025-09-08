'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, Button } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient, API_ENDPOINTS } from '@/lib/api-client'
import { useToast } from '@/components/ui/Toast'

interface Review {
  id: string
  restaurantName: string
  restaurantImage: string
  rating: number
  content: string
  images: string[]
  visitDate: string
  createdAt: string
  helpful: number
  category: string
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  helpfulCount: number
  topReviewer: boolean
}

/**
 * 내 리뷰 목록 페이지
 * 경로: /profile/reviews
 */
export default function MyReviewsPage() {
  const { isLoggedIn, user } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    helpfulCount: 0,
    topReviewer: false
  })
  const [filter, setFilter] = useState<'all' | 'recent' | 'popular'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  // 인증되지 않은 사용자 리디렉션
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login')
    }
  }, [isLoggedIn, router, isLoading])

  // 리뷰 데이터 및 통계 로드
  useEffect(() => {
    if (isLoggedIn) {
      loadReviews()
      loadStats()
    }
  }, [isLoggedIn])

  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.MY_REVIEWS, {
        params: { page: 1, limit: 50 }
      })
      
      if (response.success && response.data) {
        setReviews(response.data.reviews || [])
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
      showToast({
        type: 'error',
        title: '리뷰 로딩 실패',
        message: '리뷰를 불러올 수 없습니다.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    setIsLoadingStats(true)
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.MY_STATS)
      
      if (response.success && response.data) {
        setStats({
          totalReviews: response.data.totalReviews || 0,
          averageRating: response.data.averageRating || 0,
          helpfulCount: response.data.helpfulCount || 0,
          topReviewer: response.data.topReviewer || false
        })
      }
    } catch (error) {
      console.error('Failed to load review stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const getFilteredReviews = () => {
    switch (filter) {
      case 'recent':
        return [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'popular':
        return [...reviews].sort((a, b) => b.helpful - a.helpful)
      default:
        return reviews
    }
  }

  const renderStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">리뷰를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // 리디렉션 중
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/main" className="hover:text-hazelnut transition-colors">홈</Link>
            <span>›</span>
            <Link href="/profile" className="hover:text-hazelnut transition-colors">프로필</Link>
            <span>›</span>
            <span className="text-brown-900 font-medium">내 리뷰</span>
          </div>
          
          <h1 className="text-3xl font-bold text-brown-900 mb-2">내 리뷰 📝</h1>
          <p className="text-gray-600">작성한 리뷰를 관리하고 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 - 통계 */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-bold text-brown-900 mb-4">리뷰 통계</h2>
              
              {isLoadingStats ? (
                <div className="text-center py-6">
                  <div className="w-6 h-6 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-500">통계를 불러오는 중...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-hazelnut-50 rounded-lg">
                    <div className="text-2xl font-bold text-hazelnut">{stats.totalReviews}</div>
                    <div className="text-sm text-gray-600">총 리뷰 수</div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {stats.averageRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">평균 별점</div>
                    <div className="flex justify-center mt-1">
                      {renderStarRating(Math.round(stats.averageRating))}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-muted-blue">{stats.helpfulCount}</div>
                    <div className="text-sm text-gray-600">받은 도움돼요</div>
                  </div>

                  {stats.topReviewer && (
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-700 font-medium text-sm flex items-center justify-center gap-1">
                        🏆 탑 리뷰어
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 필터 */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                전체
              </Button>
              <Button
                variant={filter === 'recent' ? 'default' : 'outline'}
                onClick={() => setFilter('recent')}
                size="sm"
              >
                최신순
              </Button>
              <Button
                variant={filter === 'popular' ? 'default' : 'outline'}
                onClick={() => setFilter('popular')}
                size="sm"
              >
                도움돼요순
              </Button>
            </div>

            {/* 리뷰 목록 */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-hazelnut border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">리뷰를 불러오는 중...</p>
                </div>
              ) : getFilteredReviews().length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-4 text-4xl">📝</div>
                  <h3 className="text-lg font-medium text-brown-900 mb-2">작성한 리뷰가 없습니다</h3>
                  <p className="text-gray-600 mb-4">맛집을 방문하고 첫 리뷰를 작성해보세요!</p>
                  <Link href="/main">
                    <Button>맛집 둘러보기</Button>
                  </Link>
                </div>
              ) : (
                getFilteredReviews().map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* 식당 이미지 */}
                    <div className="flex-shrink-0">
                      <img
                        src={review.restaurantImage}
                        alt={review.restaurantName}
                        className="w-full md:w-24 h-32 md:h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* 리뷰 내용 */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-brown-900 mb-1">
                            {review.restaurantName}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">{renderStarRating(review.rating)}</div>
                            <span className="text-sm text-gray-500">
                              {review.visitDate} 방문
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                            {review.category}
                          </span>
                          <span>👍 {review.helpful}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {review.content}
                      </p>

                      {/* 리뷰 이미지 */}
                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-3 overflow-x-auto">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`리뷰 사진 ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{review.createdAt} 작성</span>
                        <div className="flex gap-2">
                          <button className="hover:text-hazelnut transition-colors">
                            수정
                          </button>
                          <button className="hover:text-red-600 transition-colors">
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}