'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, Button, Input } from '@/components/ui'

interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  category: string
  image?: string
  isRecommended: boolean
  isAvailable: boolean
}

interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

/**
 * 파트너 메뉴 관리 페이지
 * HTML 시안: jarimae_partner_menu.html
 * 경로: /partner/menu
 */
export default function PartnerMenuPage() {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    description: '',
    category: '',
    isRecommended: false,
    isAvailable: true
  })

  // 임시 메뉴 데이터
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([
    {
      id: '1',
      name: '대표 메뉴',
      items: [
        {
          id: '1',
          name: '김치찌개',
          price: 8000,
          description: '진짜 맛있는 김치찌개',
          category: '대표 메뉴',
          isRecommended: true,
          isAvailable: true
        },
        {
          id: '2',
          name: '된장찌개',
          price: 7000,
          description: '구수한 된장찌개',
          category: '대표 메뉴',
          isRecommended: false,
          isAvailable: true
        }
      ]
    },
    {
      id: '2',
      name: '메인 요리',
      items: [
        {
          id: '3',
          name: '불고기',
          price: 15000,
          description: '한우 불고기',
          category: '메인 요리',
          isRecommended: true,
          isAvailable: true
        },
        {
          id: '4',
          name: '갈비찜',
          price: 18000,
          description: '부드러운 갈비찜',
          category: '메인 요리',
          isRecommended: false,
          isAvailable: false
        }
      ]
    }
  ])

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category) return

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: newItem.price,
      description: newItem.description || '',
      category: newItem.category,
      isRecommended: newItem.isRecommended || false,
      isAvailable: newItem.isAvailable !== false
    }

    setMenuCategories(prev => {
      const updatedCategories = [...prev]
      const categoryIndex = updatedCategories.findIndex(cat => cat.name === item.category)
      
      if (categoryIndex >= 0) {
        updatedCategories[categoryIndex].items.push(item)
      } else {
        updatedCategories.push({
          id: Date.now().toString(),
          name: item.category,
          items: [item]
        })
      }
      
      return updatedCategories
    })

    setNewItem({
      name: '',
      price: 0,
      description: '',
      category: '',
      isRecommended: false,
      isAvailable: true
    })
    setIsAddingItem(false)
  }

  const handleToggleAvailable = (categoryId: string, itemId: string) => {
    setMenuCategories(prev =>
      prev.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? { ...item, isAvailable: !item.isAvailable }
                  : item
              )
            }
          : category
      )
    )
  }

  const handleToggleRecommended = (categoryId: string, itemId: string) => {
    setMenuCategories(prev =>
      prev.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId
                  ? { ...item, isRecommended: !item.isRecommended }
                  : item
              )
            }
          : category
      )
    )
  }

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    if (!confirm('이 메뉴를 삭제하시겠습니까?')) return

    setMenuCategories(prev =>
      prev.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.filter(item => item.id !== itemId)
            }
          : category
      ).filter(category => category.items.length > 0)
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      {/* 상단 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-hazelnut">
                자리매
              </Link>
              <span className="text-brown-900 font-medium">메뉴 관리</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsAddingItem(true)}
                size="sm"
              >
                + 메뉴 추가
              </Button>
              <Button variant="outline" size="sm">
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              <Link
                href="/partner/dashboard"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="mr-3">📊</span>
                대시보드
              </Link>
              <Link
                href="/partner/menu"
                className="flex items-center px-4 py-3 text-brown-900 bg-hazelnut-50 rounded-lg font-medium"
              >
                <span className="mr-3">🍽️</span>
                메뉴 관리
              </Link>
              <Link
                href="/partner/store"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="mr-3">🏪</span>
                매장 정보
              </Link>
              <Link
                href="/partner/settlement"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="mr-3">💰</span>
                정산 관리
              </Link>
            </div>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-brown-900 mb-2">메뉴 관리</h1>
            <p className="text-gray-600">매장의 메뉴를 등록하고 관리하세요</p>
          </div>

          {/* 메뉴 추가 폼 */}
          {isAddingItem && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-bold text-brown-900 mb-4">새 메뉴 추가</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="메뉴명"
                  value={newItem.name || ''}
                  onChange={(value) => setNewItem(prev => ({ ...prev, name: value }))}
                />
                
                <Input
                  placeholder="가격 (원)"
                  type="number"
                  value={newItem.price?.toString() || ''}
                  onChange={(value) => setNewItem(prev => ({ ...prev, price: parseInt(value) || 0 }))}
                />
                
                <Input
                  placeholder="카테고리"
                  value={newItem.category || ''}
                  onChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
                />
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.isRecommended || false}
                      onChange={(e) => setNewItem(prev => ({ ...prev, isRecommended: e.target.checked }))}
                      className="mr-2"
                    />
                    추천 메뉴
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newItem.isAvailable !== false}
                      onChange={(e) => setNewItem(prev => ({ ...prev, isAvailable: e.target.checked }))}
                      className="mr-2"
                    />
                    판매 가능
                  </label>
                </div>
              </div>
              
              <textarea
                placeholder="메뉴 설명"
                value={newItem.description || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hazelnut focus:border-transparent resize-none mb-4"
                rows={3}
              />
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingItem(false)
                    setNewItem({
                      name: '',
                      price: 0,
                      description: '',
                      category: '',
                      isRecommended: false,
                      isAvailable: true
                    })
                  }}
                >
                  취소
                </Button>
                <Button onClick={handleAddItem}>
                  메뉴 추가
                </Button>
              </div>
            </Card>
          )}

          {/* 메뉴 카테고리별 목록 */}
          <div className="space-y-6">
            {menuCategories.map((category) => (
              <Card key={category.id} className="p-6">
                <h2 className="text-xl font-bold text-brown-900 mb-4">{category.name}</h2>
                
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        item.isAvailable ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`font-medium ${item.isAvailable ? 'text-brown-900' : 'text-gray-500'}`}>
                            {item.name}
                          </h3>
                          {item.isRecommended && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                              추천
                            </span>
                          )}
                          {!item.isAvailable && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                              품절
                            </span>
                          )}
                        </div>
                        
                        <p className={`text-sm mb-2 ${item.isAvailable ? 'text-gray-600' : 'text-gray-400'}`}>
                          {item.description}
                        </p>
                        
                        <p className={`font-bold ${item.isAvailable ? 'text-brown-900' : 'text-gray-500'}`}>
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleRecommended(category.id, item.id)}
                        >
                          {item.isRecommended ? '추천 해제' : '추천 설정'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleAvailable(category.id, item.id)}
                        >
                          {item.isAvailable ? '품절 처리' : '판매 재개'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteItem(category.id, item.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {menuCategories.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-brown-900 mb-2">등록된 메뉴가 없습니다</h3>
              <p className="text-gray-600 mb-4">첫 메뉴를 등록해보세요</p>
              <Button onClick={() => setIsAddingItem(true)}>
                메뉴 추가하기
              </Button>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}