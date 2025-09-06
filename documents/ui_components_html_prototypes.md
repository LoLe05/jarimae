# 🎨 자리매 HTML 프로토타입 분석 및 컴포넌트 가이드

**프로젝트**: 자리매 (소상공인 예약 플랫폼)  
**작성일**: 2025-09-05  
**목적**: HTML 시안을 Next.js 14 컴포넌트로 변환하기 위한 분석 문서  
**기반**: 디자이너와 함께 작성된 HTML 프로토타입

---

## 📋 **HTML 프로토타입 개요**

### **전체 페이지 구조 (13개 파일)**
```
고객용 (Customer) 페이지:
├── jarimae_unified_main_final.html         # 메인 페이지 (통합 대시보드)
├── jarimae_user_type_selection.html        # 회원 유형 선택
├── jarimae_customer_signup.html            # 고객 회원가입
├── jarimae_address_collection.html         # 주소 수집
├── jarimae_search_results.html             # 식당 검색 결과
├── jarimae_restaurant_detail.html          # 식당 상세 페이지
├── jarimae_booking_and_payment.html        # 예약 및 결제
├── jarimae_booking_success.html            # 예약 완료
└── jarimae_user_profile_creative.html      # 고객 프로필 관리

사장님용 (Partner) 페이지:
├── jarimae_partner_signup.html             # 매장 등록 및 회원가입
├── jarimae_partner_application_success.html # 매장 신청 완료
├── jarimae_partner_dashboard.html          # 매장 대시보드
├── jarimae_partner_menu.html               # 메뉴 관리
├── jarimae_partner_store_info_v2.html      # 매장 정보 관리
└── jarimae_partner_settlement_v2.html      # 정산 관리
```

### **공통 디자인 시스템**
```css
/* 확정된 컬러 팔레트 */
:root {
  --hazelnut: #b1967b;        /* 메인 컬러 */
  --muted-blue: #557c9f;      /* 포인트 컬러 (담청색) */
  --brown-900: #4A2C20;       /* 폰트 컬러 (밤색) */
  --warm-gray: #f3f2f1;       /* 배경색 */
  --muted-gray: #64748b;      /* 웨이팅 컬러 */
}

/* 공통 폰트 */
font-family: 'Pretendard', sans-serif;

/* 공통 스타일링 */
.login-card {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
```

---

## 🏠 **메인 페이지 컴포넌트 분석**
**파일**: `jarimae_unified_main_final.html`  
**라우트**: `/` (홈페이지)

### **주요 컴포넌트 구조**
```typescript
// 페이지 레이아웃
MainPage {
  ├── BackgroundAnimation     // 배경 애니메이션
  ├── HeroSection            // 로고 및 캐치프레이즈
  ├── SearchContainer        // 검색 및 탭 통합 컨테이너
  │   ├── TabNavigation      // 예약/배달/웨이팅 탭
  │   ├── SearchBar          // 통합 검색창
  │   └── LocationButton     // 위치 설정 버튼
  └── DashboardSection       // 개인화된 대시보드 (로그인 후)
      ├── MyReservations     // 내 예약 목록
      ├── Calendar           // 예약 캘린더
      └── QuickStats         // 간단한 통계
}
```

### **핵심 기능**
- **탭 전환**: 예약/배달/웨이팅 서비스 선택
- **검색**: 통합 검색 기능
- **개인 대시보드**: 로그인 상태에서 개인화 정보
- **반응형**: 모바일/데스크톱 대응

---

## 🔐 **인증 관련 페이지**

### **1. 회원 유형 선택**
**파일**: `jarimae_user_type_selection.html`  
**라우트**: `/auth/type`

```typescript
UserTypeSelection {
  ├── LogoSection           // 자리매 로고
  ├── SelectionCards        // 고객/사장님 선택 카드
  │   ├── CustomerCard      // 고객 선택 카드
  │   └── PartnerCard       // 사장님 선택 카드
  └── ContinueButton        // 계속하기 버튼
}
```

### **2. 고객 회원가입**
**파일**: `jarimae_customer_signup.html`  
**라우트**: `/auth/signup?type=customer`

```typescript
CustomerSignup {
  ├── ProgressIndicator     // 단계 표시
  ├── SignupForm           // 회원가입 폼
  │   ├── NameInput        // 실명 입력
  │   ├── NicknameInput    // 닉네임 입력
  │   ├── PhoneInput       // 휴대폰 번호
  │   ├── EmailInput       // 이메일
  │   └── PasswordInput    // 비밀번호
  ├── TermsAgreement       // 약관 동의
  └── SubmitButton         // 가입하기 버튼
}
```

### **3. 주소 수집**
**파일**: `jarimae_address_collection.html`  
**라루트**: `/address/collect`

```typescript
AddressCollection {
  ├── LocationPermission   // 위치 권한 요청
  ├── AddressInput        // 수동 주소 입력
  ├── ConsentCheckbox     // 위치 정보 동의
  └── SkipOption          // 건너뛰기 옵션
}
```

---

## 🔍 **검색 및 매장 관련 페이지**

### **1. 검색 결과**
**파일**: `jarimae_search_results.html`  
**라우트**: `/search`

```typescript
SearchResults {
  ├── SearchHeader
  │   ├── TabNavigation    // 예약/배달/웨이팅 탭
  │   ├── SearchBar        // 검색창
  │   └── FilterButton     // 필터 버튼
  ├── MapSection           // 지도 영역
  │   ├── MapContainer     // 네이버 지도
  │   └── StoreMarkers     // 매장 마커들
  ├── FilterSidebar        // 필터 사이드바
  │   ├── CategoryFilter   // 카테고리 필터
  │   ├── PriceFilter      // 가격 필터
  │   ├── RatingFilter     // 평점 필터
  │   └── DistanceFilter   // 거리 필터
  └── StoreList            // 매장 목록
      └── StoreCard[]      // 매장 카드들
}
```

### **2. 매장 상세**
**파일**: `jarimae_restaurant_detail.html`  
**라우트**: `/restaurant/[id]`

```typescript
RestaurantDetail {
  ├── RestaurantHeader
  │   ├── ImageGallery     // 매장 이미지 갤러리
  │   ├── BasicInfo        // 기본 정보 (이름, 평점, 주소)
  │   └── ActionButtons    // 찜하기, 공유 버튼
  ├── TabNavigation        // 메뉴/리뷰/정보 탭
  ├── MenuSection          // 메뉴 섹션
  │   ├── MenuCategories   // 메뉴 카테고리
  │   └── MenuItems        // 메뉴 아이템들
  ├── ReviewSection        // 리뷰 섹션
  │   ├── ReviewSummary    // 리뷰 요약
  │   └── ReviewList       // 리뷰 목록
  ├── InfoSection          // 매장 정보
  │   ├── OperatingHours   // 영업시간
  │   ├── ContactInfo      // 연락처 정보
  │   └── Amenities        // 편의시설
  └── ReservationWidget    // 예약 위젯 (고정)
      ├── DatePicker       // 날짜 선택
      ├── TimePicker       // 시간 선택
      ├── PartySizePicker  // 인원 선택
      └── BookButton       // 예약하기 버튼
}
```

---

## 📅 **예약 관련 페이지**

### **1. 예약 및 결제**
**파일**: `jarimae_booking_and_payment.html`  
**라우트**: `/booking/[id]`

```typescript
BookingAndPayment {
  ├── BookingHeader        // 예약 정보 헤더
  ├── ReservationSummary   // 예약 요약 정보
  │   ├── RestaurantInfo   // 매장 정보
  │   ├── DateTimeInfo     // 날짜/시간
  │   ├── PartyInfo        // 인원 정보
  │   └── SpecialRequests  // 특별 요청사항
  ├── PaymentSection       // 결제 섹션
  │   ├── PaymentMethods   // 결제 수단 선택
  │   ├── DepositInfo      // 예약금 정보
  │   └── TotalAmount      // 총 금액
  ├── TermsAgreement       // 이용약관 동의
  └── ConfirmButton        // 예약 확정 버튼
}
```

### **2. 예약 완료**
**파일**: `jarimae_booking_success.html`  
**라우트**: `/booking/success/[id]`

```typescript
BookingSuccess {
  ├── SuccessIcon          // 성공 아이콘
  ├── SuccessMessage       // 성공 메시지
  ├── ReservationDetails   // 예약 상세 정보
  │   ├── ReservationNumber // 예약 번호
  │   ├── RestaurantInfo   // 매장 정보
  │   └── BookingInfo      // 예약 정보
  ├── NextActions          // 다음 액션
  │   ├── CalendarAdd      // 캘린더 추가
  │   ├── ShareButton      // 공유 버튼
  │   └── ContactInfo      // 연락처 안내
  └── HomeButton           // 홈으로 가기
}
```

---

## 👤 **사용자 프로필 페이지**

### **고객 프로필**
**파일**: `jarimae_user_profile_creative.html`  
**라우트**: `/profile`

```typescript
UserProfile {
  ├── ProfileHeader
  │   ├── ProfileImage     // 프로필 이미지
  │   ├── UserInfo         // 사용자 정보
  │   └── UserTitle        // 사용자 칭호 (게임화 요소)
  ├── StatsSection         // 통계 섹션
  │   ├── ReservationStats // 예약 통계
  │   ├── ReviewStats      // 리뷰 통계
  │   └── VisitStats       // 방문 통계
  ├── AchievementSection   // 성취 섹션
  │   └── TitleCollection  // 칭호 컬렉션
  ├── RecentActivity       // 최근 활동
  │   ├── RecentReservations // 최근 예약
  │   └── RecentReviews    // 최근 리뷰
  └── SettingsSection      // 설정 섹션
      ├── PersonalInfo     // 개인정보 수정
      ├── Preferences      // 앱 설정
      └── AccountSettings  // 계정 설정
}
```

---

## 🏪 **사장님용 페이지**

### **1. 매장 등록**
**파일**: `jarimae_partner_signup.html`  
**라우트**: `/partner/register`

```typescript
PartnerSignup {
  ├── ProgressIndicator    // 진행 단계 표시
  ├── StoreInfoForm        // 매장 정보 입력
  │   ├── BasicInfo        // 기본 정보 (이름, 카테고리)
  │   ├── AddressInfo      // 주소 정보
  │   ├── ContactInfo      // 연락처
  │   └── BusinessInfo     // 사업자 등록 정보
  ├── OwnerInfoForm        // 대표자 정보
  │   ├── PersonalInfo     // 개인 정보
  │   └── AccountInfo      // 계정 정보
  ├── DocumentUpload       // 서류 업로드
  │   ├── BusinessLicense  // 사업자등록증
  │   └── IdentityCard     // 신분증
  └── SubmitButton         // 신청하기 버튼
}
```

### **2. 신청 완료**
**파일**: `jarimae_partner_application_success.html`  
**라우트**: `/partner/application/success`

```typescript
PartnerApplicationSuccess {
  ├── SuccessIcon          // 성공 아이콘
  ├── SuccessMessage       // 신청 완료 메시지
  ├── ProcessInfo          // 심사 과정 안내
  │   ├── Timeline         // 처리 일정
  │   └── RequiredDocs     // 필요 서류 안내
  ├── ContactInfo          // 문의처 안내
  └── HomeButton           // 홈으로 가기
}
```

### **3. 매장 대시보드**
**파일**: `jarimae_partner_dashboard.html`  
**라우트**: `/partner/dashboard`

```typescript
PartnerDashboard {
  ├── DashboardHeader
  │   ├── StoreProfile     // 매장 프로필 요약
  │   └── QuickActions     // 빠른 액션 버튼들
  ├── StatsOverview        // 통계 개요
  │   ├── TodayStats       // 오늘 통계
  │   ├── WeeklyTrend      // 주간 트렌드
  │   └── MonthlyRevenue   // 월 매출
  ├── ReservationPanel     // 예약 관리 패널
  │   ├── PendingReservations // 대기 중인 예약
  │   ├── TodayReservations // 오늘 예약
  │   └── TableStatus      // 테이블 현황
  ├── TableLayoutEditor    // 매장 구조도 에디터
  │   ├── TableDragDrop    // 테이블 드래그 앤 드롭
  │   └── TableStatusIndicator // 테이블 상태 표시
  ├── RecentReviews        // 최근 리뷰
  │   ├── ReviewList       // 리뷰 목록
  │   └── ReplyInterface   // 답글 인터페이스
  └── NavigationSidebar    // 사이드 네비게이션
      ├── MenuManagement   // 메뉴 관리
      ├── StoreSettings    // 매장 설정
      └── SettlementInfo   // 정산 정보
}
```

### **4. 메뉴 관리**
**파일**: `jarimae_partner_menu.html`  
**라우트**: `/partner/menu`

```typescript
MenuManagement {
  ├── MenuHeader
  │   ├── CategoryTabs     // 메뉴 카테고리 탭
  │   └── AddMenuButton    // 메뉴 추가 버튼
  ├── MenuEditor           // 메뉴 에디터
  │   ├── MenuItemForm     // 메뉴 아이템 폼
  │   │   ├── BasicInfo    // 기본 정보 (이름, 가격)
  │   │   ├── Description  // 설명
  │   │   ├── ImageUpload  // 이미지 업로드
  │   │   ├── StatusToggle // 판매 여부 토글
  │   │   └── RecommendToggle // 추천 여부 토글
  │   └── CategoryManager  // 카테고리 관리
  └── MenuPreview          // 메뉴 미리보기
      └── MenuItemCard     // 메뉴 아이템 카드
}
```

### **5. 매장 정보 관리**
**파일**: `jarimae_partner_store_info_v2.html`  
**라우트**: `/partner/store`

```typescript
StoreInfoManagement {
  ├── BasicInfoEditor      // 기본 정보 에디터
  │   ├── StoreNameInput   // 매장명 입력
  │   ├── CategorySelect   // 카테고리 선택
  │   ├── DescriptionText  // 설명 입력
  │   └── ContactInfo      // 연락처 정보
  ├── OperatingHoursEditor // 영업시간 에디터
  │   ├── WeeklySchedule   // 주간 일정표
  │   │   ├── DayToggle    // 요일별 ON/OFF 토글
  │   │   ├── TimeSlider   // 시간 슬라이더
  │   │   └── BreakTime    // 브레이크 타임 설정
  │   └── HolidaySchedule  // 휴무일 설정
  ├── LocationEditor       // 위치 정보 에디터
  │   ├── AddressInput     // 주소 입력
  │   └── MapPicker        // 지도에서 위치 선택
  ├── AmenitiesEditor      // 편의시설 에디터
  │   └── CheckboxList     // 편의시설 체크박스
  └── ImageGalleryEditor   // 이미지 갤러리 에디터
      ├── ImageUpload      // 이미지 업로드
      └── ImageOrganizer   // 이미지 정렬
}
```

### **6. 정산 관리**
**파일**: `jarimae_partner_settlement_v2.html`  
**라우트**: `/partner/settlement`

```typescript
SettlementManagement {
  ├── SettlementHeader
  │   ├── CurrentBalance   // 현재 잔액
  │   ├── PendingAmount    // 정산 대기 금액
  │   └── WithdrawButton   // 출금 신청 버튼
  ├── SettlementCalendar   // 정산 캘린더
  │   ├── MonthlyView      // 월간 보기
  │   ├── DailyRevenue     // 일별 매출
  │   └── EventIndicators  // 이벤트 표시
  ├── StatisticsPanel      // 통계 패널
  │   ├── RevenueChart     // 매출 차트
  │   ├── ReservationTrend // 예약 트렌드
  │   └── ComparisonData   // 비교 데이터
  ├── TransactionHistory   // 거래 내역
  │   ├── TransactionList  // 거래 목록
  │   └── FilterOptions    // 필터 옵션
  └── AccountSettings      // 계좌 설정
      ├── BankInfo         // 은행 정보
      └── TaxInfo          // 세금 정보
}
```

---

## 🎨 **공통 컴포넌트 라이브러리**

### **UI 기본 컴포넌트**
```typescript
// 버튼 컴포넌트
Button {
  variants: 'primary' | 'secondary' | 'ghost' | 'outline'
  sizes: 'sm' | 'md' | 'lg'
  colors: 'hazelnut' | 'muted-blue' | 'gray'
}

// 입력 컴포넌트
Input {
  types: 'text' | 'email' | 'tel' | 'password'
  variants: 'default' | 'filled' | 'bordered'
  states: 'normal' | 'error' | 'success'
}

// 카드 컴포넌트
Card {
  variants: 'default' | 'elevated' | 'outlined'
  padding: 'sm' | 'md' | 'lg'
  radius: 'sm' | 'md' | 'lg' | 'xl'
}

// 탭 컴포넌트
Tabs {
  orientation: 'horizontal' | 'vertical'
  variant: 'default' | 'pills' | 'underlined'
  size: 'sm' | 'md' | 'lg'
}
```

### **복합 컴포넌트**
```typescript
// 매장 카드
StoreCard {
  image: string
  name: string
  category: string
  rating: number
  reviewCount: number
  distance?: number
  isOpen: boolean
  minOrderAmount?: number
  deliveryFee?: number
  onClick: () => void
}

// 예약 위젯
ReservationWidget {
  storeId: string
  availableSlots: TimeSlot[]
  onReservationSubmit: (data: ReservationData) => void
}

// 테이블 레이아웃 에디터
TableLayoutEditor {
  tables: Table[]
  onTableMove: (tableId: string, position: Position) => void
  onTableStatusChange: (tableId: string, status: TableStatus) => void
}
```

### **폼 컴포넌트**
```typescript
// 주소 입력
AddressInput {
  onAddressSelect: (address: Address) => void
  showMapPicker?: boolean
}

// 시간 선택기
TimePicker {
  availableSlots: string[]
  selectedTime: string
  onTimeSelect: (time: string) => void
}

// 이미지 업로드
ImageUpload {
  maxFiles: number
  acceptedFormats: string[]
  onUpload: (files: File[]) => void
}
```

---

## 🚀 **Next.js 14 변환 가이드**

### **App Router 구조 매핑**
```
HTML 파일 → Next.js App Router

jarimae_unified_main_final.html → app/(main)/page.tsx
jarimae_user_type_selection.html → app/auth/type/page.tsx
jarimae_customer_signup.html → app/auth/signup/page.tsx
jarimae_address_collection.html → app/address/collect/page.tsx
jarimae_search_results.html → app/search/page.tsx
jarimae_restaurant_detail.html → app/restaurant/[id]/page.tsx
jarimae_booking_and_payment.html → app/booking/[id]/page.tsx
jarimae_booking_success.html → app/booking/success/[id]/page.tsx
jarimae_user_profile_creative.html → app/profile/page.tsx

jarimae_partner_signup.html → app/partner/register/page.tsx
jarimae_partner_application_success.html → app/partner/application/success/page.tsx
jarimae_partner_dashboard.html → app/partner/dashboard/page.tsx
jarimae_partner_menu.html → app/partner/menu/page.tsx
jarimae_partner_store_info_v2.html → app/partner/store/page.tsx
jarimae_partner_settlement_v2.html → app/partner/settlement/page.tsx
```

### **컴포넌트 분리 전략**
```typescript
// 1. 페이지 레벨 컴포넌트 (app/ 폴더)
// 라우팅과 데이터 페칭을 담당

// 2. 레이아웃 컴포넌트 (components/layout/)
// Header, Footer, Sidebar 등

// 3. 비즈니스 로직 컴포넌트 (components/business/)
// ReservationWidget, StoreCard, MenuEditor 등

// 4. UI 기본 컴포넌트 (components/ui/)
// Button, Input, Card, Modal 등

// 5. 폼 컴포넌트 (components/forms/)
// SignupForm, ReservationForm 등
```

### **상태 관리 전략**
```typescript
// Zustand 스토어 구조
├── authStore.ts          // 인증 상태
├── reservationStore.ts   // 예약 관리 상태
├── storeStore.ts        // 매장 정보 상태
├── uiStore.ts           // UI 상태 (모달, 알림 등)
└── partnerStore.ts      // 사장님 관리 상태
```

---

## 📋 **변환 작업 체크리스트**

### **Phase 1: 핵심 페이지 (Week 1)**
- [ ] 메인 페이지 (`/`)
- [ ] 회원 유형 선택 (`/auth/type`)
- [ ] 고객 회원가입 (`/auth/signup`)
- [ ] 매장 검색 (`/search`)
- [ ] 매장 상세 (`/restaurant/[id]`)

### **Phase 2: 예약 플로우 (Week 2)**
- [ ] 예약 및 결제 (`/booking/[id]`)
- [ ] 예약 완료 (`/booking/success/[id]`)
- [ ] 고객 프로필 (`/profile`)
- [ ] 주소 수집 (`/address/collect`)

### **Phase 3: 사장님 기능 (Week 3)**
- [ ] 매장 등록 (`/partner/register`)
- [ ] 신청 완료 (`/partner/application/success`)
- [ ] 매장 대시보드 (`/partner/dashboard`)

### **Phase 4: 고급 관리 기능 (Week 4)**
- [ ] 메뉴 관리 (`/partner/menu`)
- [ ] 매장 정보 관리 (`/partner/store`)
- [ ] 정산 관리 (`/partner/settlement`)

### **Phase 5: 최적화 및 통합 (Week 5-6)**
- [ ] 공통 컴포넌트 정리
- [ ] 반응형 대응
- [ ] 접근성 개선
- [ ] 성능 최적화

---

## 💡 **개발 시 고려사항**

### **반응형 디자인**
- **모바일 퍼스트**: 모든 컴포넌트는 모바일을 우선으로 설계
- **브레이크포인트**: Tailwind CSS 표준 브레이크포인트 사용
- **터치 최적화**: 버튼과 터치 영역 최소 44px 확보

### **접근성 (A11y)**
- **키보드 네비게이션**: 모든 인터랙티브 요소 키보드 접근 가능
- **스크린 리더**: ARIA 레이블과 역할 명시
- **색상 대비**: WCAG 2.1 AA 기준 준수

### **성능 최적화**
- **이미지 최적화**: Next.js Image 컴포넌트 활용
- **지연 로딩**: 스크롤 기반 컴포넌트 레이지 로딩
- **코드 분할**: 페이지별 번들 분할

### **SEO 최적화**
- **메타 태그**: 페이지별 적절한 메타 데이터
- **구조화 데이터**: 매장 정보에 JSON-LD 적용
- **사이트맵**: 동적 사이트맵 생성

---

## 🔧 **Claude Code 활용 명령어**

### **컴포넌트 생성**
```bash
# 1. UI 기본 컴포넌트 생성
claude-code "이 문서를 참고해서 components/ui/ 폴더에 Button, Input, Card 컴포넌트 생성"

# 2. 메인 페이지 변환
claude-code "jarimae_unified_main_final.html을 참고해서 app/(main)/page.tsx 생성"

# 3. 매장 카드 컴포넌트 생성
claude-code "검색 결과 페이지의 StoreCard 컴포넌트를 components/business/StoreCard.tsx로 생성"

# 4. 예약 위젯 생성
claude-code "매장 상세 페이지의 ReservationWidget을 components/business/ReservationWidget.tsx로 생성"
```

### **페이지 변환**
```bash
# 고객용 페이지 생성
claude-code "고객 회원가입 HTML을 Next.js 14 app/auth/signup/page.tsx로 변환"
claude-code "매장 검색 HTML을 app/search/page.tsx로 변환, 지도 연동 포함"

# 사장님용 페이지 생성
claude-code "매장 대시보드 HTML을 app/partner/dashboard/page.tsx로 변환"
claude-code "메뉴 관리 HTML을 app/partner/menu/page.tsx로 변환"
```

---

**🎯 최종 목표**: HTML 프로토타입을 기반으로 한 완전한 Next.js 14 애플리케이션 구축  
**📅 완료 목표**: 6주 내 모든 페이지 변환 완료  
**🚀 다음 단계**: 메인 페이지부터 순차적으로 컴포넌트 변환 시작