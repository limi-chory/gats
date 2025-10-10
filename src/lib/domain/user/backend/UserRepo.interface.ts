import type { User, CreateUserInput, UpdateUserInput } from '../types'

/**
 * User Repository Interface
 * 사용자 데이터 영속성 계층 추상화
 */
export interface IUserRepo {
  /**
   * 새 사용자 생성
   */
  create(input: CreateUserInput): Promise<User>
  
  /**
   * ID로 사용자 조회
   */
  findById(id: string): Promise<User | null>
  
  /**
   * Clerk User ID로 사용자 조회
   */
  findByClerkUserId(clerkUserId: string): Promise<User | null>
  
  /**
   * 전화번호 해시로 사용자 조회
   */
  findByPhoneHash(phoneHash: string): Promise<User | null>
  
  /**
   * 전화번호 해시 목록으로 사용자들 조회 (매칭용)
   */
  findByPhoneHashes(phoneHashes: string[]): Promise<User[]>
  
  /**
   * 사용자 정보 업데이트
   */
  update(id: string, input: UpdateUserInput): Promise<User>
  
  /**
   * 전화번호 인증 상태 업데이트
   */
  updateVerificationStatus(id: string, isVerified: boolean): Promise<void>
  
  /**
   * 마지막 동기화 시간 업데이트
   */
  updateLastSyncAt(id: string): Promise<void>
  
  /**
   * 사용자 삭제
   */
  delete(id: string): Promise<void>
  
  /**
   * 사용자 존재 여부 확인
   */
  exists(id: string): Promise<boolean>
}

