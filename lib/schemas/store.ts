// Store management validation schemas
import { z } from 'zod'

// Store creation schema
export const createStoreSchema = z.object({
  name: z
    .string()
    .min(2, '매장명은 최소 2자 이상이어야 합니다.')
    .max(100, '매장명은 100자를 초과할 수 없습니다.'),
  
  description: z
    .string()
    .max(1000, '설명은 1000자를 초과할 수 없습니다.')
    .optional(),
  
  phone: z
    .string()
    .regex(/^0\d{1,2}-\d{3,4}-\d{4}$/, '전화번호는 000-0000-0000 또는 00-000-0000 형식으로 입력해주세요.'),
  
  address: z
    .string()
    .min(5, '주소는 최소 5자 이상이어야 합니다.')
    .max(200, '주소는 200자를 초과할 수 없습니다.'),
  
  latitude: z
    .number()
    .min(-90, '위도는 -90도 이상이어야 합니다.')
    .max(90, '위도는 90도 이하여야 합니다.'),
  
  longitude: z
    .number()
    .min(-180, '경도는 -180도 이상이어야 합니다.')
    .max(180, '경도는 180도 이하여야 합니다.'),
  
  cuisine_type: z.enum([
    'KOREAN', 'JAPANESE', 'CHINESE', 'WESTERN', 'ITALIAN', 'MEXICAN', 
    'THAI', 'VIETNAMESE', 'INDIAN', 'MIDDLE_EASTERN', 'FUSION', 'CAFE', 
    'BAR', 'BAKERY', 'DESSERT', 'BUFFET', 'BBQ', 'SEAFOOD', 'VEGETARIAN', 'OTHER'
  ], {
    errorMap: () => ({ message: '요리 종류를 선택해주세요.' })
  }),
  
  price_range: z.enum(['BUDGET', 'MID_RANGE', 'FINE_DINING'], {
    errorMap: () => ({ message: '가격대를 선택해주세요.' })
  }),
  
  capacity: z
    .number()
    .int('수용인원은 정수여야 합니다.')
    .min(1, '수용인원은 최소 1명 이상이어야 합니다.')
    .max(1000, '수용인원은 1000명을 초과할 수 없습니다.'),
  
  average_meal_duration: z
    .number()
    .int('평균 식사 시간은 정수여야 합니다.')
    .min(30, '평균 식사 시간은 최소 30분 이상이어야 합니다.')
    .max(300, '평균 식사 시간은 300분을 초과할 수 없습니다.'),
  
  has_parking: z.boolean(),
  
  has_valet: z.boolean(),
  
  has_wifi: z.boolean(),
  
  has_private_room: z.boolean(),
  
  accepts_reservations: z.boolean(),
  
  accepts_walk_ins: z.boolean(),
  
  delivery_available: z.boolean(),
  
  takeout_available: z.boolean(),
  
  images: z
    .array(z.string().url('올바른 이미지 URL을 입력해주세요.'))
    .max(10, '이미지는 최대 10개까지 업로드 가능합니다.')
    .optional(),
  
  business_hours: z
    .array(z.object({
      day_of_week: z.number().int().min(0).max(6),
      open_time: z.string().regex(/^\d{2}:\d{2}$/, '시간은 HH:MM 형식으로 입력해주세요.'),
      close_time: z.string().regex(/^\d{2}:\d{2}$/, '시간은 HH:MM 형식으로 입력해주세요.'),
      is_closed: z.boolean()
    }))
    .length(7, '모든 요일의 영업시간을 입력해주세요.'),
  
  special_features: z
    .array(z.string())
    .max(10, '특별 서비스는 최대 10개까지 입력 가능합니다.')
    .optional()
})

// Store update schema (all fields optional except id)
export const updateStoreSchema = z.object({
  name: z
    .string()
    .min(2, '매장명은 최소 2자 이상이어야 합니다.')
    .max(100, '매장명은 100자를 초과할 수 없습니다.')
    .optional(),
  
  description: z
    .string()
    .max(1000, '설명은 1000자를 초과할 수 없습니다.')
    .optional(),
  
  phone: z
    .string()
    .regex(/^0\d{1,2}-\d{3,4}-\d{4}$/, '전화번호는 000-0000-0000 또는 00-000-0000 형식으로 입력해주세요.')
    .optional(),
  
  address: z
    .string()
    .min(5, '주소는 최소 5자 이상이어야 합니다.')
    .max(200, '주소는 200자를 초과할 수 없습니다.')
    .optional(),
  
  latitude: z
    .number()
    .min(-90, '위도는 -90도 이상이어야 합니다.')
    .max(90, '위도는 90도 이하여야 합니다.')
    .optional(),
  
  longitude: z
    .number()
    .min(-180, '경도는 -180도 이상이어야 합니다.')
    .max(180, '경도는 180도 이하여야 합니다.')
    .optional(),
  
  cuisine_type: z.enum([
    'KOREAN', 'JAPANESE', 'CHINESE', 'WESTERN', 'ITALIAN', 'MEXICAN', 
    'THAI', 'VIETNAMESE', 'INDIAN', 'MIDDLE_EASTERN', 'FUSION', 'CAFE', 
    'BAR', 'BAKERY', 'DESSERT', 'BUFFET', 'BBQ', 'SEAFOOD', 'VEGETARIAN', 'OTHER'
  ], {
    errorMap: () => ({ message: '요리 종류를 선택해주세요.' })
  }).optional(),
  
  price_range: z.enum(['BUDGET', 'MID_RANGE', 'FINE_DINING'], {
    errorMap: () => ({ message: '가격대를 선택해주세요.' })
  }).optional(),
  
  capacity: z
    .number()
    .int('수용인원은 정수여야 합니다.')
    .min(1, '수용인원은 최소 1명 이상이어야 합니다.')
    .max(1000, '수용인원은 1000명을 초과할 수 없습니다.')
    .optional(),
  
  average_meal_duration: z
    .number()
    .int('평균 식사 시간은 정수여야 합니다.')
    .min(30, '평균 식사 시간은 최소 30분 이상이어야 합니다.')
    .max(300, '평균 식사 시간은 300분을 초과할 수 없습니다.')
    .optional(),
  
  has_parking: z.boolean().optional(),
  has_valet: z.boolean().optional(),
  has_wifi: z.boolean().optional(),
  has_private_room: z.boolean().optional(),
  accepts_reservations: z.boolean().optional(),
  accepts_walk_ins: z.boolean().optional(),
  delivery_available: z.boolean().optional(),
  takeout_available: z.boolean().optional(),
  
  images: z
    .array(z.string().url('올바른 이미지 URL을 입력해주세요.'))
    .max(10, '이미지는 최대 10개까지 업로드 가능합니다.')
    .optional(),
  
  business_hours: z
    .array(z.object({
      day_of_week: z.number().int().min(0).max(6),
      open_time: z.string().regex(/^\d{2}:\d{2}$/, '시간은 HH:MM 형식으로 입력해주세요.'),
      close_time: z.string().regex(/^\d{2}:\d{2}$/, '시간은 HH:MM 형식으로 입력해주세요.'),
      is_closed: z.boolean()
    }))
    .length(7, '모든 요일의 영업시간을 입력해주세요.')
    .optional(),
  
  special_features: z
    .array(z.string())
    .max(10, '특별 서비스는 최대 10개까지 입력 가능합니다.')
    .optional()
})

// Store search/filter schema
export const storeSearchSchema = z.object({
  query: z.string().optional(),
  cuisine_type: z.enum([
    'KOREAN', 'JAPANESE', 'CHINESE', 'WESTERN', 'ITALIAN', 'MEXICAN', 
    'THAI', 'VIETNAMESE', 'INDIAN', 'MIDDLE_EASTERN', 'FUSION', 'CAFE', 
    'BAR', 'BAKERY', 'DESSERT', 'BUFFET', 'BBQ', 'SEAFOOD', 'VEGETARIAN', 'OTHER'
  ]).optional(),
  price_range: z.enum(['BUDGET', 'MID_RANGE', 'FINE_DINING']).optional(),
  has_parking: z.boolean().optional(),
  has_wifi: z.boolean().optional(),
  has_private_room: z.boolean().optional(),
  accepts_reservations: z.boolean().optional(),
  delivery_available: z.boolean().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().min(0.1).max(50).optional(), // km
  sort_by: z.enum(['name', 'distance', 'rating', 'created_at']).default('name'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

// Store status update schema
export const updateStoreStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED'], {
    errorMap: () => ({ message: '매장 상태를 선택해주세요.' })
  })
})

// Export type definitions
export type CreateStoreData = z.infer<typeof createStoreSchema>
export type UpdateStoreData = z.infer<typeof updateStoreSchema>
export type StoreSearchData = z.infer<typeof storeSearchSchema>
export type UpdateStoreStatusData = z.infer<typeof updateStoreStatusSchema>