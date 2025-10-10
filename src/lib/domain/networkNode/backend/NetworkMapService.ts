import type { INetworkNodeRepo } from './NetworkNodeRepo.interface'
import type { IContactRepo } from '../../contact/backend/ContactRepo.interface'
import type { IUserRepo } from '../../user/backend/UserRepo.interface'
import type { NetworkMapData, NetworkNode } from '../types'

/**
 * Network Map Service
 * 네트워크 맵 비즈니스 로직
 */
export class NetworkMapService {
  constructor(
    private networkNodeRepo: INetworkNodeRepo,
    private contactRepo: IContactRepo,
    private userRepo: IUserRepo
  ) {}
  
  /**
   * 사용자의 네트워크 맵 생성/업데이트
   */
  async buildNetworkMap(userId: string): Promise<void> {
    // 기존 노드 삭제
    await this.networkNodeRepo.deleteByUserId(userId)
    
    // 1. 자기 자신 노드 생성 (layer 0)
    const user = await this.userRepo.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    await this.createUserNode(userId, user.id, 0, 0, 0)
    
    // 2. 연락처에서 노드 생성
    const contacts = await this.contactRepo.findByUserId(userId)
    
    let angle = 0
    const angleStep = (2 * Math.PI) / contacts.length
    const radius = 200
    
    for (const contact of contacts) {
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      if (contact.matchedUserId) {
        // GATS 사용자 노드
        await this.createUserNode(userId, contact.matchedUserId, x, y, 1)
      } else {
        // 비가입자 연락처 노드
        await this.createContactNode(userId, contact.id, x, y, 1)
      }
      
      angle += angleStep
    }
  }
  
  /**
   * 사용자 노드 생성
   */
  private async createUserNode(
    ownerId: string,
    targetUserId: string,
    x: number,
    y: number,
    layer: number
  ): Promise<NetworkNode> {
    const targetUser = await this.userRepo.findById(targetUserId)
    if (!targetUser) {
      throw new Error('Target user not found')
    }
    
    const initials = this.getInitials(targetUser.name)
    
    return this.networkNodeRepo.create({
      userId: ownerId,
      nodeType: 'user',
      targetUserId,
      displayName: targetUser.name,
      initials,
      estimatedInfo: targetUser.company || targetUser.school ? {
        company: targetUser.company,
        school: targetUser.school,
        confidence: 100,
        source: 'profile',
      } : undefined,
      visualization: {
        position: { x, y },
        size: layer === 0 ? 60 : 40,
        layer,
        color: this.getColorByLayer(layer),
      },
      connectionCount: 0,
      isHidden: false,
      isPinned: layer === 0,
    })
  }
  
  /**
   * 연락처 노드 생성
   */
  private async createContactNode(
    ownerId: string,
    contactId: string,
    x: number,
    y: number,
    layer: number
  ): Promise<NetworkNode> {
    const contact = await this.contactRepo.findById(contactId)
    if (!contact) {
      throw new Error('Contact not found')
    }
    
    const initials = this.getInitials(contact.originalName)
    
    return this.networkNodeRepo.create({
      userId: ownerId,
      nodeType: 'contact',
      contactId,
      displayName: contact.originalName,
      initials,
      visualization: {
        position: { x, y },
        size: 30,
        layer,
        color: '#9CA3AF', // Gray for non-users
      },
      connectionCount: 0,
      isHidden: false,
      isPinned: false,
    })
  }
  
  /**
   * 네트워크 맵 데이터 조회
   */
  async getNetworkMapData(userId: string): Promise<NetworkMapData> {
    const nodes = await this.networkNodeRepo.findByUserId(userId)
    
    // 임시로 빈 클러스터와 연결 데이터 반환
    // 실제로는 ConnectionRepo에서 조회해야 함
    
    return {
      nodes,
      clusters: [],
      connections: [],
      stats: {
        totalNodes: nodes.length,
        totalConnections: 0,
        avgConnectionStrength: 0,
      },
    }
  }
  
  /**
   * 이름에서 이니셜 추출
   */
  private getInitials(name: string): string {
    if (!name) return '?'
    
    // 한글: 첫 글자만
    if (/[가-힣]/.test(name)) {
      return name.charAt(0)
    }
    
    // 영문: 첫 두 글자
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase()
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }
  
  /**
   * 레이어별 색상
   */
  private getColorByLayer(layer: number): string {
    const colors = [
      '#3B82F6', // Blue - 본인
      '#10B981', // Green - 1촌
      '#F59E0B', // Orange - 2촌
      '#EF4444', // Red - 3촌
    ]
    
    return colors[Math.min(layer, colors.length - 1)]
  }
}

