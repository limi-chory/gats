import type { IPathRequestRepo } from './PathRequestRepo.interface'
import type { INetworkNodeRepo } from '../../networkNode/backend/NetworkNodeRepo.interface'
import type { IConnectionRepo } from '../../connection/backend/ConnectionRepo.interface'
import type { PathRequest, PathResult, PathNode } from '../types'
import type { NetworkNode } from '../../networkNode/types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Path Finder Service
 * 경로 탐색 비즈니스 로직
 */
export class PathFinderService {
  constructor(
    private pathRequestRepo: IPathRequestRepo,
    private networkNodeRepo: INetworkNodeRepo,
    private connectionRepo: IConnectionRepo
  ) {}
  
  /**
   * 경로 검색 실행
   */
  async searchPath(requestId: string): Promise<PathResult[]> {
    const request = await this.pathRequestRepo.findById(requestId)
    if (!request) {
      throw new Error('Path request not found')
    }
    
    // 상태 업데이트
    await this.pathRequestRepo.updateStatus(requestId, 'processing')
    
    try {
      // 노드 검색
      const candidateNodes = await this.findCandidateNodes(request)
      
      // 각 후보에 대해 경로 찾기
      const results: PathResult[] = []
      
      for (const candidateNode of candidateNodes) {
        const path = await this.findPathToNode(
          request.userId,
          candidateNode,
          request.searchConfig.maxDepth
        )
        
        if (path) {
          const result: PathResult = {
            id: uuidv4(),
            requestId,
            path,
            depth: path.length - 1,
            confidence: this.calculateConfidence(candidateNode, request.parsedCriteria),
            pathStrength: this.calculatePathStrength(path),
            targetNode: {
              nodeId: candidateNode.id,
              userId: candidateNode.targetUserId,
              name: candidateNode.displayName,
              company: candidateNode.estimatedInfo?.company,
              role: candidateNode.estimatedInfo?.role,
              matchedCriteria: this.getMatchedCriteria(candidateNode, request.parsedCriteria),
            },
            rank: 0, // 나중에 정렬 후 설정
          }
          
          results.push(result)
        }
      }
      
      // 결과 정렬 및 순위 설정
      results.sort((a, b) => {
        // 신뢰도와 경로 강도의 가중 평균으로 정렬
        const scoreA = a.confidence * 0.6 + a.pathStrength * 0.4
        const scoreB = b.confidence * 0.6 + b.pathStrength * 0.4
        return scoreB - scoreA
      })
      
      results.forEach((result, index) => {
        result.rank = index + 1
      })
      
      // 최대 결과 수 제한
      const limitedResults = results.slice(0, request.searchConfig.maxResults)
      
      // 결과 저장
      await this.pathRequestRepo.updateResults(requestId, limitedResults)
      await this.pathRequestRepo.updateStatus(requestId, 'completed', new Date())
      
      return limitedResults
    } catch (error) {
      await this.pathRequestRepo.updateStatus(requestId, 'failed')
      throw error
    }
  }
  
  /**
   * 후보 노드 찾기
   */
  private async findCandidateNodes(request: PathRequest): Promise<NetworkNode[]> {
    const allNodes = await this.networkNodeRepo.findByUserId(request.userId)
    
    const candidates = allNodes.filter(node => {
      // 자기 자신 제외
      if (node.targetUserId === request.userId) {
        return false
      }
      
      // 비가입자 포함 여부
      if (!request.searchConfig.includeNonUsers && node.nodeType !== 'user') {
        return false
      }
      
      // 검색 조건 매칭
      return this.matchesCriteria(node, request.parsedCriteria)
    })
    
    return candidates
  }
  
  /**
   * 노드가 검색 조건을 만족하는지 확인
   */
  private matchesCriteria(node: NetworkNode, criteria: PathRequest['parsedCriteria']): boolean {
    const { companies, schools, roles, keywords } = criteria
    
    const nodeCompany = node.estimatedInfo?.company?.toLowerCase()
    const nodeSchool = node.estimatedInfo?.school?.toLowerCase()
    const nodeRole = node.estimatedInfo?.role?.toLowerCase()
    const nodeName = node.displayName.toLowerCase()
    
    // 회사 매칭
    if (companies && companies.length > 0) {
      const hasCompanyMatch = companies.some(c => 
        nodeCompany?.includes(c.toLowerCase())
      )
      if (hasCompanyMatch) return true
    }
    
    // 학교 매칭
    if (schools && schools.length > 0) {
      const hasSchoolMatch = schools.some(s => 
        nodeSchool?.includes(s.toLowerCase())
      )
      if (hasSchoolMatch) return true
    }
    
    // 역할 매칭
    if (roles && roles.length > 0) {
      const hasRoleMatch = roles.some(r => 
        nodeRole?.includes(r.toLowerCase()) || nodeName.includes(r.toLowerCase())
      )
      if (hasRoleMatch) return true
    }
    
    // 키워드 매칭
    if (keywords && keywords.length > 0) {
      const hasKeywordMatch = keywords.some(k => 
        nodeName.includes(k.toLowerCase()) ||
        nodeCompany?.includes(k.toLowerCase()) ||
        nodeRole?.includes(k.toLowerCase())
      )
      if (hasKeywordMatch) return true
    }
    
    return false
  }
  
  /**
   * 특정 노드까지의 경로 찾기 (BFS)
   */
  private async findPathToNode(
    userId: string,
    targetNode: NetworkNode,
    maxDepth: number
  ): Promise<PathNode[] | null> {
    const connections = await this.connectionRepo.findByUserId(userId)
    const nodes = await this.networkNodeRepo.findByUserId(userId)
    
    // 시작 노드 찾기 (본인)
    const startNode = nodes.find(n => n.targetUserId === userId)
    if (!startNode) {
      return null
    }
    
    // 그래프 구축
    const graph = new Map<string, Array<{ nodeId: string; strength: number }>>()
    for (const conn of connections) {
      if (!graph.has(conn.fromNodeId)) {
        graph.set(conn.fromNodeId, [])
      }
      graph.get(conn.fromNodeId)!.push({
        nodeId: conn.toNodeId,
        strength: conn.strength,
      })
      
      if (conn.isMutual) {
        if (!graph.has(conn.toNodeId)) {
          graph.set(conn.toNodeId, [])
        }
        graph.get(conn.toNodeId)!.push({
          nodeId: conn.fromNodeId,
          strength: conn.strength,
        })
      }
    }
    
    // BFS
    const queue: Array<{ nodeId: string; path: PathNode[]; depth: number }> = [
      {
        nodeId: startNode.id,
        path: [{
          nodeId: startNode.id,
          userId: startNode.targetUserId,
          name: startNode.displayName,
          company: startNode.estimatedInfo?.company,
          role: startNode.estimatedInfo?.role,
          connectionStrength: 100,
          isGatsUser: true,
        }],
        depth: 0,
      }
    ]
    
    const visited = new Set<string>([startNode.id])
    
    while (queue.length > 0) {
      const { nodeId, path, depth } = queue.shift()!
      
      if (depth > maxDepth) {
        continue
      }
      
      if (nodeId === targetNode.id) {
        return path
      }
      
      const neighbors = graph.get(nodeId) || []
      for (const { nodeId: neighborId, strength } of neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId)
          
          const neighborNode = nodes.find(n => n.id === neighborId)
          if (neighborNode) {
            queue.push({
              nodeId: neighborId,
              path: [
                ...path,
                {
                  nodeId: neighborNode.id,
                  userId: neighborNode.targetUserId,
                  name: neighborNode.displayName,
                  company: neighborNode.estimatedInfo?.company,
                  role: neighborNode.estimatedInfo?.role,
                  connectionStrength: strength,
                  isGatsUser: neighborNode.nodeType === 'user',
                },
              ],
              depth: depth + 1,
            })
          }
        }
      }
    }
    
    return null
  }
  
  /**
   * 신뢰도 계산
   */
  private calculateConfidence(node: NetworkNode, criteria: PathRequest['parsedCriteria']): number {
    let score = 0
    let maxScore = 0
    
    const { companies, schools, roles } = criteria
    
    if (companies && companies.length > 0) {
      maxScore += 40
      const hasMatch = companies.some(c => 
        node.estimatedInfo?.company?.toLowerCase().includes(c.toLowerCase())
      )
      if (hasMatch) score += 40
    }
    
    if (schools && schools.length > 0) {
      maxScore += 30
      const hasMatch = schools.some(s => 
        node.estimatedInfo?.school?.toLowerCase().includes(s.toLowerCase())
      )
      if (hasMatch) score += 30
    }
    
    if (roles && roles.length > 0) {
      maxScore += 30
      const hasMatch = roles.some(r => 
        node.estimatedInfo?.role?.toLowerCase().includes(r.toLowerCase())
      )
      if (hasMatch) score += 30
    }
    
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 50
  }
  
  /**
   * 경로 강도 계산
   */
  private calculatePathStrength(path: PathNode[]): number {
    if (path.length <= 1) {
      return 100
    }
    
    const strengths = path.slice(1).map(node => node.connectionStrength)
    const avgStrength = strengths.reduce((sum, s) => sum + s, 0) / strengths.length
    
    return Math.round(avgStrength)
  }
  
  /**
   * 매칭된 조건 추출
   */
  private getMatchedCriteria(node: NetworkNode, criteria: PathRequest['parsedCriteria']): string[] {
    const matched: string[] = []
    
    if (criteria.companies) {
      criteria.companies.forEach(c => {
        if (node.estimatedInfo?.company?.toLowerCase().includes(c.toLowerCase())) {
          matched.push(`회사: ${c}`)
        }
      })
    }
    
    if (criteria.schools) {
      criteria.schools.forEach(s => {
        if (node.estimatedInfo?.school?.toLowerCase().includes(s.toLowerCase())) {
          matched.push(`학교: ${s}`)
        }
      })
    }
    
    if (criteria.roles) {
      criteria.roles.forEach(r => {
        if (node.estimatedInfo?.role?.toLowerCase().includes(r.toLowerCase())) {
          matched.push(`역할: ${r}`)
        }
      })
    }
    
    return matched
  }
}

