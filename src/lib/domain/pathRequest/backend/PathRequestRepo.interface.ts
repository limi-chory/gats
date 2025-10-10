import type { PathRequest } from '../types'

/**
 * Path Request Repository Interface
 * 경로 검색 요청 데이터 영속성 계층 추상화
 */
export interface IPathRequestRepo {
  /**
   * 새 경로 요청 생성
   */
  create(request: Omit<PathRequest, 'id' | 'createdAt'>): Promise<PathRequest>
  
  /**
   * ID로 경로 요청 조회
   */
  findById(id: string): Promise<PathRequest | null>
  
  /**
   * 사용자의 경로 요청 목록 조회
   */
  findByUserId(userId: string, limit?: number): Promise<PathRequest[]>
  
  /**
   * 경로 요청 업데이트
   */
  update(id: string, data: Partial<PathRequest>): Promise<PathRequest>
  
  /**
   * 검색 결과 추가
   */
  updateResults(id: string, results: PathRequest['results']): Promise<void>
  
  /**
   * 상태 업데이트
   */
  updateStatus(
    id: string,
    status: PathRequest['status'],
    processedAt?: Date
  ): Promise<void>
  
  /**
   * 경로 요청 삭제
   */
  delete(id: string): Promise<void>
  
  /**
   * 사용자의 모든 경로 요청 삭제
   */
  deleteByUserId(userId: string): Promise<void>
}

