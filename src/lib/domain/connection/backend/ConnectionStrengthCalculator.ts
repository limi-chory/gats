import type { IConnectionRepo } from './ConnectionRepo.interface'
import type { ConnectionStrength, Connection } from '../types'

/**
 * Connection Strength Calculator
 * 연결 강도 계산 비즈니스 로직
 */
export class ConnectionStrengthCalculator {
  constructor(private connectionRepo: IConnectionRepo) {}
  
  /**
   * 연결 강도 계산
   */
  async calculateStrength(connectionId: string): Promise<ConnectionStrength> {
    const connection = await this.connectionRepo.findById(connectionId)
    
    if (!connection) {
      throw new Error('Connection not found')
    }
    
    const factors = {
      mutualContact: this.calculateMutualContactScore(connection.isMutual),
      sharedConnections: await this.calculateSharedConnectionsScore(connection),
      sameCluster: this.calculateSameClusterScore(connection),
      recentInteraction: this.calculateRecentInteractionScore(connection),
    }
    
    const totalScore = Math.min(
      factors.mutualContact +
      factors.sharedConnections +
      factors.sameCluster +
      factors.recentInteraction,
      100
    )
    
    return {
      connectionId,
      factors,
      totalScore,
      calculatedAt: new Date(),
    }
  }
  
  /**
   * 양방향 저장 점수 (0 or 40)
   */
  private calculateMutualContactScore(isMutual: boolean): number {
    return isMutual ? 40 : 0
  }
  
  /**
   * 공통 지인 수 점수 (0-30)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async calculateSharedConnectionsScore(_connection: Connection): Promise<number> {
    // TODO: 실제 공통 연결 계산
    // 현재는 단순 구현
    return 0
  }
  
  /**
   * 같은 클러스터 점수 (0-20)
   */
  private calculateSameClusterScore(connection: Connection): number {
    const sharedGroups = connection.context?.sharedGroups || []
    return Math.min(sharedGroups.length * 10, 20)
  }
  
  /**
   * 최근 상호작용 점수 (0-10)
   */
  private calculateRecentInteractionScore(connection: Connection): number {
    if (!connection.context?.lastInteraction) {
      return 0
    }
    
    const daysSinceInteraction = Math.floor(
      (Date.now() - new Date(connection.context.lastInteraction).getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (daysSinceInteraction < 7) return 10
    if (daysSinceInteraction < 30) return 7
    if (daysSinceInteraction < 90) return 4
    return 0
  }
  
  /**
   * 모든 연결의 강도 재계산
   */
  async recalculateAllStrengths(userId: string): Promise<void> {
    const connections = await this.connectionRepo.findByUserId(userId)
    
    for (const connection of connections) {
      const strength = await this.calculateStrength(connection.id)
      await this.connectionRepo.updateStrength(connection.id, strength.totalScore)
    }
  }
}

