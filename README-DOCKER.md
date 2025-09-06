# 🐳 자리매 Docker 가이드

## 📋 필요 조건

- Docker Desktop 또는 Docker Engine
- Docker Compose v2.0 이상

## 🚀 빠른 시작

### 개발 환경에서 실행

```bash
# Docker Compose로 개발 서버 시작
docker-compose up

# 백그라운드에서 실행
docker-compose up -d

# 특정 서비스만 실행
docker-compose up web
```

### 프로덕션 환경에서 실행

```bash
# 프로덕션 환경으로 실행
docker-compose -f docker-compose.prod.yml up

# 백그라운드에서 실행
docker-compose -f docker-compose.prod.yml up -d
```

## 🛠️ Docker 명령어 모음

### 기본 명령어
```bash
# 모든 서비스 시작
docker-compose up

# 모든 서비스 중지
docker-compose down

# 모든 서비스 중지 및 볼륨 제거
docker-compose down -v

# 로그 확인
docker-compose logs

# 특정 서비스 로그 확인
docker-compose logs web

# 실시간 로그 보기
docker-compose logs -f web
```

### 개발 명령어
```bash
# 컨테이너 내부 접속
docker-compose exec web sh

# 새 패키지 설치 후 컨테이너 재시작
docker-compose down
docker-compose up --build

# 캐시 없이 빌드
docker-compose build --no-cache
```

### 데이터베이스 명령어
```bash
# PostgreSQL 컨테이너 접속
docker-compose exec postgres psql -U jarimae_user -d jarimae

# Redis 컨테이너 접속
docker-compose exec redis redis-cli

# 데이터베이스 백업
docker-compose exec postgres pg_dump -U jarimae_user jarimae > backup.sql

# 데이터베이스 복원
docker-compose exec -T postgres psql -U jarimae_user jarimae < backup.sql
```

## 🔧 서비스 구성

### 개발 환경 (docker-compose.yml)

| 서비스 | 포트 | 설명 |
|--------|------|------|
| web | 3000 | Next.js 애플리케이션 |
| postgres | 5432 | PostgreSQL 데이터베이스 |
| redis | 6379 | Redis 캐시 |

### 프로덕션 환경 (docker-compose.prod.yml)

| 서비스 | 포트 | 설명 |
|--------|------|------|
| web | 3000 | Next.js 애플리케이션 (내부) |
| nginx | 80, 443 | 리버스 프록시 |
| postgres | 5432 | PostgreSQL 데이터베이스 (내부) |
| redis | 6379 | Redis 캐시 (내부) |

## 🌍 환경 변수

개발 환경에서는 `.env.local` 파일을 생성하여 환경 변수를 설정하세요:

```env
# 데이터베이스
DATABASE_URL=postgresql://jarimae_user:jarimae_password@localhost:5432/jarimae

# Redis
REDIS_URL=redis://localhost:6379

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_TELEMETRY_DISABLED=1

# 인증 (예시)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 🔒 SSL 인증서 설정 (프로덕션)

프로덕션에서 HTTPS를 사용하려면 SSL 인증서가 필요합니다:

```bash
# ssl 디렉토리 생성
mkdir ssl

# 자체 서명 인증서 생성 (개발용)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem

# Let's Encrypt 인증서 사용 (프로덕션용)
# certbot을 사용하여 인증서를 발급받고 ssl/ 디렉토리에 복사
```

## 🐛 트러블슈팅

### 포트 충돌 오류
```bash
# 사용 중인 포트 확인
netstat -tulpn | grep :3000

# 다른 포트로 실행
docker-compose up -e "PORT=3001"
```

### 권한 오류 (Windows)
```bash
# Docker Desktop에서 파일 공유 설정 확인
# Settings > Resources > File Sharing
```

### 빌드 오류
```bash
# 모든 캐시 삭제 후 재빌드
docker system prune -a
docker-compose build --no-cache
```

### 데이터베이스 연결 오류
```bash
# PostgreSQL 컨테이너 상태 확인
docker-compose ps postgres

# 데이터베이스 로그 확인
docker-compose logs postgres
```

## 📊 모니터링

### 리소스 사용량 확인
```bash
# 컨테이너 리소스 사용량
docker stats

# Docker Compose 서비스 상태
docker-compose ps
```

### 로그 관리
```bash
# 로그 로테이션 설정 (docker-compose.yml)
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 🚀 배포 팁

### 프로덕션 배포 체크리스트
- [ ] 환경 변수 설정 확인
- [ ] SSL 인증서 설정
- [ ] 데이터베이스 백업 설정
- [ ] 로그 관리 설정
- [ ] 리소스 제한 설정
- [ ] Health Check 설정

### CI/CD 파이프라인 예시
```yaml
# .github/workflows/deploy.yml
- name: Deploy to production
  run: |
    docker-compose -f docker-compose.prod.yml pull
    docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 고급 설정

### Multi-stage Build 최적화
Dockerfile에서 3단계 빌드를 사용하여 이미지 크기 최적화:
1. Development: 개발 의존성 포함
2. Builder: 프로덕션 빌드 생성
3. Production: 최소한의 런타임만 포함

### 볼륨 관리
```bash
# 볼륨 목록 확인
docker volume ls

# 사용하지 않는 볼륨 정리
docker volume prune

# 특정 볼륨 삭제
docker volume rm jarimae_postgres_data
```

이제 Docker를 사용하여 자리매 애플리케이션을 쉽게 개발하고 배포할 수 있습니다! 🎉