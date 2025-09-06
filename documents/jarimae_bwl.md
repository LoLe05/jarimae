# 📊 BWL (Business Work Log) - 자리매 개발계획서

**프로젝트**: 자리매 (소상공인 예약 플랫폼)  
**작성일**: 2025-09-04  
**작성자**: PM Claude  
**버전**: v1.0  
**목표**: HTML 프로토타입 → 실제 웹 서비스 전환

---

## 🎯 **프로젝트 개요**

### **비전**
소상공인을 위한 스마트 예약 솔루션으로 공익성을 바탕으로 한 차별화된 서비스 구축

### **핵심 목표**
- **최종 목표**: 모바일 앱 출시 (웹 → 앱 순차 개발)
- **수익 모델**: 구독제 + 광고 (수수료 최소화)
- **정부 지원**: 공익성 강조를 통한 정부 지원 확보
- **차별화 요소**: 수수료 최소화 + 소상공인 친화적 정책

### **현재 자산**
- ✅ 완성된 디자인 시스템 (헤이즐넛/밤색)
- ✅ 12개 핵심 HTML 페이지 프로토타입
- ✅ 고객/사장님 사용자 플로우 설계
- ✅ 반응형 UI/UX 구현 완료

---

## 📅 **개발 로드맵**

### **Phase 1: 코어 인프라 구축 (Week 1-2)**
**목표**: MVP 웹 서비스 기반 완성

#### **Week 1: 프로젝트 초기화**
- [ ] Next.js 14 프로젝트 세팅
- [ ] TypeScript + Tailwind CSS 구성
- [ ] Supabase 데이터베이스 구축
- [ ] Prisma ORM 스키마 설계
- [ ] NextAuth.js 인증 시스템 기본 구현

#### **Week 2: 핵심 페이지 전환**
- [ ] HTML → React 컴포넌트 전환 (우선순위 페이지)
- [ ] 기본 라우팅 설정
- [ ] 레이아웃 컴포넌트 구축
- [ ] 반응형 디자인 검증

### **Phase 2: 사용자 플로우 구현 (Week 3-4)**
**목표**: 고객 예약 플로우 완성

#### **Week 3: 사용자 인증 & 메인 기능**
- [ ] 회원가입/로그인 시스템
- [ ] 고객/사장님 구분 가입
- [ ] 통합 메인 대시보드
- [ ] 검색 기능 (가상 데이터)

#### **Week 4: 예약 시스템 구현**
- [ ] 매장 목록/상세 페이지
- [ ] 예약 신청 플로우
- [ ] 더미 결제 시스템
- [ ] 예약 완료 플로우

### **Phase 3: 매장 관리 시스템 (Week 5-6)**
**목표**: 사장님 대시보드 구현

#### **Week 5: 매장 등록 시스템**
- [ ] 사장님 매장 등록
- [ ] 자동/수동 승인 시스템
- [ ] 매장 정보 관리
- [ ] 기본 대시보드

#### **Week 6: 예약 관리 기능**
- [ ] 예약 승인/거절
- [ ] 실시간 현황 대시보드
- [ ] 기본 통계 기능
- [ ] 테이블 상태 관리

### **Phase 4: 고도화 & 배포 (Week 7-8)**
**목표**: 베타 서비스 준비

#### **Week 7: 지도 연동 & 알림**
- [ ] 네이버 지도 API 연동
- [ ] SMS 알림 시스템
- [ ] 이메일 발송 기능
- [ ] 검색/필터링 고도화

#### **Week 8: 최적화 & 배포**
- [ ] 성능 최적화
- [ ] SEO 최적화
- [ ] 배포 파이프라인
- [ ] 파일럿 테스트 환경 구축

---

## 🔧 **기술 스택**

### **Frontend**
```
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: Zustand
- UI Components: Radix UI + Headless UI
```

### **Backend**
```
- Runtime: Node.js
- Framework: Next.js API Routes
- Database: PostgreSQL
- ORM: Prisma
- Authentication: NextAuth.js
```

### **Infrastructure**
```
- Hosting: Vercel
- Database: Supabase
- File Storage: Cloudinary
- Maps: 네이버 클라우드 플랫폼
- Monitoring: Vercel Analytics
```

---

## 📋 **데이터베이스 설계**

### **핵심 테이블**

#### **Users (사용자)**
```sql
id, email, name, nickname, phone
user_type (customer/owner), profile_image
created_at, updated_at
```

#### **Stores (매장)**
```sql
id, name, category, description
address, phone, business_number
owner_id (Users 참조)
operating_hours, break_time
status (pending/approved/rejected)
approval_type (auto/manual)
created_at, updated_at
```

#### **Tables (테이블)**
```sql
id, store_id (Stores 참조)
table_number, capacity, table_type
status (available/reserved/occupied)
position_x, position_y (매장 내 위치)
```

#### **Reservations (예약)**
```sql
id, store_id, customer_id, table_id
reservation_date, reservation_time
party_size, special_requests
status (pending/confirmed/cancelled/completed)
deposit_amount, payment_status
created_at, updated_at
```

#### **Reviews (리뷰)**
```sql
id, store_id, customer_id, reservation_id
rating, comment, photos
created_at, updated_at
```

---

## 🚀 **API 설계**

### **인증 관리**
```
POST /api/auth/register    # 회원가입
POST /api/auth/login       # 로그인
POST /api/auth/logout      # 로그아웃
POST /api/auth/verify-sms  # SMS 인증
```

### **매장 관리**
```
GET  /api/stores           # 매장 목록
GET  /api/stores/:id       # 매장 상세
POST /api/stores           # 매장 등록
PUT  /api/stores/:id       # 매장 정보 수정
PUT  /api/stores/:id/status # 매장 승인 상태 변경
```

### **예약 관리**
```
GET  /api/reservations          # 예약 목록
POST /api/reservations          # 예약 생성
PUT  /api/reservations/:id      # 예약 수정
DEL  /api/reservations/:id      # 예약 취소
PUT  /api/reservations/:id/status # 예약 상태 변경
```

### **테이블 관리**
```
GET  /api/stores/:id/tables     # 매장 테이블 현황
POST /api/stores/:id/tables     # 테이블 추가
PUT  /api/tables/:id/status     # 테이블 상태 변경
```

---

## 📊 **주간 진행 체크리스트**

### **Week 1 체크포인트 (40시간 목표)**
- [ ] Next.js 프로젝트 생성 및 기본 설정 **[6h]**
- [ ] Supabase 프로젝트 생성 및 DB 스키마 **[16h]**
- [ ] GitHub 레포지토리 설정 **[2h]**
- [ ] Vercel 배포 환경 구축 **[4h]**
- [ ] 기본 인증 API 구현 **[12h]**

### **Week 2 체크포인트 (40시간 목표)**
- [ ] 랜딩 페이지 React 전환 **[8h]**
- [ ] 회원가입/로그인 페이지 전환 **[16h]**
- [ ] 메인 대시보드 기본 구조 **[12h]**
- [ ] 라우팅 및 네비게이션 구현 **[4h]**

### **Week 3 체크포인트 (40시간 목표)**
- [ ] 사용자 인증 플로우 완성 **[16h]**
- [ ] 매장 검색 기능 (목업 데이터) **[8h]**
- [ ] 고객 메인 대시보드 완성 **[12h]**
- [ ] 반응형 디자인 검증 **[4h]**

### **Week 4 체크포인트 (40시간 목표)**
- [ ] 매장 상세 페이지 구현 **[14h]**
- [ ] 예약 신청 플로우 완성 **[16h]**
- [ ] 더미 결제 시스템 연동 **[6h]**
- [ ] 예약 완료 페이지 구현 **[4h]**

---

## 📈 **성능 지표 & 품질 관리**

### **코드 품질 목표**
- **컴포넌트 재사용률**: 80% 이상
- **TypeScript 커버리지**: 95% 이상
- **ESLint 오류**: 0개 유지
- **번들 크기**: < 500KB (gzipped)

### **성능 목표**
- **First Contentful Paint**: < 1.5초
- **Largest Contentful Paint**: < 2.5초
- **Time to Interactive**: < 3초
- **Cumulative Layout Shift**: < 0.1

### **테스트 커버리지 목표**
- **Unit Test 커버리지**: 70% 이상
- **E2E 테스트**: 핵심 사용자 플로우 100%
- **API 테스트**: 모든 엔드포인트 100%

---

## 🛠️ **개발 효율성 최적화**

### **Claude Code 활용 예상 효과**
- **코드 생성 속도**: 기존 대비 **50% 향상**
- **디버깅 시간**: 기존 대비 **30% 단축**
- **리팩토링 작업**: 기존 대비 **40% 단축**
- **문서 작성**: 기존 대비 **60% 단축**

### **실제 예상 개발 시간 (AI 협업 적용시)**
- **기존 예상**: 352시간
- **AI 협업 적용**: **245시간** (30% 단축)
- **단축된 시간**: 107시간
- **절약 비용**: ₩5,350,000

### **시간 단축 영역별 분석**
| 작업 영역 | 원래 시간 | 단축 후 | 단축률 |
|-----------|-----------|---------|--------|
| 반복적 코드 작성 | 80h | 40h | 50% |
| API 엔드포인트 구현 | 40h | 28h | 30% |
| 컴포넌트 구현 | 60h | 36h | 40% |
| 디버깅 & 테스트 | 40h | 28h | 30% |
| 문서화 | 20h | 8h | 60% |

---

## 📊 **일일 작업 시간 배분 권장사항**

### **효율적인 하루 일정 (8시간 기준)**
```
09:00-10:00 | 일일 플래닝 & 이슈 체크 (1h)
10:00-12:00 | 핵심 개발 작업 (2h)
12:00-13:00 | 점심 시간
13:00-15:00 | 핵심 개발 작업 (2h)
15:00-15:30 | 휴식
15:30-17:00 | 테스트 & 디버깅 (1.5h)
17:00-18:00 | 문서 업데이트 & 다음 날 계획 (1h)
```

### **주간 작업 패턴 권장**
- **월/화/수**: 신규 기능 개발 집중
- **목요일**: 테스트 & 버그 수정
- **금요일**: 리팩토링 & 문서화

---

## 🎯 **마일스톤별 달성도 측정**

### **Week 2 마일스톤 (50% 완성)**
- [ ] 프로젝트 인프라 구축 완료
- [ ] 핵심 3개 페이지 React 전환
- [ ] 기본 인증 시스템 동작
- [ ] **누적 작업 시간**: 80시간

### **Week 4 마일스톤 (MVP 완성)**
- [ ] 고객 예약 플로우 100% 동작
- [ ] 모든 핵심 페이지 구현 완료
- [ ] 모바일 반응형 100% 지원
- [ ] **누적 작업 시간**: 160시간

### **Week 6 마일스톤 (75% 완성)**
- [ ] 매장 관리 시스템 구현 완료
- [ ] 사장님 대시보드 동작
- [ ] 예약 승인/거절 시스템 완성
- [ ] **누적 작업 시간**: 240시간

### **Week 8 마일스톤 (베타 완성)**
- [ ] 전체 기능 구현 완료
- [ ] 성능 최적화 완료
- [ ] 파일럿 테스트 준비 완료
- [ ] **총 작업 시간**: 320시간 (버퍼 제외)

---

## ⚠️ **리스크 및 대응 방안**

### **기술적 리스크**
| 리스크 | 확률 | 영향도 | 대응 방안 |
|--------|------|--------|-----------|
| Next.js 14 학습 곡선 | 30% | 중간 | 공식 문서 숙지, 튜토리얼 우선 진행 |
| Supabase 연동 이슈 | 20% | 높음 | 로컬 PostgreSQL 백업 준비 |
| 지도 API 제한 | 40% | 낮음 | 네이버 → 카카오맵 전환 계획 |
| 모바일 반응형 이슈 | 25% | 중간 | 단계적 디바이스 테스트 |

### **일정 리스크**
| 리스크 | 확률 | 영향도 | 대응 방안 |
|--------|------|--------|-----------|
| 개발 지연 | 50% | 높음 | MVP 기능 축소, 우선순위 재조정 |
| 디자인 수정 요청 | 30% | 중간 | 현재 디자인 시스템 최대한 유지 |
| 추가 기능 요청 | 60% | 중간 | Phase 2 이후로 연기 |

---

## 📈 **성공 지표 (KPI)**

### **Week 4 목표 (MVP)**
- [ ] 회원가입 플로우 완성도 100%
- [ ] 예약 신청 플로우 완성도 100%
- [ ] 모바일 반응형 지원 100%
- [ ] 페이지 로딩 속도 < 3초

### **Week 8 목표 (베타)**
- [ ] 전체 기능 구현 완성도 90%
- [ ] 파일럿 매장 5곳 이상 등록
- [ ] 실제 예약 테스트 20건 이상
- [ ] 사용자 피드백 수집 시스템 구축

---

## 📞 **팀 커뮤니케이션**

### **일일 체크인**
- **시간**: 매일 오전 10시
- **형식**: 5분 스탠드업 (어제 완료/오늘 계획/블로커)
- **도구**: Notion 업데이트

### **주간 리뷰**
- **시간**: 매주 금요일 17시
- **형식**: 진행 상황 리뷰 + 다음 주 계획
- **참석자**: PM Claude + 프로젝트 오너

### **이슈 관리**
- **긴급도 높음**: 즉시 알림
- **일반 이슈**: 다음 체크인 때 논의
- **기록**: 모든 결정사항 Notion 문서화

---

## 📊 **개발 우선순위 (큰 가지 → 작은 가지)**

### **1차 개발 순서**
```
1️⃣ 랜딩 페이지 (First Impression)
   └── 브랜드 인지도 구축
   
2️⃣ 회원가입/로그인 시스템
   └── 고객/사장님 구분 가입
   └── SMS 인증 연동
   
3️⃣ 고객 메인 대시보드
   └── 통합 검색 + 내 자리매
   └── 예약/배달/웨이팅 탭
   
4️⃣ 예약 플로우
   └── 매장 검색 → 상세보기 → 예약 → 결제(더미) → 완료
```

### **2차 개발 순서**
```
5️⃣ 매장 관리자 플로우
   └── 사장님 가입 → 매장 등록 → 대시보드 → 예약 관리
   
6️⃣ 매장 승인 시스템
   └── 자동/수동 승인 옵션 구현
   
7️⃣ 실시간 알림
   └── SMS/이메일 발송 시스템
```

---

## 💡 **특별 구현 사항**

### **결제 시스템**
- **현재**: UI만 구현, 더미 플로우
- **동작**: "결제하기" 버튼 → 바로 "결제 성공" 페이지로
- **나중에**: 실제 PG사 연동 (토스페이먼츠/아임포트)

### **매장 승인 프로세스**
- **자동 승인 모드**: 매장 등록 즉시 서비스 이용 가능
- **수동 승인 모드**: 관리자 검토 후 승인
- **설정**: 사장님이 매장 등록 시 선택 가능
- **구현**: 두 플로우 모두 구현 필요

### **지도 API 전략**
- **1차**: 가상 지도 (정적 이미지)로 시작
- **2차**: 네이버 클라우드 플랫폼 Maps API (월 600만건 무료)
- **3차**: 정부지원 확보시 카카오맵으로 업그레이드

---

## 📚 **참고 자료**

### **기술 문서**
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Guide](https://next-auth.js.org/)

### **디자인 리소스**
- 자리매 HTML 프로토타입 (12개 페이지)
- 헤이즐넛/밤색 디자인 시스템
- Tailwind CSS 구성

### **외부 서비스**
- [네이버 클라우드 플랫폼 Maps API](https://www.ncloud.com/product/applicationService/maps)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Cloudinary Setup](https://cloudinary.com/documentation)

---

## 🎯 **즉시 실행 액션 아이템**

### **Claude Code와 진행할 개발 작업**
1. **Next.js 14 프로젝트 세팅** (TypeScript + Tailwind)
2. **Supabase 데이터베이스 구축** (PostgreSQL + Prisma)
3. **현재 HTML → React 컴포넌트 전환**
4. **인증 시스템 구현** (NextAuth.js)
5. **기본 API 엔드포인트** (RESTful 설계)

### **보류 사항**
- 🔒 결제 시스템: UI만 구현, 더미 플로우
- 📱 SMS 인증: 개발 완료 후 연동
- 🗺️ 지도 연동: Phase 2에서 네이버 지도 적용
- 📧 이메일 발송: Phase 3에서 구현

---

**📅 최종 업데이트**: 2025-09-04  
**🎯 다음 마일스톤**: Week 1 완료 (2025-09-11)  
**📋 담당자**: PM Claude + Claude Code 개발자

---

## 📋 **즉시 시작 가능한 TODO 리스트**

### **오늘 할 일**
- [ ] Claude Code 환경 구축 확인
- [ ] GitHub 레포지토리 생성
- [ ] Next.js 14 프로젝트 초기화
- [ ] Supabase 계정 생성 및 프로젝트 설정

### **이번 주 목표**
- [ ] 기본 프로젝트 구조 완성
- [ ] 첫 번째 페이지 (랜딩) React 전환
- [ ] 데이터베이스 스키마 설계 완료
- [ ] Vercel 배포 환경 구축

**🚀 목표**: 4주 내 MVP 웹 서비스 완성 및 파일럿 테스트 시작