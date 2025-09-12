// Reservation availability check API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withValidation } from '@/lib/middleware/validation'
import { withErrorHandling } from '@/lib/middleware/error'
import { checkAvailabilitySchema, CheckAvailabilityData } from '@/lib/schemas/reservation'

// Check availability for reservation
async function checkAvailabilityHandler(req: NextRequest & { validatedData: CheckAvailabilityData }) {
  const { store_id, reservation_date, party_size, preferred_time } = req.validatedData

  try {
    // Get store information
    const store = await prisma.store.findUnique({
      where: { id: store_id },
      include: {
        business_hours: {
          orderBy: { day_of_week: 'asc' }
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

    // Check if party size exceeds capacity
    if (party_size > store.capacity) {
      return NextResponse.json(
        {
          success: false,
          available: false,
          error: {
            code: 'PARTY_SIZE_EXCEEDS_CAPACITY',
            message: `최대 수용인원(${store.capacity}명)을 초과합니다.`
          }
        },
        { status: 200 }
      )
    }

    // Check business hours for the given date
    const reservationDate = new Date(reservation_date)
    const dayOfWeek = reservationDate.getDay()
    
    const businessHour = store.business_hours.find(bh => bh.day_of_week === dayOfWeek)
    
    if (!businessHour || businessHour.is_closed) {
      return NextResponse.json(
        {
          success: true,
          available: false,
          message: '해당 날짜에 매장이 영업하지 않습니다.',
          business_hours: null,
          available_slots: []
        },
        { status: 200 }
      )
    }

    // Get existing reservations for the date
    const existingReservations = await prisma.reservation.findMany({
      where: {
        store_id,
        reservation_date: reservationDate,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      select: {
        reservation_time: true,
        party_size: true,
        estimated_duration: true
      }
    })

    // Generate available time slots
    const [openHour, openMin] = businessHour.open_time.split(':').map(Number)
    const [closeHour, closeMin] = businessHour.close_time.split(':').map(Number)
    
    const openMinutes = openHour * 60 + openMin
    const closeMinutes = closeHour * 60 + closeMin
    const mealDuration = store.average_meal_duration
    const slotInterval = 30 // 30-minute intervals

    const availableSlots: Array<{
      time: string
      available: boolean
      remaining_capacity: number
    }> = []

    // Check each 30-minute slot
    for (let minutes = openMinutes; minutes <= closeMinutes - mealDuration; minutes += slotInterval) {
      const hour = Math.floor(minutes / 60)
      const min = minutes % 60
      const timeSlot = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
      
      // Calculate current occupancy for this time slot
      let currentOccupancy = 0
      
      existingReservations.forEach(reservation => {
        const [resHour, resMin] = reservation.reservation_time.split(':').map(Number)
        const resStartMinutes = resHour * 60 + resMin
        const resEndMinutes = resStartMinutes + (reservation.estimated_duration || mealDuration)
        
        // Check if this reservation overlaps with the current time slot
        if (minutes < resEndMinutes && minutes + mealDuration > resStartMinutes) {
          currentOccupancy += reservation.party_size
        }
      })
      
      const remainingCapacity = store.capacity - currentOccupancy
      const isAvailable = remainingCapacity >= party_size
      
      availableSlots.push({
        time: timeSlot,
        available: isAvailable,
        remaining_capacity: Math.max(0, remainingCapacity)
      })
    }

    // Check specific time if preferred_time is provided
    let preferredTimeAvailable = true
    let preferredTimeMessage = ''
    
    if (preferred_time) {
      const [prefHour, prefMin] = preferred_time.split(':').map(Number)
      const prefMinutes = prefHour * 60 + prefMin
      
      if (prefMinutes < openMinutes || prefMinutes > closeMinutes - mealDuration) {
        preferredTimeAvailable = false
        preferredTimeMessage = `영업시간(${businessHour.open_time}-${businessHour.close_time}) 내에서만 예약 가능합니다.`
      } else {
        const slot = availableSlots.find(slot => slot.time === preferred_time)
        if (slot && !slot.available) {
          preferredTimeAvailable = false
          preferredTimeMessage = '선택한 시간에 예약이 불가능합니다. 다른 시간을 선택해주세요.'
        }
      }
    }

    const hasAnyAvailableSlots = availableSlots.some(slot => slot.available)
    
    return NextResponse.json(
      {
        success: true,
        available: hasAnyAvailableSlots,
        data: {
          store: {
            id: store.id,
            name: store.name,
            capacity: store.capacity,
            average_meal_duration: store.average_meal_duration
          },
          business_hours: {
            day_of_week: dayOfWeek,
            open_time: businessHour.open_time,
            close_time: businessHour.close_time,
            is_closed: businessHour.is_closed
          },
          available_slots: availableSlots.filter(slot => slot.available),
          all_slots: availableSlots,
          preferred_time: preferred_time ? {
            available: preferredTimeAvailable,
            message: preferredTimeMessage
          } : undefined,
          total_available_slots: availableSlots.filter(slot => slot.available).length,
          party_size,
          reservation_date
        },
        message: hasAnyAvailableSlots 
          ? '예약 가능한 시간이 있습니다.' 
          : '해당 날짜에 예약 가능한 시간이 없습니다.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Check availability error:', error)
    throw error
  }
}

// Apply middleware and export handlers
const handler = withErrorHandling(
  withValidation(checkAvailabilitySchema)(checkAvailabilityHandler)
)

export async function GET(req: NextRequest) {
  return handler(req)
}

export async function POST(req: NextRequest) {
  return handler(req)
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