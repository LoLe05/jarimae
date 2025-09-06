# 💾 자리매 데이터베이스 스키마

**프로젝트**: 자리매 (소상공인 예약 플랫폼)  
**작성일**: 2025-09-05  
**버전**: v1.0  
**목적**: Prisma ORM 기반 데이터베이스 설계  
**Database**: PostgreSQL 15+

---

## 🎯 **스키마 설계 원칙**

### **설계 철학**
- **확장성**: 미래 기능 추가를 고려한 유연한 구조
- **성능**: 적절한 인덱싱과 관계 설정
- **일관성**: 명명 규칙과 데이터 타입 통일
- **보안**: 개인정보 암호화 및 접근 제어
- **추적성**: 생성/수정 시간 기록

### **명명 규칙**
```
- 테이블명: snake_case (복수형)
- 컬럼명: snake_case (단수형)
- 관계명: camelCase
- 인덱스명: idx_table_column
- 제약조건명: constraint_table_purpose
```

### **공통 필드**
```typescript
// 모든 주요 테이블에 포함
id: string (UUID)
created_at: DateTime
updated_at: DateTime
```

---

## 📋 **Prisma Schema 전체**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// =============================================================================
// 사용자 관련 테이블
// =============================================================================

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  password_hash     String
  name              String
  nickname          String?
  phone             String    @unique
  user_type         UserType
  profile_image     String?
  address           String?
  phone_verified    Boolean   @default(false)
  email_verified    Boolean   @default(false)
  is_active         Boolean   @default(true)
  last_login_at     DateTime?
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt

  // 관계
  stores            Store[]
  reservations      Reservation[]
  reviews           Review[]
  notifications     Notification[]
  user_preferences  UserPreference?
  authentication_logs AuthenticationLog[]

  @@map("users")
  @@index([email])
  @@index([phone])
  @@index([user_type])
  @@index([created_at])
}

model UserPreference {
  id                    String  @id @default(cuid())
  user_id               String  @unique
  notification_sms      Boolean @default(true)
  notification_email    Boolean @default(true)
  notification_push     Boolean @default(true)
  marketing_consent     Boolean @default(false)
  location_consent      Boolean @default(false)
  created_at            DateTime @default(now())
  updated_at            DateTime @updatedAt

  // 관계
  user                  User    @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@map("user_preferences")
}

model AuthenticationLog {
  id              String    @id @default(cuid())
  user_id         String
  action          AuthAction
  ip_address      String?
  user_agent      String?
  success         Boolean
  failure_reason  String?
  created_at      DateTime  @default(now())

  // 관계
  user            User      @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@map("authentication_logs")
  @@index([user_id])
  @@index([created_at])
  @@index([action])
}

// =============================================================================
// 매장 관련 테이블
// =============================================================================

model Store {
  id                    String        @id @default(cuid())
  name                  String
  slug                  String        @unique
  category              StoreCategory
  description           String?
  address               String
  detailed_address      String?
  postal_code           String?
  phone                 String
  business_number       String        @unique
  latitude              Float
  longitude             Float
  thumbnail_image       String?
  images                String[]      @default([])
  
  // 영업 정보
  operating_hours       Json          // OperatingHours 타입
  break_time            Json?         // BreakTime 타입
  holiday_schedule      Json?         // HolidaySchedule 타입
  
  // 부가 정보
  amenities             String[]      @default([])
  payment_methods       String[]      @default([])
  min_order_amount      Int?
  delivery_fee          Int?
  parking_available     Boolean       @default(false)
  wifi_available        Boolean       @default(false)
  pet_friendly          Boolean       @default(false)
  
  // 승인 관련
  status                StoreStatus   @default(PENDING)
  approval_type         ApprovalType  @default(MANUAL)
  approved_at           DateTime?
  rejected_at           DateTime?
  rejection_reason      String?
  approved_by           String?       // Admin User ID
  
  // 통계
  rating                Float         @default(0)
  review_count          Int           @default(0)
  total_reservations    Int           @default(0)
  
  // 소유자
  owner_id              String
  
  // 시간 추적
  created_at            DateTime      @default(now())
  updated_at            DateTime      @updatedAt

  // 관계
  owner                 User          @relation(fields: [owner_id], references: [id])
  tables                Table[]
  reservations          Reservation[]
  reviews               Review[]
  menu_categories       MenuCategory[]
  store_analytics       StoreAnalytics[]

  @@map("stores")
  @@index([category])
  @@index([status])
  @@index([owner_id])
  @@index([latitude, longitude])
  @@index([created_at])
  @@index([rating])
}

model Table {
  id            String      @id @default(cuid())
  store_id      String
  table_number  String
  capacity      Int
  table_type    TableType   @default(SQUARE)
  position_x    Float       @default(0)
  position_y    Float       @default(0)
  width         Float       @default(1)
  height        Float       @default(1)
  status        TableStatus @default(AVAILABLE)
  description   String?
  created_at    DateTime    @default(now())
  updated_at    DateTime    @updatedAt

  // 관계
  store         Store         @relation(fields: [store_id], references: [id], onDelete: Cascade)
  reservations  Reservation[]

  @@map("tables")
  @@unique([store_id, table_number])
  @@index([store_id])
  @@index([status])
}

// =============================================================================
// 메뉴 관련 테이블
// =============================================================================

model MenuCategory {
  id          String     @id @default(cuid())
  store_id    String
  name        String
  description String?
  sort_order  Int        @default(0)
  is_active   Boolean    @default(true)
  created_at  DateTime   @default(now())
  updated_at  DateTime   @updatedAt

  // 관계
  store       Store      @relation(fields: [store_id], references: [id], onDelete: Cascade)
  menu_items  MenuItem[]

  @@map("menu_categories")
  @@index([store_id])
  @@index([sort_order])
}

model MenuItem {
  id              String        @id @default(cuid())
  category_id     String
  name            String
  description     String?
  price           Int
  original_price  Int?          // 할인 전 가격
  image           String?
  is_available    Boolean       @default(true)
  is_recommended  Boolean       @default(false)
  is_spicy        Boolean       @default(false)
  allergens       String[]      @default([])
  calories        Int?
  preparation_time Int?         // 조리 시간 (분)
  sort_order      Int           @default(0)
  created_at      DateTime      @default(now())
  updated_at      DateTime      @updatedAt

  // 관계
  category        MenuCategory  @relation(fields: [category_id], references: [id], onDelete: Cascade)

  @@map("menu_items")
  @@index([category_id])
  @@index([is_available])
  @@index([sort_order])
}

// =============================================================================
// 예약 관련 테이블
// =============================================================================

model Reservation {
  id                    String            @id @default(cuid())
  reservation_number    String            @unique
  store_id              String
  customer_id           String
  table_id              String?
  
  // 예약 정보
  reservation_date      DateTime          @db.Date
  reservation_time      DateTime          @db.Time
  party_size            Int
  special_requests      String?
  estimated_duration    Int               @default(120) // 분 단위
  
  // 상태 관리
  status                ReservationStatus @default(PENDING)
  confirmed_at          DateTime?
  cancelled_at          DateTime?
  completed_at          DateTime?
  
  // 취소/거절 관련
  cancellation_reason   String?
  cancelled_by          String?           // USER_ID (고객 또는 매장)
  cancellation_type     CancellationType?
  
  // 결제 관련
  deposit_amount        Int               @default(0)
  payment_status        PaymentStatus     @default(NONE)
  payment_method        PaymentMethod?
  paid_at               DateTime?
  
  // 알림 관련
  sms_sent              Boolean           @default(false)
  email_sent            Boolean           @default(false)
  reminder_sent         Boolean           @default(false)
  
  // 시간 추적
  created_at            DateTime          @default(now())
  updated_at            DateTime          @updatedAt

  // 관계
  store                 Store             @relation(fields: [store_id], references: [id])
  customer              User              @relation(fields: [customer_id], references: [id])
  table                 Table?            @relation(fields: [table_id], references: [id])
  payment               Payment?
  review                Review?
  reservation_logs      ReservationLog[]

  @@map("reservations")
  @@index([store_id])
  @@index([customer_id])
  @@index([reservation_date])
  @@index([status])
  @@index([created_at])
  @@index([reservation_date, reservation_time])
}

model ReservationLog {
  id              String          @id @default(cuid())
  reservation_id  String
  action          ReservationAction
  old_status      ReservationStatus?
  new_status      ReservationStatus?
  changed_by      String?         // USER_ID
  reason          String?
  metadata        Json?
  created_at      DateTime        @default(now())

  // 관계
  reservation     Reservation     @relation(fields: [reservation_id], references: [id], onDelete: Cascade)

  @@map("reservation_logs")
  @@index([reservation_id])
  @@index([action])
  @@index([created_at])
}

// =============================================================================
// 결제 관련 테이블
// =============================================================================

model Payment {
  id                String        @id @default(cuid())
  reservation_id    String        @unique
  amount            Int
  payment_method    PaymentMethod
  payment_status    PaymentStatus @default(PENDING)
  
  // 외부 결제 시스템 연동
  external_payment_id String?     @unique
  payment_gateway   String?       // "toss", "iamport", etc.
  
  // 결제 상세
  paid_at           DateTime?
  cancelled_at      DateTime?
  refunded_at       DateTime?
  refund_amount     Int?
  refund_reason     String?
  
  // 추가 정보
  receipt_url       String?
  failure_reason    String?
  
  created_at        DateTime      @default(now())
  updated_at        DateTime      @updatedAt

  // 관계
  reservation       Reservation   @relation(fields: [reservation_id], references: [id], onDelete: Cascade)

  @@map("payments")
  @@index([payment_status])
  @@index([payment_method])
  @@index([created_at])
}

// =============================================================================
// 리뷰 관련 테이블
// =============================================================================

model Review {
  id              String      @id @default(cuid())
  store_id        String
  customer_id     String
  reservation_id  String      @unique
  
  // 리뷰 내용
  rating          Int         // 1-5점
  comment         String?
  images          String[]    @default([])
  
  // 세부 평가 (선택사항)
  food_rating     Int?        // 음식 맛
  service_rating  Int?        // 서비스
  atmosphere_rating Int?      // 분위기
  price_rating    Int?        // 가성비
  
  // 상태
  is_public       Boolean     @default(true)
  is_flagged      Boolean     @default(false)
  flag_reason     String?
  
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt

  // 관계
  store           Store       @relation(fields: [store_id], references: [id])
  customer        User        @relation(fields: [customer_id], references: [id])
  reservation     Reservation @relation(fields: [reservation_id], references: [id])
  store_reply     StoreReply?

  @@map("reviews")
  @@index([store_id])
  @@index([customer_id])
  @@index([rating])
  @@index([created_at])
  @@index([is_public])
}

model StoreReply {
  id         String   @id @default(cuid())
  review_id  String   @unique
  comment    String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  // 관계
  review     Review   @relation(fields: [review_id], references: [id], onDelete: Cascade)

  @@map("store_replies")
}

// =============================================================================
// 알림 관련 테이블
// =============================================================================

model Notification {
  id              String            @id @default(cuid())
  user_id         String
  type            NotificationType
  title           String
  message         String
  data            Json?             // 추가 데이터 (예약 ID 등)
  
  // 상태
  is_read         Boolean           @default(false)
  read_at         DateTime?
  
  // 발송 정보
  sent_via        String[]          @default([]) // ["sms", "email", "push"]
  sms_sent        Boolean           @default(false)
  email_sent      Boolean           @default(false)
  push_sent       Boolean           @default(false)
  
  created_at      DateTime          @default(now())

  // 관계
  user            User              @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@map("notifications")
  @@index([user_id])
  @@index([type])
  @@index([is_read])
  @@index([created_at])
}

// =============================================================================
// 통계 및 분석 테이블
// =============================================================================

model StoreAnalytics {
  id                  String   @id @default(cuid())
  store_id            String
  date                DateTime @db.Date
  
  // 예약 통계
  total_reservations  Int      @default(0)
  confirmed_reservations Int   @default(0)
  cancelled_reservations Int   @default(0)
  completed_reservations Int   @default(0)
  no_show_count       Int      @default(0)
  
  // 수익 통계
  total_revenue       Int      @default(0)
  average_party_size  Float    @default(0)
  peak_hour           Int?     // 가장 바쁜 시간대
  
  // 운영 통계
  table_turnover_rate Float    @default(0)
  average_duration    Int      @default(0) // 분 단위
  
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt

  // 관계
  store               Store    @relation(fields: [store_id], references: [id], onDelete: Cascade)

  @@map("store_analytics")
  @@unique([store_id, date])
  @@index([store_id])
  @@index([date])
}

model SystemAnalytics {
  id                    String   @id @default(cuid())
  date                  DateTime @db.Date
  
  // 사용자 통계
  new_customers         Int      @default(0)
  new_store_owners      Int      @default(0)
  active_users          Int      @default(0)
  total_users           Int      @default(0)
  
  // 매장 통계
  new_stores            Int      @default(0)
  approved_stores       Int      @default(0)
  rejected_stores       Int      @default(0)
  total_stores          Int      @default(0)
  
  // 예약 통계
  total_reservations    Int      @default(0)
  successful_reservations Int    @default(0)
  cancellation_rate     Float    @default(0)
  
  // 수익 통계
  total_revenue         Int      @default(0)
  commission_earned     Int      @default(0)
  
  created_at            DateTime @default(now())

  @@map("system_analytics")
  @@unique([date])
  @@index([date])
}

// =============================================================================
// 시스템 관리 테이블
// =============================================================================

model AppConfig {
  id          String   @id @default(cuid())
  key         String   @unique
  value       String
  description String?
  is_public   Boolean  @default(false)
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  @@map("app_configs")
}

model AdminUser {
  id          String    @id @default(cuid())
  email       String    @unique
  name        String
  role        AdminRole @default(MODERATOR)
  is_active   Boolean   @default(true)
  last_login  DateTime?
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt

  @@map("admin_users")
}

// =============================================================================
// ENUMS
// =============================================================================

enum UserType {
  CUSTOMER
  OWNER
}

enum StoreCategory {
  KOREAN      // 한식
  CHINESE     // 중식
  JAPANESE    // 일식
  WESTERN     // 양식
  ASIAN       // 아시안
  CAFE        // 카페
  BAR         // 술집
  FAST_FOOD   // 패스트푸드
  DESSERT     // 디저트
  OTHER       // 기타
}

enum StoreStatus {
  PENDING     // 승인 대기
  APPROVED    // 승인 완료
  REJECTED    // 승인 거절
  SUSPENDED   // 일시 정지
  CLOSED      // 폐점
}

enum ApprovalType {
  AUTO        // 자동 승인
  MANUAL      // 수동 승인
}

enum TableType {
  ROUND       // 원형 테이블
  SQUARE      // 사각 테이블
  BAR         // 바 테이블
  BOOTH       // 부스
  PRIVATE     // 룸
}

enum TableStatus {
  AVAILABLE   // 사용 가능
  RESERVED    // 예약됨
  OCCUPIED    // 사용 중
  MAINTENANCE // 정비 중
}

enum ReservationStatus {
  PENDING     // 승인 대기
  CONFIRMED   // 승인 완료
  CANCELLED   // 취소됨
  COMPLETED   // 완료됨
  NO_SHOW     // 노쇼
}

enum CancellationType {
  USER        // 고객 취소
  STORE       // 매장 취소
  SYSTEM      // 시스템 취소
}

enum PaymentStatus {
  NONE        // 결제 없음
  PENDING     // 결제 대기
  PAID        // 결제 완료
  FAILED      // 결제 실패
  CANCELLED   // 결제 취소
  REFUNDED    // 환불 완료
}

enum PaymentMethod {
  CARD        // 카드
  TRANSFER    // 계좌이체
  VIRTUAL_ACCOUNT // 가상계좌
  MOBILE      // 모바일 결제
  CASH        // 현금 (현장 결제)
}

enum NotificationType {
  RESERVATION_CONFIRMED    // 예약 확정
  RESERVATION_CANCELLED    // 예약 취소
  RESERVATION_REMINDER     // 예약 알림
  REVIEW_REQUEST          // 리뷰 요청
  STORE_APPROVED          // 매장 승인
  STORE_REJECTED          // 매장 거절
  PROMOTION               // 프로모션
  SYSTEM_NOTICE           // 시스템 공지
}

enum ReservationAction {
  CREATED
  CONFIRMED
  CANCELLED
  COMPLETED
  MODIFIED
  NO_SHOW
}

enum AuthAction {
  LOGIN
  LOGOUT
  REGISTER
  PASSWORD_RESET
  EMAIL_VERIFY
  PHONE_VERIFY
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  MODERATOR
}

// =============================================================================
// 뷰 (Views) - 읽기 성능 최적화용
// =============================================================================

// 매장 검색용 뷰 (가상 테이블)
// CREATE VIEW store_search_view AS
// SELECT 
//   s.id,
//   s.name,
//   s.category,
//   s.address,
//   s.latitude,
//   s.longitude,
//   s.rating,
//   s.review_count,
//   s.thumbnail_image,
//   s.operating_hours,
//   s.status,
//   COUNT(CASE WHEN r.status = 'AVAILABLE' THEN 1 END) as available_tables
// FROM stores s
// LEFT JOIN tables t ON s.id = t.store_id
// LEFT JOIN reservations r ON t.id = r.table_id 
//   AND r.reservation_date = CURRENT_DATE
//   AND r.status IN ('CONFIRMED', 'PENDING')
// WHERE s.status = 'APPROVED'
// GROUP BY s.id;
```

---

## 🔧 **Prisma 설정 파일**

### **schema.prisma 추가 설정**
```prisma
// 확장 설정
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "views"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  
  // 연결 풀 설정
  relationMode = "prisma"
}

// 전체 텍스트 검색을 위한 확장
// CREATE EXTENSION IF NOT EXISTS pg_trgm;
// CREATE EXTENSION IF NOT EXISTS unaccent;
```

### **환경변수 설정**
```bash
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/jarimae_db?schema=public"

# 운영환경
DATABASE_URL="postgresql://username:password@production-host:5432/jarimae_prod?schema=public&sslmode=require"

# 개발환경 (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

---

## 📊 **인덱스 최적화 전략**

### **성능 최적화 인덱스**
```sql
-- 복합 인덱스 (자주 함께 조회되는 컬럼들)
CREATE INDEX idx_reservations_store_date_status 
  ON reservations (store_id, reservation_date, status);

CREATE INDEX idx_reservations_customer_status 
  ON reservations (customer_id, status);

CREATE INDEX idx_stores_location_category 
  ON stores USING GIST (latitude, longitude) 
  WHERE status = 'APPROVED';

CREATE INDEX idx_reviews_store_rating_date 
  ON reviews (store_id, rating, created_at) 
  WHERE is_public = true;

-- 부분 인덱스 (조건부)
CREATE INDEX idx_active_stores 
  ON stores (category, rating) 
  WHERE status = 'APPROVED' AND is_active = true;

CREATE INDEX idx_pending_reservations 
  ON reservations (store_id, created_at) 
  WHERE status = 'PENDING';

-- 전체 텍스트 검색 인덱스
CREATE INDEX idx_stores_search 
  ON stores USING GIN (to_tsvector('korean', name || ' ' || description));

CREATE INDEX idx_menu_items_search 
  ON menu_items USING GIN (to_tsvector('korean', name || ' ' || description));
```

### **파티셔닝 전략** (대용량 데이터용)
```sql
-- 예약 테이블 월별 파티셔닝
CREATE TABLE reservations_2025_01 PARTITION OF reservations
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE reservations_2025_02 PARTITION OF reservations
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- 자동 파티션 생성 함수
CREATE OR REPLACE FUNCTION create_monthly_partitions()
RETURNS void AS $$
DECLARE
  start_date date;
  end_date date;
  table_name text;
BEGIN
  start_date := date_trunc('month', CURRENT_DATE);
  end_date := start_date + interval '1 month';
  table_name := 'reservations_' || to_char(start_date, 'YYYY_MM');
  
  EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF reservations
                  FOR VALUES FROM (%L) TO (%L)',
                 table_name, start_date, end_date);
END;
$$ LANGUAGE plpgsql;
```

---

## 🔐 **보안 및 데이터 보호**

### **Row Level Security (RLS)**
```sql
-- 사용자별 데이터 접근 제한
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 고객은 자신의 예약만 조회 가능
CREATE POLICY reservations_customer_policy ON reservations
  FOR ALL TO authenticated_users
  USING (customer_id = current_user_id());

-- 매장 사장은 자신의 매장 예약만 조회 가능
CREATE POLICY reservations_store_owner_policy ON reservations
  FOR ALL TO store_owners
  USING (store_id IN (
    SELECT id FROM stores WHERE owner_id = current_user_id()
  ));
```

### **민감 데이터 암호화**
```typescript
// lib/encryption.ts
import { createCipher, createDecipher } from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

export function encryptSensitiveData(data: string): string {
  const cipher = createCipher('aes-256-cbc', ENCRYPTION_KEY)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export function decryptSensitiveData(encryptedData: string): string {
  const decipher = createDecipher('aes-256-cbc', ENCRYPTION_KEY)
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// 사용 예시 - 개인정보 암호화
const encryptedPhone = encryptSensitiveData(user.phone)
const encryptedBusinessNumber = encryptSensitiveData(store.business_number)
```

---

## 📈 **데이터 시드 및 마이그레이션**

### **시드 데이터 스크립트**
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 관리자 계정 생성
  const adminPassword = await bcrypt.hash('admin123!', 10)
  
  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@jarimae.com',
      name: '시스템 관리자',
      role: 'SUPER_ADMIN'
    }
  })

  // 테스트 고객 생성
  const customerPassword = await bcrypt.hash('test123!', 10)
  
  const customer = await prisma.user.create({
    data: {
      email: 'customer@test.com',
      password_hash: customerPassword,
      name: '김고객',
      nickname: '맛집탐험가',
      phone: '010-1234-5678',
      user_type: 'CUSTOMER',
      phone_verified: true,
      email_verified: true
    }
  })

  // 테스트 매장 사장 생성
  const ownerPassword = await bcrypt.hash('owner123!', 10)
  
  const owner = await prisma.user.create({
    data: {
      email: 'owner@test.com',
      password_hash: ownerPassword,
      name: '이사장',
      phone: '010-9876-5432',
      user_type: 'OWNER',
      phone_verified: true,
      email_verified: true
    }
  })

  // 테스트 매장 생성
  const store = await prisma.store.create({
    data: {
      name: '맛있는 삼겹살집',
      slug: 'delicious-pork-belly',
      category: 'KOREAN',
      description: '신선한 삼겹살과 다양한 한식 메뉴를 제공하는 맛집입니다.',
      address: '서울특별시 강남구 테헤란로 123',
      detailed_address: '1층',
      postal_code: '06159',
      phone: '02-1234-5678',
      business_number: '123-45-67890',
      latitude: 37.5665,
      longitude: 126.9780,
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
      amenities: ['주차가능', 'WiFi', '단체석'],
      payment_methods: ['현금', '카드', '계좌이체'],
      status: 'APPROVED',
      approval_type: 'AUTO',
      approved_at: new Date(),
      owner_id: owner.id,
      rating: 4.5,
      review_count: 128
    }
  })

  // 테이블 생성
  const tables = await Promise.all([
    prisma.table.create({
      data: {
        store_id: store.id,
        table_number: '1',
        capacity: 4,
        table_type: 'SQUARE',
        position_x: 1,
        position_y: 1,
        status: 'AVAILABLE'
      }
    }),
    prisma.table.create({
      data: {
        store_id: store.id,
        table_number: '2',
        capacity: 2,
        table_type: 'ROUND',
        position_x: 3,
        position_y: 1,
        status: 'AVAILABLE'
      }
    }),
    prisma.table.create({
      data: {
        store_id: store.id,
        table_number: '3',
        capacity: 6,
        table_type: 'SQUARE',
        position_x: 1,
        position_y: 3,
        status: 'AVAILABLE'
      }
    })
  ])

  // 메뉴 카테고리 및 메뉴 아이템 생성
  const menuCategory = await prisma.menuCategory.create({
    data: {
      store_id: store.id,
      name: '구이류',
      description: '신선한 고기 구이 메뉴',
      sort_order: 1
    }
  })

  await Promise.all([
    prisma.menuItem.create({
      data: {
        category_id: menuCategory.id,
        name: '삼겹살',
        description: '신선한 국내산 삼겹살',
        price: 15000,
        is_available: true,
        is_recommended: true,
        sort_order: 1
      }
    }),
    prisma.menuItem.create({
      data: {
        category_id: menuCategory.id,
        name: '목살',
        description: '부드러운 목살',
        price: 16000,
        is_available: true,
        sort_order: 2
      }
    }),
    prisma.menuItem.create({
      data: {
        category_id: menuCategory.id,
        name: '갈비살',
        description: '마블링이 좋은 갈비살',
        price: 18000,
        is_available: true,
        sort_order: 3
      }
    })
  ])

  // 테스트 예약 생성
  const reservation = await prisma.reservation.create({
    data: {
      reservation_number: 'RES-' + Date.now(),
      store_id: store.id,
      customer_id: customer.id,
      table_id: tables[0].id,
      reservation_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 내일
      reservation_time: new Date('1970-01-01T19:00:00'),
      party_size: 4,
      special_requests: '창가 자리 희망합니다',
      status: 'CONFIRMED',
      confirmed_at: new Date(),
      deposit_amount: 10000,
      payment_status: 'PAID'
    }
  })

  // 테스트 리뷰 생성
  await prisma.review.create({
    data: {
      store_id: store.id,
      customer_id: customer.id,
      reservation_id: reservation.id,
      rating: 5,
      comment: '정말 맛있었어요! 삼겹살이 신선하고 직원분들도 친절하셨습니다.',
      food_rating: 5,
      service_rating: 4,
      atmosphere_rating: 4,
      price_rating: 4
    }
  })

  // 앱 설정 생성
  await Promise.all([
    prisma.appConfig.create({
      data: {
        key: 'reservation_deadline_hours',
        value: '2',
        description: '예약 마감 시간 (시간 단위)',
        is_public: true
      }
    }),
    prisma.appConfig.create({
      data: {
        key: 'max_party_size',
        value: '20',
        description: '최대 예약 인원수',
        is_public: true
      }
    }),
    prisma.appConfig.create({
      data: {
        key: 'sms_api_key',
        value: 'your_sms_api_key_here',
        description: 'SMS 발송 API 키',
        is_public: false
      }
    })
  ])

  console.log('✅ 시드 데이터 생성 완료!')
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### **마이그레이션 스크립트**
```typescript
// scripts/migrate.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createInitialTriggers() {
  // 예약 상태 변경시 매장 통계 업데이트 트리거
  await prisma.$executeRaw`
    CREATE OR REPLACE FUNCTION update_store_stats()
    RETURNS TRIGGER AS $
    BEGIN
      -- 리뷰 카운트 및 평균 평점 업데이트
      IF TG_TABLE_NAME = 'reviews' THEN
        UPDATE stores 
        SET 
          review_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE store_id = NEW.store_id AND is_public = true
          ),
          rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM reviews 
            WHERE store_id = NEW.store_id AND is_public = true
          )
        WHERE id = NEW.store_id;
      END IF;
      
      -- 예약 카운트 업데이트
      IF TG_TABLE_NAME = 'reservations' THEN
        UPDATE stores 
        SET total_reservations = (
          SELECT COUNT(*) 
          FROM reservations 
          WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
        )
        WHERE id = COALESCE(NEW.store_id, OLD.store_id);
      END IF;
      
      RETURN COALESCE(NEW, OLD);
    END;
    $ LANGUAGE plpgsql;
  `

  // 트리거 생성
  await prisma.$executeRaw`
    CREATE TRIGGER trigger_update_store_stats_reviews
      AFTER INSERT OR UPDATE OR DELETE ON reviews
      FOR EACH ROW EXECUTE FUNCTION update_store_stats();
  `

  await prisma.$executeRaw`
    CREATE TRIGGER trigger_update_store_stats_reservations
      AFTER INSERT OR UPDATE OR DELETE ON reservations
      FOR EACH ROW EXECUTE FUNCTION update_store_stats();
  `
}

export async function createSearchViews() {
  // 매장 검색 최적화 뷰
  await prisma.$executeRaw`
    CREATE OR REPLACE VIEW store_search_view AS
    SELECT 
      s.id,
      s.name,
      s.slug,
      s.category,
      s.address,
      s.latitude,
      s.longitude,
      s.rating,
      s.review_count,
      s.thumbnail_image,
      s.operating_hours,
      s.status,
      s.amenities,
      s.payment_methods,
      COUNT(DISTINCT t.id) as total_tables,
      COUNT(DISTINCT CASE 
        WHEN t.status = 'AVAILABLE' 
        AND NOT EXISTS (
          SELECT 1 FROM reservations r 
          WHERE r.table_id = t.id 
          AND r.reservation_date = CURRENT_DATE
          AND r.status IN ('CONFIRMED', 'PENDING')
        ) 
        THEN t.id 
      END) as available_tables_today
    FROM stores s
    LEFT JOIN tables t ON s.id = t.store_id
    WHERE s.status = 'APPROVED'
    GROUP BY s.id, s.name, s.slug, s.category, s.address, 
             s.latitude, s.longitude, s.rating, s.review_count,
             s.thumbnail_image, s.operating_hours, s.status,
             s.amenities, s.payment_methods;
  `

  // 예약 대시보드 뷰
  await prisma.$executeRaw`
    CREATE OR REPLACE VIEW reservation_dashboard_view AS
    SELECT 
      r.id,
      r.reservation_number,
      r.reservation_date,
      r.reservation_time,
      r.party_size,
      r.status,
      r.created_at,
      s.name as store_name,
      s.address as store_address,
      s.phone as store_phone,
      u.name as customer_name,
      u.phone as customer_phone,
      t.table_number,
      t.capacity as table_capacity
    FROM reservations r
    JOIN stores s ON r.store_id = s.id
    JOIN users u ON r.customer_id = u.id
    LEFT JOIN tables t ON r.table_id = t.id
    ORDER BY r.reservation_date DESC, r.reservation_time DESC;
  `
}

export async function createAnalyticsQueries() {
  // 일일 분석 데이터 생성 함수
  await prisma.$executeRaw`
    CREATE OR REPLACE FUNCTION generate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE)
    RETURNS void AS $
    BEGIN
      -- 매장별 일일 통계 생성/업데이트
      INSERT INTO store_analytics (
        store_id, date, total_reservations, confirmed_reservations,
        cancelled_reservations, completed_reservations, total_revenue
      )
      SELECT 
        s.id,
        target_date,
        COUNT(r.id) as total_reservations,
        COUNT(CASE WHEN r.status = 'CONFIRMED' THEN 1 END) as confirmed_reservations,
        COUNT(CASE WHEN r.status = 'CANCELLED' THEN 1 END) as cancelled_reservations,
        COUNT(CASE WHEN r.status = 'COMPLETED' THEN 1 END) as completed_reservations,
        COALESCE(SUM(CASE WHEN p.payment_status = 'PAID' THEN p.amount END), 0) as total_revenue
      FROM stores s
      LEFT JOIN reservations r ON s.id = r.store_id AND r.reservation_date = target_date
      LEFT JOIN payments p ON r.id = p.reservation_id
      WHERE s.status = 'APPROVED'
      GROUP BY s.id
      ON CONFLICT (store_id, date) 
      DO UPDATE SET
        total_reservations = EXCLUDED.total_reservations,
        confirmed_reservations = EXCLUDED.confirmed_reservations,
        cancelled_reservations = EXCLUDED.cancelled_reservations,
        completed_reservations = EXCLUDED.completed_reservations,
        total_revenue = EXCLUDED.total_revenue,
        updated_at = NOW();
      
      -- 시스템 전체 일일 통계
      INSERT INTO system_analytics (
        date, new_customers, new_store_owners, total_reservations,
        successful_reservations, total_revenue
      )
      SELECT 
        target_date,
        COUNT(CASE WHEN u.user_type = 'CUSTOMER' AND u.created_at::date = target_date THEN 1 END),
        COUNT(CASE WHEN u.user_type = 'OWNER' AND u.created_at::date = target_date THEN 1 END),
        COUNT(r.id),
        COUNT(CASE WHEN r.status IN ('CONFIRMED', 'COMPLETED') THEN 1 END),
        COALESCE(SUM(CASE WHEN p.payment_status = 'PAID' THEN p.amount END), 0)
      FROM users u
      CROSS JOIN reservations r
      LEFT JOIN payments p ON r.id = p.reservation_id
      WHERE r.reservation_date = target_date
      ON CONFLICT (date)
      DO UPDATE SET
        new_customers = EXCLUDED.new_customers,
        new_store_owners = EXCLUDED.new_store_owners,
        total_reservations = EXCLUDED.total_reservations,
        successful_reservations = EXCLUDED.successful_reservations,
        total_revenue = EXCLUDED.total_revenue;
    END;
    $ LANGUAGE plpgsql;
  `
}

// 실행 함수
async function runMigrations() {
  try {
    console.log('🚀 마이그레이션 시작...')
    
    await createInitialTriggers()
    console.log('✅ 트리거 생성 완료')
    
    await createSearchViews()
    console.log('✅ 검색 뷰 생성 완료')
    
    await createAnalyticsQueries()
    console.log('✅ 분석 함수 생성 완료')
    
    console.log('🎉 모든 마이그레이션 완료!')
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  runMigrations()
}
```

---

## 🔍 **쿼리 최적화 가이드**

### **자주 사용되는 최적화된 쿼리들**
```typescript
// lib/queries.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 1. 주변 매장 검색 (지리적 검색)
export async function findNearbyStores(
  latitude: number,
  longitude: number,
  radiusKm: number = 2,
  category?: string,
  limit: number = 20
) {
  const query = `
    SELECT *, 
      (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
       cos(radians(longitude) - radians($2)) + 
       sin(radians($1)) * sin(radians(latitude)))) AS distance
    FROM store_search_view
    WHERE (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
           cos(radians(longitude) - radians($2)) + 
           sin(radians($1)) * sin(radians(latitude)))) < $3
    ${category ? 'AND category = $4' : ''}
    ORDER BY distance
    LIMIT ${category ? '5' : '4'}
  `
  
  const params = category 
    ? [latitude, longitude, radiusKm, category, limit]
    : [latitude, longitude, radiusKm, limit]
    
  return await prisma.$queryRaw`${query}` as any[]
}

// 2. 예약 가능한 시간대 조회
export async function getAvailableTimeSlots(
  storeId: string,
  date: Date,
  partySize: number
) {
  return await prisma.$queryRaw`
    WITH time_slots AS (
      SELECT generate_series(
        '11:00'::time,
        '21:00'::time,
        '30 minutes'::interval
      ) AS slot_time
    ),
    occupied_slots AS (
      SELECT reservation_time::time as slot_time
      FROM reservations r
      JOIN tables t ON r.table_id = t.id
      WHERE r.store_id = ${storeId}
        AND r.reservation_date = ${date}
        AND r.status IN ('CONFIRMED', 'PENDING')
      GROUP BY reservation_time::time
      HAVING COUNT(*) >= (
        SELECT COUNT(*) 
        FROM tables 
        WHERE store_id = ${storeId} 
          AND capacity >= ${partySize}
          AND status = 'AVAILABLE'
      )
    )
    SELECT ts.slot_time
    FROM time_slots ts
    LEFT JOIN occupied_slots os ON ts.slot_time = os.slot_time
    WHERE os.slot_time IS NULL
    ORDER BY ts.slot_time;
  `
}

// 3. 매장 대시보드 통계
export async function getStoreDashboardStats(
  storeId: string,
  startDate: Date,
  endDate: Date
) {
  return await prisma.$queryRaw`
    SELECT 
      COUNT(*) as total_reservations,
      COUNT(CASE WHEN status = 'CONFIRMED' THEN 1 END) as confirmed_reservations,
      COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelled_reservations,
      COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_reservations,
      COUNT(CASE WHEN status = 'NO_SHOW' THEN 1 END) as no_show_count,
      AVG(party_size) as avg_party_size,
      COALESCE(SUM(
        CASE WHEN p.payment_status = 'PAID' 
        THEN p.amount ELSE 0 END
      ), 0) as total_revenue
    FROM reservations r
    LEFT JOIN payments p ON r.id = p.reservation_id
    WHERE r.store_id = ${storeId}
      AND r.reservation_date BETWEEN ${startDate} AND ${endDate}
  `
}

// 4. 고객 추천 매장 (협업 필터링)
export async function getRecommendedStores(
  customerId: string,
  limit: number = 10
) {
  return await prisma.$queryRaw`
    WITH customer_preferences AS (
      SELECT s.category, COUNT(*) as visit_count
      FROM reservations r
      JOIN stores s ON r.store_id = s.id
      WHERE r.customer_id = ${customerId}
        AND r.status = 'COMPLETED'
      GROUP BY s.category
      ORDER BY visit_count DESC
      LIMIT 3
    ),
    similar_customers AS (
      SELECT r2.customer_id
      FROM reservations r1
      JOIN reservations r2 ON r1.store_id = r2.store_id
      WHERE r1.customer_id = ${customerId}
        AND r2.customer_id != ${customerId}
        AND r1.status = 'COMPLETED'
        AND r2.status = 'COMPLETED'
      GROUP BY r2.customer_id
      HAVING COUNT(*) >= 2
    )
    SELECT DISTINCT s.*, 
      CASE WHEN cp.category IS NOT NULL THEN 2 ELSE 1 END as relevance_score
    FROM stores s
    LEFT JOIN customer_preferences cp ON s.category = cp.category
    WHERE s.status = 'APPROVED'
      AND s.rating >= 4.0
      AND s.id NOT IN (
        SELECT DISTINCT store_id 
        FROM reservations 
        WHERE customer_id = ${customerId}
      )
      AND (cp.category IS NOT NULL OR s.id IN (
        SELECT DISTINCT r.store_id
        FROM reservations r
        WHERE r.customer_id IN (SELECT customer_id FROM similar_customers)
          AND r.status = 'COMPLETED'
      ))
    ORDER BY relevance_score DESC, s.rating DESC
    LIMIT ${limit}
  `
}

// 5. 실시간 테이블 상태 조회
export async function getRealTimeTableStatus(storeId: string) {
  return await prisma.$queryRaw`
    SELECT 
      t.*,
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM reservations r 
          WHERE r.table_id = t.id 
            AND r.reservation_date = CURRENT_DATE
            AND r.status IN ('CONFIRMED', 'PENDING')
            AND r.reservation_time::time <= (CURRENT_TIME + interval '30 minutes')
            AND r.reservation_time::time >= (CURRENT_TIME - interval '30 minutes')
        ) THEN 'RESERVED'
        ELSE t.status
      END as current_status,
      r.reservation_time,
      r.party_size,
      u.name as customer_name
    FROM tables t
    LEFT JOIN reservations r ON t.id = r.table_id 
      AND r.reservation_date = CURRENT_DATE
      AND r.status = 'CONFIRMED'
      AND r.reservation_time::time BETWEEN 
        (CURRENT_TIME - interval '30 minutes') AND 
        (CURRENT_TIME + interval '4 hours')
    LEFT JOIN users u ON r.customer_id = u.id
    WHERE t.store_id = ${storeId}
    ORDER BY t.table_number
  `
}
```

---

## 📊 **백업 및 복구 전략**

### **자동 백업 스크립트**
```bash
#!/bin/bash
# scripts/backup.sh

# 환경 변수 설정
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="jarimae_db"
DB_USER="postgres"
BACKUP_DIR="/var/backups/jarimae"
DATE=$(date +"%Y%m%d_%H%M%S")

# 백업 디렉토리 생성
mkdir -p $BACKUP_DIR

# 전체 백업 (스키마 + 데이터)
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME \
  --no-password --verbose --clean --create \
  --file="$BACKUP_DIR/jarimae_full_$DATE.sql"

# 스키마만 백업
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME \
  --no-password --schema-only \
  --file="$BACKUP_DIR/jarimae_schema_$DATE.sql"

# 데이터만 백업
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME \
  --no-password --data-only \
  --file="$BACKUP_DIR/jarimae_data_$DATE.sql"

# 압축
gzip "$BACKUP_DIR/jarimae_full_$DATE.sql"
gzip "$BACKUP_DIR/jarimae_data_$DATE.sql"

# 7일 이상 된 백업 파일 삭제
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "백업 완료: $DATE"
```

### **복구 스크립트**
```bash
#!/bin/bash
# scripts/restore.sh

BACKUP_FILE=$1
DB_NAME="jarimae_db"
DB_USER="postgres"

if [ -z "$BACKUP_FILE" ]; then
    echo "사용법: $0 <백업파일경로>"
    exit 1
fi

# 압축 해제 (필요시)
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -k $BACKUP_FILE
    BACKUP_FILE=${BACKUP_FILE%%.gz}
fi

# 데이터베이스 복구
psql -U $DB_USER -d $DB_NAME -f $BACKUP_FILE

echo "복구 완료: $BACKUP_FILE"
```

---

## 🔧 **개발 환경 설정**

### **Docker Compose 설정**
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: jarimae_postgres
    environment:
      POSTGRES_DB: jarimae_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    command: >
      postgres 
      -c log_statement=all 
      -c log_destination=stderr 
      -c logging_collector=on 
      -c log_filename='postgresql-%Y-%m-%d.log'

  redis:
    image: redis:7-alpine
    container_name: jarimae_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    container_name: jarimae_adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
```

### **데이터베이스 초기화 스크립트**
```sql
-- scripts/init.sql
-- 필요한 확장 프로그램 설치
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 한국어 전체 텍스트 검색 설정
CREATE TEXT SEARCH CONFIGURATION korean (COPY = simple);
```

---

## 📋 **데이터베이스 체크리스트**

### **Phase 1: 기본 구조 (Week 1)**
- [ ] Prisma 스키마 파일 생성
- [ ] 기본 테이블 (User, Store, Table, Reservation) 마이그레이션
- [ ] 초기 시드 데이터 생성
- [ ] 기본 인덱스 설정

### **Phase 2: 고도화 (Week 2-3)**
- [ ] 리뷰 시스템 테이블 추가
- [ ] 결제 시스템 테이블 추가
- [ ] 알림 시스템 테이블 추가
- [ ] 성능 최적화 인덱스 추가

### **Phase 3: 분석 시스템 (Week 4)**
- [ ] 분석 테이블 (Analytics) 추가
- [ ] 뷰(Views) 생성
- [ ] 트리거 및 함수 생성
- [ ] 백업 시스템 구축

### **Phase 4: 운영 준비 (Week 5-6)**
- [ ] Row Level Security 설정
- [ ] 데이터 암호화 적용
- [ ] 모니터링 시스템 연동
- [ ] 성능 튜닝

---

## 🚀 **Claude Code 활용 가이드**

### **Prisma 스키마 생성 명령어**
```bash
# 1. 스키마 파일 생성
claude-code "이 DATABASE.md를 참고해서 완전한 prisma/schema.prisma 파일 생성"

# 2. 마이그레이션 실행
claude-code "Prisma 마이그레이션 생성 및 실행 스크립트 작성"

# 3. 시드 데이터 생성
claude-code "테스트용 시드 데이터 생성 스크립트 완성"

# 4. 데이터베이스 헬퍼 함수 생성
claude-code "최적화된 데이터베이스 쿼리 함수들을 lib/db-queries.ts에 구현"
```

### **다음 단계 권장사항**
1. **우선 구현**: 핵심 테이블 (User, Store, Reservation, Table)
2. **2차 구현**: 리뷰, 결제, 알림 시스템
3. **최적화**: 인덱스, 뷰, 트리거 추가
4. **운영 준비**: 백업, 모니터링, 보안 강화

---

**📅 최종 업데이트**: 2025-09-05  
**🎯 다음 단계**: Prisma 스키마 구현 및 마이그레이션  
**📋 상태**: Claude Code 실행 준비 완료

---

## 💡 **추가 고려사항**

### **확장성 대비**
- **샤딩**: 지역별 데이터베이스 분산 준비
- **읽기 복제본**: 조회 성능 향상을 위한 읽기 전용 DB
- **캐싱 레이어**: Redis를 활용한 세션 및 자주 조회되는 데이터 캐싱
- **아카이빙**: 오래된 예약 데이터 별도 테이블 이관

### **모니터링 및 알림**
```sql
-- 성능 모니터링 뷰
CREATE VIEW performance_monitor AS
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_tuples,
  n_dead_tup as dead_tuples,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- 슬로우 쿼리 감지
CREATE VIEW slow_queries AS
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows,
  100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE mean_time > 100  -- 100ms 이상 쿼리
ORDER BY mean_time DESC;
```

### **보안 강화**
```typescript
// 데이터 마스킹 함수
export function maskPersonalData(data: any, userRole: string) {
  if (userRole !== 'ADMIN') {
    return {
      ...data,
      phone: data.phone?.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3'),
      email: data.email?.replace(/(.{3}).*@/, '$1***@'),
      business_number: data.business_number?.replace(/(\d{3})-(\d{2})-(\d{5})/, '$1-**-$3')
    }
  }
  return data
}

// 감사 로그 시스템
model AuditLog {
  id          String    @id @default(cuid())
  table_name  String
  record_id   String
  action      String    // INSERT, UPDATE, DELETE
  old_values  Json?
  new_values  Json?
  user_id     String?
  ip_address  String?
  user_agent  String?
  created_at  DateTime  @default(now())

  @@map("audit_logs")
  @@index([table_name, record_id])
  @@index([user_id])
  @@index([created_at])
}
```

### **데이터 품질 관리**
```sql
-- 데이터 품질 체크 함수
CREATE OR REPLACE FUNCTION check_data_quality()
RETURNS TABLE(
  check_name TEXT,
  table_name TEXT,
  issue_count BIGINT,
  severity TEXT
) AS $
BEGIN
  -- 중복된 이메일 체크
  RETURN QUERY
  SELECT 
    'duplicate_emails'::TEXT,
    'users'::TEXT,
    COUNT(*)::BIGINT,
    'HIGH'::TEXT
  FROM users
  GROUP BY email
  HAVING COUNT(*) > 1;
  
  -- 고아 레코드 체크 (외래키 참조 무결성)
  RETURN QUERY
  SELECT 
    'orphaned_reservations'::TEXT,
    'reservations'::TEXT,
    COUNT(*)::BIGINT,
    'MEDIUM'::TEXT
  FROM reservations r
  LEFT JOIN stores s ON r.store_id = s.id
  WHERE s.id IS NULL;
  
  -- 비정상적인 예약 시간 체크
  RETURN QUERY
  SELECT 
    'invalid_reservation_times'::TEXT,
    'reservations'::TEXT,
    COUNT(*)::BIGINT,
    'LOW'::TEXT
  FROM reservations
  WHERE reservation_date < CURRENT_DATE
    AND status = 'PENDING';
    
  -- 빈 필수 필드 체크
  RETURN QUERY
  SELECT 
    'missing_store_info'::TEXT,
    'stores'::TEXT,
    COUNT(*)::BIGINT,
    'MEDIUM'::TEXT
  FROM stores
  WHERE name IS NULL OR name = ''
    OR address IS NULL OR address = ''
    OR phone IS NULL OR phone = '';
END;
$ LANGUAGE plpgsql;
```

---

## 🔄 **실시간 동기화 시스템**

### **Supabase Realtime 설정**
```sql
-- 실시간 구독을 위한 Publication 생성
CREATE PUBLICATION jarimae_realtime FOR ALL TABLES;

-- 특정 테이블만 실시간 동기화
ALTER PUBLICATION jarimae_realtime DROP TABLE users;
ALTER PUBLICATION jarimae_realtime ADD TABLE reservations;
ALTER PUBLICATION jarimae_realtime ADD TABLE tables;
ALTER PUBLICATION jarimae_realtime ADD TABLE notifications;

-- Row Level Security 설정 (실시간 구독용)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reservations" ON reservations
  FOR SELECT USING (
    auth.uid()::text = customer_id OR 
    auth.uid()::text IN (
      SELECT owner_id FROM stores WHERE id = store_id
    )
  );

CREATE POLICY "Store owners can update own store reservations" ON reservations
  FOR UPDATE USING (
    auth.uid()::text IN (
      SELECT owner_id FROM stores WHERE id = store_id
    )
  );
```

### **WebSocket 이벤트 처리**
```typescript
// lib/realtime.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 예약 상태 실시간 구독
export function subscribeToReservationUpdates(
  storeId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel('reservations')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reservations',
        filter: `store_id=eq.${storeId}`
      },
      callback
    )
    .subscribe()
}

// 테이블 상태 실시간 구독
export function subscribeToTableUpdates(
  storeId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel('tables')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'tables',
        filter: `store_id=eq.${storeId}`
      },
      callback
    )
    .subscribe()
}

// 알림 실시간 구독
export function subscribeToNotifications(
  userId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}
```

---

## 📊 **성능 벤치마크 목표**

### **데이터베이스 성능 지표**
```typescript
// 성능 목표 설정
const PERFORMANCE_TARGETS = {
  // 응답 시간 (ms)
  SIMPLE_SELECT: 10,      // 단순 조회
  COMPLEX_JOIN: 50,       // 복잡한 조인 쿼리
  FULL_TEXT_SEARCH: 100,  // 전체 텍스트 검색
  ANALYTICAL_QUERY: 500,  // 분석 쿼리
  
  // 처리량 (TPS - Transactions Per Second)
  READ_TPS: 1000,         // 읽기 처리량
  WRITE_TPS: 100,         // 쓰기 처리량
  
  // 동시 접속
  MAX_CONNECTIONS: 200,    // 최대 동시 연결
  
  // 저장소
  INDEX_SIZE_RATIO: 0.3,  // 인덱스 크기 비율 (테이블 대비)
  CACHE_HIT_RATIO: 0.95   // 캐시 적중률
}

// 성능 측정 함수
export async function measureQueryPerformance(
  query: string,
  params: any[] = []
) {
  const startTime = process.hrtime.bigint()
  
  try {
    const result = await prisma.$queryRaw`${query}`
    const endTime = process.hrtime.bigint()
    const duration = Number(endTime - startTime) / 1000000 // ms 변환
    
    console.log(`Query executed in ${duration.toFixed(2)}ms`)
    
    return {
      success: true,
      duration,
      result,
      query: query.substring(0, 100) + '...'
    }
  } catch (error) {
    const endTime = process.hrtime.bigint()
    const duration = Number(endTime - startTime) / 1000000
    
    return {
      success: false,
      duration,
      error: error.message,
      query: query.substring(0, 100) + '...'
    }
  }
}
```

---

## 🧪 **테스트 데이터 생성**

### **대용량 테스트 데이터 생성 스크립트**
```typescript
// scripts/generate-test-data.ts
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/ko'

const prisma = new PrismaClient()

async function generateTestData() {
  console.log('🏗️ 대용량 테스트 데이터 생성 시작...')
  
  // 1. 고객 1000명 생성
  console.log('👥 고객 데이터 생성 중...')
  const customers = []
  for (let i = 0; i < 1000; i++) {
    customers.push({
      email: faker.internet.email(),
      password_hash: '$2a$10$example.hash.for.testing.only',
      name: faker.person.fullName(),
      nickname: faker.internet.userName(),
      phone: `010-${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
      user_type: 'CUSTOMER' as const,
      phone_verified: faker.datatype.boolean(0.8),
      email_verified: faker.datatype.boolean(0.7),
      created_at: faker.date.between({
        from: '2024-01-01',
        to: new Date()
      })
    })
  }
  
  await prisma.user.createMany({
    data: customers,
    skipDuplicates: true
  })
  
  // 2. 매장 사장 100명 생성
  console.log('🏪 매장 사장 데이터 생성 중...')
  const owners = []
  for (let i = 0; i < 100; i++) {
    owners.push({
      email: faker.internet.email(),
      password_hash: '$2a$10$example.hash.for.testing.only',
      name: faker.person.fullName(),
      phone: `010-${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
      user_type: 'OWNER' as const,
      phone_verified: true,
      email_verified: true,
      created_at: faker.date.between({
        from: '2024-01-01',
        to: new Date()
      })
    })
  }
  
  await prisma.user.createMany({
    data: owners,
    skipDuplicates: true
  })
  
  // 3. 매장 200개 생성
  console.log('🏢 매장 데이터 생성 중...')
  const allOwners = await prisma.user.findMany({
    where: { user_type: 'OWNER' }
  })
  
  const stores = []
  const categories = ['KOREAN', 'CHINESE', 'JAPANESE', 'WESTERN', 'CAFE', 'BAR']
  
  for (let i = 0; i < 200; i++) {
    const owner = faker.helpers.arrayElement(allOwners)
    stores.push({
      name: faker.company.name() + ' 맛집',
      slug: faker.helpers.slugify(faker.company.name() + '-restaurant'),
      category: faker.helpers.arrayElement(categories) as any,
      description: faker.lorem.paragraphs(2),
      address: faker.location.streetAddress(),
      detailed_address: faker.location.secondaryAddress(),
      postal_code: faker.location.zipCode(),
      phone: `02-${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
      business_number: `${faker.string.numeric(3)}-${faker.string.numeric(2)}-${faker.string.numeric(5)}`,
      latitude: parseFloat(faker.location.latitude({ min: 37.4, max: 37.7 })),
      longitude: parseFloat(faker.location.longitude({ min: 126.8, max: 127.2 })),
      operating_hours: {
        monday: { open: '11:00', close: '22:00', is_closed: false },
        tuesday: { open: '11:00', close: '22:00', is_closed: false },
        wednesday: { open: '11:00', close: '22:00', is_closed: false },
        thursday: { open: '11:00', close: '22:00', is_closed: false },
        friday: { open: '11:00', close: '23:00', is_closed: false },
        saturday: { open: '11:00', close: '23:00', is_closed: false },
        sunday: { open: '11:00', close: '21:00', is_closed: faker.datatype.boolean(0.2) }
      },
      amenities: faker.helpers.arrayElements(
        ['주차가능', 'WiFi', '단체석', '반려동물동반', '포장가능', '배달가능'],
        { min: 2, max: 4 }
      ),
      payment_methods: ['현금', '카드', '계좌이체'],
      status: faker.helpers.weightedArrayElement([
        { weight: 8, value: 'APPROVED' },
        { weight: 1, value: 'PENDING' },
        { weight: 1, value: 'REJECTED' }
      ]) as any,
      approval_type: faker.helpers.arrayElement(['AUTO', 'MANUAL']) as any,
      owner_id: owner.id,
      rating: parseFloat(faker.number.float({ min: 3.0, max: 5.0 }).toFixed(1)),
      review_count: faker.number.int({ min: 0, max: 500 }),
      created_at: faker.date.between({
        from: '2024-01-01',
        to: new Date()
      })
    })
  }
  
  await prisma.store.createMany({
    data: stores,
    skipDuplicates: true
  })
  
  // 4. 각 매장에 테이블 생성 (매장당 5-15개)
  console.log('🪑 테이블 데이터 생성 중...')
  const allStores = await prisma.store.findMany()
  
  for (const store of allStores) {
    const tableCount = faker.number.int({ min: 5, max: 15 })
    const tables = []
    
    for (let i = 1; i <= tableCount; i++) {
      tables.push({
        store_id: store.id,
        table_number: i.toString(),
        capacity: faker.helpers.weightedArrayElement([
          { weight: 4, value: 2 },
          { weight: 6, value: 4 },
          { weight: 3, value: 6 },
          { weight: 1, value: 8 }
        ]),
        table_type: faker.helpers.arrayElement(['ROUND', 'SQUARE', 'BAR']) as any,
        position_x: faker.number.float({ min: 0, max: 10 }),
        position_y: faker.number.float({ min: 0, max: 10 }),
        status: 'AVAILABLE' as const
      })
    }
    
    await prisma.table.createMany({
      data: tables
    })
  }
  
  // 5. 예약 데이터 10,000개 생성 (지난 6개월)
  console.log('📅 예약 데이터 생성 중...')
  const allCustomers = await prisma.user.findMany({
    where: { user_type: 'CUSTOMER' }
  })
  const allTables = await prisma.table.findMany({
    include: { store: true }
  })
  
  const reservations = []
  for (let i = 0; i < 10000; i++) {
    const customer = faker.helpers.arrayElement(allCustomers)
    const table = faker.helpers.arrayElement(allTables)
    const reservationDate = faker.date.between({
      from: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // 6개월 전
      to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1개월 후
    })
    
    reservations.push({
      reservation_number: `RES-${Date.now()}-${i}`,
      store_id: table.store_id,
      customer_id: customer.id,
      table_id: table.id,
      reservation_date: reservationDate,
      reservation_time: new Date(`1970-01-01T${faker.helpers.arrayElement([
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
      ])}:00`),
      party_size: faker.number.int({ min: 1, max: table.capacity }),
      special_requests: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
      status: faker.helpers.weightedArrayElement([
        { weight: 6, value: 'COMPLETED' },
        { weight: 2, value: 'CONFIRMED' },
        { weight: 1, value: 'CANCELLED' },
        { weight: 0.5, value: 'NO_SHOW' }
      ]) as any,
      deposit_amount: faker.helpers.weightedArrayElement([
        { weight: 7, value: 0 },
        { weight: 2, value: 10000 },
        { weight: 1, value: 20000 }
      ]),
      payment_status: faker.helpers.arrayElement(['NONE', 'PAID']) as any,
      created_at: faker.date.between({
        from: new Date(reservationDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        to: reservationDate
      })
    })
  }
  
  // 배치로 나누어 생성 (메모리 효율성)
  const batchSize = 1000
  for (let i = 0; i < reservations.length; i += batchSize) {
    const batch = reservations.slice(i, i + batchSize)
    await prisma.reservation.createMany({
      data: batch,
      skipDuplicates: true
    })
    console.log(`📊 예약 배치 ${Math.floor(i / batchSize) + 1}/${Math.ceil(reservations.length / batchSize)} 완료`)
  }
  
  // 6. 완료된 예약에 대한 리뷰 생성 (30% 확률)
  console.log('⭐ 리뷰 데이터 생성 중...')
  const completedReservations = await prisma.reservation.findMany({
    where: { status: 'COMPLETED' },
    take: 3000 // 첫 3000개만
  })
  
  const reviews = []
  for (const reservation of completedReservations) {
    if (faker.datatype.boolean(0.3)) { // 30% 확률로 리뷰 작성
      reviews.push({
        store_id: reservation.store_id,
        customer_id: reservation.customer_id,
        reservation_id: reservation.id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.datatype.boolean(0.8) ? faker.lorem.paragraphs(1) : null,
        food_rating: faker.number.int({ min: 1, max: 5 }),
        service_rating: faker.number.int({ min: 1, max: 5 }),
        atmosphere_rating: faker.number.int({ min: 1, max: 5 }),
        price_rating: faker.number.int({ min: 1, max: 5 }),
        created_at: faker.date.between({
          from: reservation.created_at,
          to: new Date()
        })
      })
    }
  }
  
  await prisma.review.createMany({
    data: reviews,
    skipDuplicates: true
  })
  
  console.log('✅ 대용량 테스트 데이터 생성 완료!')
  console.log(`
    📊 생성된 데이터:
    - 고객: 1,000명
    - 매장 사장: 100명  
    - 매장: 200개
    - 테이블: ~2,000개
    - 예약: 10,000개
    - 리뷰: ~900개
  `)
}

// 실행
if (require.main === module) {
  generateTestData()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
}
```

---

## 🎯 **최종 점검 체크리스트**

### **Claude Code 즉시 실행 가능한 항목들**

#### **1단계: 기본 스키마 생성**
```bash
claude-code "DATABASE.md 전체 내용을 참고해서 완전한 prisma/schema.prisma 파일 생성"
claude-code "Prisma 마이그레이션 실행을 위한 package.json 스크립트 추가"
```

#### **2단계: 시드 데이터 및 헬퍼 함수**
```bash
claude-code "기본 시드 데이터 생성을 위한 prisma/seed.ts 파일 구현"
claude-code "최적화된 데이터베이스 쿼리 함수들을 lib/db-queries.ts에 구현"
```

#### **3단계: 마이그레이션 및 성능 최적화**
```bash
claude-code "데이터베이스 트리거 및 뷰 생성을 위한 scripts/migrate.ts 구현"
claude-code "성능 모니터링을 위한 lib/db-monitor.ts 구현"
```

### **데이터베이스 구현 우선순위**

1. **🔥 최우선 (Week 1)**
   - User, Store, Table, Reservation 핵심 테이블
   - 기본 인덱스 및 관계 설정
   - 시드 데이터 생성

2. **⚡ 높음 (Week 2)**
   - Review, Payment, Notification 테이블
   - 성능 최적화 인덱스
   - 실시간 동기화 설정

3. **📊 중간 (Week 3)**
   - Analytics 테이블
   - 뷰 및 트리거 생성
   - 백업 시스템 구축

4. **🔒 운영 준비 (Week 4)**
   - 보안 설정 (RLS)
   - 모니터링 시스템
   - 성능 튜닝

---

**🚀 결론**: 완전한 엔터프라이즈급 데이터베이스 스키마가 준비되었습니다! Claude Code와 함께 즉시 구현을 시작할 수 있습니다.