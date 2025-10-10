import type { Connection } from '../types'

/**
 * Connection Repository Interface
 * 연결 데이터 영속성 계층 추상화
 */
export interface IConnectionRepo {
  /**
   * 새 연결 생성
   */
  create(connection: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Connection>
  
  /**
   * ID로 연결 조회
   */
  findById(id: string): Promise<Connection | null>
  
  /**
   * 사용자의 모든 연결 조회
   */
  findByUserId(userId: string): Promise<Connection[]>
  
  /**
   * 특정 노드의 연결 조회
   */
  findByNodeId(nodeId: string): Promise<Connection[]>
  
  /**
   * 두 노드 간의 연결 조회
   */
  findByNodes(userId: string, fromNodeId: string, toNodeId: string): Promise<Connection | null>
  
  /**
   * 연결 업데이트
   */
  update(id: string, data: Partial<Connection>): Promise<Connection>
  
  /**
   * 연결 강도 업데이트
   */
  updateStrength(connectionId: string, strength: number): Promise<void>
  
  /**
   * 연결 삭제
   */
  delete(id: string): Promise<void>
  
  /**
   * 사용자의 모든 연결 삭제
   */
  deleteByUserId(userId: string): Promise<void>
  
  /**
   * 노드의 모든 연결 삭제
   */
  deleteByNodeId(nodeId: string): Promise<void>
}

