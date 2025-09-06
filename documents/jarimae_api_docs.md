# 🌐 자리매 API 명세서

**프로젝트**: 자리매 (소상공인 예약 플랫폼)  
**작성일**: 2025-09-05  
**버전**: v1.0  
**목적**: Next.js 14 API Routes 구현 가이드  
**Base URL**: `https://jarimae.vercel.app/api`

---

## 📋 **API 개요**

### **설계 원칙**
- **RESTful**: 표준 HTTP 메소드 사용
- **일관성**: 통일된 응답 구조
- **보안**: JWT 기반 인증 및 역할 기반 접근 제어
- **성능**: 적절한 캐싱 및 페이지네이션
- **확장성**: 버전 관리 및 모듈화 설계

### **공통 응답 구조**
```typescript
// 성공 응답
interface ApiResponse<T> {
  success: true
  data: T
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

// 에러 응답
interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
    field?: string  // 유효성 검사 오류시
  }
}
```

### **HTTP 상태 코드**
- `200` OK - 성공
- `201` Created - 생성 성공
- `400` Bad Request - 잘못된 요청
- `401` Unauthorized - 인증 실패
- `403` Forbidden - 권한 없음
- `404` Not Found - 리소스 없음
- `422` Unprocessable Entity - 유효성 검사 실패
- `500` Internal Server Error - 서버 오류

---

## 🔐 **인증 API**

### **회원가입**
```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```typescript
{
  email: string          // 이메일 (유니크)
  password: string       // 비밀번호 (최소 8자)
  name: string          // 실명
  nickname?: string     // 닉네임 (고객용)
  phone: string         // 휴대폰 번호 (010-0000-0000)
  user_type: 'customer' | 'owner'  // 사용자 유형
  address?: string      // 주소 (고객용)
  business_number?: string  // 사업자등록번호 (사장님용)
  terms_agreed: boolean // 약관 동의
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    user: {
      id: string
      email: string
      name: string
      user_type: string
      phone: string
      created_at: string
    },
    tokens: {
      access_token: string
      refresh_token: string
    }
  },
  message: "회원가입이 완료되었습니다."
}
```

**에러 응답:**
```typescript
// 400 - 이메일 중복
{
  success: false,
  error: {
    code: "EMAIL_ALREADY_EXISTS",
    message: "이미 사용중인 이메일입니다.",
    field: "email"
  }
}

// 422 - 유효성 검사 실패
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "입력 정보를 확인해주세요.",
    details: {
      phone: "올바른 휴대폰 번호를 입력해주세요.",
      password: "비밀번호는 최소 8자 이상이어야 합니다."
    }
  }
}
```

### **로그인**
```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```typescript
{
  email: string
  password: string
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    user: {
      id: string
      email: string
      name: string
      nickname?: string
      user_type: 'customer' | 'owner'
      profile_image?: string
    },
    tokens: {
      access_token: string
      refresh_token: string
    }
  },
  message: "로그인 성공"
}
```

### **SMS 인증**
```http
POST /api/auth/verify-sms
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  phone: string     // 인증할 휴대폰 번호
  code?: string     // 인증 코드 (검증시)
}
```

**SMS 발송 Response (200 OK):**
```typescript
{
  success: true,
  data: {
    verification_id: string
    expires_at: string
  },
  message: "인증번호가 발송되었습니다."
}
```

**인증 확인 Response (200 OK):**
```typescript
{
  success: true,
  data: {
    verified: boolean
  },
  message: "휴대폰 인증이 완료되었습니다."
}
```

### **로그아웃**
```http
POST /api/auth/logout
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  message: "로그아웃 되었습니다."
}
```

### **토큰 갱신**
```http
POST /api/auth/refresh
Content-Type: application/json
```

**Request Body:**
```typescript
{
  refresh_token: string
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    access_token: string
    refresh_token: string
  }
}
```

---

## 🏪 **매장 관리 API**

### **매장 목록 조회**
```http
GET /api/stores?page=1&limit=20&category=korean&location=gangnam&search=삼겹살
```

**Query Parameters:**
- `page` (number): 페이지 번호 (기본값: 1)
- `limit` (number): 페이지당 항목 수 (기본값: 20, 최대: 50)
- `category` (string): 카테고리 필터
- `location` (string): 지역 필터
- `search` (string): 검색어
- `sort` (string): 정렬 ('rating', 'distance', 'price', 'newest')

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    stores: [
      {
        id: string
        name: string
        category: string
        description: string
        address: string
        phone: string
        rating: number
        review_count: number
        thumbnail_image?: string
        operating_hours: {
          monday: { open: string, close: string, is_closed: boolean }
          // ... 다른 요일들
        }
        distance?: number  // 사용자 위치 기준 (미터)
        is_open: boolean   // 현재 영업 여부
        min_order_amount?: number
        delivery_fee?: number
      }
    ]
  },
  meta: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8
  }
}
```

### **매장 상세 조회**
```http
GET /api/stores/{store_id}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    store: {
      id: string
      name: string
      category: string
      description: string
      address: string
      detailed_address: string
      phone: string
      business_number: string
      rating: number
      review_count: number
      images: string[]
      operating_hours: {
        monday: { open: string, close: string, is_closed: boolean }
        // ... 모든 요일
      }
      break_time?: {
        start: string
        end: string
      }
      amenities: string[]  // ["주차가능", "WiFi", "반려동물동반"]
      payment_methods: string[]  // ["현금", "카드", "계좌이체"]
      location: {
        latitude: number
        longitude: number
      }
      menu_categories: [
        {
          id: string
          name: string
          items: [
            {
              id: string
              name: string
              price: number
              description?: string
              image?: string
              is_available: boolean
            }
          ]
        }
      ]
      tables: [
        {
          id: string
          table_number: string
          capacity: number
          table_type: 'round' | 'square' | 'bar'
          status: 'available' | 'reserved' | 'occupied'
          position: { x: number, y: number }
        }
      ]
      recent_reviews: [
        {
          id: string
          customer_name: string
          rating: number
          comment: string
          created_at: string
          images?: string[]
        }
      ]
    }
  }
}
```

### **매장 등록**
```http
POST /api/stores
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  name: string
  category: string
  description: string
  address: string
  detailed_address: string
  phone: string
  business_number: string
  operating_hours: {
    monday: { open: string, close: string, is_closed: boolean }
    // ... 모든 요일
  }
  break_time?: {
    start: string
    end: string
  }
  approval_type: 'auto' | 'manual'  // 승인 방식 선택
  amenities?: string[]
  payment_methods?: string[]
  location: {
    latitude: number
    longitude: number
  }
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    store: {
      id: string
      name: string
      status: 'pending' | 'approved'  // approval_type에 따라
      approval_type: string
      estimated_approval_time?: string  // manual인 경우
    }
  },
  message: "매장 등록이 완료되었습니다."
}
```

### **매장 정보 수정**
```http
PUT /api/stores/{store_id}
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:** (매장 등록과 동일, 부분 업데이트 가능)

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    store: {
      id: string
      name: string
      updated_at: string
    }
  },
  message: "매장 정보가 업데이트되었습니다."
}
```

### **매장 승인 상태 변경** (관리자 전용)
```http
PUT /api/stores/{store_id}/status
Content-Type: application/json
Authorization: Bearer {admin_token}
```

**Request Body:**
```typescript
{
  status: 'approved' | 'rejected'
  rejection_reason?: string
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    store_id: string
    status: string
    updated_at: string
  },
  message: "매장 승인 상태가 변경되었습니다."
}
```

---

## 🪑 **테이블 관리 API**

### **매장 테이블 목록**
```http
GET /api/stores/{store_id}/tables
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    tables: [
      {
        id: string
        table_number: string
        capacity: number
        table_type: 'round' | 'square' | 'bar'
        status: 'available' | 'reserved' | 'occupied'
        position: { x: number, y: number }
        current_reservation?: {
          id: string
          customer_name: string
          start_time: string
          end_time: string
        }
      }
    ],
    layout: {
      width: number
      height: number
      background_image?: string
    }
  }
}
```

### **테이블 추가**
```http
POST /api/stores/{store_id}/tables
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  table_number: string
  capacity: number
  table_type: 'round' | 'square' | 'bar'
  position: { x: number, y: number }
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    table: {
      id: string
      table_number: string
      capacity: number
      table_type: string
      position: { x: number, y: number }
      status: 'available'
    }
  },
  message: "테이블이 추가되었습니다."
}
```

### **테이블 상태 변경**
```http
PUT /api/tables/{table_id}/status
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  status: 'available' | 'reserved' | 'occupied'
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    table_id: string
    status: string
    updated_at: string
  },
  message: "테이블 상태가 변경되었습니다."
}
```

---

## 📅 **예약 관리 API**

### **예약 목록 조회**
```http
GET /api/reservations?page=1&limit=20&status=confirmed&store_id={store_id}
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`, `limit`: 페이지네이션
- `status`: 예약 상태 ('pending', 'confirmed', 'cancelled', 'completed')
- `store_id`: 특정 매장 예약만 조회 (사장님용)
- `date`: 특정 날짜 예약 (YYYY-MM-DD)

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    reservations: [
      {
        id: string
        store: {
          id: string
          name: string
          address: string
          phone: string
        }
        customer: {
          id: string
          name: string
          phone: string
        }
        table: {
          id: string
          table_number: string
        }
        reservation_date: string  // YYYY-MM-DD
        reservation_time: string  // HH:mm
        party_size: number
        special_requests?: string
        status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
        deposit_amount: number
        payment_status: 'pending' | 'paid' | 'refunded'
        created_at: string
        updated_at: string
      }
    ]
  },
  meta: {
    page: 1,
    limit: 20,
    total: 45,
    totalPages: 3
  }
}
```

### **예약 생성**
```http
POST /api/reservations
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  store_id: string
  table_id?: string           // 특정 테이블 지정 (선택사항)
  reservation_date: string    // YYYY-MM-DD
  reservation_time: string    // HH:mm
  party_size: number
  special_requests?: string
  deposit_amount?: number     // 예약금 (기본값: 0)
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    reservation: {
      id: string
      reservation_number: string  // 예약번호 (고객 확인용)
      store: {
        id: string
        name: string
        address: string
        phone: string
      }
      table?: {
        id: string
        table_number: string
      }
      reservation_date: string
      reservation_time: string
      party_size: number
      status: 'pending'
      deposit_amount: number
      payment_url?: string      // 결제 URL (예약금 있는 경우)
      estimated_confirmation_time: string
    }
  },
  message: "예약 신청이 완료되었습니다."
}
```

### **예약 상세 조회**
```http
GET /api/reservations/{reservation_id}
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    reservation: {
      id: string
      reservation_number: string
      store: {
        id: string
        name: string
        category: string
        address: string
        phone: string
        thumbnail_image?: string
      }
      customer: {
        id: string
        name: string
        phone: string
      }
      table?: {
        id: string
        table_number: string
        capacity: number
      }
      reservation_date: string
      reservation_time: string
      party_size: number
      special_requests?: string
      status: string
      deposit_amount: number
      payment_status: string
      created_at: string
      updated_at: string
      cancellation_reason?: string
      can_cancel: boolean       // 취소 가능 여부
      can_modify: boolean       // 수정 가능 여부
    }
  }
}
```

### **예약 상태 변경**
```http
PUT /api/reservations/{reservation_id}/status
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  status: 'confirmed' | 'cancelled' | 'completed'
  reason?: string             // 취소/거절 사유
  assigned_table_id?: string  // 승인시 테이블 배정
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    reservation: {
      id: string
      status: string
      assigned_table?: {
        id: string
        table_number: string
      }
      updated_at: string
    }
  },
  message: "예약 상태가 변경되었습니다."
}
```

### **예약 취소**
```http
DELETE /api/reservations/{reservation_id}
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  reason: string    // 취소 사유
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    reservation_id: string
    status: 'cancelled'
    refund_amount: number     // 환불 금액
    refund_method: string     // 환불 방법
    estimated_refund_time: string
  },
  message: "예약이 취소되었습니다."
}
```

---

## 👤 **사용자 관리 API**

### **프로필 조회**
```http
GET /api/users/profile
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    user: {
      id: string
      email: string
      name: string
      nickname?: string
      phone: string
      user_type: 'customer' | 'owner'
      profile_image?: string
      address?: string
      phone_verified: boolean
      email_verified: boolean
      created_at: string
      preferences?: {
        notification_sms: boolean
        notification_email: boolean
        marketing_consent: boolean
      }
    }
  }
}
```

### **프로필 수정**
```http
PUT /api/users/profile
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  name?: string
  nickname?: string
  address?: string
  profile_image?: string
  preferences?: {
    notification_sms: boolean
    notification_email: boolean
    marketing_consent: boolean
  }
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    user: {
      id: string
      name: string
      nickname?: string
      updated_at: string
    }
  },
  message: "프로필이 업데이트되었습니다."
}
```

### **특정 사용자 조회** (관리자 전용)
```http
GET /api/users/{user_id}
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    user: {
      id: string
      email: string
      name: string
      user_type: string
      phone: string
      phone_verified: boolean
      email_verified: boolean
      created_at: string
      last_login_at?: string
      reservation_count: number
      total_spent: number
    }
  }
}
```

---

## ⭐ **리뷰 관리 API**

### **매장 리뷰 목록**
```http
GET /api/stores/{store_id}/reviews?page=1&limit=20&sort=newest
```

**Query Parameters:**
- `page`, `limit`: 페이지네이션
- `sort`: 정렬 ('newest', 'oldest', 'rating_high', 'rating_low')

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    reviews: [
      {
        id: string
        customer: {
          name: string           // 익명화된 이름 (김**)
          profile_image?: string
        }
        reservation: {
          id: string
          reservation_date: string
        }
        rating: number           // 1-5점
        comment: string
        images?: string[]
        created_at: string
        store_reply?: {
          comment: string
          created_at: string
        }
      }
    ]
  },
  meta: {
    page: 1,
    limit: 20,
    total: 123,
    totalPages: 7,
    average_rating: 4.2
  }
}
```

### **리뷰 작성**
```http
POST /api/reviews
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  reservation_id: string
  rating: number           // 1-5점
  comment: string
  images?: string[]        // 이미지 URL 배열
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    review: {
      id: string
      rating: number
      comment: string
      created_at: string
    }
  },
  message: "리뷰가 등록되었습니다."
}
```

### **리뷰 답글 작성** (매장 사장님 전용)
```http
POST /api/reviews/{review_id}/reply
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  comment: string
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    reply: {
      id: string
      comment: string
      created_at: string
    }
  },
  message: "답글이 등록되었습니다."
}
```

---

## 📊 **통계 및 대시보드 API**

### **고객 대시보드 데이터**
```http
GET /api/dashboard/customer
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    summary: {
      total_reservations: number
      completed_reservations: number
      cancelled_reservations: number
      total_spent: number
    },
    recent_reservations: [
      {
        id: string
        store_name: string
        reservation_date: string
        status: string
      }
    ],
    favorite_stores: [
      {
        id: string
        name: string
        visit_count: number
        last_visit: string
      }
    ],
    recommendations: [
      {
        id: string
        name: string
        category: string
        rating: number
        reason: string  // 추천 이유
      }
    ]
  }
}
```

### **매장 사장님 대시보드 데이터**
```http
GET /api/dashboard/partner?store_id={store_id}&period=week
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `store_id`: 매장 ID
- `period`: 기간 ('today', 'week', 'month')

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    summary: {
      today_reservations: number
      pending_reservations: number
      total_revenue: number
      table_occupancy_rate: number
    },
    reservations_by_status: {
      pending: number
      confirmed: number
      completed: number
      cancelled: number
    },
    daily_stats: [
      {
        date: string
        reservations: number
        revenue: number
        cancellation_rate: number
      }
    ],
    popular_times: [
      {
        hour: number
        reservation_count: number
      }
    ],
    recent_reviews: [
      {
        id: string
        customer_name: string
        rating: number
        comment: string
        needs_reply: boolean
      }
    ]
  }
}
```

---

## 🔔 **알림 관리 API**

### **알림 목록 조회**
```http
GET /api/notifications?page=1&limit=20&type=reservation
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page`, `limit`: 페이지네이션
- `type`: 알림 타입 ('reservation', 'review', 'promotion', 'system')
- `unread_only`: true일 경우 읽지 않은 알림만

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    notifications: [
      {
        id: string
        type: 'reservation' | 'review' | 'promotion' | 'system'
        title: string
        message: string
        data?: any           // 추가 데이터 (예약 ID 등)
        is_read: boolean
        created_at: string
      }
    ],
    unread_count: number
  },
  meta: {
    page: 1,
    limit: 20,
    total: 67,
    totalPages: 4
  }
}
```

### **알림 읽음 처리**
```http
PUT /api/notifications/{notification_id}/read
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    notification_id: string
    is_read: true
  }
}
```

### **모든 알림 읽음 처리**
```http
PUT /api/notifications/read-all
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    updated_count: number
  },
  message: "모든 알림을 읽음 처리했습니다."
}
```

---

## 🗺️ **지도 및 검색 API**

### **주변 매장 검색**
```http
GET /api/stores/nearby?lat=37.5665&lng=126.9780&radius=2000&category=korean
```

**Query Parameters:**
- `lat`, `lng`: 위도, 경도
- `radius`: 반경 (미터, 기본값: 1000, 최대: 5000)
- `category`: 카테고리 필터
- `limit`: 결과 수 제한 (기본값: 20)

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    stores: [
      {
        id: string
        name: string
        category: string
        address: string
        distance: number      // 미터 단위
        rating: number
        review_count: number
        is_open: boolean
        location: {
          latitude: number
          longitude: number
        }
        estimated_wait_time?: number  // 분 단위
      }
    ],
    center: {
      latitude: number
      longitude: number
    }
  }
}
```

### **주소 검색**
```http
GET /api/search/address?query=강남구 테헤란로
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    addresses: [
      {
        address: string
        detailed_address: string
        postal_code: string
        location: {
          latitude: number
          longitude: number
        }
      }
    ]
  }
}
```

---

## 📋 **시스템 관리 API** (관리자 전용)

### **시스템 통계**
```http
GET /api/admin/stats?period=month
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    overview: {
      total_users: number
      total_stores: number
      total_reservations: number
      monthly_revenue: number
      growth_rate: number
    },
    user_stats: {
      new_customers: number
      new_store_owners: number
      active_users: number
      retention_rate: number
    },
    store_stats: {
      pending_approvals: number
      approved_stores: number
      rejected_stores: number
      average_rating: number
    },
    reservation_stats: {
      total_reservations: number
      confirmed_reservations: number
      cancelled_reservations: number
      completion_rate: number
    },
    revenue_by_day: [
      {
        date: string
        revenue: number
        transaction_count: number
      }
    ]
  }
}
```

### **매장 승인 대기 목록**
```http
GET /api/admin/stores/pending?page=1&limit=20
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    stores: [
      {
        id: string
        name: string
        category: string
        owner_name: string
        owner_phone: string
        business_number: string
        address: string
        submitted_at: string
        documents: {
          business_license?: string
          id_card?: string
          bank_account?: string
        }
      }
    ]
  },
  meta: {
    page: 1,
    limit: 20,
    total: 15,
    totalPages: 1
  }
}
```

---

## 📧 **외부 서비스 연동 API**

### **SMS 발송**
```http
POST /api/external/sms
Content-Type: application/json
Authorization: Bearer {service_token}
```

**Request Body:**
```typescript
{
  to: string              // 수신 번호
  message: string         // 메시지 내용
  type: 'verification' | 'notification' | 'marketing'
  reservation_id?: string // 예약 관련 SMS인 경우
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    message_id: string
    status: 'sent' | 'failed'
    cost: number
    sent_at: string
  }
}
```

### **이메일 발송**
```http
POST /api/external/email
Content-Type: application/json
Authorization: Bearer {service_token}
```

**Request Body:**
```typescript
{
  to: string
  subject: string
  template: 'reservation_confirmation' | 'welcome' | 'password_reset'
  data: Record<string, any>  // 템플릿 변수
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    email_id: string
    status: 'sent' | 'failed'
    sent_at: string
  }
}
```

---

## 💰 **결제 시스템 API** (추후 구현)

### **결제 생성** (더미 구현)
```http
POST /api/payments
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```typescript
{
  reservation_id: string
  amount: number
  payment_method: 'card' | 'transfer' | 'virtual_account'
  return_url: string     // 결제 완료 후 리턴 URL
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    payment: {
      id: string
      amount: number
      status: 'pending'
      payment_url: string    // 더미 결제 페이지 URL
      expires_at: string
    }
  }
}
```

### **결제 상태 확인**
```http
GET /api/payments/{payment_id}
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    payment: {
      id: string
      reservation_id: string
      amount: number
      status: 'pending' | 'completed' | 'failed' | 'cancelled'
      payment_method: string
      paid_at?: string
      receipt_url?: string
    }
  }
}
```

---

## 🔧 **미들웨어 및 보안**

### **인증 미들웨어**
```typescript
// middleware/auth.ts
export function withAuth(handler: ApiHandler) {
  return async (req: NextRequest) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_TOKEN', message: '인증 토큰이 필요합니다.' } },
        { status: 401 }
      )
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      req.user = decoded
      return handler(req)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TOKEN', message: '유효하지 않은 토큰입니다.' } },
        { status: 401 }
      )
    }
  }
}
```

### **권한 체크 미들웨어**
```typescript
// middleware/rbac.ts
export function withRole(roles: string[]) {
  return function(handler: ApiHandler) {
    return withAuth(async (req: NextRequest) => {
      const userRole = req.user.user_type
      
      if (!roles.includes(userRole)) {
        return NextResponse.json(
          { success: false, error: { code: 'INSUFFICIENT_PERMISSIONS', message: '권한이 없습니다.' } },
          { status: 403 }
        )
      }
      
      return handler(req)
    })
  }
}
```

### **요청 검증 미들웨어**
```typescript
// middleware/validation.ts
import { ZodSchema } from 'zod'

export function withValidation(schema: ZodSchema) {
  return function(handler: ApiHandler) {
    return async (req: NextRequest) => {
      try {
        const body = await req.json()
        const validatedData = schema.parse(body)
        req.validatedData = validatedData
        return handler(req)
      } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: '입력 데이터가 올바르지 않습니다.',
                details: error.errors.reduce((acc, err) => {
                  acc[err.path.join('.')] = err.message
                  return acc
                }, {})
              }
            },
            { status: 422 }
          )
        }
        throw error
      }
    }
  }
}
```

### **속도 제한 미들웨어**
```typescript
// middleware/rateLimit.ts
const rateLimitMap = new Map()

export function withRateLimit(maxRequests: number, windowMs: number) {
  return function(handler: ApiHandler) {
    return async (req: NextRequest) => {
      const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
      const now = Date.now()
      const windowStart = now - windowMs
      
      const requests = rateLimitMap.get(ip) || []
      const validRequests = requests.filter((time: number) => time > windowStart)
      
      if (validRequests.length >= maxRequests) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
            }
          },
          { status: 429 }
        )
      }
      
      validRequests.push(now)
      rateLimitMap.set(ip, validRequests)
      
      return handler(req)
    }
  }
}
```

---

## 📊 **API 사용 예시**

### **예약 플로우 시나리오**

#### **1. 고객이 매장 검색**
```javascript
// 주변 매장 검색
const response = await fetch('/api/stores/nearby?lat=37.5665&lng=126.9780&radius=1000', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})

const { data } = await response.json()
console.log(data.stores)
```

#### **2. 매장 상세 정보 조회**
```javascript
const storeResponse = await fetch(`/api/stores/${storeId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})

const { data: storeData } = await storeResponse.json()
console.log(storeData.store)
```

#### **3. 예약 신청**
```javascript
const reservationResponse = await fetch('/api/reservations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    store_id: storeId,
    reservation_date: '2025-09-10',
    reservation_time: '19:00',
    party_size: 4,
    special_requests: '창가 자리 희망'
  })
})

const { data: reservationData } = await reservationResponse.json()
console.log(reservationData.reservation)
```

#### **4. 예약 상태 확인**
```javascript
const statusResponse = await fetch(`/api/reservations/${reservationId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})

const { data: statusData } = await statusResponse.json()
console.log(statusData.reservation.status)
```

### **매장 관리자 플로우 시나리오**

#### **1. 매장 등록**
```javascript
const storeResponse = await fetch('/api/stores', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    name: '맛있는 삼겹살집',
    category: 'korean',
    description: '신선한 삼겹살을 제공하는 맛집입니다.',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    business_number: '123-45-67890',
    approval_type: 'auto',
    operating_hours: {
      monday: { open: '11:00', close: '22:00', is_closed: false },
      // ... 다른 요일들
    },
    location: {
      latitude: 37.5665,
      longitude: 126.9780
    }
  })
})
```

#### **2. 예약 승인/거절**
```javascript
const approvalResponse = await fetch(`/api/reservations/${reservationId}/status`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    status: 'confirmed',
    assigned_table_id: 'table_001'
  })
})
```

#### **3. 대시보드 데이터 조회**
```javascript
const dashboardResponse = await fetch(`/api/dashboard/partner?store_id=${storeId}&period=week`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})

const { data: dashboardData } = await dashboardResponse.json()
console.log(dashboardData.summary)
```

---

## ⚡ **성능 최적화**

### **캐싱 전략**
```typescript
// lib/cache.ts
import { unstable_cache } from 'next/cache'

// 매장 목록 캐싱 (5분)
export const getCachedStores = unstable_cache(
  async (filters: StoreFilters) => {
    return await getStores(filters)
  },
  ['stores'],
  { revalidate: 300 }
)

// 매장 상세 캐싱 (10분)
export const getCachedStore = unstable_cache(
  async (storeId: string) => {
    return await getStore(storeId)
  },
  ['store'],
  { revalidate: 600 }
)
```

### **데이터베이스 최적화**
```sql
-- 성능을 위한 인덱스
CREATE INDEX idx_stores_location ON stores USING GIST (location);
CREATE INDEX idx_reservations_date_status ON reservations (reservation_date, status);
CREATE INDEX idx_reservations_store_date ON reservations (store_id, reservation_date);
CREATE INDEX idx_reviews_store_rating ON reviews (store_id, rating);
```

### **페이지네이션 최적화**
```typescript
// 커서 기반 페이지네이션 (대량 데이터용)
interface CursorPagination {
  cursor?: string
  limit: number
  sort: 'asc' | 'desc'
}

export async function getReservationsWithCursor(params: CursorPagination) {
  const query = {
    take: params.limit,
    orderBy: { created_at: params.sort },
    ...(params.cursor && {
      cursor: { id: params.cursor },
      skip: 1
    })
  }
  
  const reservations = await prisma.reservation.findMany(query)
  
  return {
    data: reservations,
    next_cursor: reservations.length === params.limit 
      ? reservations[reservations.length - 1].id 
      : null
  }
}
```

---

## 🚨 **에러 처리 가이드**

### **공통 에러 코드**
```typescript
enum ErrorCodes {
  // 인증 관련
  NO_TOKEN = 'NO_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // 사용자 관련
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // 매장 관련
  STORE_NOT_FOUND = 'STORE_NOT_FOUND',
  STORE_NOT_APPROVED = 'STORE_NOT_APPROVED',
  UNAUTHORIZED_STORE_ACCESS = 'UNAUTHORIZED_STORE_ACCESS',
  
  // 예약 관련
  RESERVATION_NOT_FOUND = 'RESERVATION_NOT_FOUND',
  TABLE_NOT_AVAILABLE = 'TABLE_NOT_AVAILABLE',
  INVALID_RESERVATION_TIME = 'INVALID_RESERVATION_TIME',
  RESERVATION_DEADLINE_PASSED = 'RESERVATION_DEADLINE_PASSED',
  
  // 시스템 관련
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR'
}
```

### **글로벌 에러 핸들러**
```typescript
// lib/errorHandler.ts
export function handleApiError(error: any): NextResponse {
  console.error('API Error:', error)
  
  // Prisma 에러 처리
  if (error.code === 'P2002') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: '이미 존재하는 데이터입니다.',
          field: error.meta?.target?.[0]
        }
      },
      { status: 400 }
    )
  }
  
  // Zod 유효성 검사 에러
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '입력 데이터가 올바르지 않습니다.',
          details: error.errors
        }
      },
      { status: 422 }
    )
  }
  
  // 기본 서버 에러
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '서버 오류가 발생했습니다.'
      }
    },
    { status: 500 }
  )
}
```

---

## 📝 **개발 환경 설정**

### **환경변수 설정**
```bash
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/jarimae"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# 외부 서비스
NAVER_MAP_CLIENT_ID="your-naver-map-client-id"
SMS_API_KEY="your-sms-api-key"
EMAIL_API_KEY="your-email-api-key"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"

# Redis (캐싱용)
REDIS_URL="redis://localhost:6379"
```

### **API 테스트 설정**
```typescript
// tests/api/setup.ts
import { createMocks } from 'node-mocks-http'
import { NextRequest, NextResponse } from 'next/server'

export function createApiMocks(method: string, url: string, body?: any) {
  const { req, res } = createMocks({
    method,
    url,
    body
  })
  
  return {
    req: req as NextRequest,
    res: res as NextResponse
  }
}

// 테스트 유틸리티
export async function callApi(handler: Function, method: string, path: string, body?: any, headers?: any) {
  const { req, res } = createApiMocks(method, path, body)
  
  if (headers) {
    Object.keys(headers).forEach(key => {
      req.headers.set(key, headers[key])
    })
  }
  
  await handler(req, res)
  return res
}
```

---

## 🚀 **배포 및 모니터링**

### **API 상태 확인 엔드포인트**
```http
GET /api/health
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    status: 'healthy',
    timestamp: string,
    version: string,
    uptime: number,
    database: 'connected' | 'disconnected',
    external_services: {
      sms: 'available' | 'unavailable',
      email: 'available' | 'unavailable',
      maps: 'available' | 'unavailable'
    }
  }
}
```

### **API 문서 엔드포인트**
```http
GET /api/docs
```

**Response:** Swagger UI 또는 이 문서의 HTML 버전

---

## 📋 **개발 체크리스트**

### **Phase 1: 기본 API 구현 (Week 1-2)**
- [ ] 인증 API (회원가입, 로그인, SMS 인증)
- [ ] 매장 CRUD API
- [ ] 기본 예약 API
- [ ] 사용자 프로필 API

### **Phase 2: 핵심 기능 API (Week 3-4)**
- [ ] 예약 관리 API (승인/거절)
- [ ] 테이블 관리 API
- [ ] 검색 및 필터링 API
- [ ] 대시보드 API

### **Phase 3: 고도화 API (Week 5-6)**
- [ ] 리뷰 시스템 API
- [ ] 알림 API
- [ ] 통계 API
- [ ] 지도 연동 API

### **Phase 4: 외부 연동 (Week 7-8)**
- [ ] SMS/이메일 발송 API
- [ ] 결제 시스템 API (더미)
- [ ] 관리자 API
- [ ] 모니터링 API

---

**📅 최종 업데이트**: 2025-09-05  
**🎯 다음 단계**: Claude Code와 함께 API 구현 시작  
**📋 담당자**: PM Claude + 개발팀

---

## 🔗 **참고 링크**

- [Next.js API Routes 공식 문서](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma ORM 가이드](https://www.prisma.io/docs)
- [NextAuth.js 설정 가이드](https://next-auth.js.org/configuration)
- [Zod 유효성 검사](https://zod.dev/)
- [JWT 인증 가이드](https://jwt.io/introduction)

**🚀 Claude Code 실행 명령어 예시:**
```bash
claude-code "이 API 명세서를 참고해서 /api/auth/register 엔드포인트 구현"
claude-code "Prisma 스키마를 기반으로 /api/stores CRUD API 생성"
```