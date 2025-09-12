// Seed data for Jarimae database
import { PrismaClient, UserType, StoreCategory, StoreStatus, TableType, ReservationStatus } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (optional - comment out in production)
  console.log('🧹 Cleaning existing data...')
  await prisma.reservationLog.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.reservation.deleteMany({})
  await prisma.menuItem.deleteMany({})
  await prisma.menuCategory.deleteMany({})
  await prisma.table.deleteMany({})
  await prisma.store.deleteMany({})
  await prisma.notification.deleteMany({})
  await prisma.userPreference.deleteMany({})
  await prisma.authenticationLog.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.appConfig.deleteMany({})

  // Create app configurations
  console.log('⚙️ Creating app configurations...')
  await prisma.appConfig.createMany({
    data: [
      {
        key: 'reservation_deadline_hours',
        value: '2',
        description: '예약 마감 시간 (시간 단위)',
        is_public: true
      },
      {
        key: 'max_party_size',
        value: '20',
        description: '최대 예약 인원수',
        is_public: true
      },
      {
        key: 'sms_api_key',
        value: 'test_sms_api_key',
        description: 'SMS 발송 API 키',
        is_public: false
      },
      {
        key: 'email_api_key',
        value: 'test_email_api_key',
        description: '이메일 발송 API 키',
        is_public: false
      }
    ]
  })

  // Create test customers
  console.log('👥 Creating test customers...')
  const customerPassword = await hashPassword('password123!')
  
  const customers = await prisma.user.createMany({
    data: [
      {
        email: 'customer1@test.com',
        password_hash: customerPassword,
        name: '김고객',
        nickname: '맛집탐험가',
        phone: '010-1234-5678',
        user_type: UserType.CUSTOMER,
        address: '서울특별시 강남구 테헤란로 123',
        phone_verified: true,
        email_verified: true
      },
      {
        email: 'customer2@test.com',
        password_hash: customerPassword,
        name: '이손님',
        nickname: '미식가',
        phone: '010-2345-6789',
        user_type: UserType.CUSTOMER,
        address: '서울특별시 서초구 강남대로 456',
        phone_verified: true,
        email_verified: true
      },
      {
        email: 'customer3@test.com',
        password_hash: customerPassword,
        name: '박고객',
        nickname: '리뷰어',
        phone: '010-3456-7890',
        user_type: UserType.CUSTOMER,
        phone_verified: false,
        email_verified: true
      }
    ]
  })

  // Create test store owners
  console.log('🏪 Creating test store owners...')
  const ownerPassword = await hashPassword('owner123!')
  
  const owner1 = await prisma.user.create({
    data: {
      email: 'owner1@test.com',
      password_hash: ownerPassword,
      name: '김사장',
      phone: '010-9876-5432',
      user_type: UserType.OWNER,
      phone_verified: true,
      email_verified: true
    }
  })

  const owner2 = await prisma.user.create({
    data: {
      email: 'owner2@test.com',
      password_hash: ownerPassword,
      name: '이사장',
      phone: '010-8765-4321',
      user_type: UserType.OWNER,
      phone_verified: true,
      email_verified: true
    }
  })

  const owner3 = await prisma.user.create({
    data: {
      email: 'owner3@test.com',
      password_hash: ownerPassword,
      name: '박사장',
      phone: '010-7654-3210',
      user_type: UserType.OWNER,
      phone_verified: true,
      email_verified: true
    }
  })

  // Create user preferences
  console.log('🔔 Creating user preferences...')
  const allUsers = await prisma.user.findMany()
  
  for (const user of allUsers) {
    await prisma.userPreference.create({
      data: {
        user_id: user.id,
        notification_sms: true,
        notification_email: true,
        notification_push: true,
        marketing_consent: user.user_type === UserType.CUSTOMER,
        location_consent: user.user_type === UserType.CUSTOMER
      }
    })
  }

  // Create test stores
  console.log('🏬 Creating test stores...')
  const store1 = await prisma.store.create({
    data: {
      name: '맛있는 삼겹살집',
      slug: 'delicious-pork-belly',
      category: StoreCategory.KOREAN,
      description: '신선한 삼겹살과 다양한 한식 메뉴를 제공하는 맛집입니다. 가족 단위 손님들에게 인기가 많습니다.',
      address: '서울특별시 강남구 테헤란로 123',
      detailed_address: '1층',
      postal_code: '06159',
      phone: '02-1234-5678',
      business_number: '123-45-67890',
      latitude: 37.5665,
      longitude: 126.9780,
      thumbnail_image: '/images/stores/store1-thumb.jpg',
      images: ['/images/stores/store1-1.jpg', '/images/stores/store1-2.jpg'],
      operating_hours: {
        monday: { open: '11:00', close: '22:00', is_closed: false },
        tuesday: { open: '11:00', close: '22:00', is_closed: false },
        wednesday: { open: '11:00', close: '22:00', is_closed: false },
        thursday: { open: '11:00', close: '22:00', is_closed: false },
        friday: { open: '11:00', close: '23:00', is_closed: false },
        saturday: { open: '11:00', close: '23:00', is_closed: false },
        sunday: { open: '11:00', close: '21:00', is_closed: false }
      },
      break_time: {
        start: '15:00',
        end: '17:00'
      },
      amenities: ['주차가능', 'WiFi', '단체석', '포장가능'],
      payment_methods: ['현금', '카드', '계좌이체'],
      parking_available: true,
      wifi_available: true,
      pet_friendly: false,
      status: StoreStatus.APPROVED,
      approved_at: new Date(),
      owner_id: owner1.id,
      rating: 4.5,
      review_count: 128,
      total_reservations: 256
    }
  })

  const store2 = await prisma.store.create({
    data: {
      name: '이탈리아 파스타 하우스',
      slug: 'italian-pasta-house',
      category: StoreCategory.WESTERN,
      description: '정통 이탈리아 파스타와 피자를 맛볼 수 있는 레스토랑입니다.',
      address: '서울특별시 강남구 강남대로 456',
      detailed_address: '2층',
      postal_code: '06292',
      phone: '02-2345-6789',
      business_number: '234-56-78901',
      latitude: 37.5679,
      longitude: 126.9750,
      thumbnail_image: '/images/stores/store2-thumb.jpg',
      images: ['/images/stores/store2-1.jpg'],
      operating_hours: {
        monday: { open: '11:30', close: '22:00', is_closed: false },
        tuesday: { open: '11:30', close: '22:00', is_closed: false },
        wednesday: { open: '11:30', close: '22:00', is_closed: false },
        thursday: { open: '11:30', close: '22:00', is_closed: false },
        friday: { open: '11:30', close: '22:30', is_closed: false },
        saturday: { open: '11:30', close: '22:30', is_closed: false },
        sunday: { open: '11:30', close: '21:30', is_closed: false }
      },
      amenities: ['WiFi', '데이트코스', '단체석'],
      payment_methods: ['현금', '카드'],
      parking_available: false,
      wifi_available: true,
      pet_friendly: false,
      status: StoreStatus.APPROVED,
      approved_at: new Date(),
      owner_id: owner2.id,
      rating: 4.2,
      review_count: 89,
      total_reservations: 167
    }
  })

  const store3 = await prisma.store.create({
    data: {
      name: '힐링 카페',
      slug: 'healing-cafe',
      category: StoreCategory.CAFE,
      description: '조용하고 아늑한 분위기의 카페입니다. 디저트와 음료가 맛있습니다.',
      address: '서울특별시 서초구 서초대로 789',
      phone: '02-3456-7890',
      business_number: '345-67-89012',
      latitude: 37.4957,
      longitude: 127.0275,
      operating_hours: {
        monday: { open: '08:00', close: '22:00', is_closed: false },
        tuesday: { open: '08:00', close: '22:00', is_closed: false },
        wednesday: { open: '08:00', close: '22:00', is_closed: false },
        thursday: { open: '08:00', close: '22:00', is_closed: false },
        friday: { open: '08:00', close: '23:00', is_closed: false },
        saturday: { open: '09:00', close: '23:00', is_closed: false },
        sunday: { open: '09:00', close: '22:00', is_closed: false }
      },
      amenities: ['WiFi', '콘센트', '조용한분위기', '디저트'],
      payment_methods: ['현금', '카드', '모바일결제'],
      parking_available: true,
      wifi_available: true,
      pet_friendly: true,
      status: StoreStatus.PENDING,
      owner_id: owner3.id,
      rating: 0,
      review_count: 0,
      total_reservations: 0
    }
  })

  // Create tables for stores
  console.log('🪑 Creating tables for stores...')
  
  // Store 1 tables
  const store1Tables = []
  for (let i = 1; i <= 8; i++) {
    const table = await prisma.table.create({
      data: {
        store_id: store1.id,
        table_number: `T${i.toString().padStart(2, '0')}`,
        capacity: i <= 4 ? 4 : i <= 6 ? 2 : 6,
        table_type: i <= 4 ? TableType.SQUARE : i <= 6 ? TableType.ROUND : TableType.SQUARE,
        position_x: (i - 1) % 4,
        position_y: Math.floor((i - 1) / 4)
      }
    })
    store1Tables.push(table)
  }

  // Store 2 tables
  const store2Tables = []
  for (let i = 1; i <= 6; i++) {
    const table = await prisma.table.create({
      data: {
        store_id: store2.id,
        table_number: `테이블${i}`,
        capacity: i <= 3 ? 2 : 4,
        table_type: i <= 3 ? TableType.ROUND : TableType.SQUARE,
        position_x: (i - 1) % 3,
        position_y: Math.floor((i - 1) / 3)
      }
    })
    store2Tables.push(table)
  }

  // Store 3 tables (cafe)
  for (let i = 1; i <= 10; i++) {
    await prisma.table.create({
      data: {
        store_id: store3.id,
        table_number: `좌석${i}`,
        capacity: i <= 6 ? 2 : 4,
        table_type: i <= 6 ? TableType.ROUND : TableType.SQUARE,
        position_x: (i - 1) % 5,
        position_y: Math.floor((i - 1) / 5)
      }
    })
  }

  // Create menu categories and items
  console.log('🍽️ Creating menu categories and items...')
  
  // Store 1 menu (Korean restaurant)
  const koreanMainCategory = await prisma.menuCategory.create({
    data: {
      store_id: store1.id,
      name: '구이류',
      description: '신선한 고기 구이 메뉴',
      sort_order: 1
    }
  })

  const koreanSideCategory = await prisma.menuCategory.create({
    data: {
      store_id: store1.id,
      name: '사이드메뉴',
      description: '구이와 함께 즐기는 사이드메뉴',
      sort_order: 2
    }
  })

  await prisma.menuItem.createMany({
    data: [
      {
        category_id: koreanMainCategory.id,
        name: '삼겹살',
        description: '신선한 국내산 삼겹살',
        price: 15000,
        is_recommended: true,
        sort_order: 1
      },
      {
        category_id: koreanMainCategory.id,
        name: '목살',
        description: '부드러운 목살',
        price: 16000,
        sort_order: 2
      },
      {
        category_id: koreanMainCategory.id,
        name: '갈비살',
        description: '마블링이 좋은 갈비살',
        price: 18000,
        sort_order: 3
      },
      {
        category_id: koreanSideCategory.id,
        name: '김치찌개',
        description: '얼큰한 김치찌개',
        price: 8000,
        sort_order: 1
      },
      {
        category_id: koreanSideCategory.id,
        name: '된장찌개',
        description: '구수한 된장찌개',
        price: 7000,
        sort_order: 2
      }
    ]
  })

  // Store 2 menu (Italian restaurant)
  const pastaCategory = await prisma.menuCategory.create({
    data: {
      store_id: store2.id,
      name: '파스타',
      description: '정통 이탈리아 파스타',
      sort_order: 1
    }
  })

  const pizzaCategory = await prisma.menuCategory.create({
    data: {
      store_id: store2.id,
      name: '피자',
      description: '수제 화덕 피자',
      sort_order: 2
    }
  })

  await prisma.menuItem.createMany({
    data: [
      {
        category_id: pastaCategory.id,
        name: '카르보나라',
        description: '크림소스 베이컨 파스타',
        price: 16000,
        is_recommended: true,
        sort_order: 1
      },
      {
        category_id: pastaCategory.id,
        name: '알리오 올리오',
        description: '갈릭 오일 파스타',
        price: 14000,
        sort_order: 2
      },
      {
        category_id: pizzaCategory.id,
        name: '마르게리타',
        description: '토마토, 모짜렐라, 바질',
        price: 18000,
        is_recommended: true,
        sort_order: 1
      },
      {
        category_id: pizzaCategory.id,
        name: '페퍼로니',
        description: '페퍼로니와 치즈',
        price: 20000,
        sort_order: 2
      }
    ]
  })

  // Create test reservations
  console.log('📅 Creating test reservations...')
  const allCustomers = await prisma.user.findMany({
    where: { user_type: UserType.CUSTOMER }
  })

  if (allCustomers.length > 0 && store1Tables.length > 0) {
    // Past completed reservation
    const pastReservation = await prisma.reservation.create({
      data: {
        reservation_number: `RES-${Date.now()}-001`,
        store_id: store1.id,
        customer_id: allCustomers[0].id,
        table_id: store1Tables[0].id,
        reservation_date: new Date('2025-09-01'),
        reservation_time: new Date('1970-01-01T19:00:00'),
        party_size: 4,
        special_requests: '창가 자리 희망합니다',
        status: ReservationStatus.COMPLETED,
        confirmed_at: new Date('2025-08-31T10:00:00'),
        completed_at: new Date('2025-09-01T21:00:00'),
        deposit_amount: 0
      }
    })

    // Future confirmed reservation
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 3)
    
    await prisma.reservation.create({
      data: {
        reservation_number: `RES-${Date.now()}-002`,
        store_id: store1.id,
        customer_id: allCustomers[1] ? allCustomers[1].id : allCustomers[0].id,
        table_id: store1Tables[1].id,
        reservation_date: futureDate,
        reservation_time: new Date('1970-01-01T18:30:00'),
        party_size: 2,
        status: ReservationStatus.CONFIRMED,
        confirmed_at: new Date(),
        deposit_amount: 10000
      }
    })

    // Pending reservation
    const pendingDate = new Date()
    pendingDate.setDate(pendingDate.getDate() + 1)
    
    await prisma.reservation.create({
      data: {
        reservation_number: `RES-${Date.now()}-003`,
        store_id: store2.id,
        customer_id: allCustomers[2] ? allCustomers[2].id : allCustomers[0].id,
        table_id: store2Tables[0].id,
        reservation_date: pendingDate,
        reservation_time: new Date('1970-01-01T20:00:00'),
        party_size: 3,
        special_requests: '생일 축하 케이크 준비 부탁드립니다',
        status: ReservationStatus.PENDING,
        deposit_amount: 0
      }
    })

    // Create review for completed reservation
    console.log('⭐ Creating test reviews...')
    await prisma.review.create({
      data: {
        store_id: store1.id,
        customer_id: allCustomers[0].id,
        reservation_id: pastReservation.id,
        rating: 5,
        comment: '정말 맛있었어요! 삼겹살이 신선하고 직원분들도 친절하셨습니다. 다음에도 꼭 다시 오겠어요.',
        food_rating: 5,
        service_rating: 4,
        atmosphere_rating: 4,
        price_rating: 4,
        images: ['/images/reviews/review1-1.jpg']
      }
    })
  }

  // Create test notifications
  console.log('🔔 Creating test notifications...')
  if (allCustomers.length > 0) {
    await prisma.notification.createMany({
      data: [
        {
          user_id: allCustomers[0].id,
          type: 'RESERVATION_CONFIRMED',
          title: '예약이 확정되었습니다',
          message: '맛있는 삼겹살집에서의 예약이 확정되었습니다.',
          data: { reservation_id: 'some-id' },
          is_read: false
        },
        {
          user_id: allCustomers[0].id,
          type: 'REVIEW_REQUEST',
          title: '리뷰를 작성해주세요',
          message: '방문하신 매장은 어떠셨나요? 리뷰를 남겨주세요.',
          is_read: true,
          read_at: new Date()
        }
      ]
    })
  }

  console.log('✅ Database seeding completed successfully!')
  console.log(`
📊 Created:
- 👥 Users: ${allUsers.length} (${allCustomers.length} customers, 3 owners)
- 🏪 Stores: 3 (2 approved, 1 pending)
- 🪑 Tables: 24 total
- 🍽️ Menu categories: 4
- 📱 Menu items: 9
- 📅 Reservations: 3
- ⭐ Reviews: 1
- 🔔 Notifications: 2
- ⚙️ App configs: 4
`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })