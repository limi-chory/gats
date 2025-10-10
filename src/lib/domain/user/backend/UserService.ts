import type { IUserRepo } from './UserRepo.interface'
import type { User, CreateUserInput, UpdateUserInput, UserProfile } from '../types'
import { validatePhoneNumber } from '@/lib/security/phoneValidator'

/**
 * User Service
 * 사용자 관련 비즈니스 로직
 */
export class UserService {
  constructor(private userRepo: IUserRepo) {}
  
  /**
   * 새 사용자 생성
   */
  async createUser(input: CreateUserInput): Promise<User> {
    // 전화번호 유효성 검증
    const validation = validatePhoneNumber(input.phoneNumber)
    if (!validation.isValid) {
      throw new Error(validation.error || '유효하지 않은 전화번호입니다.')
    }
    
    // 정규화된 전화번호 사용
    const normalizedPhone = validation.normalized!
    
    // Clerk User ID로 기존 사용자 확인
    if (input.clerkUserId) {
      const existingUser = await this.userRepo.findByClerkUserId(input.clerkUserId)
      if (existingUser) {
        throw new Error('이미 등록된 Clerk 사용자입니다.')
      }
    }
    
    // 사용자 생성
    const user = await this.userRepo.create({
      ...input,
      phoneNumber: normalizedPhone,
    })
    
    return user
  }
  
  /**
   * 사용자 ID로 조회
   */
  async getUserById(id: string): Promise<User | null> {
    return this.userRepo.findById(id)
  }
  
  /**
   * Clerk User ID로 조회
   */
  async getUserByClerkUserId(clerkUserId: string): Promise<User | null> {
    return this.userRepo.findByClerkUserId(clerkUserId)
  }
  
  /**
   * 사용자 정보 업데이트
   */
  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepo.findById(id)
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.')
    }
    
    return this.userRepo.update(id, input)
  }
  
  /**
   * 사용자 프로필 조회 (공개 정보만)
   */
  async getUserProfile(id: string, requesterId?: string): Promise<UserProfile | null> {
    const user = await this.userRepo.findById(id)
    if (!user) {
      return null
    }
    
    // 프로필 공개 설정 확인
    if (user.profileVisibility === 'ghost_mode' && id !== requesterId) {
      return null
    }
    
    // connections_only인 경우 연결 확인 필요 (추후 구현)
    // 현재는 단순화
    
    return {
      id: user.id,
      name: user.name,
      company: user.company,
      school: user.school,
      interests: user.interests,
      profileVisibility: user.profileVisibility,
      isVerified: user.isVerified,
    }
  }
  
  /**
   * 사용자 삭제
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id)
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.')
    }
    
    await this.userRepo.delete(id)
  }
  
  /**
   * 전화번호 인증 완료 처리
   */
  async verifyPhone(userId: string): Promise<void> {
    await this.userRepo.updateVerificationStatus(userId, true)
  }
}

