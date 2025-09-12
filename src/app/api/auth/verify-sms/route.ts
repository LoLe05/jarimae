// SMS verification API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateVerificationCode } from '@/lib/auth'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { smsVerificationRequestSchema, smsVerificationConfirmSchema } from '@/lib/schemas/auth'

// In-memory store for verification codes (in production, use Redis)
const verificationCodes = new Map<string, { code: string, expires: Date, attempts: number }>()

// Clean up expired codes every 5 minutes
setInterval(() => {
  const now = new Date()
  for (const [phone, data] of verificationCodes.entries()) {
    if (data.expires < now) {
      verificationCodes.delete(phone)
    }
  }
}, 5 * 60 * 1000)

// Request SMS verification code
async function requestVerificationHandler(req: AuthenticatedRequest & { validatedData: any }) {
  const { phone } = req.validatedData
  const userId = req.user?.userId

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다.'
        }
      },
      { status: 401 }
    )
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다.'
        }
      },
      { status: 404 }
    )
  }

  // Check if phone is already verified for this user
  if (user.phone === phone && user.phone_verified) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ALREADY_VERIFIED',
          message: '이미 인증된 휴대폰 번호입니다.'
        }
      },
      { status: 400 }
    )
  }

  // Check if phone is used by another user
  if (user.phone !== phone) {
    const phoneUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (phoneUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PHONE_ALREADY_EXISTS',
            message: '이미 사용중인 휴대폰 번호입니다.'
          }
        },
        { status: 400 }
      )
    }
  }

  // Generate verification code
  const code = generateVerificationCode(6)
  const expires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  // Store verification code
  verificationCodes.set(phone, { code, expires, attempts: 0 })

  // In production, send actual SMS here
  console.log(`SMS verification code for ${phone}: ${code}`)

  // For development, we'll simulate SMS sending
  const isTestPhone = phone.startsWith('010-0000') // Test phones
  
  return NextResponse.json(
    {
      success: true,
      data: {
        verification_id: `${phone}-${Date.now()}`,
        expires_at: expires.toISOString(),
        // Only return code in development for test phones
        ...(process.env.NODE_ENV === 'development' && isTestPhone && { code })
      },
      message: '인증번호가 발송되었습니다.'
    },
    { status: 200 }
  )
}

// Verify SMS code
async function verifyCodeHandler(req: AuthenticatedRequest & { validatedData: any }) {
  const { phone, code } = req.validatedData
  const userId = req.user?.userId

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다.'
        }
      },
      { status: 401 }
    )
  }

  // Get stored verification code
  const stored = verificationCodes.get(phone)

  if (!stored) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VERIFICATION_NOT_FOUND',
          message: '인증번호 요청을 먼저 해주세요.'
        }
      },
      { status: 400 }
    )
  }

  // Check if expired
  if (stored.expires < new Date()) {
    verificationCodes.delete(phone)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VERIFICATION_EXPIRED',
          message: '인증번호가 만료되었습니다. 다시 요청해주세요.'
        }
      },
      { status: 400 }
    )
  }

  // Check attempts
  if (stored.attempts >= 5) {
    verificationCodes.delete(phone)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'MAX_ATTEMPTS_EXCEEDED',
          message: '인증 시도 횟수를 초과했습니다. 다시 요청해주세요.'
        }
      },
      { status: 400 }
    )
  }

  // Increment attempts
  stored.attempts++

  // Verify code
  if (stored.code !== code) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_VERIFICATION_CODE',
          message: '인증번호가 올바르지 않습니다.',
          remaining_attempts: Math.max(0, 5 - stored.attempts)
        }
      },
      { status: 400 }
    )
  }

  // Code is valid, update user
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        phone: phone,
        phone_verified: true
      }
    }),
    prisma.authenticationLog.create({
      data: {
        user_id: userId,
        action: 'PHONE_VERIFY',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        success: true
      }
    })
  ])

  // Remove verification code
  verificationCodes.delete(phone)

  return NextResponse.json(
    {
      success: true,
      data: {
        verified: true
      },
      message: '휴대폰 인증이 완료되었습니다.'
    },
    { status: 200 }
  )
}

// Route handlers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    if (body.code) {
      // Verification confirm
      const handler = withErrorHandling(
        withAuth(
          withValidation(smsVerificationConfirmSchema)(verifyCodeHandler)
        )
      )
      return handler(req)
    } else {
      // Verification request
      const handler = withErrorHandling(
        withAuth(
          withValidation(smsVerificationRequestSchema)(requestVerificationHandler)
        )
      )
      return handler(req)
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'JSON 형식이 올바르지 않습니다.'
        }
      },
      { status: 400 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}