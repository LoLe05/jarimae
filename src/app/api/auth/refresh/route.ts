// Token refresh API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyRefreshToken, generateTokens } from '@/lib/auth'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { refreshTokenSchema, RefreshTokenData } from '@/lib/schemas/auth'

async function refreshHandler(req: NextRequest & { validatedData: RefreshTokenData }) {
  const { refresh_token } = req.validatedData

  // Verify refresh token
  const payload = verifyRefreshToken(refresh_token)

  if (!payload) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: '유효하지 않은 리프레시 토큰입니다.'
        }
      },
      { status: 401 }
    )
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { 
      id: payload.userId,
      is_active: true
    },
    select: {
      id: true,
      email: true,
      name: true,
      user_type: true
    }
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
      { status: 401 }
    )
  }

  // Generate new tokens
  const tokens = generateTokens(user)

  return NextResponse.json(
    {
      success: true,
      data: {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      },
      message: '토큰이 갱신되었습니다.'
    },
    { status: 200 }
  )
}

// Apply middleware and export handlers
const handler = withErrorHandling(
  withValidation(refreshTokenSchema)(refreshHandler)
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