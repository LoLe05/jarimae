import React, { forwardRef } from 'react'
import { clsx } from 'clsx'
import type { ButtonProps } from '@/types'

/**
 * 자리매 브랜드 스타일 Button 컴포넌트
 * 
 * @example
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   예약하기
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  children,
  ...props
}, ref) => {
  const baseStyles = [
    // 기본 스타일
    'inline-flex items-center justify-center',
    'font-medium rounded-full',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none',
    // 터치 최적화
    'touch-manipulation',
    'active:scale-[0.98]'
  ]

  const variants = {
    primary: [
      'bg-hazelnut text-white',
      'hover:bg-hazelnut-600 focus:bg-hazelnut-700',
      'focus:ring-hazelnut focus:ring-opacity-50',
      'shadow-sm hover:shadow-md',
      'disabled:bg-hazelnut-300'
    ],
    secondary: [
      'bg-muted-blue text-white',
      'hover:bg-muted-blue-600 focus:bg-muted-blue-700',
      'focus:ring-muted-blue focus:ring-opacity-50',
      'shadow-sm hover:shadow-md',
      'disabled:bg-muted-blue-300'
    ],
    outline: [
      'border-2 border-hazelnut text-hazelnut bg-transparent',
      'hover:bg-hazelnut hover:text-white',
      'focus:bg-hazelnut focus:text-white',
      'focus:ring-hazelnut focus:ring-opacity-50',
      'disabled:border-hazelnut-300 disabled:text-hazelnut-300'
    ],
    ghost: [
      'text-brown-900 bg-transparent',
      'hover:bg-warm-gray-100',
      'focus:bg-warm-gray-200',
      'focus:ring-brown-900 focus:ring-opacity-20',
      'disabled:text-brown-400'
    ]
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]'
  }

  const combinedClassName = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    {
      'cursor-not-allowed': disabled || loading,
      'pointer-events-none': loading
    },
    className
  )

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    onClick?.()
  }

  return (
    <button
      ref={ref}
      type={type}
      className={combinedClassName}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>잠시만요...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button