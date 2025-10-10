// PathRequest Domain Types

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

