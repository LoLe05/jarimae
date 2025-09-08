import { User, Restaurant, Reservation, Review, Table, Menu, RestaurantCategory, UserType, ReservationStatus, RestaurantStatus } from '@prisma/client'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// User Types
export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface LoginResponse {
  user: UserWithoutPassword
  token: string
}

export interface SignupRequest {
  name: string
  nickname?: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
  userType: UserType
  termsAgreed: boolean
  privacyAgreed: boolean
  marketingAgreed?: boolean
  // Owner specific fields
  storeName?: string
  storeAddress?: string
  storePhone?: string
  storeCategory?: RestaurantCategory
  storeDescription?: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface UpdateProfileRequest {
  name?: string
  nickname?: string
  phone?: string
  profileImage?: string
  birthDate?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Restaurant Types
export interface RestaurantWithOwner extends Restaurant {
  owner: UserWithoutPassword
  images: Array<{
    id: string
    url: string
    caption?: string
    isMain: boolean
  }>
  tables: Table[]
  menus: Menu[]
  _count?: {
    reviews: number
    reservations: number
  }
}

export interface CreateRestaurantRequest {
  name: string
  description?: string
  category: RestaurantCategory
  phone: string
  email?: string
  address: string
  addressDetail?: string
  latitude?: number
  longitude?: number
  openingHours?: Record<string, {
    open: string
    close: string
    closed: boolean
  }>
  maxReservationDays?: number
  minReservationHours?: number
  maxPartySize?: number
}

// Reservation Types
export interface ReservationWithDetails extends Reservation {
  restaurant: {
    id: string
    name: string
    address: string
    phone: string
  }
  table?: {
    id: string
    name: string
    capacity: number
  }
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
}

export interface CreateReservationRequest {
  restaurantId: string
  reservationDate: string
  partySize: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  specialRequest?: string
  tableId?: string
}

export interface UpdateReservationStatusRequest {
  status: ReservationStatus
  tableId?: string
}

// Review Types
export interface ReviewWithDetails extends Review {
  user: {
    id: string
    name: string
    nickname?: string
    profileImage?: string
  }
  restaurant: {
    id: string
    name: string
  }
  images: Array<{
    id: string
    url: string
  }>
}

export interface CreateReviewRequest {
  restaurantId: string
  rating: number
  content: string
  visitDate?: string
  images?: string[]
}

// Search Types
export interface SearchParams {
  q?: string
  category?: RestaurantCategory
  location?: string
  sortBy?: 'rating' | 'distance' | 'reviews' | 'name'
  page?: number
  limit?: number
  latitude?: number
  longitude?: number
}

export interface SearchResult {
  restaurants: RestaurantWithOwner[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    categories: Array<{
      category: RestaurantCategory
      count: number
    }>
    locations: Array<{
      location: string
      count: number
    }>
  }
}

// Dashboard Types
export interface DashboardStats {
  totalRestaurants: number
  totalUsers: number
  totalReservations: number
  totalReviews: number
  todayReservations: number
  pendingReservations: number
  recentActivity: Array<{
    type: 'reservation' | 'review' | 'user' | 'restaurant'
    message: string
    timestamp: string
  }>
}

export interface OwnerDashboard {
  restaurant: RestaurantWithOwner
  stats: {
    totalReservations: number
    totalReviews: number
    averageRating: number
    todayReservations: number
    pendingReservations: number
    monthlyRevenue: number
  }
  recentReservations: ReservationWithDetails[]
  recentReviews: ReviewWithDetails[]
}

// File Upload Types
export interface UploadResponse {
  url: string
  publicId?: string
  width?: number
  height?: number
  format?: string
  bytes?: number
}