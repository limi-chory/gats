# **서비스 개요**

"연락처 속 500명, 당신은 그중 5명만 기억합니다. 나머지 495명이 당신의 기회입니다."
투자자를 만나고 싶거나, 구글에 지원하고 싶거나, 특정 업계 전문가와 연결되고 싶을 때 — 당신은 분명 그 사람을 아는 누군가를 알고 있습니다. 하지만 누군지, 어떻게 부탁해야 할지 모릅니다.
GATS는 AI로 당신의 전체 네트워크를 분석해서 가장 짧은 연결 경로를 보여줍니다. "시리즈 A 투자자를 만나고 싶다"고 하면, "민수에게 부탁 → 민수가 지혜를 연결 → 지혜가 그 투자자와 골프 친구"라고 알려줍니다.
각 단계마다 당사자가 동의해야만 연결되기 때문에, 신뢰는 유지됩니다.
잠자던 인맥을 당신의 최강 무기로 만들어드립니다 — 똑똑한 소개, 단 한 번으로.

핵심 사용자 가치:
"내가 이미 아는 사람들을 통해, 필요한 누구든 만날 수 있다."

# **GATS MVP 핵심 User Stories (사용자 여정 순서)**

---

## **1단계: 온보딩 & 네트워크 구축**

**US-01. 첫 프로필 생성**
- *As a* 새 사용자,
- *I want to* 내 기본 정보(이름, 학교, 회사, 관심사)를 5분 안에 입력하고
- *So that* 다른 사람들이 나를 찾고 연결할 수 있다.

**US-02. 연락처 동기화**
- *As a* 사용자,
- *I want to* 내 연락처를 한 번의 클릭으로 동기화하고
- *So that* GATS가 내 네트워크의 기본 구조를 파악할 수 있다.

**US-03. 네트워크 초기 매칭**
- *As a* 사용자,
- *I want to* 내 연락처 중 누가 이미 GATS를 쓰고 있는지 자동으로 확인되고
- *So that* 즉시 연결 가능한 네트워크가 형성된다.

---

## **2단계: 네트워크 이해하기**

**US-04. 네트워크 시각화 맵 보기**
- *As a* 사용자,
- *I want to* 내 인맥을 그룹별(학교/회사/취미 등)로 클러스터링된 맵으로 보고
- *So that* 내가 어떤 네트워크를 가지고 있는지 한눈에 이해할 수 있다.

---

## **3단계: 연결 찾기 (핵심 가치)**

**US-05. AI에게 연결 요청하기**
- *As a* 사용자,
- *I want to* "시리즈 A 투자자 찾아줘" 또는 "네이버 다니는 개발자 소개받고 싶어" 같은 자연어로 요청하고
- *So that* AI가 내 네트워크를 검색해서 가능한 경로를 찾아준다.

**US-06. 연결 경로 확인**
- *As a* 사용자,
- *I want to* "나 → A(친구) → B(친구의 친구) → 목표 인물" 형태로 최단 경로를 시각적으로 보고
- *So that* 어떤 루트로 접근할지 선택할 수 있다.

---

## **4단계: 연결 요청 & 중간자 동의**

**US-07. 중간 연결자에게 요청 보내기**
- *As a* 사용자,
- *I want to* 선택한 경로의 첫 번째 사람(내 친구)에게 "이 사람 소개 좀 부탁해도 될까?"라는 메시지를 템플릿으로 보내고
- *So that* 부담 없이 도움을 요청할 수 있다.

**US-08. 중간자의 동의/거절 처리**
- *As a* 중간 연결자,
- *I want to* 소개 요청을 받으면 "수락" 또는 "정중히 거절" 버튼으로 응답하고
- *So that* 내가 편한 범위 내에서만 네트워크를 공유할 수 있다.

---

## **5단계: 연결 성사**

**US-09. 최종 연결 알림**
- *As a* 요청자,
- *I want to* 모든 중간자가 동의하면 최종 목표 인물의 연락처(또는 소개 메시지)를 받고
- *So that* 직접 연락을 시작할 수 있다.

---

## **끊긴 고리 없는 최소 여정 (MVP Core Flow)**

가입 → 프로필 입력 → 연락처 동기화 → 
맵 확인 → "○○ 찾아줘" 요청 → 경로 확인 → 
중간자에게 요청 → 중간자 수락 → 최종 연결 → 피드백


이 기능들만 있어도 핵심 가치인 **"잠자는 인맥으로 필요한 사람 찾기"**는 작동합니다.

# 📁 GATS 프로젝트 전체 구조 (DDD 기반)
**DB 및 백엔드 계층 설계 완료, 프론트엔드 계층은 다음 단계에서 구현**

## 🏗️ 전체 폴더 구조

```
gats/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── user/
│   │   │   │   ├── profile/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── verify-phone/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── contact/
│   │   │   │   ├── sync/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── match/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── network/
│   │   │   │   ├── map/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── nodes/
│   │   │   │   │   └── route.ts
│   │   │   │   └── clusters/
│   │   │   │       └── route.ts
│   │   │   ├── path/
│   │   │   │   ├── search/
│   │   │   │   │   └── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── introduction/
│   │   │       ├── request/
│   │   │       │   └── route.ts
│   │   │       ├── [id]/
│   │   │       │   ├── respond/
│   │   │       │   │   └── route.ts
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── lib/
│   │   ├── domain/
│   │   │   ├── user/
│   │   │   │   ├── types.ts
│   │   │   │   └── backend/
│   │   │   │       ├── UserService.ts
│   │   │   │       ├── AuthService.ts
│   │   │   │       ├── ProfileService.ts
│   │   │   │       ├── UserRepo.interface.ts
│   │   │   │       └── SqliteUserRepo.ts
│   │   │   ├── contact/
│   │   │   │   ├── types.ts
│   │   │   │   └── backend/
│   │   │   │       ├── ContactSyncService.ts
│   │   │   │       ├── ContactMatchService.ts
│   │   │   │       ├── EncryptionService.ts
│   │   │   │       ├── ContactRepo.interface.ts
│   │   │   │       └── SqliteContactRepo.ts
│   │   │   ├── networkNode/
│   │   │   │   ├── types.ts
│   │   │   │   └── backend/
│   │   │   │       ├── NetworkMapService.ts
│   │   │   │       ├── NodeClusteringService.ts
│   │   │   │       ├── NodeEstimationService.ts
│   │   │   │       ├── NetworkNodeRepo.interface.ts
│   │   │   │       └── SqliteNetworkNodeRepo.ts
│   │   │   ├── connection/
│   │   │   │   ├── types.ts
│   │   │   │   └── backend/
│   │   │   │       ├── ConnectionService.ts
│   │   │   │       ├── ConnectionStrengthCalculator.ts
│   │   │   │       ├── ConnectionRepo.interface.ts
│   │   │   │       └── SqliteConnectionRepo.ts
│   │   │   ├── pathRequest/
│   │   │   │   ├── types.ts
│   │   │   │   └── backend/
│   │   │   │       ├── PathFinderService.ts
│   │   │   │       ├── QueryParserService.ts
│   │   │   │       ├── PathRankingService.ts
│   │   │   │       ├── PathRequestRepo.interface.ts
│   │   │   │       └── SqlitePathRequestRepo.ts
│   │   │   └── introductionFlow/
│   │   │       ├── types.ts
│   │   │       └── backend/
│   │   │           ├── IntroductionOrchestrator.ts
│   │   │           ├── NotificationService.ts
│   │   │           ├── TemplateService.ts
│   │   │           ├── IntroductionRepo.interface.ts
│   │   │           └── SqliteIntroductionRepo.ts
│   │   │
│   │   ├── security/
│   │   │   ├── crypto.ts
│   │   │   └── phoneValidator.ts
│   │   │
│   │   └── sqlite/
│   │       ├── db.ts
│   │       ├── migrations/
│   │       │   ├── 001_create_users_table.sql
│   │       │   ├── 002_create_contacts_table.sql
│   │       │   ├── 003_create_network_nodes_table.sql
│   │       │   ├── 004_create_connections_table.sql
│   │       │   ├── 005_create_path_requests_table.sql
│   │       │   └── 006_create_introduction_flows_table.sql
│   │       └── scripts/
│   │           ├── migrate.ts
│   │           └── seed.ts
│   │
│   └── middleware.ts
│
├── .env.local
├── package.json
└── tsconfig.json
```

## 📝 Domain Types 전체 정의

### 1️⃣ **User Domain**

```typescript
// src/lib/domain/user/types.ts
export interface User {
  id: string
  clerkUserId?: string           // Clerk 연동
  phoneNumber: string             // 암호화 저장
  phoneHash: string               // 매칭용 해시
  name: string
  company?: string
  school?: string
  interests: string[]
  profileVisibility: 'public' | 'connections_only' | 'ghost_mode'
  userSalt: string                // 개인별 salt
  isVerified: boolean             // 전화번호 인증 여부
  createdAt: Date
  updatedAt: Date
  lastSyncAt?: Date
}

export interface CreateUserInput {
  clerkUserId?: string
  phoneNumber: string
  name: string
  company?: string
  school?: string
  interests?: string[]
}

export interface UpdateUserInput {
  name?: string
  company?: string
  school?: string
  interests?: string[]
  profileVisibility?: 'public' | 'connections_only' | 'ghost_mode'
}

export interface PhoneVerificationRequest {
  phoneNumber: string
  code?: string
}

export interface PhoneVerificationResponse {
  verificationId: string
  status: 'pending' | 'verified'
  expiresAt: Date
}

export interface UserProfile {
  id: string
  name: string
  company?: string
  school?: string
  interests: string[]
  profileVisibility: string
  connectionCount?: number
  isVerified: boolean
}
```

### 2️⃣ **Contact Domain**

```typescript
// src/lib/domain/contact/types.ts
export interface Contact {
  id: string
  userId: string                  // 소유자
  phoneHash: string               // bcrypt 해시 (매칭용)
  encryptedPhone: string          // AES 암호화 (표시용)
  encryptedName: string           // AES 암호화
  originalName: string            // 연락처 원본 이름
  matchedUserId?: string          // GATS 사용자 매칭
  tags: string[]                  // 그룹 태그
  syncedAt: Date
  createdAt: Date
}

export interface ContactSyncBatch {
  userId: string
  contacts: RawContact[]
  syncId: string                  // 동기화 세션 ID
  timestamp: Date
}

export interface RawContact {
  phoneNumber: string
  name: string
  tags?: string[]
}

export interface ContactMatch {
  contactId: string
  matchedUserId: string
  matchConfidence: number         // 0-100
  matchedAt: Date
}

export interface ContactSyncResult {
  totalContacts: number
  newContacts: number
  updatedContacts: number
  matchedUsers: number
  errors: string[]
}

export interface ContactGroup {
  id: string
  userId: string
  name: string
  contactIds: string[]
  color?: string
  createdAt: Date
}
```

### 3️⃣ **NetworkNode Domain**

```typescript
// src/lib/domain/networkNode/types.ts
export interface NetworkNode {
  id: string
  userId: string                   // 네트워크 소유자
  nodeType: 'user' | 'contact'
  targetUserId?: string            // user 타입일 때
  contactId?: string               // contact 타입일 때
  
  // 표시 정보
  displayName: string
  initials: string                 // 아바타용
  avatarUrl?: string
  
  // AI 추정 정보
  estimatedInfo?: {
    company?: string
    school?: string
    role?: string
    location?: string
    confidence: number             // 0-100
    source: 'profile' | 'common_contacts' | 'pattern'
  }
  
  // 시각화 정보
  visualization: {
    position: { x: number; y: number }
    clusterId?: string
    color?: string                 // 클러스터 색상
    size: number                   // 노드 크기 (연결 수 기반)
    layer: number                  // 0=나, 1=1촌, 2=2촌
  }
  
  // 메타데이터
  connectionCount: number          // 연결된 노드 수
  isHidden: boolean
  isPinned: boolean                // 고정 노드
  updatedAt: Date
}

export interface NetworkCluster {
  id: string
  userId: string
  name: string                     // "대학 동기", "현 직장" 등
  type: 'school' | 'company' | 'location' | 'custom'
  nodeIds: string[]
  color: string
  centroid: { x: number; y: number }
  metadata?: {
    schoolName?: string
    companyName?: string
    location?: string
  }
}

export interface NetworkMapView {
  userId: string
  zoom: number
  center: { x: number; y: number }
  visibleClusters: string[]
  hiddenNodes: string[]
  selectedNodeId?: string
  filterCriteria?: {
    nodeType?: 'user' | 'contact' | 'all'
    clusters?: string[]
    searchTerm?: string
  }
}

export interface NetworkMapData {
  nodes: NetworkNode[]
  clusters: NetworkCluster[]
  connections: Array<{
    fromNodeId: string
    toNodeId: string
    strength: number
  }>
  stats: {
    totalNodes: number
    totalConnections: number
    avgConnectionStrength: number
  }
}
```

### 4️⃣ **Connection Domain**

```typescript
// src/lib/domain/connection/types.ts
export interface Connection {
  id: string
  userId: string                   // 연결 소유자
  fromNodeId: string
  toNodeId: string
  
  // 관계 정보
  strength: number                 // 0-100
  type: ConnectionType
  isMutual: boolean                // 양방향 저장 여부
  isActive: boolean                // 활성 연결
  
  // 관계 맥락
  context?: {
    source: 'contact' | 'introduction' | 'inferred'
    sharedGroups?: string[]        // 공통 그룹/클러스터
    lastInteraction?: Date
    interactionCount?: number
  }
  
  createdAt: Date
  updatedAt: Date
}

export type ConnectionType = 
  | 'friend'
  | 'colleague'
  | 'family'
  | 'schoolmate'
  | 'business'
  | 'other'

export interface ConnectionStrength {
  connectionId: string
  factors: {
    mutualContact: number           // 양방향 저장 (0 or 40)
    sharedConnections: number       // 공통 지인 수 (0-30)
    sameCluster: number             // 같은 그룹 (0-20)
    recentInteraction: number       // 최근 상호작용 (0-10)
  }
  totalScore: number                // 0-100
  calculatedAt: Date
}

export interface ConnectionAnalysis {
  userId: string
  strongConnections: string[]      // 70+ strength
  mediumConnections: string[]       // 40-69 strength
  weakConnections: string[]         // 0-39 strength
  bridgeNodes: string[]             // 다른 클러스터 연결 노드
  isolatedNodes: string[]           // 연결 없는 노드
}
```

### 5️⃣ **PathRequest Domain**

```typescript
// src/lib/domain/pathRequest/types.ts
export interface PathRequest {
  id: string
  userId: string
  
  // 검색 쿼리
  query: string                     // 원본 자연어 쿼리
  queryType: 'natural' | 'structured'
  
  // 파싱된 검색 조건
  parsedCriteria: {
    companies?: string[]            // ["네이버", "카카오"]
    schools?: string[]
    roles?: string[]                // ["개발자", "디자이너"]
    skills?: string[]
    keywords?: string[]             // 기타 키워드
    location?: string
  }
  
  // 검색 설정
  searchConfig: {
    maxDepth: number                // 최대 촌수 (2 or 3)
    maxResults: number              // 최대 결과 수
    minConfidence: number           // 최소 신뢰도
    includeNonUsers: boolean        // 비가입자 포함
  }
  
  // 검색 결과
  results: PathResult[]
  
  // 메타데이터
  status: 'pending' | 'processing' | 'completed' | 'failed'
  processedAt?: Date
  createdAt: Date
}

export interface PathResult {
  id: string
  requestId: string
  
  // 경로 정보
  path: PathNode[]                  // 상세 경로 노드
  depth: number                     // 촌수
  
  // 평가 지표
  confidence: number                // 0-100 (매칭 정확도)
  pathStrength: number              // 0-100 (경로 강도)
  
  // 타겟 정보
  targetNode: {
    nodeId: string
    userId?: string                 // 가입자인 경우
    name: string
    company?: string
    role?: string
    matchedCriteria: string[]       // 매칭된 조건들
  }
  
  rank: number                      // 순위
}

export interface PathNode {
  nodeId: string
  userId?: string
  name: string
  company?: string
  role?: string
  connectionStrength: number        // 이전 노드와의 연결 강도
  isGatsUser: boolean
}

export interface ParsedQuery {
  intent: 'find_person' | 'find_role' | 'find_company'
  entities: {
    companies: string[]
    roles: string[]
    skills: string[]
    names: string[]
    locations: string[]
  }
  confidence: number
}

export interface SearchHistory {
  userId: string
  searches: Array<{
    query: string
    timestamp: Date
    resultCount: number
  }>
}
```

### 6️⃣ **IntroductionFlow Domain**

```typescript
// src/lib/domain/introductionFlow/types.ts
export interface IntroductionFlow {
  id: string
  pathRequestId: string             // 원본 검색 요청
  requesterId: string                // 요청자
  targetNodeId: string               // 최종 목표
  
  // 경로 정보
  path: string[]                    // 사용자 ID 배열
  pathDetails: IntroductionNode[]   // 상세 경로 정보
  
  // 상태 관리
  currentStep: number
  status: IntroductionStatus
  
  // 단계별 진행
  steps: IntroductionStep[]
  
  // 메시지 템플릿
  messageTemplate?: {
    subject: string
    body: string
    variables: Record<string, string>
  }
  
  // 최종 결과
  completionInfo?: {
    sharedContact?: {
      phoneNumber: string
      name: string
    }
    introductionMessage?: string
    completedAt: Date
  }
  
  // 메타데이터
  expiresAt: Date                   // 72시간 후
  createdAt: Date
  updatedAt: Date
}

export type IntroductionStatus = 
  | 'draft'                          // 작성 중
  | 'pending'                        // 대기 중
  | 'in_progress'                    // 진행 중
  | 'completed'                      // 완료
  | 'failed'                         // 실패
  | 'expired'                        // 만료
  | 'cancelled'                      // 취소됨

export interface IntroductionStep {
  stepNumber: number
  fromUserId: string
  toUserId: string
  
  // 요청 정보
  request: {
    message: string
    sentAt: Date
    expiresAt: Date
  }
  
  // 응답 정보
  response?: {
    status: 'accepted' | 'declined'
    message?: string                 // 거절 사유 등
    respondedAt: Date
  }
  
  // 알림 설정
  notifications: {
    reminderSent: boolean
    reminderCount: number
  }
}

export interface IntroductionNode {
  userId: string
  name: string
  company?: string
  role?: string
  relationToNext?: string           // "대학 동기", "전 직장 동료" 등
}

export interface IntroductionTemplate {
  id: string
  name: string
  category: 'business' | 'job' | 'investment' | 'general'
  subject: string
  body: string
  variables: string[]               // ["requesterName", "targetRole", ...]
  isDefault: boolean
}

export interface IntroductionNotification {
  flowId: string
  stepNumber: number
  userId: string                    // 수신자
  type: 'new_request' | 'reminder' | 'accepted' | 'declined' | 'completed'
  sentAt: Date
  channel: 'push' | 'email' | 'sms'
  delivered: boolean
}

export interface IntroductionStats {
  userId: string
  totalRequests: number
  successRate: number
  avgCompletionTime: number         // hours
  topIntroducers: Array<{
    userId: string
    name: string
    successCount: number
  }>
}
```

## 🔐 Clerk 통합 (middleware.ts)

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
])

// API routes that require authentication
const isApiRoute = createRouteMatcher([
  '/api/user(.*)',
  '/api/contact(.*)',
  '/api/network(.*)',
  '/api/path(.*)',
  '/api/introduction(.*)',
])

export default clerkMiddleware((auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) return
  
  // Protect API routes
  if (isApiRoute(req)) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

## 📊 Database Schema

```sql
-- src/lib/sqlite/migrations/001_create_users_table.sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT UNIQUE,
  phone_number TEXT NOT NULL,  -- encrypted
  phone_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company TEXT,
  school TEXT,
  interests TEXT,  -- JSON array
  profile_visibility TEXT DEFAULT 'public',
  user_salt TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_sync_at DATETIME
);

CREATE INDEX idx_users_phone_hash ON users(phone_hash);
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
```
