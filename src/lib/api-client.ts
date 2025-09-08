import { ApiResponse } from '@/types/api'

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : 'http://localhost:3003/api'

class ApiClient {
  private token: string | null = null

  constructor() {
    // 클라이언트 사이드에서 토큰 초기화
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken() {
    return this.token
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      defaultHeaders.Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // 401 에러 시 토큰 자동 제거
        if (response.status === 401) {
          this.setToken(null)
          
          // 클라이언트 사이드에서 로그인 페이지로 리디렉션
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/')) {
            window.location.href = '/'
          }
        }
        
        const error = new Error(data.error || `HTTP error! status: ${response.status}`)
        ;(error as any).status = response.status
        throw error
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // GET 요청
  async get<T>(endpoint: string, options?: { params?: Record<string, any> }): Promise<ApiResponse<T>> {
    let url = endpoint
    
    if (options?.params) {
      const searchParams = new URLSearchParams()
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      url = `${endpoint}?${searchParams.toString()}`
    }

    return this.request<T>(url, { method: 'GET' })
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // 파일 업로드 요청
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const headers: HeadersInit = {}
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Upload request failed:', error)
      throw error
    }
  }
}

// 싱글톤 인스턴스
export const apiClient = new ApiClient()

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    ME: '/auth/me',
  },
  
  // 사용자
  USER: {
    PROFILE: '/users/profile',
    PASSWORD: '/users/password',
    STATS: '/users/stats',
  },
  
  // 매장
  RESTAURANTS: {
    LIST: '/restaurants',
    DETAIL: (id: string) => `/restaurants/${id}`,
    TABLES: (id: string) => `/restaurants/${id}/tables`,
    MENUS: (id: string) => `/restaurants/${id}/menus`,
  },
  
  // 예약
  RESERVATIONS: {
    LIST: '/reservations',
    DETAIL: (id: string) => `/reservations/${id}`,
  },
  
  // 리뷰
  REVIEWS: {
    LIST: '/reviews',
    DETAIL: (id: string) => `/reviews/${id}`,
    MY_REVIEWS: '/reviews/my',
    MY_STATS: '/reviews/my/stats',
  },
  
  // 검색
  SEARCH: {
    RESTAURANTS: '/search',
    SUGGESTIONS: '/search/suggestions',
  },
  
  // 업로드
  UPLOAD: {
    IMAGES: '/upload',
  },
} as const