# GATS - 네트워크 연결 플랫폼

"연락처 속 500명, 당신은 그중 5명만 기억합니다. 나머지 495명이 당신의 기회입니다."

GATS는 AI로 당신의 전체 네트워크를 분석해서 가장 짧은 연결 경로를 보여주는 플랫폼입니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js 20+
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어서 필요한 값들을 설정하세요

# 데이터베이스 마이그레이션 실행
npm run db:migrate up

# (선택사항) 개발용 시드 데이터 생성
npm run db:seed
```

### 환경 변수 설정

#### 1. Clerk 설정

1. [Clerk Dashboard](https://dashboard.clerk.com)에서 새 애플리케이션을 만듭니다
2. Dashboard에서 다음 키를 복사합니다:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: API Keys 섹션의 Publishable Key
   - `CLERK_SECRET_KEY`: API Keys 섹션의 Secret Key
3. `.env.local` 파일에 추가합니다

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Clerk 통합 확인:**
- ✅ `middleware.ts`에서 `clerkMiddleware()` 사용
- ✅ `app/layout.tsx`에서 `<ClerkProvider>` 래핑
- ✅ 올바른 import: `@clerk/nextjs` 및 `@clerk/nextjs/server`

#### 2. 암호화 키 생성

```bash
# 암호화 마스터 키 생성 (64자 hex 문자열)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

생성된 값을 `.env.local`의 `ENCRYPTION_MASTER_KEY`에 설정하세요.

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요.

## 📁 프로젝트 구조

```
gats/
├── src/
│   ├── app/                    # Next.js App Router
│   │   └── api/               # API 라우트
│   ├── lib/
│   │   ├── domain/            # DDD 도메인 계층
│   │   │   ├── user/          # 사용자 도메인
│   │   │   ├── contact/       # 연락처 도메인
│   │   │   ├── networkNode/   # 네트워크 노드 도메인
│   │   │   ├── connection/    # 연결 도메인
│   │   │   ├── pathRequest/   # 경로 검색 도메인
│   │   │   └── introductionFlow/ # 소개 플로우 도메인
│   │   ├── security/          # 보안 유틸리티
│   │   └── sqlite/            # 데이터베이스
│   │       ├── migrations/    # 마이그레이션 파일
│   │       └── scripts/       # DB 스크립트
│   └── middleware.ts          # Clerk 인증 미들웨어
├── data/                      # SQLite 데이터베이스 (생성됨)
└── .env.local                 # 환경 변수 (직접 생성)
```

## 🛠️ 사용 가능한 스크립트

- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 시작
- `npm run lint` - ESLint 실행
- `npm run db:migrate up` - 마이그레이션 실행
- `npm run db:migrate status` - 마이그레이션 상태 확인
- `npm run db:seed` - 시드 데이터 생성 (개발용)

## 🏗️ 기술 스택

### Frontend & Backend
- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링

### 인증
- **Clerk** - 사용자 인증 및 관리

### 데이터베이스
- **SQLite** (better-sqlite3) - 로컬 데이터베이스
- **DDD 아키텍처** - 도메인 주도 설계

### 보안
- **bcrypt** - 전화번호 해싱 (매칭용)
- **crypto (Node.js)** - AES-256-GCM 암호화

## 📊 데이터베이스 스키마

### 주요 테이블

1. **users** - 사용자 기본 정보
2. **contacts** - 동기화된 연락처
3. **network_nodes** - 네트워크 맵 노드
4. **connections** - 노드 간 연결
5. **path_requests** - 경로 검색 요청
6. **introduction_flows** - 소개 플로우

## 🔐 보안 고려사항

### 데이터 암호화

- **전화번호**: 사용자별 salt를 사용한 AES-256-GCM 암호화
- **전화번호 매칭**: bcrypt 해시 사용 (원본 복구 불가능)
- **연락처 이름**: AES-256-GCM 암호화

### 개인정보 보호

- 모든 민감 정보는 암호화되어 저장
- 사용자별 독립적인 암호화 키 사용
- 프로필 공개 설정 지원 (public, connections_only, ghost_mode)

## 📝 개발 가이드

### 새로운 도메인 추가하기

1. `src/lib/domain/{domain}/` 디렉토리 생성
2. `types.ts` - 타입 정의
3. `backend/` 디렉토리:
   - `{Domain}Repo.interface.ts` - Repository 인터페이스
   - `Sqlite{Domain}Repo.ts` - SQLite 구현
   - `{Domain}Service.ts` - 비즈니스 로직
4. 마이그레이션 파일 생성: `src/lib/sqlite/migrations/`

### 마이그레이션 작성하기

```sql
-- src/lib/sqlite/migrations/007_create_new_table.sql
CREATE TABLE new_table (
  id TEXT PRIMARY KEY,
  -- 컬럼 정의
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_new_table_id ON new_table(id);
```

마이그레이션 실행:
```bash
npm run db:migrate up
```

## 🚧 현재 상태

✅ **완료된 기능**
- DDD 기반 백엔드 아키텍처
- 6개 도메인 구현 (User, Contact, NetworkNode, Connection, PathRequest, IntroductionFlow)
- SQLite 데이터베이스 및 마이그레이션 시스템
- Clerk 인증 미들웨어
- 보안 유틸리티 (암호화, 전화번호 검증)

⏳ **진행 중**
- API 라우트 구현
- 프론트엔드 UI 구현

## 📄 라이선스

Private

Powered by 🥝Codekiwi
