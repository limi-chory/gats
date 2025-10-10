import type { IContactRepo } from './ContactRepo.interface'
import type { IUserRepo } from '../../user/backend/UserRepo.interface'
import type { ContactMatch } from '../types'

/**
 * Contact Match Service
 * 연락처-사용자 매칭 비즈니스 로직
 */
export class ContactMatchService {
  constructor(
    private contactRepo: IContactRepo,
    private userRepo: IUserRepo
  ) {}
  
  /**
   * 사용자의 모든 연락처 매칭 수행
   */
  async matchAllContacts(userId: string): Promise<ContactMatch[]> {
    const contacts = await this.contactRepo.findByUserId(userId)
    const matches: ContactMatch[] = []
    
    for (const contact of contacts) {
      // 이미 매칭된 경우 스킵
      if (contact.matchedUserId) {
        continue
      }
      
      // 전화번호 해시로 사용자 검색
      const matchedUser = await this.userRepo.findByPhoneHash(contact.phoneHash)
      
      if (matchedUser) {
        await this.contactRepo.updateMatch(contact.id, matchedUser.id)
        
        matches.push({
          contactId: contact.id,
          matchedUserId: matchedUser.id,
          matchConfidence: 100, // 전화번호 해시 매칭은 100% 신뢰도
          matchedAt: new Date(),
        })
      }
    }
    
    return matches
  }
  
  /**
   * 특정 연락처의 매칭 정보 조회
   */
  async getContactMatch(contactId: string): Promise<ContactMatch | null> {
    const contact = await this.contactRepo.findById(contactId)
    
    if (!contact || !contact.matchedUserId) {
      return null
    }
    
    return {
      contactId: contact.id,
      matchedUserId: contact.matchedUserId,
      matchConfidence: 100,
      matchedAt: contact.syncedAt,
    }
  }
  
  /**
   * 새로 가입한 사용자에 대한 역방향 매칭
   * (다른 사용자들의 연락처에서 이 사용자를 찾아 매칭)
   */
  async reverseMatchNewUser(newUserId: string): Promise<number> {
    const newUser = await this.userRepo.findById(newUserId)
    if (!newUser) {
      throw new Error('User not found')
    }
    
    // 모든 연락처에서 이 전화번호 해시를 가진 것 찾기
    // 현재 구현에서는 효율적인 방법이 없으므로 스킵
    // 실제로는 전화번호 해시 인덱스를 활용해야 함
    
    // 임시: 매칭되지 않은 모든 연락처 확인 (비효율적, 개선 필요)
    // 프로덕션에서는 백그라운드 작업으로 처리
    
    return 0
  }
  
  /**
   * 사용자의 매칭된 연락처 통계
   */
  async getMatchStats(userId: string): Promise<{
    total: number
    matched: number
    unmatched: number
    matchRate: number
  }> {
    const contacts = await this.contactRepo.findByUserId(userId)
    const total = contacts.length
    const matched = contacts.filter(c => c.matchedUserId).length
    const unmatched = total - matched
    const matchRate = total > 0 ? (matched / total) * 100 : 0
    
    return {
      total,
      matched,
      unmatched,
      matchRate,
    }
  }
}

