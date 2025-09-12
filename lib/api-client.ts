// API client for frontend-backend communication
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    field?: string
  }
  message?: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    nickname?: string
    user_type: string
    phone?: string
    profile_image?: string
    address?: string
    phone_verified: boolean
    email_verified: boolean
    preferences?: any
    unread_notifications: number
  }
  tokens: {
    access_token: string
    refresh_token: string
  }
}

export interface User {
  id: string
  email: string
  name: string
  nickname?: string
  user_type: string
  phone?: string
  profile_image?: string
  address?: string
  phone_verified: boolean
  email_verified: boolean
  preferences?: any
  unread_notifications?: number
  stats?: any
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// API endpoints constants
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VERIFY_SMS: '/auth/verify-sms',
  VERIFY_EMAIL: '/auth/verify-email',
  
  // User endpoints
  PROFILE: '/users/profile',
  
  // Store endpoints
  STORES: '/stores',
  STORE_BY_ID: (id: string) => `/stores/${id}`,
  
  // Reservation endpoints
  RESERVATIONS: '/reservations',
  RESERVATION_BY_ID: (id: string) => `/reservations/${id}`,
  CHECK_AVAILABILITY: '/reservations/availability',
}

class ApiClient {
  private getAuthHeader(): HeadersInit {
    if (typeof window === 'undefined') return {}
    
    const token = localStorage.getItem('access_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed')
      }
      
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(data: any): Promise<ApiResponse<any>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  async refreshToken(): Promise<ApiResponse<any>> {
    const refreshToken = localStorage.getItem('refresh_token')
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  }

  // User Profile
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/users/profile')
  }

  async updateProfile(data: any): Promise<ApiResponse<any>> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Stores
  async getStores(params?: any): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/stores${queryString}`)
  }

  async getStore(id: string): Promise<ApiResponse<any>> {
    return this.request(`/stores/${id}`)
  }

  // Reservations
  async getReservations(params?: any): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/reservations${queryString}`)
  }

  async createReservation(data: any): Promise<ApiResponse<any>> {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async checkAvailability(data: any): Promise<ApiResponse<any>> {
    return this.request('/reservations/availability', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // SMS Verification
  async requestSMSVerification(phone: string): Promise<ApiResponse<any>> {
    return this.request('/auth/verify-sms', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    })
  }

  async verifySMS(phone: string, code: string): Promise<ApiResponse<any>> {
    return this.request('/auth/verify-sms', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    })
  }

  // Email Verification
  async requestEmailVerification(email: string): Promise<ApiResponse<any>> {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async verifyEmail(email: string, code: string): Promise<ApiResponse<any>> {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient