import type { NetworkNode } from '../types'

/**
 * Network Node Repository Interface
 * 네트워크 노드 데이터 영속성 계층 추상화
 */
export interface INetworkNodeRepo {
  /**
   * 새 노드 생성
   */
  create(node: Omit<NetworkNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<NetworkNode>
  
  /**
   * ID로 노드 조회
   */
  findById(id: string): Promise<NetworkNode | null>
  
  /**
   * 사용자의 모든 노드 조회
   */
  findByUserId(userId: string): Promise<NetworkNode[]>
  
  /**
   * 타겟 사용자 ID로 노드 조회
   */
  findByTargetUserId(userId: string, targetUserId: string): Promise<NetworkNode | null>
  
  /**
   * 연락처 ID로 노드 조회
   */
  findByContactId(userId: string, contactId: string): Promise<NetworkNode | null>
  
  /**
   * 노드 업데이트
   */
  update(id: string, data: Partial<NetworkNode>): Promise<NetworkNode>
  
  /**
   * 노드 삭제
   */
  delete(id: string): Promise<void>
  
  /**
   * 사용자의 모든 노드 삭제
   */
  deleteByUserId(userId: string): Promise<void>
  
  /**
   * 연결 수 업데이트
   */
  updateConnectionCount(nodeId: string, count: number): Promise<void>
  
  /**
   * 노드 위치 업데이트
   */
  updatePosition(nodeId: string, x: number, y: number): Promise<void>
}

