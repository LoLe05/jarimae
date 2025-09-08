import { z } from 'zod'

// 공통 스키마
export const phoneSchema = z.string().regex(/^010-\d{4}-\d{4}$/, '올바른 휴대폰 번호를 입력해주세요')
export const emailSchema = z.string().email('올바른 이메일 주소를 입력해주세요')
export const passwordSchema = z.string().min(8, '비밀번호는 8자 이상이어야 합니다')

// 사용자 관련 스키마
export const signupSchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상이어야 합니다'),
  nickname: z.string().min(2, '닉네임은 2글자 이상이어야 합니다').optional(),
  email: emailSchema,
  phone: phoneSchema.optional(),
  password: passwordSchema,
  confirmPassword: z.string(),
  userType: z.enum(['CUSTOMER', 'OWNER']),
  termsAgreed: z.boolean().refine(val => val === true, '이용약관에 동의해주세요'),
  privacyAgreed: z.boolean().refine(val => val === true, '개인정보 처리방침에 동의해주세요'),
  marketingAgreed: z.boolean().optional(),
  // 사장님 전용 필드
  storeName: z.string().min(2, '매장명은 2글자 이상이어야 합니다').optional(),
  storeAddress: z.string().min(10, '매장 주소를 정확히 입력해주세요').optional(),
  storePhone: z.string().regex(/^\d{2,3}-\d{3,4}-\d{4}$/, '올바른 전화번호를 입력해주세요').optional(),
  storeCategory: z.enum(['KOREAN', 'CHINESE', 'JAPANESE', 'WESTERN', 'SNACK', 'CHICKEN', 'PIZZA', 'CAFE', 'DESSERT', 'FAST_FOOD', 'OTHER']).optional(),
  storeDescription: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword']
}).refine(data => {
  if (data.userType === 'OWNER') {
    return data.storeName && data.storeAddress && data.storePhone && data.storeCategory
  }
  return true
}, {
  message: '사장님 가입 시 매장 정보는 필수입니다',
  path: ['storeName']
})

export const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean().optional()
})

export const updateProfileSchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상이어야 합니다').optional(),
  nickname: z.string().min(2, '닉네임은 2글자 이상이어야 합니다').optional(),
  phone: phoneSchema.optional(),
  profileImage: z.string().url().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional()
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword']
})

// 매장 관련 스키마
export const restaurantSchema = z.object({
  name: z.string().min(2, '매장명은 2글자 이상이어야 합니다'),
  description: z.string().optional(),
  category: z.enum(['KOREAN', 'CHINESE', 'JAPANESE', 'WESTERN', 'SNACK', 'CHICKEN', 'PIZZA', 'CAFE', 'DESSERT', 'FAST_FOOD', 'OTHER']),
  phone: z.string().regex(/^\d{2,3}-\d{3,4}-\d{4}$/, '올바른 전화번호를 입력해주세요'),
  email: emailSchema.optional(),
  address: z.string().min(10, '주소를 정확히 입력해주세요'),
  addressDetail: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  openingHours: z.record(z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/, 'HH:MM 형식으로 입력해주세요'),
    close: z.string().regex(/^\d{2}:\d{2}$/, 'HH:MM 형식으로 입력해주세요'),
    closed: z.boolean()
  })).optional(),
  maxReservationDays: z.number().min(1).max(365).optional(),
  minReservationHours: z.number().min(0).max(72).optional(),
  maxPartySize: z.number().min(1).max(50).optional()
})

// 예약 관련 스키마
export const reservationSchema = z.object({
  restaurantId: z.string().cuid(),
  reservationDate: z.string().datetime(),
  partySize: z.number().min(1, '최소 1명 이상이어야 합니다').max(50, '최대 50명까지 예약 가능합니다'),
  customerName: z.string().min(2, '이름은 2글자 이상이어야 합니다'),
  customerPhone: phoneSchema,
  customerEmail: emailSchema.optional(),
  specialRequest: z.string().max(500, '특별 요청사항은 500자 이내로 입력해주세요').optional(),
  tableId: z.string().cuid().optional()
})

export const updateReservationStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']),
  tableId: z.string().cuid().optional()
})

// 리뷰 관련 스키마
export const reviewSchema = z.object({
  restaurantId: z.string().cuid(),
  rating: z.number().min(1, '최소 1점 이상이어야 합니다').max(5, '최대 5점까지 가능합니다'),
  content: z.string().min(10, '리뷰 내용은 10자 이상 작성해주세요').max(1000, '리뷰 내용은 1000자 이내로 작성해주세요'),
  visitDate: z.string().datetime().optional(),
  images: z.array(z.string().url()).max(5, '이미지는 최대 5개까지 업로드 가능합니다').optional()
})

// 검색 관련 스키마
export const searchSchema = z.object({
  q: z.string().min(1, '검색어를 입력해주세요').optional(),
  category: z.enum(['KOREAN', 'CHINESE', 'JAPANESE', 'WESTERN', 'SNACK', 'CHICKEN', 'PIZZA', 'CAFE', 'DESSERT', 'FAST_FOOD', 'OTHER']).optional(),
  location: z.string().optional(),
  sortBy: z.enum(['rating', 'distance', 'reviews', 'name']).default('rating'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})

// 페이지네이션 스키마
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})