import React from 'react'
import { clsx } from 'clsx'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
  className?: string
  text?: string
  overlay?: boolean
}

/**
 * 로딩 컴포넌트
 * 다양한 크기와 스타일의 로딩 인디케이터를 제공합니다.
 */
export default function Loading({
  size = 'md',
  variant = 'spinner',
  className,
  text,
  overlay = false
}: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const renderSpinner = () => (
    <div
      className={clsx(
        'border-2 border-gray-200 border-t-hazelnut rounded-full animate-spin',
        sizes[size]
      )}
    />
  )

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            'bg-hazelnut rounded-full animate-pulse',
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <div
      className={clsx(
        'bg-hazelnut rounded-full animate-pulse',
        sizes[size]
      )}
      style={{
        animationDuration: '2s'
      }}
    />
  )

  const getLoadingElement = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      default:
        return renderSpinner()
    }
  }

  const content = (
    <div className={clsx(
      'flex flex-col items-center justify-center space-y-3',
      className
    )}>
      {getLoadingElement()}
      {text && (
        <p className={clsx('text-gray-600 font-medium', textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {content}
        </div>
      </div>
    )
  }

  return content
}

// 페이지 로딩용 컴포넌트
export function PageLoading({ text = '로딩 중...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-warm-gray flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  )
}

// 버튼 내부 로딩용 컴포넌트
export function ButtonLoading({ className }: { className?: string }) {
  return (
    <Loading 
      size="sm" 
      variant="spinner" 
      className={clsx('inline-flex', className)} 
    />
  )
}

// 카드 로딩용 스켈레톤 컴포넌트
export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 rounded-lg h-48 mb-4"></div>
      <div className="space-y-2">
        <div className="bg-gray-300 h-4 rounded w-3/4"></div>
        <div className="bg-gray-300 h-4 rounded w-1/2"></div>
      </div>
    </div>
  )
}

// 리스트 로딩용 스켈레톤 컴포넌트
export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4">
          <div className="bg-gray-300 rounded-full w-12 h-12"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
            <div className="bg-gray-300 h-4 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}