'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'

interface SettlementData {
  date: string
  totalRevenue: number
  commission: number
  settlement: number
  reservations: number
}

interface MonthlyStats {
  month: string
  totalRevenue: number
  totalCommission: number
  totalSettlement: number
  totalReservations: number
}

/**
 * 파트너 정산 관리 페이지
 * HTML 시안: jarimae_partner_settlement_v2.html
 * 경로: /partner/settlement
 */
export default function PartnerSettlementPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-09')
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'account'>('daily')

  // 임시 정산 데이터
  const [dailySettlements] = useState<SettlementData[]>([
    {
      date: '2024-09-01',
      totalRevenue: 450000,
      commission: 22500,
      settlement: 427500,
      reservations: 15
    },
    {
      date: '2024-09-02',
      totalRevenue: 380000,
      commission: 19000,
      settlement: 361000,
      reservations: 12
    },
    {
      date: '2024-09-03',
      totalRevenue: 520000,
      commission: 26000,
      settlement: 494000,
      reservations: 18
    }
  ])

  const [monthlyStats] = useState<MonthlyStats[]>([
    {
      month: '2024-08',
      totalRevenue: 12500000,
      totalCommission: 625000,
      totalSettlement: 11875000,
      totalReservations: 320
    },
    {
      month: '2024-07',
      totalRevenue: 11800000,
      totalCommission: 590000,
      totalSettlement: 11210000,
      totalReservations: 295
    },
    {
      month: '2024-06',
      totalRevenue: 13200000,
      totalCommission: 660000,
      totalSettlement: 12540000,
      totalReservations: 340
    }
  ])

  const [accountInfo] = useState({
    bankName: '국민은행',
    accountNumber: '123456-78-901234',
    accountHolder: '김사장',
    settlementCycle: 'weekly', // weekly, monthly
    nextSettlementDate: '2024-09-15'
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderDailyTab = () => (
    <div className="space-y-6">
      {/* 월 선택 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brown-900">일별 정산 내역</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hazelnut focus:border-transparent"
        >
          <option value="2024-09">2024년 9월</option>
          <option value="2024-08">2024년 8월</option>
          <option value="2024-07">2024년 7월</option>
        </select>
      </div>

      {/* 정산 목록 */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-brown-900">날짜</th>
                <th className="text-right py-3 px-4 font-medium text-brown-900">총 매출</th>
                <th className="text-right py-3 px-4 font-medium text-brown-900">수수료 (5%)</th>
                <th className="text-right py-3 px-4 font-medium text-brown-900">정산금</th>
                <th className="text-center py-3 px-4 font-medium text-brown-900">예약 수</th>
              </tr>
            </thead>
            <tbody>
              {dailySettlements.map((settlement, index) => (
                <tr key={settlement.date} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 text-brown-900">
                    {formatDate(settlement.date)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-brown-900">
                    {formatCurrency(settlement.totalRevenue)}
                  </td>
                  <td className="py-3 px-4 text-right text-red-600">
                    -{formatCurrency(settlement.commission)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-hazelnut">
                    {formatCurrency(settlement.settlement)}
                  </td>
                  <td className="py-3 px-4 text-center text-brown-900">
                    {settlement.reservations}건
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 합계 */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-end space-x-8">
            <div className="text-right">
              <p className="text-sm text-gray-600">총 매출</p>
              <p className="text-lg font-bold text-brown-900">
                {formatCurrency(dailySettlements.reduce((sum, item) => sum + item.totalRevenue, 0))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">총 수수료</p>
              <p className="text-lg font-bold text-red-600">
                -{formatCurrency(dailySettlements.reduce((sum, item) => sum + item.commission, 0))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">총 정산금</p>
              <p className="text-xl font-bold text-hazelnut">
                {formatCurrency(dailySettlements.reduce((sum, item) => sum + item.settlement, 0))}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderMonthlyTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brown-900">월별 정산 통계</h2>

      {/* 월별 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm text-gray-600 mb-1">이번 달 매출</p>
          <p className="text-2xl font-bold text-brown-900">
            {formatCurrency(1350000)}
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl mb-2">💰</div>
          <p className="text-sm text-gray-600 mb-1">이번 달 정산금</p>
          <p className="text-2xl font-bold text-hazelnut">
            {formatCurrency(1282500)}
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl mb-2">📅</div>
          <p className="text-sm text-gray-600 mb-1">총 예약 수</p>
          <p className="text-2xl font-bold text-brown-900">45건</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl mb-2">📈</div>
          <p className="text-sm text-gray-600 mb-1">전월 대비</p>
          <p className="text-2xl font-bold text-green-600">+8.5%</p>
        </Card>
      </div>

      {/* 월별 내역 */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-brown-900 mb-4">월별 정산 내역</h3>
        
        <div className="space-y-4">
          {monthlyStats.map((stat) => (
            <div key={stat.month} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-brown-900">
                  {stat.month.replace('-', '년 ')}월
                </h4>
                <span className="text-sm text-gray-600">
                  {stat.totalReservations}건 예약
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">총 매출</p>
                  <p className="font-bold text-brown-900">{formatCurrency(stat.totalRevenue)}</p>
                </div>
                <div>
                  <p className="text-gray-600">수수료</p>
                  <p className="font-bold text-red-600">-{formatCurrency(stat.totalCommission)}</p>
                </div>
                <div>
                  <p className="text-gray-600">정산금</p>
                  <p className="font-bold text-hazelnut">{formatCurrency(stat.totalSettlement)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderAccountTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brown-900">정산 계좌 관리</h2>

      {/* 정산 정보 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-brown-900">정산 계좌 정보</h3>
          <Button variant="outline" size="sm">
            수정
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                은행명
              </label>
              <p className="text-lg text-brown-900">{accountInfo.bankName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                계좌번호
              </label>
              <p className="text-lg text-brown-900 font-mono">{accountInfo.accountNumber}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                예금주
              </label>
              <p className="text-lg text-brown-900">{accountInfo.accountHolder}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                정산 주기
              </label>
              <p className="text-lg text-brown-900">
                {accountInfo.settlementCycle === 'weekly' ? '주간 정산' : '월간 정산'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 다음 정산 일정 */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-brown-900 mb-4">정산 일정</h3>
        
        <div className="bg-hazelnut-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📅</div>
            <div>
              <p className="text-sm text-gray-600">다음 정산 예정일</p>
              <p className="text-lg font-bold text-brown-900">
                {formatDate(accountInfo.nextSettlementDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>• 정산은 매주 일요일에 진행됩니다</p>
          <p>• 정산 후 1-2 영업일 내에 계좌로 입금됩니다</p>
          <p>• 정산 수수료는 총 매출의 5%입니다</p>
        </div>
      </Card>

      {/* 정산 내역 다운로드 */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-brown-900 mb-4">정산 내역 다운로드</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-brown-900">2024년 8월 정산서</p>
              <p className="text-sm text-gray-600">2024-08-01 ~ 2024-08-31</p>
            </div>
            <Button variant="outline" size="sm">
              다운로드
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-brown-900">2024년 7월 정산서</p>
              <p className="text-sm text-gray-600">2024-07-01 ~ 2024-07-31</p>
            </div>
            <Button variant="outline" size="sm">
              다운로드
            </Button>
          </div>
        </div>
      </Card>
    </div>
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
              <span className="text-brown-900 font-medium">정산 관리</span>
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
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="mr-3">🏪</span>
                매장 정보
              </Link>
              <Link
                href="/partner/settlement"
                className="flex items-center px-4 py-3 text-brown-900 bg-hazelnut-50 rounded-lg font-medium"
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
            <h1 className="text-2xl font-bold text-brown-900 mb-2">정산 관리</h1>
            <p className="text-gray-600">매출 내역과 정산 정보를 확인하고 관리하세요</p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex space-x-1 mb-6">
            {[
              { id: 'daily', label: '일별 정산', icon: '📊' },
              { id: 'monthly', label: '월별 통계', icon: '📈' },
              { id: 'account', label: '정산 계좌', icon: '🏦' }
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
          {activeTab === 'daily' && renderDailyTab()}
          {activeTab === 'monthly' && renderMonthlyTab()}
          {activeTab === 'account' && renderAccountTab()}
        </main>
      </div>
    </div>
  )
}