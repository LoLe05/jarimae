import React, { forwardRef } from 'react'
import { clsx } from 'clsx'
import type { CardProps } from '@/types'

/**
 * 자리매 브랜드 스타일 Card 컴포넌트
 * 
 * @example
 * <Card variant="elevated" padding="lg" clickable onClick={handleClick}>
 *   <h3>매장 이름</h3>
 *   <p>매장 설명</p>
 * </Card>
 */
const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  radius = 'xl',
  clickable = false,
  onClick,
  className,
  children,
  ...props
}, ref) => {
  const baseStyles = [
    // 기본 스타일
    'bg-white transition-all duration-200',
    // 클릭 가능한 카드의 경우 호버 효과
    clickable && [
      'cursor-pointer hover:shadow-md',
      'active:scale-[0.99] active:shadow-sm',
      'focus:outline-none focus:ring-2 focus:ring-hazelnut focus:ring-opacity-50'
    ]
  ]

  const variants = {
    default: [
      'shadow-soft border border-gray-100',
    ],
    elevated: [
      'shadow-medium border border-gray-100',
      clickable && 'hover:shadow-hard'
    ],
    outlined: [
      'border-2 border-gray-200 shadow-none',
      clickable && 'hover:border-hazelnut hover:shadow-soft'
    ]
  }

  const paddings = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  }

  const radiuses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl'
  }

  const combinedClassName = clsx(
    baseStyles,
    variants[variant],
    paddings[padding],
    radiuses[radius],
    className
  )

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickable) return
    onClick?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!clickable) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      ref={ref}
      className={combinedClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card

// 카드 하위 컴포넌트들
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex flex-col space-y-1.5 pb-4 border-b border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={clsx('text-2xl font-semibold leading-none tracking-tight text-brown-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx('text-sm text-gray-600', className)}
      {...props}
    >
      {children}
    </p>
  )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex items-center pt-4 border-t border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = 'CardFooter'