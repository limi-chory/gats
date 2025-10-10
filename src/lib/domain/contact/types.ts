// Contact Domain Types

export interface Contact {
  id: string
  userId: string                  // 소유자
  phoneHash: string               // bcrypt 해시 (매칭용)
  encryptedPhone: string          // AES 암호화 (표시용)
  encryptedName: string           // AES 암호화
  originalName: string            // 연락처 원본 이름
  matchedUserId?: string          // GATS 사용자 매칭
  tags: string[]                  // 그룹 태그
  syncedAt: Date
  createdAt: Date
}

export interface ContactSyncBatch {
  userId: string
  contacts: RawContact[]
  syncId: string                  // 동기화 세션 ID
  timestamp: Date
}

export interface RawContact {
  phoneNumber: string
  name: string
  tags?: string[]
}

export interface ContactMatch {
  contactId: string
  matchedUserId: string
  matchConfidence: number         // 0-100
  matchedAt: Date
}

export interface ContactSyncResult {
  totalContacts: number
  newContacts: number
  updatedContacts: number
  matchedUsers: number
  errors: string[]
}

export interface ContactGroup {
  id: string
  userId: string
  name: string
  contactIds: string[]
  color?: string
  createdAt: Date
}

