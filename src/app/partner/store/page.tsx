'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, Button, Input } from '@/components/ui'

interface StoreInfo {
  storeName: string
  storePhone: string
  storeAddress: string
  storeDescription: string
  storeCategory: string
}

interface BusinessHours {
  [key: string]: {
    isOpen: boolean
    openTime: string
    closeTime: string
    breakStart: string
    breakEnd: string
    hasBreakTime: boolean
  }
}

/**
 * 파트너 매장 정보 관리 페이지
 * HTML 시안: jarimae_partner_store_info_v2.html
 * 경로: /partner/store
 */
export default function PartnerStorePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'hours' | 'settings'>('info')
  const [isEditing, setIsEditing] = useState(false)

  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    storeName: '맛있는 한식당',
    storePhone: '02-1234-5678',
    storeAddress: '서울특별시 강남구 역삼동 123-45',
    storeDescription: '정성스럽게 만든 한국 전통 음식을 제공합니다. 신선한 재료와 정통 조리법으로 만든 요리를 경험해보세요.',
    storeCategory: '한식'
  })

  const dayNames = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
  
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    월요일: { isOpen: true, openTime: '10:00', closeTime: '22:00', breakStart: '15:00', breakEnd: '17:00', hasBreakTime: true },
    화요일: { isOpen: true, openTime: '10:00', closeTime: '22:00', breakStart: '15:00', breakEnd: '17:00', hasBreakTime: true },
    수요일: { isOpen: true, openTime: '10:00', closeTime: '22:00', breakStart: '15:00', breakEnd: '17:00', hasBreakTime: true },
    목요일: { isOpen: true, openTime: '10:00', closeTime: '22:00', breakStart: '15:00', breakEnd: '17:00', hasBreakTime: true },
    금요일: { isOpen: true, openTime: '10:00', closeTime: '22:00', breakStart: '15:00', breakEnd: '17:00', hasBreakTime: true },
    토요일: { isOpen: true, openTime: '10:00', closeTime: '23:00', breakStart: '', breakEnd: '', hasBreakTime: false },
    일요일: { isOpen: false, openTime: '10:00', closeTime: '22:00', breakStart: '', breakEnd: '', hasBreakTime: false }
  })

  const categories = [
    '한식', '중식', '일식', '양식', '치킨', '피자', '햄버거', '카페', '디저트', '술집', '기타'
  ]

  const handleSaveInfo = () => {
    console.log('Store info saved:', storeInfo)
    setIsEditing(false)
    // TODO: API 호출
  }

  const handleSaveHours = () => {
    console.log('Business hours saved:', businessHours)
    // TODO: API 호출
  }

  const handleHourChange = (day: string, field: string, value: string | boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const renderStoreInfoTab = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-brown-900">매장 기본 정보</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          size="sm"
        >
          {isEditing ? '취소' : '수정'}
        </Button>
      </div>

      <div className="space-y-6">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-brown-900 mb-2">
                매장명
              </label>
              <Input
                value={storeInfo.storeName}
                onChange={(value) => setStoreInfo(prev => ({ ...prev, storeName: value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-900 mb-2">
                전화번호
              </label>
              <Input
                value={storeInfo.storePhone}
                onChange={(value) => setStoreInfo(prev => ({ ...prev, storePhone: value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-900 mb-2">
                주소
              </label>
              <Input
                value={storeInfo.storeAddress}
                onChange={(value) => setStoreInfo(prev => ({ ...prev, storeAddress: value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-900 mb-2">
                카테고리
              </label>
              <div className="grid grid-cols-4 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setStoreInfo(prev => ({ ...prev, storeCategory: category }))}
                    className={`p-3 rounded-lg border transition-colors text-sm font-medium ${
                      storeInfo.storeCategory === category
                        ? 'bg-hazelnut text-white border-hazelnut'
                        : 'bg-white text-brown-900 border-gray-200 hover:border-hazelnut'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-900 mb-2">
                매장 소개
              </label>
              <textarea
                rows={4}
                value={storeInfo.storeDescription}
                onChange={(e) => setStoreInfo(prev => ({ ...prev, storeDescription: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hazelnut focus:border-transparent resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                취소
              </Button>
              <Button onClick={handleSaveInfo}>
                저장
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  매장명
                </label>
                <p className="text-lg text-brown-900">{storeInfo.storeName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  전화번호
                </label>
                <p className="text-lg text-brown-900">{storeInfo.storePhone}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  주소
                </label>
                <p className="text-lg text-brown-900">{storeInfo.storeAddress}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  카테고리
                </label>
                <span className="inline-block px-3 py-1 bg-hazelnut text-white rounded-full text-sm">
                  {storeInfo.storeCategory}
                </span>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  매장 소개
                </label>
                <p className="text-brown-900">{storeInfo.storeDescription}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )

  const renderBusinessHoursTab = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-brown-900">영업 시간</h2>
        <Button onClick={handleSaveHours} size="sm">
          저장
        </Button>
      </div>

      <div className="space-y-4">
        {dayNames.map((day) => (
          <div key={day} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-brown-900 w-16">{day}</span>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={businessHours[day].isOpen}
                    onChange={(e) => handleHourChange(day, 'isOpen', e.target.checked)}
                    className="mr-2"
                  />
                  영업
                </label>
              </div>
            </div>

            {businessHours[day].isOpen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-12">영업:</span>
                  <input
                    type="time"
                    value={businessHours[day].openTime}
                    onChange={(e) => handleHourChange(day, 'openTime', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hazelnut focus:border-transparent"
                  />
                  <span className="text-gray-500">~</span>
                  <input
                    type="time"
                    value={businessHours[day].closeTime}
                    onChange={(e) => handleHourChange(day, 'closeTime', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hazelnut focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={businessHours[day].hasBreakTime}
                      onChange={(e) => handleHourChange(day, 'hasBreakTime', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">브레이크타임</span>
                  </label>
                </div>

                {businessHours[day].hasBreakTime && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 w-12">휴식:</span>
                    <input
                      type="time"
                      value={businessHours[day].breakStart}
                      onChange={(e) => handleHourChange(day, 'breakStart', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hazelnut focus:border-transparent"
                    />
                    <span className="text-gray-500">~</span>
                    <input
                      type="time"
                      value={businessHours[day].breakEnd}
                      onChange={(e) => handleHourChange(day, 'breakEnd', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hazelnut focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            )}

            {!businessHours[day].isOpen && (
              <div className="text-gray-500 text-sm">휴무</div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )

  const renderSettingsTab = () => (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-brown-900 mb-6">매장 설정</h2>
      
      <div className="space-y-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-brown-900 mb-2">예약 설정</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">온라인 예약 받기</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">당일 예약 허용</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-sm text-gray-700">예약 확정 전 승인 필요</span>
            </label>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-brown-900 mb-2">웨이팅 설정</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">웨이팅 접수 받기</span>
            </label>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">최대 웨이팅 팀 수:</span>
              <input
                type="number"
                defaultValue="10"
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hazelnut focus:border-transparent"
              />
              <span className="text-sm text-gray-700">팀</span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-brown-900 mb-2">알림 설정</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">새 예약 알림</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">예약 취소 알림</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-sm text-gray-700">새 리뷰 알림</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            설정 저장
          </Button>
        </div>
      </div>
    </Card>
  )

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
              <span className="text-brown-900 font-medium">매장 정보</span>
            </div>
            <Button variant="outline" size="sm">
              로그아웃
            </Button>
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
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="mr-3">🍽️</span>
                메뉴 관리
              </Link>
              <Link
                href="/partner/store"
                className="flex items-center px-4 py-3 text-brown-900 bg-hazelnut-50 rounded-lg font-medium"
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
            <h1 className="text-2xl font-bold text-brown-900 mb-2">매장 정보 관리</h1>
            <p className="text-gray-600">매장의 기본 정보와 운영 설정을 관리하세요</p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex space-x-1 mb-6">
            {[
              { id: 'info', label: '기본 정보', icon: '🏪' },
              { id: 'hours', label: '영업 시간', icon: '🕒' },
              { id: 'settings', label: '설정', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-hazelnut text-white'
                    : 'text-brown-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'info' && renderStoreInfoTab()}
          {activeTab === 'hours' && renderBusinessHoursTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </main>
      </div>
    </div>
  )
}