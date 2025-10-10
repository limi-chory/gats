import type { ParsedQuery } from '../types'

/**
 * Query Parser Service
 * 자연어 쿼리 파싱 비즈니스 로직
 */
export class QueryParserService {
  /**
   * 자연어 쿼리 파싱
   */
  parseNaturalQuery(query: string): ParsedQuery {
    const lowerQuery = query.toLowerCase()
    
    const entities = {
      companies: this.extractCompanies(lowerQuery),
      roles: this.extractRoles(lowerQuery),
      skills: this.extractSkills(lowerQuery),
      names: this.extractNames(lowerQuery),
      locations: this.extractLocations(lowerQuery),
    }
    
    const intent = this.detectIntent(lowerQuery)
    const confidence = this.calculateParsingConfidence(entities)
    
    return {
      intent,
      entities,
      confidence,
    }
  }
  
  /**
   * 회사명 추출
   */
  private extractCompanies(query: string): string[] {
    const companies: string[] = []
    
    const knownCompanies = [
      '네이버', '카카오', '라인', '쿠팡', '배달의민족', '당근마켓',
      '토스', '삼성', 'lg', 'sk', '현대',
      'google', 'apple', 'microsoft', 'amazon', 'meta', 'facebook',
    ]
    
    for (const company of knownCompanies) {
      if (query.includes(company)) {
        companies.push(company)
      }
    }
    
    return companies
  }
  
  /**
   * 역할/직무 추출
   */
  private extractRoles(query: string): string[] {
    const roles: string[] = []
    
    const knownRoles = [
      '개발자', '엔지니어', '프로그래머', '개발',
      '디자이너', '디자인',
      'pm', '프로덕트 매니저', '기획자',
      'ceo', '대표', '임원',
      '마케터', '마케팅',
      '투자자', '벤처캐피탈', 'vc',
    ]
    
    for (const role of knownRoles) {
      if (query.includes(role)) {
        roles.push(role)
      }
    }
    
    return roles
  }
  
  /**
   * 기술/스킬 추출
   */
  private extractSkills(query: string): string[] {
    const skills: string[] = []
    
    const knownSkills = [
      'react', 'vue', 'angular', 'javascript', 'typescript',
      'python', 'java', 'kotlin', 'swift',
      'ai', 'ml', '머신러닝', '인공지능',
      '디자인', 'figma', 'sketch',
    ]
    
    for (const skill of knownSkills) {
      if (query.includes(skill)) {
        skills.push(skill)
      }
    }
    
    return skills
  }
  
  /**
   * 이름 추출 (단순 구현)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private extractNames(_query: string): string[] {
    // 실제로는 NER (Named Entity Recognition) 사용
    // 현재는 간단한 패턴 매칭
    return []
  }
  
  /**
   * 위치 추출
   */
  private extractLocations(query: string): string[] {
    const locations: string[] = []
    
    const knownLocations = [
      '서울', '강남', '판교', '분당', '송도',
      '부산', '대구', '광주', '대전',
    ]
    
    for (const location of knownLocations) {
      if (query.includes(location)) {
        locations.push(location)
      }
    }
    
    return locations
  }
  
  /**
   * 의도 감지
   */
  private detectIntent(query: string): ParsedQuery['intent'] {
    if (query.includes('회사') || query.includes('다니는') || query.includes('근무')) {
      return 'find_company'
    }
    
    if (query.includes('개발자') || query.includes('디자이너') || query.includes('pm')) {
      return 'find_role'
    }
    
    return 'find_person'
  }
  
  /**
   * 파싱 신뢰도 계산
   */
  private calculateParsingConfidence(entities: ParsedQuery['entities']): number {
    let score = 0
    
    if (entities.companies.length > 0) score += 30
    if (entities.roles.length > 0) score += 30
    if (entities.skills.length > 0) score += 20
    if (entities.names.length > 0) score += 20
    
    return Math.min(score, 100)
  }
}

