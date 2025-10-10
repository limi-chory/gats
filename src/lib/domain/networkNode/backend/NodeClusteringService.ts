import type { INetworkNodeRepo } from './NetworkNodeRepo.interface'
import type { NetworkNode, NetworkCluster } from '../types'

/**
 * Node Clustering Service
 * 노드 클러스터링 비즈니스 로직
 */
export class NodeClusteringService {
  constructor(private networkNodeRepo: INetworkNodeRepo) {}
  
  /**
   * 노드들을 클러스터로 그룹화
   */
  async clusterNodes(userId: string): Promise<NetworkCluster[]> {
    const nodes = await this.networkNodeRepo.findByUserId(userId)
    
    // 회사별 클러스터
    const companyClusters = this.clusterByCompany(userId, nodes)
    
    // 학교별 클러스터
    const schoolClusters = this.clusterBySchool(userId, nodes)
    
    return [...companyClusters, ...schoolClusters]
  }
  
  /**
   * 회사별 클러스터링
   */
  private clusterByCompany(userId: string, nodes: NetworkNode[]): NetworkCluster[] {
    const companyMap = new Map<string, NetworkNode[]>()
    
    for (const node of nodes) {
      const company = node.estimatedInfo?.company
      if (company) {
        if (!companyMap.has(company)) {
          companyMap.set(company, [])
        }
        companyMap.get(company)!.push(node)
      }
    }
    
    const clusters: NetworkCluster[] = []
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
    let colorIndex = 0
    
    for (const [company, clusterNodes] of companyMap.entries()) {
      if (clusterNodes.length < 2) continue // 2명 이상일 때만 클러스터 생성
      
      const centroid = this.calculateCentroid(clusterNodes)
      
      clusters.push({
        id: `company-${company.replace(/\s+/g, '-')}`,
        userId,
        name: company,
        type: 'company',
        nodeIds: clusterNodes.map(n => n.id),
        color: colors[colorIndex % colors.length],
        centroid,
        metadata: {
          companyName: company,
        },
      })
      
      colorIndex++
    }
    
    return clusters
  }
  
  /**
   * 학교별 클러스터링
   */
  private clusterBySchool(userId: string, nodes: NetworkNode[]): NetworkCluster[] {
    const schoolMap = new Map<string, NetworkNode[]>()
    
    for (const node of nodes) {
      const school = node.estimatedInfo?.school
      if (school) {
        if (!schoolMap.has(school)) {
          schoolMap.set(school, [])
        }
        schoolMap.get(school)!.push(node)
      }
    }
    
    const clusters: NetworkCluster[] = []
    const colors = ['#06B6D4', '#84CC16', '#F97316', '#EF4444', '#A855F7', '#EC4899']
    let colorIndex = 0
    
    for (const [school, clusterNodes] of schoolMap.entries()) {
      if (clusterNodes.length < 2) continue
      
      const centroid = this.calculateCentroid(clusterNodes)
      
      clusters.push({
        id: `school-${school.replace(/\s+/g, '-')}`,
        userId,
        name: school,
        type: 'school',
        nodeIds: clusterNodes.map(n => n.id),
        color: colors[colorIndex % colors.length],
        centroid,
        metadata: {
          schoolName: school,
        },
      })
      
      colorIndex++
    }
    
    return clusters
  }
  
  /**
   * 클러스터 중심점 계산
   */
  private calculateCentroid(nodes: NetworkNode[]): { x: number; y: number } {
    if (nodes.length === 0) {
      return { x: 0, y: 0 }
    }
    
    let sumX = 0
    let sumY = 0
    
    for (const node of nodes) {
      sumX += node.visualization.position.x
      sumY += node.visualization.position.y
    }
    
    return {
      x: sumX / nodes.length,
      y: sumY / nodes.length,
    }
  }
}

