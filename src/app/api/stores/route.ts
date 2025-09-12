// Stores API endpoints - list and create
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { withRBAC } from '@/lib/middleware/rbac'
import { createStoreSchema, storeSearchSchema, CreateStoreData, StoreSearchData } from '@/lib/schemas/store'

// Get stores with search/filter
async function getStoresHandler(req: NextRequest & { validatedData: StoreSearchData }) {
  const {
    query,
    cuisine_type,
    price_range,
    has_parking,
    has_wifi,
    has_private_room,
    accepts_reservations,
    delivery_available,
    latitude,
    longitude,
    radius,
    sort_by,
    sort_order,
    page,
    limit
  } = req.validatedData

  // Build where clause
  const where: any = {
    status: 'ACTIVE'
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { address: { contains: query, mode: 'insensitive' } }
    ]
  }

  if (cuisine_type) where.cuisine_type = cuisine_type
  if (price_range) where.price_range = price_range
  if (has_parking !== undefined) where.has_parking = has_parking
  if (has_wifi !== undefined) where.has_wifi = has_wifi
  if (has_private_room !== undefined) where.has_private_room = has_private_room
  if (accepts_reservations !== undefined) where.accepts_reservations = accepts_reservations
  if (delivery_available !== undefined) where.delivery_available = delivery_available

  // Calculate pagination
  const skip = (page - 1) * limit

  // Build order by clause
  let orderBy: any = {}
  
  if (sort_by === 'distance' && latitude && longitude) {
    // For distance sorting, we'll need to calculate distance in the application layer
    orderBy = { created_at: sort_order }
  } else if (sort_by === 'rating') {
    orderBy = { average_rating: sort_order }
  } else {
    orderBy = { [sort_by]: sort_order }
  }

  try {
    const [stores, totalCount] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          business_hours: {
            orderBy: { day_of_week: 'asc' }
          },
          _count: {
            select: {
              reservations: true,
              reviews: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.store.count({ where })
    ])

    // Calculate distance if coordinates provided
    let processedStores = stores
    if (latitude && longitude) {
      processedStores = stores.map(store => {
        const distance = calculateDistance(latitude, longitude, store.latitude, store.longitude)
        return { ...store, distance }
      })

      // Sort by distance if requested
      if (sort_by === 'distance') {
        processedStores.sort((a, b) => {
          const aDistance = a.distance || Infinity
          const bDistance = b.distance || Infinity
          return sort_order === 'asc' ? aDistance - bDistance : bDistance - aDistance
        })
      }

      // Filter by radius if provided
      if (radius) {
        processedStores = processedStores.filter(store => 
          store.distance && store.distance <= radius
        )
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          stores: processedStores.map(store => ({
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
            average_rating: store.average_rating,
            total_reviews: store._count.reviews,
            total_reservations: store._count.reservations,
            has_parking: store.has_parking,
            has_wifi: store.has_wifi,
            has_private_room: store.has_private_room,
            accepts_reservations: store.accepts_reservations,
            delivery_available: store.delivery_available,
            takeout_available: store.takeout_available,
            images: store.images,
            business_hours: store.business_hours,
            special_features: store.special_features,
            distance: 'distance' in store ? store.distance : undefined,
            created_at: store.created_at,
            updated_at: store.updated_at
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
    console.error('Get stores error:', error)
    throw error
  }
}

// Create new store (OWNER only)
async function createStoreHandler(req: AuthenticatedRequest & { validatedData: CreateStoreData }) {
  const userId = req.user?.userId
  const storeData = req.validatedData

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

  // Check if user is OWNER
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user || user.user_type !== 'OWNER') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: '매장 등록 권한이 없습니다.'
        }
      },
      { status: 403 }
    )
  }

  try {
    const store = await prisma.$transaction(async (tx) => {
      // Create store
      const newStore = await tx.store.create({
        data: {
          ...storeData,
          owner_id: userId,
          status: 'PENDING', // Needs admin approval
          average_rating: 0,
          images: storeData.images || []
        }
      })

      // Create business hours
      if (storeData.business_hours) {
        await tx.businessHour.createMany({
          data: storeData.business_hours.map(hours => ({
            store_id: newStore.id,
            ...hours
          }))
        })
      }

      return newStore
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          store: {
            id: store.id,
            name: store.name,
            status: store.status
          }
        },
        message: '매장이 등록되었습니다. 관리자 승인 후 활성화됩니다.'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create store error:', error)
    throw error
  }
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Apply middleware and export handlers
const getHandler = withErrorHandling(
  withValidation(storeSearchSchema)(getStoresHandler)
)

const postHandler = withErrorHandling(
  withAuth(
    withRBAC(['OWNER'])(
      withValidation(createStoreSchema)(createStoreHandler)
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