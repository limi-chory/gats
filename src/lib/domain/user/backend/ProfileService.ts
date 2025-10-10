import type { IUserRepo } from './UserRepo.interface'
import type { UserProfile, UpdateUserInput } from '../types'

/**
 * Profile Service
 * 사용자 프로필 관련 비즈니스 로직
 */
export class ProfileService {
  constructor(private userRepo: IUserRepo) {}
  
  /**
   * 사용자 프로필 조회
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const user = await this.userRepo.findById(userId)
    
    if (!user) {
      return null
    }
    
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
   * 프로필 업데이트
   */
  async updateProfile(userId: string, input: UpdateUserInput): Promise<UserProfile> {
    const updatedUser = await this.userRepo.update(userId, input)
    
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      company: updatedUser.company,
      school: updatedUser.school,
      interests: updatedUser.interests,
      profileVisibility: updatedUser.profileVisibility,
      isVerified: updatedUser.isVerified,
    }
  }
  
  /**
   * 프로필 공개 설정 변경
   */
  async updateVisibility(
    userId: string,
    visibility: 'public' | 'connections_only' | 'ghost_mode'
  ): Promise<void> {
    await this.userRepo.update(userId, {
      profileVisibility: visibility,
    })
  }
  
  /**
   * 프로필 완성도 계산
   */
  async getProfileCompleteness(userId: string): Promise<number> {
    const user = await this.userRepo.findById(userId)
    
    if (!user) {
      return 0
    }
    
    let score = 0
    const maxScore = 7
    
    // 필수 정보
    if (user.name) score += 1
    if (user.phoneNumber && user.isVerified) score += 2
    
    // 선택 정보
    if (user.company) score += 1
    if (user.school) score += 1
    if (user.interests && user.interests.length > 0) score += 1
    if (user.lastSyncAt) score += 1  // 연락처 동기화 여부
    
    return Math.round((score / maxScore) * 100)
  }
}

