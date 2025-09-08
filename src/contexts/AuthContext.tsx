'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiClient, API_ENDPOINTS } from '@/lib/api-client'
import { useToast } from '@/components/ui/Toast'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  userType: 'customer' | 'owner' | 'admin'
  nickname?: string
  profileImage?: string
  emailVerified?: boolean
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('🔧 AuthProvider 초기화됨')
  
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // 임시로 useToast 제거 - 순환 의존성 방지
  // const { showToast } = useToast()

  // 페이지 로드 시 토큰 확인 및 사용자 정보 복원
  useEffect(() => {
    console.log('🔄 useEffect 실행 - checkAuth 호출')
    checkAuth()
  }, []) // 빈 배열로 한 번만 실행되도록 유지

  const checkAuth = async () => {
    console.log('🔍 checkAuth 함수 실행됨')
    setIsLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('user_data')
      console.log('🔍 저장된 토큰:', token ? 'EXISTS' : 'NULL')
      console.log('🔍 저장된 사용자:', savedUser ? 'EXISTS' : 'NULL')
      
      if (token && savedUser) {
        console.log('✅ 로컬 스토리지에서 사용자 정보 복원')
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsLoggedIn(true)
        apiClient.setToken(token)
      } else {
        console.log('ℹ️ 저장된 인증 정보가 없음')
      }
    } catch (error: any) {
      console.error('인증 확인 중 오류:', error)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      apiClient.setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    try {
      console.log('🔐 Mock 로그인 시도:', email)
      
      // Mock 로그인 (어떤 이메일/패스워드든 허용)
      const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const userData = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0] || '사용자',
        email: email,
        userType: 'customer' as const,
        phone: '010-0000-0000',
        emailVerified: false,
        profileImage: null,
        createdAt: new Date().toISOString()
      }
      
      console.log('🔐 로그인 성공 - 토큰 저장:', mockToken)
      
      // 토큰과 사용자 정보 저장
      localStorage.setItem('auth_token', mockToken)
      localStorage.setItem('user_data', JSON.stringify(userData))
      apiClient.setToken(mockToken)
      
      console.log('✅ localStorage에 토큰과 사용자 정보 저장됨')
      
      // 사용자 정보 설정
      setUser(userData)
      setIsLoggedIn(true)
      
      console.log('✅ 사용자 상태 업데이트됨:', userData)
      console.log('✅ 로그인 성공 토스트 (비활성화됨):', `안녕하세요, ${userData.name}님!`)
      
    } catch (error: any) {
      console.log('❌ 로그인 실패 토스트 (비활성화됨):', error.message || '로그인 중 오류가 발생했습니다')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      setIsLoggedIn(false)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      localStorage.removeItem('jarimae_remembered_email')
      apiClient.setToken(null)
      
      // 임시로 토스트 비활성화
      console.log('ℹ️ 로그아웃 토스트 (비활성화됨): 안전하게 로그아웃되었습니다')
      // showToast({
      //   type: 'info',
      //   title: '로그아웃',
      //   message: '안전하게 로그아웃되었습니다'
      // })
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData }
        localStorage.setItem('user_data', JSON.stringify(updatedUser))
        setUser(updatedUser)
        console.log('✅ 프로필 업데이트 토스트 (비활성화됨): 프로필이 성공적으로 업데이트되었습니다')
      }
    } catch (error: any) {
      console.log('❌ 업데이트 실패 토스트 (비활성화됨):', error.message || '프로필 업데이트 중 오류가 발생했습니다')
      throw error
    }
  }

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    updateUser,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}