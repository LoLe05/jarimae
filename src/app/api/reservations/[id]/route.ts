// Individual reservation API endpoints - get, update, delete
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { withRBAC } from '@/lib/middleware/rbac'
import { updateReservationSchema, updateReservationStatusSchema, UpdateReservationData, UpdateReservationStatusData } from '@/lib/schemas/reservation'

// Get reservation by ID
async function getReservationHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  const userId = req.user?.userId
  const userType = req.user?.userType
  const reservationId = params.id

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

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            cuisine_type: true,
            price_range: true,
            images: true,
            owner_id: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            nickname: true,
            profile_image: true
          }
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
            service_rating: true,
            food_rating: true,
            atmosphere_rating: true,
            value_rating: true,
            images: true,
            would_recommend: true,
            tags: true,
            created_at: true
          }
        }
      }
    })

    if (!reservation) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RESERVATION_NOT_FOUND',
            message: '예약을 찾을 수 없습니다.'
          }
        },
        { status: 404 }
      )
    }

    // Check permissions
    const canView = 
      userType === 'ADMIN' ||
      (userType === 'CUSTOMER' && reservation.customer_id === userId) ||
      (userType === 'OWNER' && reservation.store.owner_id === userId)

    if (!canView) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '예약 조회 권한이 없습니다.'
          }
        },
        { status: 403 }
      )
    }

    // Calculate if review is allowed (completed reservations only)
    const canReview = 
      userType === 'CUSTOMER' && 
      reservation.customer_id === userId && 
      reservation.status === 'COMPLETED' &&
      !reservation.review

    // Calculate if cancellation is allowed (pending/confirmed reservations, not in the past)
    const now = new Date()
    const reservationDateTime = new Date(`${reservation.reservation_date.toISOString().split('T')[0]}T${reservation.reservation_time}:00`)
    const canCancel = 
      ['PENDING', 'CONFIRMED'].includes(reservation.status) &&
      reservationDateTime > now &&
      (
        (userType === 'CUSTOMER' && reservation.customer_id === userId) ||
        (userType === 'OWNER' && reservation.store.owner_id === userId) ||
        userType === 'ADMIN'
      )

    return NextResponse.json(
      {
        success: true,
        data: {
          reservation: {
            id: reservation.id,
            store: reservation.store,
            customer: userType === 'CUSTOMER' ? undefined : reservation.customer,
            reservation_date: reservation.reservation_date,
            reservation_time: reservation.reservation_time,
            party_size: reservation.party_size,
            status: reservation.status,
            special_requests: reservation.special_requests,
            contact_phone: reservation.contact_phone,
            contact_name: reservation.contact_name,
            estimated_duration: reservation.estimated_duration,
            total_amount: reservation.total_amount,
            cancellation_reason: reservation.cancellation_reason,
            review: reservation.review,
            permissions: {
              can_review: canReview,
              can_cancel: canCancel,
              can_modify: canCancel // Same conditions as cancel
            },
            created_at: reservation.created_at,
            updated_at: reservation.updated_at
          }
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get reservation error:', error)
    throw error
  }
}

// Update reservation details (customer can update their own, owner can update store's reservations)
async function updateReservationHandler(
  req: AuthenticatedRequest & { validatedData: UpdateReservationData },
  { params }: { params: { id: string } }
) {
  const userId = req.user?.userId
  const userType = req.user?.userType
  const reservationId = params.id
  const updateData = req.validatedData

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

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        store: {
          include: {
            business_hours: true
          }
        }
      }
    })

    if (!reservation) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RESERVATION_NOT_FOUND',
            message: '예약을 찾을 수 없습니다.'
          }
        },
        { status: 404 }
      )
    }

    // Check permissions
    const canUpdate = 
      userType === 'ADMIN' ||
      (userType === 'CUSTOMER' && reservation.customer_id === userId) ||
      (userType === 'OWNER' && reservation.store.owner_id === userId)

    if (!canUpdate) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '예약 수정 권한이 없습니다.'
          }
        },
        { status: 403 }
      )
    }

    // Check if reservation can be modified
    if (!['PENDING', 'CONFIRMED'].includes(reservation.status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RESERVATION_NOT_MODIFIABLE',
            message: '수정할 수 없는 예약 상태입니다.'
          }
        },
        { status: 400 }
      )
    }

    // Check if reservation is in the future
    const now = new Date()
    const currentReservationDateTime = new Date(`${reservation.reservation_date.toISOString().split('T')[0]}T${reservation.reservation_time}:00`)
    
    if (currentReservationDateTime <= now) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RESERVATION_IN_PAST',
            message: '과거의 예약은 수정할 수 없습니다.'
          }
        },
        { status: 400 }
      )
    }

    // Validate new date and time if provided
    if (updateData.reservation_date || updateData.reservation_time) {
      const newDate = updateData.reservation_date || reservation.reservation_date.toISOString().split('T')[0]
      const newTime = updateData.reservation_time || reservation.reservation_time
      const newPartySize = updateData.party_size || reservation.party_size

      // Check business hours
      const newReservationDate = new Date(newDate)
      const dayOfWeek = newReservationDate.getDay()
      
      const businessHour = reservation.store.business_hours.find(bh => bh.day_of_week === dayOfWeek)
      
      if (!businessHour || businessHour.is_closed) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'STORE_CLOSED',
              message: '해당 날짜에 매장이 영업하지 않습니다.'
            }
          },
          { status: 400 }
        )
      }

      // Check if new time is within business hours
      const [newHour, newMin] = newTime.split(':').map(Number)
      const [openHour, openMin] = businessHour.open_time.split(':').map(Number)
      const [closeHour, closeMin] = businessHour.close_time.split(':').map(Number)
      
      const newMinutes = newHour * 60 + newMin
      const openMinutes = openHour * 60 + openMin
      const closeMinutes = closeHour * 60 + closeMin
      
      if (newMinutes < openMinutes || newMinutes > closeMinutes) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'OUTSIDE_BUSINESS_HOURS',
              message: `영업시간(${businessHour.open_time}-${businessHour.close_time}) 내에서만 예약 가능합니다.`
            }
          },
          { status: 400 }
        )
      }

      // Check party size against capacity
      if (newPartySize > reservation.store.capacity) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'PARTY_SIZE_EXCEEDS_CAPACITY',
              message: `최대 수용인원(${reservation.store.capacity}명)을 초과합니다.`
            }
          },
          { status: 400 }
        )
      }

      // Check for conflicts with other reservations
      const conflictingReservations = await prisma.reservation.count({
        where: {
          store_id: reservation.store_id,
          reservation_date: newReservationDate,
          reservation_time: newTime,
          status: {
            in: ['PENDING', 'CONFIRMED']
          },
          id: {
            not: reservationId // Exclude current reservation
          }
        }
      })

      if (conflictingReservations > 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'TIME_SLOT_UNAVAILABLE',
              message: '선택한 시간에 예약이 불가능합니다. 다른 시간을 선택해주세요.'
            }
          },
          { status: 400 }
        )
      }
    }

    // Update reservation
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        ...updateData,
        reservation_date: updateData.reservation_date ? new Date(updateData.reservation_date) : undefined
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          reservation: {
            id: updatedReservation.id,
            store: updatedReservation.store,
            reservation_date: updatedReservation.reservation_date,
            reservation_time: updatedReservation.reservation_time,
            party_size: updatedReservation.party_size,
            status: updatedReservation.status,
            special_requests: updatedReservation.special_requests,
            contact_phone: updatedReservation.contact_phone,
            contact_name: updatedReservation.contact_name,
            estimated_duration: updatedReservation.estimated_duration,
            updated_at: updatedReservation.updated_at
          }
        },
        message: '예약이 수정되었습니다.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update reservation error:', error)
    throw error
  }
}

// Update reservation status (OWNER and ADMIN)
async function updateReservationStatusHandler(
  req: AuthenticatedRequest & { validatedData: UpdateReservationStatusData },
  { params }: { params: { id: string } }
) {
  const userId = req.user?.userId
  const userType = req.user?.userType
  const reservationId = params.id
  const { status, cancellation_reason, total_amount } = req.validatedData

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

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        store: true,
        customer: true
      }
    })

    if (!reservation) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RESERVATION_NOT_FOUND',
            message: '예약을 찾을 수 없습니다.'
          }
        },
        { status: 404 }
      )
    }

    // Check permissions
    const canUpdateStatus = 
      userType === 'ADMIN' ||
      (userType === 'OWNER' && reservation.store.owner_id === userId) ||
      (userType === 'CUSTOMER' && reservation.customer_id === userId && status === 'CANCELLED')

    if (!canUpdateStatus) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '예약 상태 변경 권한이 없습니다.'
          }
        },
        { status: 403 }
      )
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      'PENDING': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['COMPLETED', 'CANCELLED', 'NO_SHOW'],
      'CANCELLED': [], // Cannot change from cancelled
      'COMPLETED': [], // Cannot change from completed
      'NO_SHOW': [] // Cannot change from no-show
    }

    if (!validTransitions[reservation.status]?.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_STATUS_TRANSITION',
            message: `${reservation.status}에서 ${status}로 변경할 수 없습니다.`
          }
        },
        { status: 400 }
      )
    }

    // Update reservation
    const updatedReservation = await prisma.$transaction(async (tx) => {
      const updated = await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status,
          cancellation_reason: status === 'CANCELLED' ? cancellation_reason : null,
          total_amount: status === 'COMPLETED' ? total_amount : undefined
        }
      })

      // Update store rating if reservation is completed
      if (status === 'COMPLETED' && total_amount !== undefined) {
        // Calculate new average rating (simplified - in production, use more sophisticated calculation)
        const completedReservations = await tx.reservation.count({
          where: {
            store_id: reservation.store_id,
            status: 'COMPLETED'
          }
        })

        // Log the completion for analytics
        console.log(`Reservation ${reservationId} completed for store ${reservation.store.name}`)
      }

      return updated
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          reservation: {
            id: updatedReservation.id,
            status: updatedReservation.status,
            cancellation_reason: updatedReservation.cancellation_reason,
            total_amount: updatedReservation.total_amount,
            updated_at: updatedReservation.updated_at
          }
        },
        message: '예약 상태가 변경되었습니다.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update reservation status error:', error)
    throw error
  }
}

// Apply middleware and export handlers
const getHandler = withErrorHandling(
  withAuth(
    withRBAC(['CUSTOMER', 'OWNER', 'ADMIN'])(getReservationHandler)
  )
)

const putHandler = withErrorHandling(
  withAuth(
    withRBAC(['CUSTOMER', 'OWNER', 'ADMIN'])(
      withValidation(updateReservationSchema)(updateReservationHandler)
    )
  )
)

const patchHandler = withErrorHandling(
  withAuth(
    withRBAC(['CUSTOMER', 'OWNER', 'ADMIN'])(
      withValidation(updateReservationStatusSchema)(updateReservationStatusHandler)
    )
  )
)

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  return getHandler(req, context)
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  return putHandler(req, context)
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  return patchHandler(req, context)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}