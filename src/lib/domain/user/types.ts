// User Domain Types

export interface User {
  id: string
  clerkUserId?: string           // Clerk 연동
  phoneNumber: string             // 암호화 저장
  phoneHash: string               // 매칭용 해시
  name: string
  company?: string
  school?: string
  interests: string[]
  profileVisibility: 'public' | 'connections_only' | 'ghost_mode'
  userSalt: string                // 개인별 salt
  isVerified: boolean             // 전화번호 인증 여부
  createdAt: Date
  updatedAt: Date
  lastSyncAt?: Date
}

export interface CreateUserInput {
  clerkUserId?: string
  phoneNumber: string
  name: string
  company?: string
  school?: string
  interests?: string[]
}

export interface UpdateUserInput {
  name?: string
  company?: string
  school?: string
  interests?: string[]
  profileVisibility?: 'public' | 'connections_only' | 'ghost_mode'
}

export interface PhoneVerificationRequest {
  phoneNumber: string
  code?: string
}

export interface PhoneVerificationResponse {
  verificationId: string
  status: 'pending' | 'verified'
  expiresAt: Date
}

export interface UserProfile {
  id: string
  name: string
  company?: string
  school?: string
  interests: string[]
  profileVisibility: string
  connectionCount?: number
  isVerified: boolean
}

