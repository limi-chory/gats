import crypto from 'crypto'
import bcrypt from 'bcrypt'

// AES-256-GCM 암호화 설정
const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 16 // 128 bits
const SALT_ROUNDS = 10

/**
 * 마스터 암호화 키 가져오기
 * 환경 변수에서 키를 가져오거나, 없으면 생성 (개발 환경용)
 */
function getMasterKey(): Buffer {
  const keyString = process.env.ENCRYPTION_MASTER_KEY
  
  if (!keyString) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_MASTER_KEY must be set in production')
    }
    
    // 개발 환경에서는 기본 키 사용 (실제 운영에서는 절대 사용 금지!)
    console.warn('⚠️  Using default encryption key for development. DO NOT use in production!')
    return Buffer.from('dev_master_key_32_bytes_long!!', 'utf-8')
  }
  
  // 키를 Buffer로 변환
  const key = Buffer.from(keyString, 'hex')
  
  if (key.length !== KEY_LENGTH) {
    throw new Error(`ENCRYPTION_MASTER_KEY must be ${KEY_LENGTH} bytes (${KEY_LENGTH * 2} hex chars)`)
  }
  
  return key
}

/**
 * 사용자별 암호화 키 생성
 * @param userSalt - 사용자별 고유 salt
 */
export function deriveUserKey(userSalt: string): Buffer {
  const masterKey = getMasterKey()
  return crypto.pbkdf2Sync(masterKey, userSalt, 100000, KEY_LENGTH, 'sha256')
}

/**
 * 데이터 암호화 (AES-256-GCM)
 * @param plaintext - 암호화할 평문
 * @param userSalt - 사용자별 salt
 * @returns 암호화된 데이터 (iv:authTag:ciphertext 형식)
 */
export function encrypt(plaintext: string, userSalt: string): string {
  const key = deriveUserKey(userSalt)
  const iv = crypto.randomBytes(IV_LENGTH)
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  // iv:authTag:encrypted 형태로 결합
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

/**
 * 데이터 복호화 (AES-256-GCM)
 * @param encryptedData - 암호화된 데이터 (iv:authTag:ciphertext 형식)
 * @param userSalt - 사용자별 salt
 * @returns 복호화된 평문
 */
export function decrypt(encryptedData: string, userSalt: string): string {
  const key = deriveUserKey(userSalt)
  
  const parts = encryptedData.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format')
  }
  
  const [ivHex, authTagHex, encrypted] = parts
  
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * 전화번호를 bcrypt 해시로 변환 (매칭용)
 * @param phoneNumber - 전화번호 (숫자만)
 * @returns bcrypt 해시값
 */
export async function hashPhoneNumber(phoneNumber: string): Promise<string> {
  // 전화번호에서 숫자만 추출
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  return bcrypt.hash(cleanPhone, SALT_ROUNDS)
}

/**
 * 전화번호와 해시 비교
 * @param phoneNumber - 전화번호 (숫자만)
 * @param hash - 비교할 해시값
 * @returns 일치 여부
 */
export async function comparePhoneHash(phoneNumber: string, hash: string): Promise<boolean> {
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  return bcrypt.compare(cleanPhone, hash)
}

/**
 * 랜덤 salt 생성
 * @returns hex 형식의 랜덤 salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * 안전한 랜덤 문자열 생성
 * @param length - 생성할 문자열 길이
 * @returns 랜덤 문자열
 */
export function generateRandomString(length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
}

/**
 * 전화번호 정규화 (숫자만 추출)
 * @param phoneNumber - 원본 전화번호
 * @returns 숫자만 포함된 전화번호
 */
export function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '')
}

