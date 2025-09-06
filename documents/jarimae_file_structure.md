# 📁 자리매 프로젝트 파일 구조 설계

**프로젝트**: 자리매 (Next.js 14 기반)  
**작성일**: 2025-09-04  
**목적**: Claude Code를 위한 체계적 파일 구조 설계

---

## 🏗️ **프로젝트 루트 구조**

```
jarimae-web/
├── 📋 docs/                          # 프로젝트 문서
├── 🎨 design-assets/                 # 디자인 리소스
├── 🌐 src/                           # 소스 코드
├── 🧪 tests/                         # 테스트 파일
├── 🛠️ scripts/                       # 유틸리티 스크립트
├── 📦 public/                        # 정적 파일
├── ⚙️ config/                        # 설정 파일
└── 📄 [설정파일들]                    # 루트 레벨 설정
```

---

## 📋 **1. docs/ - 프로젝트 문서**

```
docs/
├── 📊 BWL.md                         # Business Work Log (개발계획서)
├── 🏗️ ARCHITECTURE.md               # 시스템 아키텍처 문서
├── 🚀 API.md                         # API 명세서
├── 💾 DATABASE.md                    # 데이터베이스 스키마
├── 🎨 UI-COMPONENTS.md               # UI 컴포넌트 가이드
├── 📱 USER-FLOWS.md                  # 사용자 플로우
├── 🔧 DEVELOPMENT.md                 # 개발환경 설정 가이드
├── 🚀 DEPLOYMENT.md                  # 배포 가이드
├── 📈 PROGRESS.md                    # 주간 진행 상황
└── 🐛 TROUBLESHOOTING.md             # 문제 해결 가이드
```

---

## 🎨 **2. design-assets/ - 디자인 리소스**

```
design-assets/
├── 🎨 color-palette/
│   ├── hazelnut-#b1967b.png
│   ├── brown-#4A2C20.png
│   └── colors.css
├── 📱 html-prototypes/               # 기존 HTML 프로토타입
│   ├── jarimae_unified_main_final.html
│   ├── jarimae_user_type_selection.html
│   ├── jarimae_customer_signup.html
│   ├── jarimae_address_collection.html
│   ├── jarimae_search_results.html
│   ├── jarimae_restaurant_detail.html
│   ├── jarimae_booking_and_payment.html
│   ├── jarimae_booking_success.html
│   ├── jarimae_user_profile_creative.html
│   ├── jarimae_partner_signup.html
│   ├── jarimae_partner_application_success.html
│   └── jarimae_partner_dashboard.html
├── 🖼️ images/
│   ├── logos/
│   ├── icons/
│   └── placeholders/
└── 📐 figma-exports/                 # 추후 Figma 파일들
```

---

## 🌐 **3. src/ - 소스 코드 (Next.js 14 App Router)**

```
src/
├── 📱 app/                           # Next.js 14 App Router
│   ├── 🏠 (main)/                   # 메인 그룹
│   │   ├── page.tsx                  # 홈페이지 (/)
│   │   ├── search/
│   │   │   └── page.tsx              # 검색 페이지 (/search)
│   │   └── restaurant/
│   │       └── [id]/
│   │           └── page.tsx          # 매장 상세 (/restaurant/[id])
│   ├── 🔐 auth/                     # 인증 관련
│   │   ├── type/
│   │   │   └── page.tsx              # 회원 유형 선택 (/auth/type)
│   │   ├── signup/
│   │   │   └── page.tsx              # 회원가입 (/auth/signup)
│   │   └── login/
│   │       └── page.tsx              # 로그인 (/auth/login)
│   ├── 📅 booking/                  # 예약 관련
│   │   ├── [id]/
│   │   │   └── page.tsx              # 예약 신청 (/booking/[id])
│   │   └── success/
│   │       └── [id]/
│   │           └── page.tsx          # 예약 완료 (/booking/success/[id])
│   ├── 🏪 partner/                  # 매장 관리자
│   │   ├── register/
│   │   │   └── page.tsx              # 매장 등록 (/partner/register)
│   │   ├── dashboard/
│   │   │   └── page.tsx              # 매장 대시보드 (/partner/dashboard)
│   │   ├── menu/
│   │   │   └── page.tsx              # 메뉴 관리 (/partner/menu)
│   │   ├── store/
│   │   │   └── page.tsx              # 매장 정보 관리 (/partner/store)
│   │   └── settlement/
│   │       └── page.tsx              # 정산 관리 (/partner/settlement)
│   ├── 👤 profile/
│   │   └── page.tsx                  # 프로필 관리 (/profile)
│   ├── 🌐 api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── verify-sms/
│   │   │       └── route.ts
│   │   ├── stores/
│   │   │   ├── route.ts              # GET, POST /api/stores
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET, PUT /api/stores/[id]
│   │   │       └── tables/
│   │   │           └── route.ts      # GET, POST /api/stores/[id]/tables
│   │   ├── reservations/
│   │   │   ├── route.ts              # GET, POST /api/reservations
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET, PUT, DELETE /api/reservations/[id]
│   │   └── tables/
│   │       └── [id]/
│   │           └── status/
│   │               └── route.ts      # PUT /api/tables/[id]/status
│   ├── 🎯 globals.css               # 전역 스타일
│   ├── 📱 layout.tsx                # 루트 레이아웃
│   ├── 🚫 not-found.tsx             # 404 페이지
│   ├── ⚠️ error.tsx                 # 에러 페이지
│   └── 📦 loading.tsx               # 로딩 페이지
├── 🧩 components/                   # 재사용 컴포넌트
│   ├── 🎨 ui/                       # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Tabs.tsx
│   │   └── index.ts                  # 배럴 익스포트
│   ├── 📋 forms/                    # 폼 컴포넌트
│   │   ├── SignupForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── ReservationForm.tsx
│   │   └── StoreRegistrationForm.tsx
│   ├── 🏪 store/                    # 매장 관련 컴포넌트
│   │   ├── StoreCard.tsx
│   │   ├── StoreList.tsx
│   │   ├── StoreDetail.tsx
│   │   └── TableLayout.tsx
│   ├── 📅 booking/                  # 예약 관련 컴포넌트
│   │   ├── ReservationWidget.tsx
│   │   ├── BookingFlow.tsx
│   │   └── PaymentDummy.tsx
│   ├── 🗺️ map/                      # 지도 관련 컴포넌트
│   │   ├── NaverMap.tsx
│   │   ├── MapPlaceholder.tsx
│   │   └── StoreMarker.tsx
│   ├── 🎛️ dashboard/                # 대시보드 컴포넌트
│   │   ├── CustomerDashboard.tsx
│   │   ├── PartnerDashboard.tsx
│   │   ├── ReservationList.tsx
│   │   └── Statistics.tsx
│   ├── 🚇 navigation/               # 네비게이션 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   └── 🔧 providers/                # Context Providers
│       ├── AuthProvider.tsx
│       ├── ThemeProvider.tsx
│       └── ToastProvider.tsx
├── 🪝 hooks/                        # 커스텀 훅
│   ├── useAuth.ts
│   ├── useReservation.ts
│   ├── useStore.ts
│   └── useGeolocation.ts
├── 🛠️ lib/                          # 유틸리티 라이브러리
│   ├── 🔐 auth.ts                   # NextAuth 설정
│   ├── 💾 db.ts                     # Prisma 클라이언트
│   ├── 🎨 utils.ts                  # 유틸리티 함수
│   ├── 📊 validations.ts            # Zod 스키마
│   ├── 🌐 api.ts                    # API 클라이언트
│   └── 📍 maps.ts                   # 지도 API 관련
├── 🎨 styles/                       # 스타일 파일
│   ├── globals.css
│   ├── components.css
│   └── tailwind.css
├── 🗂️ types/                        # TypeScript 타입 정의
│   ├── auth.ts
│   ├── store.ts
│   ├── reservation.ts
│   ├── user.ts
│   └── api.ts
└── 📁 constants/                    # 상수 정의
    ├── routes.ts
    ├── api-endpoints.ts
    ├── colors.ts
    └── config.ts
```

---

## 🧪 **4. tests/ - 테스트 파일**

```
tests/
├── 🔬 unit/                         # 유닛 테스트
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── utils/
├── 🎭 integration/                  # 통합 테스트
│   ├── auth/
│   ├── api/
│   └── database/
├── 🌐 e2e/                         # E2E 테스트
│   ├── user-flows/
│   ├── booking-flow.spec.ts
│   └── partner-flow.spec.ts
└── 🧪 __fixtures__/                # 테스트 데이터
    ├── users.json
    ├── stores.json
    └── reservations.json
```

---

## 🛠️ **5. scripts/ - 유틸리티 스크립트**

```
scripts/
├── 🗄️ db-seed.ts                   # 데이터베이스 시드
├── 🔄 migrate.ts                   # 마이그레이션 스크립트
├── 🧹 cleanup.ts                   # 정리 스크립트
├── 📊 generate-docs.ts             # 문서 자동 생성
└── 🚀 deploy.ts                    # 배포 스크립트
```

---

## 📦 **6. public/ - 정적 파일**

```
public/
├── 🖼️ images/
│   ├── logo/
│   │   ├── logo.svg
│   │   ├── logo-light.svg
│   │   └── favicon.ico
│   ├── placeholders/
│   │   ├── restaurant-placeholder.jpg
│   │   ├── user-avatar.png
│   │   └── map-placeholder.png
│   └── icons/
│       ├── reservation.svg
│       ├── delivery.svg
│       └── waiting.svg
├── 📄 docs/                        # 정적 문서
│   └── privacy-policy.pdf
└── 🤖 robots.txt
```

---

## ⚙️ **7. config/ - 설정 파일**

```
config/
├── 💾 database.ts                  # 데이터베이스 설정
├── 🔐 auth.ts                      # 인증 설정
├── 🗺️ maps.ts                      # 지도 API 설정
├── 📧 email.ts                     # 이메일 설정
├── 📱 sms.ts                       # SMS 설정
└── 🌐 api.ts                       # API 설정
```

---

## 📄 **8. 루트 레벨 설정 파일**

```
jarimae-web/
├── 📦 package.json                 # NPM 패키지 설정
├── 📝 package-lock.json            # 패키지 락 파일
├── ⚙️ next.config.js               # Next.js 설정
├── 🎨 tailwind.config.js           # Tailwind CSS 설정
├── 📝 tsconfig.json                # TypeScript 설정
├── 💾 prisma/
│   ├── schema.prisma               # Prisma 스키마
│   ├── migrations/                 # 마이그레이션 파일
│   └── seed.ts                     # 시드 데이터
├── 🔧 .env.local                   # 환경변수 (로컬)
├── 🔧 .env.example                 # 환경변수 예시
├── 🚫 .gitignore                   # Git 무시 파일
├── 📄 README.md                    # 프로젝트 설명
├── 📋 CHANGELOG.md                 # 변경사항 로그
├── ⚖️ LICENSE                      # 라이선스
├── 🔧 .eslintrc.json               # ESLint 설정
├── 🎨 .prettierrc                  # Prettier 설정
├── 📋 .vscode/
│   ├── settings.json               # VSCode 설정
│   └── extensions.json             # 권장 확장프로그램
└── 🐳 docker-compose.yml           # Docker 설정 (개발용)
```

---

## 🎯 **Claude Code 활용을 위한 핵심 파일**

### **우선 생성할 문서들**
```
docs/
├── 📊 BWL.md                       # ✅ 이미 완성
├── 🏗️ ARCHITECTURE.md             # 시스템 구조 가이드
├── 🚀 API.md                       # API 명세서
├── 💾 DATABASE.md                  # DB 스키마
└── 🎨 UI-COMPONENTS.md             # 컴포넌트 가이드
```

### **HTML 프로토타입 위치**
```
design-assets/html-prototypes/
├── jarimae_unified_main_final.html # 메인 페이지
├── jarimae_user_type_selection.html # 회원 유형 선택
├── jarimae_customer_signup.html   # 고객 가입
└── [나머지 9개 파일...]
```

---

## 🚀 **Claude Code 작업 순서**

### **1단계: 프로젝트 초기화**
```bash
claude-code "이 파일구조에 따라 Next.js 14 프로젝트 초기화"
```

### **2단계: 문서 기반 개발**
```bash
claude-code "BWL.md와 ARCHITECTURE.md를 참고해서 기본 구조 생성"
```

### **3단계: HTML 컴포넌트 전환**
```bash
claude-code "design-assets/html-prototypes/ 파일들을 src/app/ 구조로 전환"
```

---

**🎯 목적**: 이 파일 구조를 Claude Code에게 제공하여 체계적이고 일관된 개발이 가능하도록 설계했습니다!