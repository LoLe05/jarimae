// ============================================================================
// 공통 타입 정의
// ============================================================================

export interface ApiResponse<T> {
  success: true
  data: T
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
    field?: string
  }
}

export type ApiResult<T> = ApiResponse<T> | ApiError

// ============================================================================
// 사용자 관련 타입
// ============================================================================

export type UserType = 'CUSTOMER' | 'OWNER'

export interface User {
  id: string
  email: string
  name: string
  nickname?: string
  phone: string
  userType: UserType
  profileImage?: string
  address?: string
  phoneVerified: boolean
  emailVerified: boolean
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserPreference {
  id: string
  userId: string
  notificationSms: boolean
  notificationEmail: boolean
  notificationPush: boolean
  marketingConsent: boolean
  locationConsent: boolean
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// 매장 관련 타입
// ============================================================================

export type StoreCategory = 
  | 'KOREAN' 
  | 'CHINESE' 
  | 'JAPANESE' 
  | 'WESTERN' 
  | 'ASIAN' 
  | 'CAFE' 
  | 'BAR' 
  | 'FAST_FOOD' 
  | 'DESSERT' 
  | 'OTHER'

export type StoreStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'SUSPENDED' 
  | 'CLOSED'

export type ApprovalType = 'AUTO' | 'MANUAL'

export interface OperatingHours {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

export interface DaySchedule {
  open: string // HH:mm 형식
  close: string // HH:mm 형식
  isClosed: boolean
}

export interface BreakTime {
  start: string // HH:mm 형식
  end: string // HH:mm 형식
}

export interface Store {
  id: string
  name: string
  slug: string
  category: StoreCategory
  description?: string
  address: string
  detailedAddress?: string
  postalCode?: string
  phone: string
  businessNumber: string
  latitude: number
  longitude: number
  thumbnailImage?: string
  images: string[]
  operatingHours: OperatingHours
  breakTime?: BreakTime
  amenities: string[]
  paymentMethods: string[]
  minOrderAmount?: number
  deliveryFee?: number
  parkingAvailable: boolean
  wifiAvailable: boolean
  petFriendly: boolean
  status: StoreStatus
  approvalType: ApprovalType
  approvedAt?: Date
  rejectedAt?: Date
  rejectionReason?: string
  ownerId: string
  rating: number
  reviewCount: number
  totalReservations: number
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// 테이블 관련 타입
// ============================================================================

export type TableType = 'ROUND' | 'SQUARE' | 'BAR' | 'BOOTH' | 'PRIVATE'
export type TableStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE'

export interface Table {
  id: string
  storeId: string
  tableNumber: string
  capacity: number
  tableType: TableType
  positionX: number
  positionY: number
  width: number
  height: number
  status: TableStatus
  description?: string
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// 예약 관련 타입
// ============================================================================

export type ReservationStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'CANCELLED' 
  | 'COMPLETED' 
  | 'NO_SHOW'

export type CancellationType = 'USER' | 'STORE' | 'SYSTEM'

export type PaymentStatus = 
  | 'NONE' 
  | 'PENDING' 
  | 'PAID' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'REFUNDED'

export type PaymentMethod = 
  | 'CARD' 
  | 'TRANSFER' 
  | 'VIRTUAL_ACCOUNT' 
  | 'MOBILE' 
  | 'CASH'

export interface Reservation {
  id: string
  reservationNumber: string
  storeId: string
  customerId: string
  tableId?: string
  reservationDate: Date
  reservationTime: Date
  partySize: number
  specialRequests?: string
  estimatedDuration: number
  status: ReservationStatus
  confirmedAt?: Date
  cancelledAt?: Date
  completedAt?: Date
  cancellationReason?: string
  cancelledBy?: string
  cancellationType?: CancellationType
  depositAmount: number
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  paidAt?: Date
  smsSent: boolean
  emailSent: boolean
  reminderSent: boolean
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// 리뷰 관련 타입
// ============================================================================

export interface Review {
  id: string
  storeId: string
  customerId: string
  reservationId: string
  rating: number // 1-5점
  comment?: string
  images: string[]
  foodRating?: number
  serviceRating?: number
  atmosphereRating?: number
  priceRating?: number
  isPublic: boolean
  isFlagged: boolean
  flagReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface StoreReply {
  id: string
  reviewId: string
  comment: string
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// 메뉴 관련 타입
// ============================================================================

export interface MenuCategory {
  id: string
  storeId: string
  name: string
  description?: string
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  menuItems?: MenuItem[]
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  image?: string
  isAvailable: boolean
  isRecommended: boolean
  isSpicy: boolean
  allergens: string[]
  calories?: number
  preparationTime?: number
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// 알림 관련 타입
// ============================================================================

export type NotificationType = 
  | 'RESERVATION_CONFIRMED'
  | 'RESERVATION_CANCELLED'
  | 'RESERVATION_REMINDER'
  | 'REVIEW_REQUEST'
  | 'STORE_APPROVED'
  | 'STORE_REJECTED'
  | 'PROMOTION'
  | 'SYSTEM_NOTICE'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: any
  isRead: boolean
  readAt?: Date
  sentVia: string[]
  smsSent: boolean
  emailSent: boolean
  pushSent: boolean
  createdAt: Date
}

// ============================================================================
// 폼 관련 타입
// ============================================================================

export interface SignupFormData {
  email: string
  password: string
  name: string
  nickname?: string
  phone: string
  userType: UserType
  address?: string
  businessNumber?: string
  termsAgreed: boolean
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ReservationFormData {
  storeId: string
  tableId?: string
  reservationDate: string
  reservationTime: string
  partySize: number
  specialRequests?: string
  depositAmount?: number
}

export interface StoreRegistrationFormData {
  name: string
  category: StoreCategory
  description: string
  address: string
  detailedAddress: string
  phone: string
  businessNumber: string
  operatingHours: OperatingHours
  breakTime?: BreakTime
  approvalType: ApprovalType
  amenities?: string[]
  paymentMethods?: string[]
  location: {
    latitude: number
    longitude: number
  }
}

// ============================================================================
// 검색 관련 타입
// ============================================================================

export interface SearchFilters {
  category?: StoreCategory
  location?: string
  search?: string
  sort?: 'rating' | 'distance' | 'price' | 'newest'
  minRating?: number
  maxDistance?: number
  priceRange?: [number, number]
  amenities?: string[]
  isOpen?: boolean
}

export interface SearchResults {
  stores: Store[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================================================
// 위치 관련 타입
// ============================================================================

export interface Location {
  latitude: number
  longitude: number
}

export interface Address {
  address: string
  detailedAddress: string
  postalCode: string
  location: Location
}

// ============================================================================
// 대시보드 관련 타입
// ============================================================================

export interface CustomerDashboard {
  summary: {
    totalReservations: number
    completedReservations: number
    cancelledReservations: number
    totalSpent: number
  }
  recentReservations: Reservation[]
  favoriteStores: Array<{
    store: Store
    visitCount: number
    lastVisit: Date
  }>
  recommendations: Store[]
}

export interface PartnerDashboard {
  summary: {
    todayReservations: number
    pendingReservations: number
    totalRevenue: number
    tableOccupancyRate: number
  }
  reservationsByStatus: {
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }
  dailyStats: Array<{
    date: string
    reservations: number
    revenue: number
    cancellationRate: number
  }>
  popularTimes: Array<{
    hour: number
    reservationCount: number
  }>
  recentReviews: Array<{
    review: Review
    customer: Pick<User, 'name' | 'profileImage'>
    needsReply: boolean
  }>
}

// ============================================================================
// 공통 컴포넌트 Props 타입
// ============================================================================

export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends BaseProps {
  id?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  label?: string
  maxLength?: number
  onChange?: (value: string) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

export interface CardProps extends BaseProps {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'sm' | 'md' | 'lg'
  radius?: 'sm' | 'md' | 'lg' | 'xl'
  clickable?: boolean
  onClick?: () => void
}

// ============================================================================
// 유틸리티 타입
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>

// API 응답에서 Date 필드를 string으로 변환
export type SerializedData<T> = {
  [K in keyof T]: T[K] extends Date 
    ? string 
    : T[K] extends Date | undefined 
    ? string | undefined 
    : T[K] extends object 
    ? SerializedData<T[K]>
    : T[K]
}

// 페이지네이션 메타데이터
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// 정렬 옵션
export interface SortOption<T = string> {
  field: T
  direction: 'asc' | 'desc'
}