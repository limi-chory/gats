// NetworkNode Domain Types

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
  createdAt: Date
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

