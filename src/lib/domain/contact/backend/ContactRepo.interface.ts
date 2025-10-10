import type { Contact } from '../types'

/**
 * Contact Repository Interface
 * 연락처 데이터 영속성 계층 추상화
 */
export interface IContactRepo {
  /**
   * 새 연락처 생성
   */
  create(contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact>
  
  /**
   * ID로 연락처 조회
   */
  findById(id: string): Promise<Contact | null>
  
  /**
   * 사용자의 모든 연락처 조회
   */
  findByUserId(userId: string): Promise<Contact[]>
  
  /**
   * 사용자와 전화번호 해시로 연락처 조회
   */
  findByUserAndPhoneHash(userId: string, phoneHash: string): Promise<Contact | null>
  
  /**
   * 매칭된 사용자 ID로 연락처 조회
   */
  findByMatchedUserId(matchedUserId: string): Promise<Contact[]>
  
  /**
   * 연락처 업데이트
   */
  update(id: string, data: Partial<Contact>): Promise<Contact>
  
  /**
   * 연락처 삭제
   */
  delete(id: string): Promise<void>
  
  /**
   * 사용자의 모든 연락처 삭제
   */
  deleteByUserId(userId: string): Promise<void>
  
  /**
   * 매칭 정보 업데이트
   */
  updateMatch(contactId: string, matchedUserId: string): Promise<void>
  
  /**
   * 전화번호 해시 목록으로 연락처 조회
   */
  findByPhoneHashes(userId: string, phoneHashes: string[]): Promise<Contact[]>
}

