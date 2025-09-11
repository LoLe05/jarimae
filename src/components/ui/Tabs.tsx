'use client'

import React, { useState, useEffect, forwardRef } from 'react'
import { clsx } from 'clsx'
import type { BaseProps } from '@/types'

interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

interface TabsProps extends BaseProps {
  items: TabItem[]
  defaultTab?: string
  activeTab?: string
  onTabChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underlined'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

/**
 * 자리매 브랜드 스타일 Tabs 컴포넌트
 * 
 * @example
 * <Tabs
 *   items={[
 *     { id: 'reservation', label: '예약', content: <ReservationTab /> },
 *     { id: 'delivery', label: '배달', content: <DeliveryTab /> },
 *     { id: 'waiting', label: '웨이팅', content: <WaitingTab /> }
 *   ]}
 *   variant="pills"
 *   onTabChange={handleTabChange}
 * />
 */
const Tabs = forwardRef<HTMLDivElement, TabsProps>(({
  items,
  defaultTab,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}, ref) => {
  // items가 없으면 빈 div 반환
  if (!items || items.length === 0) {
    return <div ref={ref} className={clsx('w-full', className)} {...props} />
  }

  const [internalActiveTab, setInternalActiveTab] = useState(() => {
    return activeTab || defaultTab || items[0]?.id || ''
  })

  // 외부에서 activeTab이 변경될 때 내부 상태 동기화
  useEffect(() => {
    if (activeTab !== undefined) {
      setInternalActiveTab(activeTab)
    }
  }, [activeTab])

  const currentTab = activeTab !== undefined ? activeTab : internalActiveTab
  const currentContent = items.find(item => item.id === currentTab)?.content

  const handleTabClick = (tabId: string) => {
    const targetItem = items.find(item => item.id === tabId)
    if (targetItem?.disabled) return

    if (activeTab === undefined) {
      setInternalActiveTab(tabId)
    }
    onTabChange?.(tabId)
  }

  const tabListStyles = clsx(
    'flex',
    {
      'w-full': fullWidth,
      'w-fit': !fullWidth,
      'space-x-1': variant === 'pills',
      'space-x-4': variant === 'underlined',
      'border-b border-gray-200': variant === 'underlined'
    }
  )

  const getTabStyles = (item: TabItem, isActive: boolean) => {
    const baseStyles = [
      'relative flex items-center justify-center gap-2',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'w-full': fullWidth,
        'cursor-pointer': !item.disabled,
        'cursor-not-allowed': item.disabled
      }
    ]

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg'
    }

    const variants = {
      default: [
        'rounded-lg',
        isActive 
          ? 'bg-hazelnut text-white shadow-sm' 
          : 'text-brown-900 hover:bg-warm-gray-100'
      ],
      pills: [
        'rounded-full',
        isActive 
          ? 'bg-hazelnut text-white shadow-md' 
          : 'text-brown-900 hover:bg-warm-gray-100'
      ],
      underlined: [
        'border-b-2 pb-3 rounded-none',
        isActive 
          ? 'border-hazelnut text-hazelnut font-semibold' 
          : 'border-transparent text-gray-600 hover:text-brown-900 hover:border-gray-300'
      ]
    }

    return clsx(
      baseStyles,
      sizes[size],
      variants[variant]
    )
  }

  return (
    <div ref={ref} className={clsx('w-full', className)} {...props}>
      {/* 탭 리스트 */}
      <div 
        className={tabListStyles}
        role="tablist"
        aria-orientation="horizontal"
      >
        {items.map((item) => {
          const isActive = item.id === currentTab
          
          return (
            <button
              key={item.id}
              className={getTabStyles(item, isActive)}
              onClick={() => handleTabClick(item.id)}
              disabled={item.disabled}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${item.id}`}
              id={`tab-${item.id}`}
              tabIndex={isActive ? 0 : -1}
            >
              {item.label}
              
              {/* 배지 */}
              {item.badge && (
                <span className={clsx(
                  'inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full min-w-[1.25rem] h-5',
                  isActive 
                    ? 'bg-white text-hazelnut'
                    : 'bg-hazelnut text-white'
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="mt-6">
        {items.map((item) => (
          <div
            key={item.id}
            id={`tabpanel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${item.id}`}
            className={clsx(
              'focus:outline-none',
              item.id === currentTab ? 'block' : 'hidden'
            )}
            tabIndex={0}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
})

Tabs.displayName = 'Tabs'

export default Tabs

// 간단한 탭 헤더만 필요한 경우를 위한 TabList 컴포넌트
export const TabList = forwardRef<HTMLDivElement, {
  items: Array<{ id: string; label: string; disabled?: boolean; badge?: string | number }>
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underlined'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
}>(({ 
  items, 
  activeTab, 
  onTabChange, 
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className 
}, ref) => {
  const tabListStyles = clsx(
    'flex',
    {
      'w-full': fullWidth,
      'w-fit': !fullWidth,
      'space-x-1': variant === 'pills',
      'space-x-4': variant === 'underlined',
      'border-b border-gray-200': variant === 'underlined'
    }
  )

  const getTabStyles = (item: typeof items[0], isActive: boolean) => {
    const baseStyles = [
      'relative flex items-center justify-center gap-2',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'w-full': fullWidth,
        'cursor-pointer': !item.disabled,
        'cursor-not-allowed': item.disabled
      }
    ]

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg'
    }

    const variants = {
      default: [
        'rounded-lg',
        isActive 
          ? 'bg-hazelnut text-white shadow-sm' 
          : 'text-brown-900 hover:bg-warm-gray-100'
      ],
      pills: [
        'rounded-full',
        isActive 
          ? 'bg-hazelnut text-white shadow-md' 
          : 'text-brown-900 hover:bg-warm-gray-100'
      ],
      underlined: [
        'border-b-2 pb-3 rounded-none',
        isActive 
          ? 'border-hazelnut text-hazelnut font-semibold' 
          : 'border-transparent text-gray-600 hover:text-brown-900 hover:border-gray-300'
      ]
    }

    return clsx(
      baseStyles,
      sizes[size],
      variants[variant]
    )
  }

  return (
    <div 
      ref={ref}
      className={clsx(tabListStyles, className)}
      role="tablist"
      aria-orientation="horizontal"
    >
      {items.map((item) => {
        const isActive = item.id === activeTab
        
        return (
          <button
            key={item.id}
            className={getTabStyles(item, isActive)}
            onClick={() => !item.disabled && onTabChange(item.id)}
            disabled={item.disabled}
            role="tab"
            aria-selected={isActive}
            id={`tab-${item.id}`}
          >
            {item.label}
            
            {/* 배지 */}
            {item.badge && (
              <span className={clsx(
                'inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full min-w-[1.25rem] h-5',
                isActive 
                  ? 'bg-white text-hazelnut'
                  : 'bg-hazelnut text-white'
              )}>
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
})

TabList.displayName = 'TabList'