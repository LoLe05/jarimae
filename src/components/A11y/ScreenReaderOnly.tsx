import React from 'react'

interface ScreenReaderOnlyProps {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
}

/**
 * 스크린 리더 전용 텍스트 컴포넌트
 * 시각적으로는 숨겨지지만 스크린 리더에서는 읽히는 텍스트를 제공합니다.
 */
export default function ScreenReaderOnly({ 
  children, 
  as: Component = 'span' 
}: ScreenReaderOnlyProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}