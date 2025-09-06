# 🏗️ 자리매 시스템 아키텍처

**프로젝트**: 자리매 (소상공인 예약 플랫폼)  
**작성일**: 2025-09-04  
**버전**: v1.0  
**목적**: Claude Code를 위한 시스템 아키텍처 가이드

---

## 🎯 **아키텍처 개요**

### **시스템 철학**
- **단순성**: 복잡한 마이크로서비스 대신 모놀리식 구조로 시작
- **확장성**: 필요시 모듈별 분리 가능한 구조
- **성능**: 서버사이드 렌더링과 클라이언트 최적화 균형
- **유지보수성**: 명확한 계층 분리와 역할 정의

### **기술 스택 선택 근거**
```
Frontend: Next.js 14 (App Router)
├── 이유: SSR/SSG 최적화, 통합 개발 환경
├── TypeScript: 타입 안정성 확보
└── Tailwind CSS: 빠른 스타일링, 일관된 디자인

Backend: Next.js API Routes
├── 이유: 풀스택 개발 효율성, 단일 배포
├── Prisma ORM: 타입 안전한 DB 조작
└── NextAuth.js: 검증된 인증 솔루션

Database: PostgreSQL (Supabase)
├── 이유: 관계형 데이터 구조 적합
├── 실시간 기능: Supabase Realtime
└── 확장성: 클라우드 네이티브 솔루션
```

---

## 🏛️ **전체 시스템 구조**

### **High-Level Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side   │    │   External      │
│                 │    │                 │    │   Services      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ React Components│◄──►│ Next.js API     │◄──►│ Supabase DB     │
│ State Management│    │ Routes          │    │ Naver Maps API  │
│ UI/UX Logic     │    │ Business Logic  │    │ SMS Service     │
│ Form Validation │    │ Data Validation │    │ Email Service   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Request Flow**
```
User Input → Component → API Route → Database → Response → UI Update
     ↓            ↓           ↓           ↓          ↓         ↓
   Browser    React      Next.js     Prisma    PostgreSQL  React
```

---

## 🧩 **계층별 상세 아키텍처**

### **1. Presentation Layer (프레젠테이션 계층)**

#### **Page Router Structure**
```
app/
├── (main)/                  # 메인 사용자 플로우
│   ├── page.tsx            # 홈페이지 (통합 대시보드)
│   ├── search/             # 검색 관련
│   └── restaurant/[id]/    # 매장 상세
├── auth/                   # 인증 플로우
│   ├── type/              # 사용자 타입 선택
│   ├── signup/            # 회원가입
│   └── login/             # 로그인
├── booking/               # 예약 플로우
│   ├── [id]/             # 예약 신청
│   └── success/[id]/     # 예약 완료
└── partner/              # 매장 관리자 플로우
    ├── register/         # 매장 등록
    ├── dashboard/        # 관리 대시보드
    ├── menu/            # 메뉴 관리
    ├── store/           # 매장 정보
    └── settlement/      # 정산 관리
```

#### **Component Architecture**
```
components/
├── ui/                    # 원자적 UI 컴포넌트
│   ├── Button.tsx        # 기본 버튼
│   ├── Input.tsx         # 폼 입력
│   ├── Card.tsx          # 카드 컨테이너
│   └── Modal.tsx         # 모달 다이얼로그
├── forms/                # 복합 폼 컴포넌트
│   ├── SignupForm.tsx    # 회원가입 폼
│   └── ReservationForm.tsx # 예약 폼
├── store/                # 매장 관련 컴포넌트
│   ├── StoreCard.tsx     # 매장 카드
│   ├── StoreList.tsx     # 매장 목록
│   └── TableLayout.tsx   # 테이블 배치도
├── booking/              # 예약 관련 컴포넌트
│   ├── ReservationWidget.tsx # 예약 위젯
│   └── BookingFlow.tsx   # 예약 플로우
└── dashboard/            # 대시보드 컴포넌트
    ├── CustomerDashboard.tsx
    └── PartnerDashboard.tsx
```

### **2. Business Logic Layer (비즈니스 로직 계층)**

#### **API Routes Structure**
```
app/api/
├── auth/                 # 인증 관련 API
│   ├── register/route.ts # 회원가입
│   ├── login/route.ts    # 로그인
│   └── verify-sms/route.ts # SMS 인증
├── stores/              # 매장 관리 API
│   ├── route.ts         # 매장 CRUD
│   └── [id]/
│       ├── route.ts     # 특정 매장 조작
│       └── tables/route.ts # 테이블 관리
├── reservations/        # 예약 관리 API
│   ├── route.ts         # 예약 CRUD
│   └── [id]/route.ts    # 특정 예약 조작
└── users/              # 사용자 관리 API
    ├── profile/route.ts # 프로필 관리
    └── [id]/route.ts    # 특정 사용자 조작
```

#### **Business Logic Modules**
```
lib/
├── auth.ts              # 인증 로직
│   ├── validateCredentials()
│   ├── generateTokens()
│   └── verifyPermissions()
├── reservations.ts      # 예약 비즈니스 로직
│   ├── checkAvailability()
│   ├── createReservation()
│   ├── sendConfirmation()
│   └── calculateDeposit()
├── stores.ts           # 매장 비즈니스 로직
│   ├── validateStoreData()
│   ├── approveStore()
│   └── updateOperatingHours()
└── notifications.ts    # 알림 로직
    ├── sendSMS()
    ├── sendEmail()
    └── createInAppNotification()
```

### **3. Data Access Layer (데이터 접근 계층)**

#### **Database Schema Overview**
```
PostgreSQL Database
├── Users                # 사용자 정보
├── Stores              # 매장 정보
├── Tables              # 테이블 정보
├── Reservations        # 예약 정보
├── Reviews             # 리뷰 정보
├── Notifications       # 알림 내역
└── Settings            # 시스템 설정
```

#### **Prisma Client Usage**
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 🔐 **인증 & 권한 아키텍처**

### **NextAuth.js 구성**
```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // 인증 로직 구현
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // JWT 토큰 처리
    },
    async session({ session, token }) {
      // 세션 처리
    }
  }
}
```

### **권한 체계**
```
Role-Based Access Control (RBAC)
├── Customer (고객)
│   ├── 매장 검색/조회
│   ├── 예약 신청/취소
│   ├── 리뷰 작성
│   └── 프로필 관리
├── Store Owner (매장 사장)
│   ├── 매장 정보 관리
│   ├── 예약 승인/거절
│   ├── 메뉴 관리
│   ├── 테이블 관리
│   └── 통계 조회
└── Admin (관리자)
    ├── 매장 승인/거절
    ├── 사용자 관리
    ├── 시스템 설정
    └── 전체 통계 조회
```

---

## 📱 **상태 관리 아키텍처**

### **Zustand Store Structure**
```typescript
// stores/
├── authStore.ts         # 인증 상태
├── reservationStore.ts  # 예약 상태
├── storeStore.ts       # 매장 상태
├── uiStore.ts          # UI 상태
└── notificationStore.ts # 알림 상태
```

### **상태 관리 패턴**
```typescript
// 예시: authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginData) => Promise<void>
  logout: () => void
  updateProfile: (data: ProfileData) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        // 로그인 로직
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      updateProfile: async (data) => {
        // 프로필 업데이트 로직
      }
    }),
    { name: 'auth-storage' }
  )
)
```

---

## 🌐 **API 설계 아키텍처**

### **RESTful API 구조**
```
HTTP Method + Resource + Action Pattern

GET    /api/stores              # 매장 목록 조회
POST   /api/stores              # 매장 생성
GET    /api/stores/{id}         # 특정 매장 조회
PUT    /api/stores/{id}         # 매장 정보 수정
DELETE /api/stores/{id}         # 매장 삭제

GET    /api/reservations        # 예약 목록 조회
POST   /api/reservations        # 예약 생성
PUT    /api/reservations/{id}   # 예약 수정
DELETE /api/reservations/{id}   # 예약 취소
```

### **API Response Format**
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
  }
}

// 에러 응답
interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}
```

### **Middleware Pattern**
```typescript
// middleware 체인
Request → Auth Middleware → Validation → Business Logic → Response

// 예시: 인증 미들웨어
export function withAuth(handler: ApiHandler) {
  return async (req: NextRequest, res: NextResponse) => {
    const token = getTokenFromRequest(req)
    if (!token || !isValidToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return handler(req, res)
  }
}
```

---

## 🗺️ **외부 서비스 통합 아키텍처**

### **지도 서비스 Integration**
```typescript
// lib/maps.ts
interface MapService {
  initMap(containerId: string): void
  addMarker(lat: number, lng: number, info: MarkerInfo): void
  searchPlaces(query: string): Promise<Place[]>
}

class NaverMapService implements MapService {
  private map: naver.maps.Map | null = null
  
  initMap(containerId: string) {
    this.map = new naver.maps.Map(containerId, {
      center: new naver.maps.LatLng(37.5665, 126.9780),
      zoom: 15
    })
  }
  
  addMarker(lat: number, lng: number, info: MarkerInfo) {
    // 마커 추가 로직
  }
}

// 추상화된 팩토리 패턴
export function createMapService(type: 'naver' | 'kakao'): MapService {
  switch (type) {
    case 'naver': return new NaverMapService()
    case 'kakao': return new KakaoMapService()
    default: throw new Error('Unsupported map service')
  }
}
```

### **알림 서비스 Integration**
```typescript
// lib/notifications.ts
interface NotificationService {
  sendSMS(phone: string, message: string): Promise<void>
  sendEmail(email: string, subject: string, content: string): Promise<void>
}

class NotificationManager {
  private smsService: NotificationService
  private emailService: NotificationService
  
  async sendReservationConfirmation(reservation: Reservation) {
    await Promise.all([
      this.smsService.sendSMS(
        reservation.customer.phone,
        `예약이 확정되었습니다. 매장: ${reservation.store.name}`
      ),
      this.emailService.sendEmail(
        reservation.customer.email,
        '예약 확정 안내',
        generateEmailTemplate(reservation)
      )
    ])
  }
}
```

---

## 🔄 **실시간 기능 아키텍처**

### **Supabase Realtime**
```typescript
// hooks/useRealtimeReservations.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useRealtimeReservations(storeId: string) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  
  useEffect(() => {
    const subscription = supabase
      .channel('reservations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
          filter: `store_id=eq.${storeId}`
        },
        (payload) => {
          // 실시간 업데이트 처리
          handleReservationUpdate(payload)
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [storeId])
  
  return reservations
}
```

### **WebSocket 통신 패턴**
```
Client                    Server                  Database
  │                         │                         │
  │─── Subscribe Event ───→│                         │
  │                         │─── Listen Changes ───→│
  │                         │                         │
  │                         │←── Data Changed ──────│
  │←── Broadcast Update ───│                         │
  │                         │                         │
```

---

## 🚀 **성능 최적화 아키텍처**

### **Next.js 최적화 전략**
```typescript
// Static Generation
export async function generateStaticParams() {
  const stores = await getPopularStores()
  return stores.map((store) => ({ id: store.id }))
}

// Server Side Rendering
export default async function StorePage({ params }: { params: { id: string } }) {
  const store = await getStore(params.id) // 서버에서 데이터 페칭
  return <StoreDetail store={store} />
}

// Client Side Caching
export function useStores() {
  return useSWR('/api/stores', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000 // 1분간 중복 요청 방지
  })
}
```

### **Database Query 최적화**
```typescript
// N+1 쿼리 방지 - Include 사용
const reservationsWithDetails = await prisma.reservation.findMany({
  include: {
    customer: true,
    store: true,
    table: true
  }
})

// 인덱스 최적화
// prisma/schema.prisma
model Reservation {
  // ...
  @@index([store_id, reservation_date]) // 복합 인덱스
  @@index([customer_id])
  @@index([status])
}
```

---

## 🛡️ **보안 아키텍처**

### **다층 보안 구조**
```
Application Security Layers
├── Frontend Security
│   ├── Input Validation (클라이언트)
│   ├── XSS Protection
│   └── CSRF Protection
├── API Security
│   ├── Authentication (JWT)
│   ├── Authorization (RBAC)
│   ├── Rate Limiting
│   └── Input Sanitization
├── Database Security
│   ├── SQL Injection 방지 (Prisma)
│   ├── Row Level Security
│   └── 암호화된 연결
└── Infrastructure Security
    ├── HTTPS 강제
    ├── Environment Variables
    └── Secure Headers
```

### **Input Validation with Zod**
```typescript
// lib/validations.ts
import { z } from 'zod'

export const createReservationSchema = z.object({
  store_id: z.string().uuid(),
  reservation_date: z.string().datetime(),
  party_size: z.number().min(1).max(20),
  special_requests: z.string().max(500).optional()
})

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(50),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/)
})
```

---

## 📊 **모니터링 & 로깅 아키텍처**

### **Application Monitoring**
```typescript
// lib/monitoring.ts
import { Analytics } from '@vercel/analytics/react'

// 성능 모니터링
export function trackPageView(page: string) {
  Analytics.track('page_view', { page })
}

export function trackReservation(storeId: string, success: boolean) {
  Analytics.track('reservation_attempt', { store_id: storeId, success })
}

// 에러 로깅
export function logError(error: Error, context: Record<string, any>) {
  console.error('Application Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  })
}
```

### **Business Metrics Tracking**
```typescript
// 비즈니스 지표 추적
interface BusinessMetrics {
  dailyReservations: number
  conversionRate: number
  avgReservationValue: number
  customerRetention: number
}

export async function calculateDailyMetrics(): Promise<BusinessMetrics> {
  const today = new Date()
  const todayReservations = await prisma.reservation.count({
    where: {
      created_at: {
        gte: startOfDay(today),
        lte: endOfDay(today)
      }
    }
  })
  
  // 기타 지표 계산
  return {
    dailyReservations: todayReservations,
    // ...
  }
}
```

---

## 🔄 **CI/CD & 배포 아키텍처**

### **배포 파이프라인**
```
GitHub → Vercel → Production
   │         │         │
   │         │         ├── Auto Deploy
   │         │         ├── Environment Variables
   │         │         └── Edge Functions
   │         │
   │         ├── Preview Deployments
   │         ├── Build Optimization
   │         └── Performance Analytics
   │
   ├── GitHub Actions
   ├── Automated Testing
   ├── Code Quality Checks
   └── Security Scanning
```

### **Environment Configuration**
```typescript
// config/env.ts
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  NAVER_MAP_CLIENT_ID: process.env.NAVER_MAP_CLIENT_ID!,
  SMS_API_KEY: process.env.SMS_API_KEY!,
  EMAIL_API_KEY: process.env.EMAIL_API_KEY!
} as const

// 환경변수 검증
function validateEnv() {
  const missingVars = Object.entries(env)
    .filter(([_, value]) => !value)
    .map(([key]) => key)
  
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
  }
}
```

---

## 🎯 **아키텍처 구현 우선순위**

### **Phase 1: 핵심 아키텍처 (Week 1-2)**
1. **Next.js 프로젝트 구조** 생성
2. **Prisma 스키마** 및 데이터베이스 연결
3. **기본 인증 시스템** (NextAuth.js)
4. **핵심 API Routes** 구현

### **Phase 2: 비즈니스 로직 (Week 3-4)**
1. **예약 시스템** 핵심 로직
2. **매장 관리** 비즈니스 로직
3. **상태 관리** (Zustand) 구현
4. **폼 검증** (Zod) 시스템

### **Phase 3: 고도화 (Week 5-6)**
1. **실시간 기능** (Supabase Realtime)
2. **외부 서비스 통합** (지도, 알림)
3. **성능 최적화**
4. **보안 강화**

### **Phase 4: 모니터링 & 배포 (Week 7-8)**
1. **모니터링 시스템** 구축
2. **CI/CD 파이프라인** 완성
3. **프로덕션 배포** 환경 구성
4. **성능 튜닝**

---

**📝 Claude Code 활용 가이드**: 이 아키텍처 문서를 참조하여 각 계층과 모듈을 단계적으로 구현해주세요. 특히 폴더 구조와 파일 역할, 그리고 각 기술 스택의 사용 목적을 명확히 이해하고 개발을 진행해주세요.