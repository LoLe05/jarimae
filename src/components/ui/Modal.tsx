'use client'

import React, { useEffect, useRef, forwardRef } from 'react'
import { clsx } from 'clsx'
import type { BaseProps } from '@/types'

interface ModalProps extends BaseProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  preventBodyScroll?: boolean
}

/**
 * 자리매 브랜드 스타일 Modal 컴포넌트
 * 
 * @example
 * <Modal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="예약 확인"
 *   size="md"
 * >
 *   <p>예약을 진행하시겠습니까?</p>
 *   <div className="flex gap-2 mt-4">
 *     <Button onClick={handleConfirm}>확인</Button>
 *     <Button variant="outline" onClick={onClose}>취소</Button>
 *   </div>
 * </Modal>
 */
const Modal = forwardRef<HTMLDivElement, ModalProps>(({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  preventBodyScroll = true,
  className,
  children,
  ...props
}, ref) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // 바디 스크롤 방지
  useEffect(() => {
    if (!preventBodyScroll) return

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '15px' // 스크롤바 너비 보상
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0'
    }
  }, [isOpen, preventBodyScroll])

  // 포커스 관리
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      modalRef.current?.focus()
    } else {
      previousActiveElement.current?.focus()
    }
  }, [isOpen])

  // ESC 키 처리
  useEffect(() => {
    if (!closeOnEscape) return

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [isOpen, onClose, closeOnEscape])

  // 백드롭 클릭 처리
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose()
    }
  }

  // 포커스 트랩 (Tab 키 처리)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return

    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus()
        event.preventDefault()
      }
    }
  }

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* 백드롭 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* 모달 컨텐츠 */}
      <div
        ref={modalRef}
        className={clsx(
          'relative bg-white rounded-2xl shadow-hard max-h-[90vh] overflow-y-auto',
          'animate-slide-up',
          sizes[size],
          'w-full mx-4',
          className
        )}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        {...props}
      >
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              {title && (
                <h2 
                  id="modal-title"
                  className="text-xl font-semibold text-brown-900"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p 
                  id="modal-description"
                  className="mt-1 text-sm text-gray-600"
                >
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-brown-900 hover:bg-gray-100 transition-colors"
                aria-label="모달 닫기"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 바디 */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
})

Modal.displayName = 'Modal'

export default Modal

// 확인 모달 특화 컴포넌트
export const ConfirmModal = forwardRef<HTMLDivElement, {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'secondary'
  loading?: boolean
}>(({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = '확인',
  cancelText = '취소',
  confirmVariant = 'primary',
  loading = false 
}, ref) => {
  const handleConfirm = () => {
    onConfirm()
    if (!loading) onClose()
  }

  return (
    <Modal
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnBackdrop={!loading}
      closeOnEscape={!loading}
      showCloseButton={!loading}
    >
      <div className="text-center">
        <p className="text-gray-700 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={clsx(
              'px-6 py-2 rounded-full font-medium transition-colors',
              confirmVariant === 'primary' 
                ? 'bg-hazelnut text-white hover:bg-hazelnut-600'
                : 'bg-muted-blue text-white hover:bg-muted-blue-600',
              'disabled:opacity-50 flex items-center gap-2'
            )}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
})

ConfirmModal.displayName = 'ConfirmModal'