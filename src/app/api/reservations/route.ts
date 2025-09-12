// Reservations API endpoints - list and create
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { withRBAC } from '@/lib/middleware/rbac'
import { createReservationSchema, reservationSearchSchema, CreateReservationData, ReservationSearchData } from '@/lib/schemas/reservation'

// Get reservations with search/filter
async function getReservationsHandler(req: AuthenticatedRequest & { validatedData: ReservationSearchData }) {
  const userId = req.user?.userId
  const userType = req.user?.userType
  
  const {
    store_id,
    customer_id,
    status,
    date_from,
    date_to,
    contact_phone,
    contact_name,
    sort_by,
    sort_order,
    page,
    limit
  } = req.validatedData

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

  // Build where clause based on user permissions
  const where: any = {}

  // Apply user-specific filters based on role
  if (userType === 'CUSTOMER') {
    where.customer_id = userId
  } else if (userType === 'OWNER') {
    // Owners can only see reservations for their own stores
    const ownedStores = await prisma.store.findMany({
      where: { owner_id: userId },
      select: { id: true }
    })
    
    if (ownedStores.length === 0) {
      return NextResponse.json({
        success: true,
        data: { reservations: [], pagination: { page, limit, total: 0, pages: 0 } }
      })
    }
    
    where.store_id = { in: ownedStores.map(store => store.id) }
  }
  // ADMIN can see all reservations (no additional filter)

  // Apply additional filters
  if (store_id) where.store_id = store_id
  if (customer_id && (userType === 'ADMIN' || userType === 'OWNER')) where.customer_id = customer_id
  if (status) where.status = status
  if (contact_phone) where.contact_phone = { contains: contact_phone }
  if (contact_name) where.contact_name = { contains: contact_name, mode: 'insensitive' }

  // Date range filter
  if (date_from || date_to) {
    where.reservation_date = {}
    if (date_from) where.reservation_date.gte = new Date(date_from)
    if (date_to) where.reservation_date.lte = new Date(date_to)
  }

  // Calculate pagination
  const skip = (page - 1) * limit

  // Build order by clause
  const orderBy: any = { [sort_by]: sort_order }

  try {
    const [reservations, totalCount] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              cuisine_type: true
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              nickname: true
            }
          },
          review: {
            select: {
              id: true,
              rating: true,
              comment: true,
              created_at: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.reservation.count({ where })
    ])

    return NextResponse.json(
      {
        success: true,
        data: {
          reservations: reservations.map(reservation => ({
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
            created_at: reservation.created_at,
            updated_at: reservation.updated_at
          })),
          pagination: {
            page,
            limit,
            total: totalCount,
            pages: Math.ceil(totalCount / limit)
          }
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get reservations error:', error)
    throw error
  }
}

// Create new reservation (CUSTOMER only)
async function createReservationHandler(req: AuthenticatedRequest & { validatedData: CreateReservationData }) {
  const userId = req.user?.userId
  const userType = req.user?.userType
  const reservationData = req.validatedData

  if (!userId || userType !== 'CUSTOMER') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: '예약 생성 권한이 없습니다.'
        }
      },
      { status: 403 }
    )
  }

  try {
    // Check if store exists and is active
    const store = await prisma.store.findUnique({
      where: { id: reservationData.store_id },
      include: {
        business_hours: true
      }
    })

    if (!store) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'STORE_NOT_FOUND',
            message: '매장을 찾을 수 없습니다.'
          }
        },
        { status: 404 }
      )
    }

    if (store.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'STORE_INACTIVE',
            message: '현재 예약을 받지 않는 매장입니다.'
          }
        },
        { status: 400 }
      )
    }

    if (!store.accepts_reservations) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RESERVATIONS_NOT_ACCEPTED',
            message: '이 매장은 예약을 받지 않습니다.'
          }
        },
        { status: 400 }
      )
    }

    // Check party size against store capacity
    if (reservationData.party_size > store.capacity) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PARTY_SIZE_EXCEEDS_CAPACITY',
            message: `최대 수용인원(${store.capacity}명)을 초과합니다.`
          }
        },
        { status: 400 }
      )
    }

    // Check business hours
    const reservationDate = new Date(reservationData.reservation_date)
    const dayOfWeek = reservationDate.getDay()
    
    const businessHour = store.business_hours.find(bh => bh.day_of_week === dayOfWeek)
    
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

    // Check if reservation time is within business hours
    const [reqHour, reqMin] = reservationData.reservation_time.split(':').map(Number)
    const [openHour, openMin] = businessHour.open_time.split(':').map(Number)
    const [closeHour, closeMin] = businessHour.close_time.split(':').map(Number)
    
    const reqMinutes = reqHour * 60 + reqMin
    const openMinutes = openHour * 60 + openMin
    const closeMinutes = closeHour * 60 + closeMin
    
    if (reqMinutes < openMinutes || reqMinutes > closeMinutes) {
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

    // Check for availability (simplified - in production, implement more sophisticated availability checking)
    const conflictingReservations = await prisma.reservation.count({
      where: {
        store_id: reservationData.store_id,
        reservation_date: new Date(reservationData.reservation_date),
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        // Check for time overlap (simplified)
        reservation_time: reservationData.reservation_time
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

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        ...reservationData,
        customer_id: userId,
        reservation_date: new Date(reservationData.reservation_date),
        estimated_duration: reservationData.estimated_duration || store.average_meal_duration,
        status: 'PENDING'
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

    // Send notification to store owner (in production, implement real notifications)
    console.log(`New reservation created for store ${store.name}: ${reservation.id}`)

    return NextResponse.json(
      {
        success: true,
        data: {
          reservation: {
            id: reservation.id,
            store: reservation.store,
            reservation_date: reservation.reservation_date,
            reservation_time: reservation.reservation_time,
            party_size: reservation.party_size,
            status: reservation.status,
            special_requests: reservation.special_requests,
            estimated_duration: reservation.estimated_duration,
            created_at: reservation.created_at
          }
        },
        message: '예약이 성공적으로 생성되었습니다.'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create reservation error:', error)
    throw error
  }
}

// Apply middleware and export handlers
const getHandler = withErrorHandling(
  withAuth(
    withRBAC(['CUSTOMER', 'OWNER', 'ADMIN'])(
      withValidation(reservationSearchSchema)(getReservationsHandler)
    )
  )
)

const postHandler = withErrorHandling(
  withAuth(
    withRBAC(['CUSTOMER'])(
      withValidation(createReservationSchema)(createReservationHandler)
    )
  )
)

export async function GET(req: NextRequest) {
  return getHandler(req)
}

export async function POST(req: NextRequest) {
  return postHandler(req)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}