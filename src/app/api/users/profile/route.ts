// User profile management API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { updateProfileSchema, UpdateProfileData } from '@/lib/schemas/auth'

// Get user profile
async function getProfileHandler(req: AuthenticatedRequest) {
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

  // Find user with preferences
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      user_preferences: true
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
      { status: 404 }
    )
  }

  // Get user statistics
  const stats = await prisma.$transaction(async (tx) => {
    const [reservationCount, completedReservations, reviewCount] = await Promise.all([
      tx.reservation.count({
        where: { customer_id: userId }
      }),
      tx.reservation.count({
        where: { 
          customer_id: userId,
          status: 'COMPLETED'
        }
      }),
      tx.review.count({
        where: { customer_id: userId }
      })
    ])

    return {
      total_reservations: reservationCount,
      completed_reservations: completedReservations,
      review_count: reviewCount
    }
  })

  // Get unread notifications count
  const unreadNotifications = await prisma.notification.count({
    where: {
      user_id: userId,
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
          phone: user.phone,
          user_type: user.user_type,
          profile_image: user.profile_image,
          address: user.address,
          phone_verified: user.phone_verified,
          email_verified: user.email_verified,
          created_at: user.created_at,
          last_login_at: user.last_login_at,
          preferences: user.user_preferences ? {
            notification_sms: user.user_preferences.notification_sms,
            notification_email: user.user_preferences.notification_email,
            notification_push: user.user_preferences.notification_push,
            marketing_consent: user.user_preferences.marketing_consent,
            location_consent: user.user_preferences.location_consent
          } : null,
          stats,
          unread_notifications
        }
      }
    },
    { status: 200 }
  )
}

// Update user profile
async function updateProfileHandler(req: AuthenticatedRequest & { validatedData: UpdateProfileData }) {
  const userId = req.user?.userId
  const { name, nickname, address, profile_image, preferences } = req.validatedData

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

  // Check if nickname is taken (if provided and different from current)
  if (nickname) {
    const existingUser = await prisma.user.findFirst({
      where: {
        nickname,
        id: { not: userId }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NICKNAME_ALREADY_EXISTS',
            message: '이미 사용중인 닉네임입니다.',
            field: 'nickname'
          }
        },
        { status: 400 }
      )
    }
  }

  // Update user profile
  const updateData: any = {}
  if (name !== undefined) updateData.name = name
  if (nickname !== undefined) updateData.nickname = nickname
  if (address !== undefined) updateData.address = address
  if (profile_image !== undefined) updateData.profile_image = profile_image || null

  const result = await prisma.$transaction(async (tx) => {
    // Update user basic info
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        nickname: true,
        address: true,
        profile_image: true,
        updated_at: true
      }
    })

    // Update preferences if provided
    if (preferences) {
      await tx.userPreference.upsert({
        where: { user_id: userId },
        update: preferences,
        create: {
          user_id: userId,
          ...preferences
        }
      })
    }

    return updatedUser
  })

  return NextResponse.json(
    {
      success: true,
      data: {
        user: result
      },
      message: '프로필이 업데이트되었습니다.'
    },
    { status: 200 }
  )
}

// Route handlers
const getHandler = withErrorHandling(
  withAuth(getProfileHandler)
)

const updateHandler = withErrorHandling(
  withAuth(
    withValidation(updateProfileSchema)(updateProfileHandler)
  )
)

export async function GET(req: NextRequest) {
  return getHandler(req)
}

export async function PUT(req: NextRequest) {
  return updateHandler(req)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}