// Individual store API endpoints - get, update, delete
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { withRBAC } from '@/lib/middleware/rbac'
import { updateStoreSchema, updateStoreStatusSchema, UpdateStoreData, UpdateStoreStatusData } from '@/lib/schemas/store'

// Get store by ID
async function getStoreHandler(req: NextRequest, { params }: { params: { id: string } }) {
  const storeId = params.id

  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        business_hours: {
          orderBy: { day_of_week: 'asc' }
        },
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                nickname: true,
                profile_image: true
              }
            }
          },
          orderBy: { created_at: 'desc' },
          take: 10 // Latest 10 reviews
        },
        _count: {
          select: {
            reservations: true,
            reviews: true
          }
        }
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

    // Calculate monthly statistics
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const [monthlyReservations, monthlyRevenue] = await Promise.all([
      prisma.reservation.count({
        where: {
          store_id: storeId,
          reservation_date: {
            gte: firstDayThisMonth
          }
        }
      }),
      prisma.reservation.aggregate({
        where: {
          store_id: storeId,
          status: 'COMPLETED',
          reservation_date: {
            gte: firstDayThisMonth
          }
        },
        _sum: {
          total_amount: true
        }
      })
    ])

    return NextResponse.json(
      {
        success: true,
        data: {
          store: {
            id: store.id,
            name: store.name,
            description: store.description,
            phone: store.phone,
            address: store.address,
            latitude: store.latitude,
            longitude: store.longitude,
            cuisine_type: store.cuisine_type,
            price_range: store.price_range,
            capacity: store.capacity,
            average_meal_duration: store.average_meal_duration,
            average_rating: store.average_rating,
            total_reviews: store._count.reviews,
            total_reservations: store._count.reservations,
            has_parking: store.has_parking,
            has_valet: store.has_valet,
            has_wifi: store.has_wifi,
            has_private_room: store.has_private_room,
            accepts_reservations: store.accepts_reservations,
            accepts_walk_ins: store.accepts_walk_ins,
            delivery_available: store.delivery_available,
            takeout_available: store.takeout_available,
            images: store.images,
            business_hours: store.business_hours,
            special_features: store.special_features,
            status: store.status,
            owner: store.owner,
            reviews: store.reviews.map(review => ({
              id: review.id,
              rating: review.rating,
              comment: review.comment,
              customer: review.customer,
              created_at: review.created_at
            })),
            monthly_stats: {
              reservations: monthlyReservations,
              revenue: monthlyRevenue._sum.total_amount || 0
            },
            created_at: store.created_at,
            updated_at: store.updated_at
          }
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get store error:', error)
    throw error
  }
}

// Update store (OWNER only - own store, or OWNER)
async function updateStoreHandler(
  req: AuthenticatedRequest & { validatedData: UpdateStoreData },
  { params }: { params: { id: string } }
) {
  const userId = req.user?.userId
  const userType = req.user?.userType
  const storeId = params.id
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
    // Find store
    const store = await prisma.store.findUnique({
      where: { id: storeId }
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

    // Check permissions (owner of the store or admin)
    if (userType !== 'OWNER' && store.owner_id !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '매장 수정 권한이 없습니다.'
          }
        },
        { status: 403 }
      )
    }

    const updatedStore = await prisma.$transaction(async (tx) => {
      // Extract business_hours from update data
      const { business_hours, ...storeUpdateData } = updateData

      // Update store basic info
      const updated = await tx.store.update({
        where: { id: storeId },
        data: storeUpdateData,
        include: {
          business_hours: true
        }
      })

      // Update business hours if provided
      if (business_hours) {
        // Delete existing business hours
        await tx.businessHour.deleteMany({
          where: { store_id: storeId }
        })

        // Create new business hours
        await tx.businessHour.createMany({
          data: business_hours.map(hours => ({
            store_id: storeId,
            ...hours
          }))
        })
      }

      return updated
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          store: {
            id: updatedStore.id,
            name: updatedStore.name,
            status: updatedStore.status,
            updated_at: updatedStore.updated_at
          }
        },
        message: '매장 정보가 수정되었습니다.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update store error:', error)
    throw error
  }
}

// Delete store (OWNER only)
async function deleteStoreHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  const userId = req.user?.userId
  const userType = req.user?.userType
  const storeId = params.id

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

  if (userType !== 'OWNER') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: '매장 삭제 권한이 없습니다.'
        }
      },
      { status: 403 }
    )
  }

  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId }
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

    // Check for active reservations
    const activeReservations = await prisma.reservation.count({
      where: {
        store_id: storeId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        reservation_date: {
          gte: new Date()
        }
      }
    })

    if (activeReservations > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'HAS_ACTIVE_RESERVATIONS',
            message: '활성 예약이 있어 매장을 삭제할 수 없습니다.'
          }
        },
        { status: 400 }
      )
    }

    // Soft delete (set status to DELETED)
    await prisma.store.update({
      where: { id: storeId },
      data: {
        status: 'DELETED',
        updated_at: new Date()
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: '매장이 삭제되었습니다.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete store error:', error)
    throw error
  }
}

// Update store status (OWNER only)
async function updateStoreStatusHandler(
  req: AuthenticatedRequest & { validatedData: UpdateStoreStatusData },
  { params }: { params: { id: string } }
) {
  const userId = req.user?.userId
  const userType = req.user?.userType
  const storeId = params.id
  const { status } = req.validatedData

  if (!userId || userType !== 'OWNER') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: '매장 상태 변경 권한이 없습니다.'
        }
      },
      { status: 403 }
    )
  }

  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId }
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

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { status }
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          store: {
            id: updatedStore.id,
            name: updatedStore.name,
            status: updatedStore.status
          }
        },
        message: '매장 상태가 변경되었습니다.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update store status error:', error)
    throw error
  }
}

// Apply middleware and export handlers
const getHandler = withErrorHandling(getStoreHandler)

const putHandler = withErrorHandling(
  withAuth(
    withRBAC(['OWNER'])(
      withValidation(updateStoreSchema)(updateStoreHandler)
    )
  )
)

const deleteHandler = withErrorHandling(
  withAuth(
    withRBAC(['OWNER'])(deleteStoreHandler)
  )
)

const patchHandler = withErrorHandling(
  withAuth(
    withRBAC(['OWNER'])(
      withValidation(updateStoreStatusSchema)(updateStoreStatusHandler)
    )
  )
)

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  return getHandler(req, context)
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  return putHandler(req, context)
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  return deleteHandler(req, context)
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  return patchHandler(req, context)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}