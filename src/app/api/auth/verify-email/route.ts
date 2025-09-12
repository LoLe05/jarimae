// Email verification API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateVerificationCode } from '@/lib/auth'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { emailVerificationRequestSchema, emailVerificationConfirmSchema } from '@/lib/schemas/auth'

// In-memory store for verification codes (in production, use Redis)
const verificationCodes = new Map<string, { code: string, expires: Date, attempts: number }>()

// Clean up expired codes every 5 minutes
setInterval(() => {
  const now = new Date()
  for (const [email, data] of verificationCodes.entries()) {
    if (data.expires < now) {
      verificationCodes.delete(email)
    }
  }
}, 5 * 60 * 1000)

// Request email verification code
async function requestVerificationHandler(req: AuthenticatedRequest & { validatedData: any }) {
  const { email } = req.validatedData
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

  // Check if email is already verified for this user
  if (user.email === email && user.email_verified) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ALREADY_VERIFIED',
          message: '이미 인증된 이메일 주소입니다.'
        }
      },
      { status: 400 }
    )
  }

  // Check if email is used by another user
  if (user.email !== email) {
    const emailUser = await prisma.user.findUnique({
      where: { email }
    })

    if (emailUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: '이미 사용중인 이메일 주소입니다.'
          }
        },
        { status: 400 }
      )
    }
  }

  // Generate verification code
  const code = generateVerificationCode(6)
  const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  // Store verification code
  verificationCodes.set(email, { code, expires, attempts: 0 })

  // In production, send actual email here
  console.log(`Email verification code for ${email}: ${code}`)

  // For development, we'll simulate email sending
  const isTestEmail = email.includes('test') || email.includes('example')
  
  return NextResponse.json(
    {
      success: true,
      data: {
        verification_id: `${email}-${Date.now()}`,
        expires_at: expires.toISOString(),
        // Only return code in development for test emails
        ...(process.env.NODE_ENV === 'development' && isTestEmail && { code })
      },
      message: '인증번호가 발송되었습니다.'
    },
    { status: 200 }
  )
}

// Verify email code
async function verifyCodeHandler(req: AuthenticatedRequest & { validatedData: any }) {
  const { email, code } = req.validatedData
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
  const stored = verificationCodes.get(email)

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
    verificationCodes.delete(email)
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
    verificationCodes.delete(email)
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
        email: email,
        email_verified: true
      }
    }),
    prisma.authenticationLog.create({
      data: {
        user_id: userId,
        action: 'EMAIL_VERIFY',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        success: true
      }
    })
  ])

  // Remove verification code
  verificationCodes.delete(email)

  return NextResponse.json(
    {
      success: true,
      data: {
        verified: true
      },
      message: '이메일 인증이 완료되었습니다.'
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
          withValidation(emailVerificationConfirmSchema)(verifyCodeHandler)
        )
      )
      return handler(req)
    } else {
      // Verification request
      const handler = withErrorHandling(
        withAuth(
          withValidation(emailVerificationRequestSchema)(requestVerificationHandler)
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