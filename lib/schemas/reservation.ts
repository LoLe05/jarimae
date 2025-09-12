// Reservation management validation schemas
import { z } from 'zod'

// Create reservation schema
export const createReservationSchema = z.object({
  store_id: z
    .string()
    .cuid('유효하지 않은 매장 ID입니다.'),
  
  reservation_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 YYYY-MM-DD 형식으로 입력해주세요.')
    .refine(date => {
      const reservationDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return reservationDate >= today
    }, '예약 날짜는 오늘 이후여야 합니다.'),
  
  reservation_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, '시간은 HH:MM 형식으로 입력해주세요.'),
  
  party_size: z
    .number()
    .int('인원수는 정수여야 합니다.')
    .min(1, '인원수는 최소 1명 이상이어야 합니다.')
    .max(20, '인원수는 최대 20명까지 가능합니다.'),
  
  special_requests: z
    .string()
    .max(500, '특별 요청사항은 500자를 초과할 수 없습니다.')
    .optional(),
  
  contact_phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, '휴대폰 번호는 010-0000-0000 형식으로 입력해주세요.'),
  
  contact_name: z
    .string()
    .min(2, '연락처 이름은 최소 2자 이상이어야 합니다.')
    .max(20, '연락처 이름은 20자를 초과할 수 없습니다.'),
  
  estimated_duration: z
    .number()
    .int('예상 소요시간은 정수여야 합니다.')
    .min(30, '예상 소요시간은 최소 30분 이상이어야 합니다.')
    .max(300, '예상 소요시간은 300분을 초과할 수 없습니다.')
    .optional()
})

// Update reservation schema
export const updateReservationSchema = z.object({
  reservation_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 YYYY-MM-DD 형식으로 입력해주세요.')
    .refine(date => {
      const reservationDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return reservationDate >= today
    }, '예약 날짜는 오늘 이후여야 합니다.')
    .optional(),
  
  reservation_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, '시간은 HH:MM 형식으로 입력해주세요.')
    .optional(),
  
  party_size: z
    .number()
    .int('인원수는 정수여야 합니다.')
    .min(1, '인원수는 최소 1명 이상이어야 합니다.')
    .max(20, '인원수는 최대 20명까지 가능합니다.')
    .optional(),
  
  special_requests: z
    .string()
    .max(500, '특별 요청사항은 500자를 초과할 수 없습니다.')
    .optional(),
  
  contact_phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, '휴대폰 번호는 010-0000-0000 형식으로 입력해주세요.')
    .optional(),
  
  contact_name: z
    .string()
    .min(2, '연락처 이름은 최소 2자 이상이어야 합니다.')
    .max(20, '연락처 이름은 20자를 초과할 수 없습니다.')
    .optional(),
  
  estimated_duration: z
    .number()
    .int('예상 소요시간은 정수여야 합니다.')
    .min(30, '예상 소요시간은 최소 30분 이상이어야 합니다.')
    .max(300, '예상 소요시간은 300분을 초과할 수 없습니다.')
    .optional()
})

// Update reservation status schema
export const updateReservationStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'], {
    errorMap: () => ({ message: '예약 상태를 선택해주세요.' })
  }),
  
  cancellation_reason: z
    .string()
    .max(200, '취소 사유는 200자를 초과할 수 없습니다.')
    .optional(),
  
  total_amount: z
    .number()
    .min(0, '총 금액은 0 이상이어야 합니다.')
    .optional()
})

// Reservation search/filter schema
export const reservationSearchSchema = z.object({
  store_id: z.string().cuid().optional(),
  customer_id: z.string().cuid().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  contact_phone: z.string().optional(),
  contact_name: z.string().optional(),
  sort_by: z.enum(['reservation_date', 'created_at', 'party_size', 'total_amount']).default('reservation_date'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

// Check availability schema
export const checkAvailabilitySchema = z.object({
  store_id: z
    .string()
    .cuid('유효하지 않은 매장 ID입니다.'),
  
  reservation_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 YYYY-MM-DD 형식으로 입력해주세요.')
    .refine(date => {
      const reservationDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return reservationDate >= today
    }, '예약 날짜는 오늘 이후여야 합니다.'),
  
  party_size: z
    .number()
    .int('인원수는 정수여야 합니다.')
    .min(1, '인원수는 최소 1명 이상이어야 합니다.')
    .max(20, '인원수는 최대 20명까지 가능합니다.'),
  
  preferred_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, '시간은 HH:MM 형식으로 입력해주세요.')
    .optional()
})

// Reservation rating schema
export const reservationRatingSchema = z.object({
  rating: z
    .number()
    .int('평점은 정수여야 합니다.')
    .min(1, '평점은 최소 1점 이상이어야 합니다.')
    .max(5, '평점은 최대 5점까지 가능합니다.'),
  
  comment: z
    .string()
    .max(1000, '리뷰는 1000자를 초과할 수 없습니다.')
    .optional(),
  
  service_rating: z
    .number()
    .int('서비스 평점은 정수여야 합니다.')
    .min(1, '서비스 평점은 최소 1점 이상이어야 합니다.')
    .max(5, '서비스 평점은 최대 5점까지 가능합니다.')
    .optional(),
  
  food_rating: z
    .number()
    .int('음식 평점은 정수여야 합니다.')
    .min(1, '음식 평점은 최소 1점 이상이어야 합니다.')
    .max(5, '음식 평점은 최대 5점까지 가능합니다.')
    .optional(),
  
  atmosphere_rating: z
    .number()
    .int('분위기 평점은 정수여야 합니다.')
    .min(1, '분위기 평점은 최소 1점 이상이어야 합니다.')
    .max(5, '분위기 평점은 최대 5점까지 가능합니다.')
    .optional(),
  
  value_rating: z
    .number()
    .int('가성비 평점은 정수여야 합니다.')
    .min(1, '가성비 평점은 최소 1점 이상이어야 합니다.')
    .max(5, '가성비 평점은 최대 5점까지 가능합니다.')
    .optional(),
  
  images: z
    .array(z.string().url('올바른 이미지 URL을 입력해주세요.'))
    .max(5, '이미지는 최대 5개까지 업로드 가능합니다.')
    .optional(),
  
  would_recommend: z.boolean().optional(),
  
  tags: z
    .array(z.string().max(20, '태그는 20자를 초과할 수 없습니다.'))
    .max(10, '태그는 최대 10개까지 입력 가능합니다.')
    .optional()
})

// Bulk reservation operations schema
export const bulkReservationActionSchema = z.object({
  reservation_ids: z
    .array(z.string().cuid())
    .min(1, '최소 1개의 예약을 선택해주세요.')
    .max(50, '최대 50개의 예약까지 일괄 처리 가능합니다.'),
  
  action: z.enum(['confirm', 'cancel', 'complete', 'no_show'], {
    errorMap: () => ({ message: '작업을 선택해주세요.' })
  }),
  
  reason: z
    .string()
    .max(200, '사유는 200자를 초과할 수 없습니다.')
    .optional()
})

// Export type definitions
export type CreateReservationData = z.infer<typeof createReservationSchema>
export type UpdateReservationData = z.infer<typeof updateReservationSchema>
export type UpdateReservationStatusData = z.infer<typeof updateReservationStatusSchema>
export type ReservationSearchData = z.infer<typeof reservationSearchSchema>
export type CheckAvailabilityData = z.infer<typeof checkAvailabilitySchema>
export type ReservationRatingData = z.infer<typeof reservationRatingSchema>
export type BulkReservationActionData = z.infer<typeof bulkReservationActionSchema>