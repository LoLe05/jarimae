'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

interface NavigationItem {
  name: string
  href: string
  icon: React.ReactNode
  badge?: string | number
  children?: Array<{
    name: string
    href: string
    badge?: string | number
  }>
}

interface NavigationProps {
  className?: string
  items: NavigationItem[]
  isCollapsed?: boolean
  onCollapseChange?: (collapsed: boolean) => void
}

/**
 * 자리매 사이드 네비게이션 컴포넌트
 * 주로 사장님 대시보드에서 사용
 */
export default function Navigation({ 
  className, 
  items, 
  isCollapsed = false,
  onCollapseChange 
}: NavigationProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 현재 경로에 해당하는 부모 메뉴 자동 확장
  useEffect(() => {
    const currentParent = items.find(item => 
      item.children?.some(child => pathname.startsWith(child.href))
    )
    if (currentParent && !expandedItems.includes(currentParent.name)) {
      setExpandedItems(prev => [...prev, currentParent.name])
    }
  }, [pathname, items, expandedItems])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const handleCollapseToggle = () => {
    onCollapseChange?.(!isCollapsed)
  }

  const NavItem = ({ item, level = 0 }: { item: NavigationItem; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)
    const active = isActive(item.href)
    
    return (
      <div>
        {hasChildren ? (
          // 하위 메뉴가 있는 경우
          <button
            onClick={() => toggleExpanded(item.name)}
            className={clsx(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              'hover:bg-hazelnut-50 focus:bg-hazelnut-50 focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50',
              active 
                ? 'bg-hazelnut text-white shadow-sm' 
                : 'text-brown-900',
              level > 0 && 'ml-4',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <div className="flex items-center gap-3">
              <span className={clsx(
                'flex-shrink-0',
                isCollapsed ? 'text-lg' : 'text-base'
              )}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={clsx(
                      'inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full min-w-[1.25rem] h-5',
                      active 
                        ? 'bg-white text-hazelnut'
                        : 'bg-hazelnut text-white'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </div>
            
            {!isCollapsed && (
              <svg
                className={clsx(
                  'w-4 h-4 transition-transform duration-200',
                  isExpanded ? 'transform rotate-180' : ''
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            )}
          </button>
        ) : (
          // 단순 링크인 경우
          <Link
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              'hover:bg-hazelnut-50 focus:bg-hazelnut-50 focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50',
              active 
                ? 'bg-hazelnut text-white shadow-sm' 
                : 'text-brown-900',
              level > 0 && 'ml-4',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <span className={clsx(
              'flex-shrink-0',
              isCollapsed ? 'text-lg' : 'text-base'
            )}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <>
                <span>{item.name}</span>
                {item.badge && (
                  <span className={clsx(
                    'inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full min-w-[1.25rem] h-5 ml-auto',
                    active 
                      ? 'bg-white text-hazelnut'
                      : 'bg-hazelnut text-white'
                  )}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        )}

        {/* 하위 메뉴 */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <Link
                key={child.name}
                href={child.href}
                className={clsx(
                  'flex items-center gap-3 ml-8 px-3 py-2 rounded-lg text-sm transition-colors duration-200',
                  'hover:bg-hazelnut-50 focus:bg-hazelnut-50 focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50',
                  isActive(child.href)
                    ? 'text-hazelnut font-medium bg-hazelnut-50'
                    : 'text-gray-600'
                )}
              >
                <span className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0" />
                <span>{child.name}</span>
                {child.badge && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full min-w-[1.25rem] h-5 ml-auto bg-hazelnut text-white">
                    {child.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <nav className={clsx(
        'hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-brown-900">메뉴</h2>
          )}
          <button
            onClick={handleCollapseToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50"
            aria-label={isCollapsed ? '메뉴 확장' : '메뉴 축소'}
          >
            <svg 
              className={clsx(
                'w-4 h-4 transition-transform duration-200',
                isCollapsed ? 'rotate-180' : ''
              )}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
              />
            </svg>
          </button>
        </div>

        {/* 메뉴 항목들 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </nav>

      {/* 모바일 메뉴 버튼 */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-hazelnut text-white rounded-full shadow-lg hover:bg-hazelnut-600 focus:bg-hazelnut-600 focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50"
        aria-label="메뉴 열기"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 모바일 사이드 메뉴 */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* 오버레이 */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* 사이드바 */}
          <nav className="relative flex flex-col w-80 max-w-sm bg-white shadow-hard">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-brown-900">메뉴</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50"
                aria-label="메뉴 닫기"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 메뉴 항목들 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {items.map((item) => (
                <div 
                  key={item.name}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <NavItem item={item} />
                </div>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}