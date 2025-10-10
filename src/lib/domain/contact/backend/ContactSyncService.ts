import type { IContactRepo } from './ContactRepo.interface'
import type { IUserRepo } from '../../user/backend/UserRepo.interface'
import type { RawContact, ContactSyncResult } from '../types'
import { hashPhoneNumber } from '@/lib/security/crypto'
import { EncryptionService } from './EncryptionService'
import { normalizePhoneNumber } from '@/lib/security/phoneValidator'

/**
 * Contact Sync Service
 * 연락처 동기화 비즈니스 로직
 */
export class ContactSyncService {
  private encryptionService: EncryptionService
  
  constructor(
    private contactRepo: IContactRepo,
    private userRepo: IUserRepo
  ) {
    this.encryptionService = new EncryptionService()
  }
  
  /**
   * 연락처 일괄 동기화
   */
  async syncContacts(userId: string, rawContacts: RawContact[]): Promise<ContactSyncResult> {
    const result: ContactSyncResult = {
      totalContacts: rawContacts.length,
      newContacts: 0,
      updatedContacts: 0,
      matchedUsers: 0,
      errors: [],
    }
    
    // 사용자 정보 조회 (salt 필요)
    const user = await this.userRepo.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    const syncedAt = new Date()
    
    // 각 연락처 처리
    for (const rawContact of rawContacts) {
      try {
        await this.syncSingleContact(userId, user.userSalt, rawContact, syncedAt)
        result.newContacts++
      } catch (error) {
        result.errors.push(`Failed to sync ${rawContact.name}: ${error}`)
      }
    }
    
    // 사용자 매칭 수행
    const matchedCount = await this.matchContactsWithUsers(userId)
    result.matchedUsers = matchedCount
    
    // 마지막 동기화 시간 업데이트
    await this.userRepo.updateLastSyncAt(userId)
    
    return result
  }
  
  /**
   * 단일 연락처 동기화
   */
  private async syncSingleContact(
    userId: string,
    userSalt: string,
    rawContact: RawContact,
    syncedAt: Date
  ): Promise<void> {
    // 전화번호 정규화 및 해시
    const normalizedPhone = normalizePhoneNumber(rawContact.phoneNumber)
    const phoneHash = await hashPhoneNumber(normalizedPhone)
    
    // 기존 연락처 확인
    const existingContact = await this.contactRepo.findByUserAndPhoneHash(userId, phoneHash)
    
    if (existingContact) {
      // 기존 연락처 업데이트
      await this.contactRepo.update(existingContact.id, {
        originalName: rawContact.name,
        encryptedName: this.encryptionService.encryptName(rawContact.name, userSalt),
        tags: rawContact.tags || [],
        syncedAt,
      })
    } else {
      // 새 연락처 생성
      await this.contactRepo.create({
        userId,
        phoneHash,
        encryptedPhone: this.encryptionService.encryptPhone(normalizedPhone, userSalt),
        encryptedName: this.encryptionService.encryptName(rawContact.name, userSalt),
        originalName: rawContact.name,
        tags: rawContact.tags || [],
        syncedAt,
      })
    }
  }
  
  /**
   * 연락처와 GATS 사용자 매칭
   */
  private async matchContactsWithUsers(userId: string): Promise<number> {
    // 사용자의 모든 연락처 조회
    const contacts = await this.contactRepo.findByUserId(userId)
    
    // 전화번호 해시 목록 추출
    const phoneHashes = contacts.map(c => c.phoneHash)
    
    // 해시로 사용자 검색
    const matchedUsers = await this.userRepo.findByPhoneHashes(phoneHashes)
    
    let matchedCount = 0
    
    // 매칭 정보 업데이트
    for (const user of matchedUsers) {
      const contact = contacts.find(c => c.phoneHash === user.phoneHash)
      if (contact && contact.matchedUserId !== user.id) {
        await this.contactRepo.updateMatch(contact.id, user.id)
        matchedCount++
      }
    }
    
    return matchedCount
  }
  
  /**
   * 특정 연락처의 매칭 재시도
   */
  async rematchContact(contactId: string): Promise<boolean> {
    const contact = await this.contactRepo.findById(contactId)
    if (!contact) {
      throw new Error('Contact not found')
    }
    
    // 전화번호 해시로 사용자 검색
    const matchedUser = await this.userRepo.findByPhoneHash(contact.phoneHash)
    
    if (matchedUser) {
      await this.contactRepo.updateMatch(contactId, matchedUser.id)
      return true
    }
    
    return false
  }
}

