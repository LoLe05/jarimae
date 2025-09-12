// User logout API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { withErrorHandling } from '@/lib/middleware/error'

async function logoutHandler(req: AuthenticatedRequest) {
  const userId = req.user?.userId

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다.'
        }
      },
      { status: 401 }
    )
  }

  try {
    // Log logout event
    await prisma.authenticationLog.create({
      data: {
        user_id: userId,
        action: 'LOGOUT',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        success: true
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: '로그아웃되었습니다.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    
    // Even if logging fails, logout should succeed
    return NextResponse.json(
      {
        success: true,
        message: '로그아웃되었습니다.'
      },
      { status: 200 }
    )
  }
}

// Apply middleware and export handlers
const handler = withErrorHandling(
  withAuth(logoutHandler)
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