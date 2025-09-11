'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'

export default function FloatingPromotion() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // 페이지 로드 후 3초 뒤에 나타나도록
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Link href="/subscription/user?welcome=true">
        <div
          className="group relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 프로모션 아이콘 */}
          <div
            className={`
              w-14 h-14 bg-gradient-to-r from-pink-400 to-purple-500 
              rounded-full flex items-center justify-center 
              shadow-lg hover:shadow-xl transition-all duration-300 
              transform hover:scale-105 animate-bounce
              ${isHovered ? 'animate-none' : ''}
            `}
            style={{
              animation: isHovered ? 'none' : 'bounce 2s infinite'
            }}
          >
            <span className="text-2xl">🎁</span>
          </div>

          {/* 펄스 효과 */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-ping opacity-20"
            style={{ animationDuration: '3s' }}
          />

          {/* 호버 시 나타나는 텍스트 */}
          {isHovered && (
            <div 
              className="absolute left-16 top-1/2 transform -translate-y-1/2 
                         bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 
                         whitespace-nowrap z-50 animate-fadeIn"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">🎉 신규 회원 혜택</span>
              </div>
              {/* 말풍선 꼬리 */}
              <div 
                className="absolute right-full top-1/2 transform -translate-y-1/2 
                           w-0 h-0 border-t-4 border-b-4 border-r-4 
                           border-transparent border-r-white"
              />
            </div>
          )}

          {/* 새 알림 점 */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        </div>
      </Link>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px) translateY(-50%); }
          to { opacity: 1; transform: translateX(0) translateY(-50%); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}