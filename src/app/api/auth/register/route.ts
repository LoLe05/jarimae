// User registration API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { UserType } from '@prisma/client'
import { prisma } from '@/lib/db'
import { hashPassword, generateTokens } from '@/lib/auth'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { registerSchema, RegisterData } from '@/lib/schemas/auth'

async function registerHandler(req: NextRequest & { validatedData: RegisterData }) {
  const {
    email,
    password,
    name,
    nickname,
    phone,
    user_type,
    address,
    business_number,
    marketing_agreed = false
  } = req.validatedData

  // Additional validation for store owners
  if (user_type === 'OWNER' && !business_number) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '사업자등록번호는 필수입니다.',
          field: 'business_number'
        }
      },
      { status: 422 }
    )
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: '이미 사용중인 이메일입니다.',
          field: 'email'
        }
      },
      { status: 400 }
    )
  }

  // Check if phone already exists
  const existingPhone = await prisma.user.findUnique({
    where: { phone }
  })

  if (existingPhone) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PHONE_ALREADY_EXISTS',
          message: '이미 사용중인 휴대폰 번호입니다.',
          field: 'phone'
        }
      },
      { status: 400 }
    )
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Create user with transaction to ensure consistency
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const user = await tx.user.create({
      data: {
        email,
        password_hash: passwordHash,
        name,
        nickname: nickname || null,
        phone,
        user_type: user_type as UserType,
        address: address || null,
        phone_verified: false,
        email_verified: false
      },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        user_type: true,
        phone: true,
        created_at: true
      }
    })

    // Create user preferences
    await tx.userPreference.create({
      data: {
        user_id: user.id,
        notification_sms: true,
        notification_email: true,
        notification_push: true,
        marketing_consent: marketing_agreed,
        location_consent: user_type === 'CUSTOMER'
      }
    })

    // Log authentication event
    await tx.authenticationLog.create({
      data: {
        user_id: user.id,
        action: 'REGISTER',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        success: true
      }
    })

    return user
  })

  // Generate tokens
  const tokens = generateTokens(result)

  // Create welcome notification
  await prisma.notification.create({
    data: {
      user_id: result.id,
      type: 'SYSTEM_NOTICE',
      title: '자리매에 오신 것을 환영합니다!',
      message: user_type === 'CUSTOMER' 
        ? '이제 자리매에서 맛집을 찾아보세요. 첫 예약 시 특별 혜택을 받으실 수 있습니다!'
        : '매장 등록을 통해 고객들과 만나보세요. 승인 후 서비스를 이용하실 수 있습니다.',
      data: { welcome: true, user_type }
    }
  })

  return NextResponse.json(
    {
      success: true,
      data: {
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
          nickname: result.nickname,
          user_type: result.user_type,
          phone: result.phone,
          created_at: result.created_at
        },
        tokens: {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken
        }
      },
      message: '회원가입이 완료되었습니다. 휴대폰 인증을 진행해주세요.'
    },
    { status: 201 }
  )
}

// Apply middleware and export handlers
const handler = withErrorHandling(
  withValidation(registerSchema)(registerHandler)
)

export async function POST(req: NextRequest) {
  return handler(req)
}

// OPTIONS for CORS
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