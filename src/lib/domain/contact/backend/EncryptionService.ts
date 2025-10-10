import { encrypt, decrypt } from '@/lib/security/crypto'

/**
 * Encryption Service
 * 연락처 데이터 암호화/복호화 서비스
 */
export class EncryptionService {
  /**
   * 연락처 이름 암호화
   */
  encryptName(name: string, userSalt: string): string {
    return encrypt(name, userSalt)
  }
  
  /**
   * 연락처 이름 복호화
   */
  decryptName(encryptedName: string, userSalt: string): string {
    try {
      return decrypt(encryptedName, userSalt)
    } catch (error) {
      console.error('Failed to decrypt name:', error)
      return '[복호화 실패]'
    }
  }
  
  /**
   * 전화번호 암호화
   */
  encryptPhone(phoneNumber: string, userSalt: string): string {
    return encrypt(phoneNumber, userSalt)
  }
  
  /**
   * 전화번호 복호화
   */
  decryptPhone(encryptedPhone: string, userSalt: string): string {
    try {
      return decrypt(encryptedPhone, userSalt)
    } catch (error) {
      console.error('Failed to decrypt phone:', error)
      return '[복호화 실패]'
    }
  }
  
  /**
   * 연락처 데이터 일괄 복호화
   */
  decryptContact(
    encryptedName: string,
    encryptedPhone: string,
    userSalt: string
  ): { name: string; phone: string } {
    return {
      name: this.decryptName(encryptedName, userSalt),
      phone: this.decryptPhone(encryptedPhone, userSalt),
    }
  }
}

