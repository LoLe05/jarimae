// User login API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, generateTokens } from '@/lib/auth'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { loginSchema, LoginData } from '@/lib/schemas/auth'

async function loginHandler(req: NextRequest & { validatedData: LoginData }) {
  const { email, password } = req.validatedData

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      user_preferences: true
    }
  })

  if (!user) {
    // Log failed attempt
    await prisma.authenticationLog.create({
      data: {
        user_id: 'unknown',
        action: 'LOGIN',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        success: false,
        failure_reason: 'User not found'
      }
    }).catch(() => {}) // Ignore logging errors

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '이메일 또는 비밀번호가 올바르지 않습니다.'
        }
      },
      { status: 401 }
    )
  }

  // Check if user account is active
  if (!user.is_active) {
    await prisma.authenticationLog.create({
      data: {
        user_id: user.id,
        action: 'LOGIN',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        success: false,
        failure_reason: 'Account disabled'
      }
    }).catch(() => {})

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: '비활성화된 계정입니다. 고객센터에 문의해주세요.'
        }
      },
      { status: 403 }
    )
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password_hash)

  if (!isPasswordValid) {
    await prisma.authenticationLog.create({
      data: {
        user_id: user.id,
        action: 'LOGIN',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        success: false,
        failure_reason: 'Invalid password'
      }
    }).catch(() => {})

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '이메일 또는 비밀번호가 올바르지 않습니다.'
        }
      },
      { status: 401 }
    )
  }

  // Generate tokens
  const tokens = generateTokens(user)

  // Update last login and log successful attempt
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() }
    }),
    prisma.authenticationLog.create({
      data: {
        user_id: user.id,
        action: 'LOGIN',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        success: true
      }
    })
  ])

  // Get unread notifications count
  const unreadNotifications = await prisma.notification.count({
    where: {
      user_id: user.id,
      is_read: false
    }
  })

  return NextResponse.json(
    {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          user_type: user.user_type,
          phone: user.phone,
          profile_image: user.profile_image,
          address: user.address,
          phone_verified: user.phone_verified,
          email_verified: user.email_verified,
          preferences: user.user_preferences ? {
            notification_sms: user.user_preferences.notification_sms,
            notification_email: user.user_preferences.notification_email,
            notification_push: user.user_preferences.notification_push,
            marketing_consent: user.user_preferences.marketing_consent,
            location_consent: user.user_preferences.location_consent
          } : null,
          unread_notifications: unreadNotifications
        },
        tokens: {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken
        }
      },
      message: '로그인 성공'
    },
    { status: 200 }
  )
}

// Apply middleware and export handlers
const handler = withErrorHandling(
  withValidation(loginSchema)(loginHandler)
)

export async function POST(req: NextRequest) {
  return handler(req)
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