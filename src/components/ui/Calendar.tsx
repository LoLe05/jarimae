'use client'

import React, { useState, useMemo, useCallback, memo } from 'react'
// import Card from './Card'

interface ReservationEvent {
  id: string
  title: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  guests: number
}

interface CalendarProps {
  events?: ReservationEvent[]
  onDateClick?: (date: Date) => void
  onEventClick?: (event: ReservationEvent) => void
}

function CalendarComponent({ events = [], onDateClick, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // 현재 월의 첫 날과 마지막 날
  const firstDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  }, [currentDate])
  
  const lastDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  }, [currentDate])
  
  // 달력에 표시할 날짜들
  const calendarDays = useMemo(() => {
    const days = []
    
    // 이전 달의 마지막 날들 (빈 칸 채우기)
    const firstDayWeekday = firstDayOfMonth.getDay()
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(firstDayOfMonth)
      date.setDate(date.getDate() - i - 1)
      days.push({ date, isCurrentMonth: false })
    }
    
    // 현재 달의 날들
    for (let date = 1; date <= lastDayOfMonth.getDate(); date++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
      days.push({ date: dayDate, isCurrentMonth: true })
    }
    
    // 다음 달의 첫 날들 (6주 완성)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDayOfMonth)
      date.setDate(date.getDate() + i)
      days.push({ date, isCurrentMonth: false })
    }
    
    return days
  }, [firstDayOfMonth, lastDayOfMonth, currentDate])
  
  // 특정 날짜의 이벤트들 가져오기
  const getEventsForDate = useCallback((date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateString)
  }, [events])
  
  // 이전 달로 이동
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }, [])
  
  // 다음 달로 이동
  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }, [])
  
  // 오늘 날짜인지 확인
  const isToday = useCallback((date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }, [])
  
  // 과거 날짜인지 확인
  const isPast = useCallback((date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }, [])
  
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]
  
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  
  return (
    <div className="bg-white shadow-soft border border-gray-100 rounded-xl">
      <div className="p-4 sm:p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-brown-900 flex items-center gap-2">
            📅 예약 달력
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="이전 달"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="text-lg font-semibold text-brown-900 min-w-[80px] text-center">
              {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
            </span>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="다음 달"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* 달력 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ date, isCurrentMonth }, index) => {
            const dayEvents = getEventsForDate(date)
            const hasEvents = dayEvents.length > 0
            const isCurrentDay = isToday(date)
            const isPastDay = isPast(date)
            
            return (
              <div
                key={index}
                onClick={() => onDateClick?.(date)}
                className={`
                  relative min-h-[60px] p-1 border border-gray-100 rounded-lg cursor-pointer transition-all duration-200
                  hover:bg-gray-50 active:bg-gray-100
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isCurrentDay ? 'ring-2 ring-hazelnut ring-inset' : ''}
                  ${isPastDay && !isCurrentDay ? 'bg-gray-50' : ''}
                `}
              >
                {/* 날짜 숫자 */}
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentDay ? 'text-hazelnut' : 
                  isPastDay ? 'text-gray-400' : 
                  'text-gray-700'
                }`}>
                  {date.getDate()}
                </div>
                
                {/* 예약 이벤트들 */}
                {hasEvents && (
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick?.(event)
                        }}
                        className={`
                          text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer
                          ${event.status === 'confirmed' ? 'bg-muted-blue' :
                            event.status === 'pending' ? 'bg-hazelnut' :
                            event.status === 'completed' ? 'bg-brown-900' :
                            'bg-red-600'}
                        `}
                        title={`${event.title} - ${event.time} (${event.guests}명)`}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 2}개 더
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* 범례 */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600 mb-2">상태별 표시</div>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-muted-blue rounded"></div>
              <span>확정</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-hazelnut rounded"></div>
              <span>대기</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-brown-900 rounded"></div>
              <span>완료</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span>취소</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// memo로 컴포넌트를 감싸서 불필요한 리렌더링 방지
export const Calendar = memo(CalendarComponent)