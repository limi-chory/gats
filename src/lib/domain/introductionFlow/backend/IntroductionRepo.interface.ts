import type { IntroductionFlow } from '../types'

/**
 * Introduction Flow Repository Interface
 * 소개 플로우 데이터 영속성 계층 추상화
 */
export interface IIntroductionRepo {
  /**
   * 새 소개 플로우 생성
   */
  create(flow: Omit<IntroductionFlow, 'id' | 'createdAt' | 'updatedAt'>): Promise<IntroductionFlow>
  
  /**
   * ID로 소개 플로우 조회
   */
  findById(id: string): Promise<IntroductionFlow | null>
  
  /**
   * 요청자의 소개 플로우 목록 조회
   */
  findByRequesterId(requesterId: string): Promise<IntroductionFlow[]>
  
  /**
   * 특정 사용자가 관여된 소개 플로우 조회 (중간자 역할 포함)
   */
  findByUserId(userId: string): Promise<IntroductionFlow[]>
  
  /**
   * 소개 플로우 업데이트
   */
  update(id: string, data: Partial<IntroductionFlow>): Promise<IntroductionFlow>
  
  /**
   * 상태 업데이트
   */
  updateStatus(id: string, status: IntroductionFlow['status']): Promise<void>
  
  /**
   * 현재 단계 업데이트
   */
  updateCurrentStep(id: string, step: number): Promise<void>
  
  /**
   * 단계 업데이트
   */
  updateSteps(id: string, steps: IntroductionFlow['steps']): Promise<void>
  
  /**
   * 완료 정보 업데이트
   */
  updateCompletionInfo(
    id: string,
    completionInfo: IntroductionFlow['completionInfo']
  ): Promise<void>
  
  /**
   * 소개 플로우 삭제
   */
  delete(id: string): Promise<void>
  
  /**
   * 만료된 소개 플로우 조회
   */
  findExpired(): Promise<IntroductionFlow[]>
}

