import React, { forwardRef } from 'react'
import { clsx } from 'clsx'
import type { InputProps } from '@/types'

/**
 * 자리매 브랜드 스타일 Input 컴포넌트
 * 
 * @example
 * <Input
 *   type="email"
 *   placeholder="이메일을 입력하세요"
 *   value={email}
 *   onChange={setEmail}
 *   error={!!errors.email}
 *   errorMessage={errors.email}
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  id,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  error = false,
  errorMessage,
  label,
  maxLength,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  className,
  children,
  ...props
}, ref) => {
  const baseStyles = [
    // 기본 스타일
    'w-full px-4 py-3 rounded-xl',
    'text-brown-900 placeholder-gray-500',
    'border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-opacity-20',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
    // 자동완성 스타일 방지
    'autofill:!bg-white',
  ]

  const variants = {
    default: [
      'border-gray-300 bg-white',
      'hover:border-gray-400',
      'focus:border-hazelnut focus:ring-hazelnut',
    ],
    error: [
      'border-red-400 bg-red-50',
      'hover:border-red-500',
      'focus:border-red-500 focus:ring-red-500',
    ]
  }

  const combinedClassName = clsx(
    baseStyles,
    error ? variants.error : variants.default,
    className
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  // 한국 전화번호 자동 하이픈 추가
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    onChange?.(formatted)
  }

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-brown-900 mb-2"
        >
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        maxLength={maxLength}
        className={combinedClassName}
        onChange={type === 'tel' ? handlePhoneChange : handleChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-invalid={error}
        aria-describedby={error && errorMessage ? `${id}-error` : undefined}
        {...props}
      />
      
      {error && errorMessage && (
        <p 
          id={`${id}-error`}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <svg 
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input