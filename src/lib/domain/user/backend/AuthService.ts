import type { IUserRepo } from './UserRepo.interface'
import type { User } from '../types'

/**
 * Authentication Service
 * 인증 관련 비즈니스 로직
 */
export class AuthService {
  constructor(private userRepo: IUserRepo) {}
  
  /**
   * Clerk User ID로 사용자 조회 또는 생성
   * Clerk 인증 후 호출
   */
  async getOrCreateUser(
    clerkUserId: string,
    phoneNumber: string,
    name: string
  ): Promise<User> {
    // 기존 사용자 확인
    let user = await this.userRepo.findByClerkUserId(clerkUserId)
    
    if (user) {
      return user
    }
    
    // 새 사용자 생성
    user = await this.userRepo.create({
      clerkUserId,
      phoneNumber,
      name,
    })
    
    return user
  }
  
  /**
   * 현재 인증된 사용자 조회
   */
  async getCurrentUser(clerkUserId: string): Promise<User | null> {
    return this.userRepo.findByClerkUserId(clerkUserId)
  }
  
  /**
   * 사용자 인증 여부 확인
   */
  async isUserVerified(userId: string): Promise<boolean> {
    const user = await this.userRepo.findById(userId)
    return user?.isVerified || false
  }
}

