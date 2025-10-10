import type { INetworkNodeRepo } from './NetworkNodeRepo.interface'
import type { IContactRepo } from '../../contact/backend/ContactRepo.interface'
import type { NetworkNode } from '../types'

/**
 * Node Estimation Service
 * AI 기반 노드 정보 추정 비즈니스 로직
 */
export class NodeEstimationService {
  constructor(
    private networkNodeRepo: INetworkNodeRepo,
    private contactRepo: IContactRepo
  ) {}
  
  /**
   * 연락처 노드의 정보 추정
   * (공통 연락처 패턴 분석 등)
   */
  async estimateNodeInfo(nodeId: string): Promise<void> {
    const node = await this.networkNodeRepo.findById(nodeId)
    
    if (!node || node.nodeType !== 'contact') {
      return
    }
    
    // 현재는 단순 구현
    // 실제로는 공통 연락처 분석, 이름 패턴 분석 등 수행
    
    // 예시: 태그 기반 추정
    if (node.contactId) {
      const contact = await this.contactRepo.findById(node.contactId)
      
      if (contact) {
        const estimatedInfo = this.estimateFromTags(contact.tags)
        
        if (estimatedInfo) {
          await this.networkNodeRepo.update(nodeId, {
            estimatedInfo,
          })
        }
      }
    }
  }
  
  /**
   * 태그에서 정보 추정
   */
  private estimateFromTags(tags: string[]): NetworkNode['estimatedInfo'] | null {
    // 회사 관련 태그
    const companyKeywords = ['회사', '동료', '직장', '업무']
    const schoolKeywords = ['학교', '동기', '선배', '후배', '대학', '고등학교']
    
    let company: string | undefined
    let school: string | undefined
    let confidence = 0
    
    for (const tag of tags) {
      if (companyKeywords.some(keyword => tag.includes(keyword))) {
        company = tag
        confidence = 30
      }
      
      if (schoolKeywords.some(keyword => tag.includes(keyword))) {
        school = tag
        confidence = 30
      }
    }
    
    if (company || school) {
      return {
        company,
        school,
        confidence,
        source: 'pattern',
      }
    }
    
    return null
  }
  
  /**
   * 공통 연락처 기반 추정
   * (추후 구현)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async estimateFromCommonContacts(_nodeId: string): Promise<void> {
    // TODO: 공통 연락처를 분석하여 정보 추정
    // 예: 같은 회사/학교에 다니는 다른 연락처들과의 공통점 분석
  }
}

