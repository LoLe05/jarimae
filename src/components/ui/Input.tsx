import React, { forwardRef, useState } from 'react'
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
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordType = type === 'password'
  const inputType = isPasswordType && showPassword ? 'text' : type

  const baseStyles = [
    // 기본 스타일
    'w-full py-3 rounded-xl',
    'text-brown-900 placeholder-gray-500',
    'border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-opacity-20',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
    // 자동완성 스타일 방지
    'autofill:!bg-white',
    // 패딩 조정 - 비밀번호 타입이면 오른쪽에 버튼 공간 확보
    isPasswordType ? 'pl-4 pr-12' : 'px-4',
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
      
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={inputType}
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
        
        {/* 비밀번호 보기 토글 버튼 */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-hazelnut focus:text-hazelnut focus:outline-none mobile-tap"
            tabIndex={-1}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      
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