// Connection Domain Types

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

