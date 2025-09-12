// Authentication validation schemas
import { z } from 'zod'

// User registration schema
export const registerSchema = z.object({
  email: z
    .string()
    .email('올바른 이메일 형식을 입력해주세요.')
    .max(100, '이메일은 100자를 초과할 수 없습니다.'),
  
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .max(100, '비밀번호는 100자를 초과할 수 없습니다.')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).*$/,
      '비밀번호는 영문자와 숫자를 포함해야 합니다.'
    ),
  
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다.')
    .max(50, '이름은 50자를 초과할 수 없습니다.')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문만 입력 가능합니다.'),
  
  nickname: z
    .string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
    .max(20, '닉네임은 20자를 초과할 수 없습니다.')
    .regex(/^[가-힣a-zA-Z0-9_]+$/, '닉네임은 한글, 영문, 숫자, 언더스코어만 사용 가능합니다.')
    .optional(),
  
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, '휴대폰 번호는 010-0000-0000 형식으로 입력해주세요.'),
  
  user_type: z.enum(['CUSTOMER', 'OWNER'], {
    errorMap: () => ({ message: '사용자 유형을 선택해주세요.' })
  }),
  
  address: z
    .string()
    .max(200, '주소는 200자를 초과할 수 없습니다.')
    .optional(),
  
  business_number: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{5}$/, '사업자등록번호는 000-00-00000 형식으로 입력해주세요.')
    .optional(),
  
  terms_agreed: z.boolean().refine(val => val === true, {
    message: '이용약관에 동의해주세요.'
  }),
  
  privacy_agreed: z.boolean().refine(val => val === true, {
    message: '개인정보처리방침에 동의해주세요.'
  }),
  
  marketing_agreed: z.boolean().optional()
})

// User login schema
export const loginSchema = z.object({
  email: z
    .string()
    .email('올바른 이메일 형식을 입력해주세요.'),
  
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
})

// SMS verification request schema
export const smsVerificationRequestSchema = z.object({
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, '휴대폰 번호는 010-0000-0000 형식으로 입력해주세요.')
})

// SMS verification confirm schema
export const smsVerificationConfirmSchema = z.object({
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, '휴대폰 번호는 010-0000-0000 형식으로 입력해주세요.'),
  
  code: z
    .string()
    .length(6, '인증번호는 6자리입니다.')
    .regex(/^\d{6}$/, '인증번호는 숫자만 입력 가능합니다.')
})

// Email verification request schema
export const emailVerificationRequestSchema = z.object({
  email: z
    .string()
    .email('올바른 이메일 형식을 입력해주세요.')
    .max(100, '이메일은 100자를 초과할 수 없습니다.')
})

// Email verification confirm schema
export const emailVerificationConfirmSchema = z.object({
  email: z
    .string()
    .email('올바른 이메일 형식을 입력해주세요.'),
  
  code: z
    .string()
    .length(6, '인증번호는 6자리입니다.')
    .regex(/^\d{6}$/, '인증번호는 숫자만 입력 가능합니다.')
})

// Token refresh schema
export const refreshTokenSchema = z.object({
  refresh_token: z
    .string()
    .min(1, '리프레시 토큰이 필요합니다.')
})

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .email('올바른 이메일 형식을 입력해주세요.')
})

// Password reset confirm schema
export const passwordResetConfirmSchema = z.object({
  token: z
    .string()
    .min(1, '비밀번호 재설정 토큰이 필요합니다.'),
  
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .max(100, '비밀번호는 100자를 초과할 수 없습니다.')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).*$/,
      '비밀번호는 영문자와 숫자를 포함해야 합니다.'
    ),
  
  password_confirm: z
    .string()
    .min(1, '비밀번호 확인을 입력해주세요.')
}).refine(data => data.password === data.password_confirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['password_confirm']
})

// Profile update schema
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다.')
    .max(50, '이름은 50자를 초과할 수 없습니다.')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문만 입력 가능합니다.')
    .optional(),
  
  nickname: z
    .string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
    .max(20, '닉네임은 20자를 초과할 수 없습니다.')
    .regex(/^[가-힣a-zA-Z0-9_]+$/, '닉네임은 한글, 영문, 숫자, 언더스코어만 사용 가능합니다.')
    .optional(),
  
  address: z
    .string()
    .max(200, '주소는 200자를 초과할 수 없습니다.')
    .optional(),
  
  profile_image: z
    .string()
    .url('올바른 이미지 URL을 입력해주세요.')
    .optional()
    .or(z.literal('')),
    
  preferences: z.object({
    notification_sms: z.boolean().optional(),
    notification_email: z.boolean().optional(),
    notification_push: z.boolean().optional(),
    marketing_consent: z.boolean().optional(),
    location_consent: z.boolean().optional()
  }).optional()
})

// Export type definitions
export type RegisterData = z.infer<typeof registerSchema>
export type LoginData = z.infer<typeof loginSchema>
export type SMSVerificationRequestData = z.infer<typeof smsVerificationRequestSchema>
export type SMSVerificationConfirmData = z.infer<typeof smsVerificationConfirmSchema>
export type EmailVerificationRequestData = z.infer<typeof emailVerificationRequestSchema>
export type EmailVerificationConfirmData = z.infer<typeof emailVerificationConfirmSchema>
export type RefreshTokenData = z.infer<typeof refreshTokenSchema>
export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema>