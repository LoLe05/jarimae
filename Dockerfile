# 멀티 스테이지 빌드를 사용하여 최적화된 Docker 이미지 생성
FROM node:18-alpine AS base

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일들 복사
COPY package*.json ./

# === 개발 단계 ===
FROM base AS development
# 모든 의존성 설치 (devDependencies 포함)
RUN npm ci

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 개발 서버 실행
CMD ["npm", "run", "dev"]

# === 빌드 단계 ===
FROM base AS builder

# 모든 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# Next.js 앱 빌드
RUN npm run build

# === 프로덕션 단계 ===
FROM base AS production

# 프로덕션 환경 변수 설정
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 시스템 사용자 추가 (보안)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 프로덕션 의존성만 설치
RUN npm ci --only=production && npm cache clean --force

# 빌드된 파일들 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# nextjs 사용자로 전환
USER nextjs

# 포트 노출
EXPOSE 3000

# 환경변수 설정
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 프로덕션 서버 실행
CMD ["node", "server.js"]