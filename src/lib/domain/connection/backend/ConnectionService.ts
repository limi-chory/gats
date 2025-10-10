import type { IConnectionRepo } from './ConnectionRepo.interface'
import type { INetworkNodeRepo } from '../../networkNode/backend/NetworkNodeRepo.interface'
import type { Connection, ConnectionType } from '../types'

/**
 * Connection Service
 * 연결 관계 비즈니스 로직
 */
export class ConnectionService {
  constructor(
    private connectionRepo: IConnectionRepo,
    private networkNodeRepo: INetworkNodeRepo
  ) {}
  
  /**
   * 새 연결 생성
   */
  async createConnection(
    userId: string,
    fromNodeId: string,
    toNodeId: string,
    type: ConnectionType = 'friend',
    strength: number = 50
  ): Promise<Connection> {
    // 노드 존재 확인
    const fromNode = await this.networkNodeRepo.findById(fromNodeId)
    const toNode = await this.networkNodeRepo.findById(toNodeId)
    
    if (!fromNode || !toNode) {
      throw new Error('Node not found')
    }
    
    if (fromNode.userId !== userId || toNode.userId !== userId) {
      throw new Error('Nodes do not belong to user')
    }
    
    // 기존 연결 확인
    const existing = await this.connectionRepo.findByNodes(userId, fromNodeId, toNodeId)
    if (existing) {
      return existing
    }
    
    // 연결 생성
    const connection = await this.connectionRepo.create({
      userId,
      fromNodeId,
      toNodeId,
      strength,
      type,
      isMutual: false,
      isActive: true,
      context: {
        source: 'contact',
      },
    })
    
    // 노드의 연결 수 업데이트
    await this.updateNodeConnectionCounts(fromNodeId, toNodeId)
    
    return connection
  }
  
  /**
   * 연결 강도 업데이트
   */
  async updateConnectionStrength(connectionId: string, strength: number): Promise<void> {
    if (strength < 0 || strength > 100) {
      throw new Error('Strength must be between 0 and 100')
    }
    
    await this.connectionRepo.updateStrength(connectionId, strength)
  }
  
  /**
   * 양방향 연결 설정
   */
  async setMutualConnection(connectionId: string, isMutual: boolean): Promise<void> {
    await this.connectionRepo.update(connectionId, { isMutual })
    
    // 강도 재계산 (양방향 연결은 +40점)
    const connection = await this.connectionRepo.findById(connectionId)
    if (connection) {
      const newStrength = isMutual 
        ? Math.min(connection.strength + 40, 100)
        : Math.max(connection.strength - 40, 0)
      
      await this.connectionRepo.updateStrength(connectionId, newStrength)
    }
  }
  
  /**
   * 노드 간 경로 찾기 (BFS)
   */
  async findPath(
    userId: string,
    fromNodeId: string,
    toNodeId: string,
    maxDepth: number = 3
  ): Promise<string[] | null> {
    const connections = await this.connectionRepo.findByUserId(userId)
    
    // 그래프 구축
    const graph = new Map<string, string[]>()
    for (const conn of connections) {
      if (!graph.has(conn.fromNodeId)) {
        graph.set(conn.fromNodeId, [])
      }
      graph.get(conn.fromNodeId)!.push(conn.toNodeId)
      
      // 양방향 연결
      if (conn.isMutual) {
        if (!graph.has(conn.toNodeId)) {
          graph.set(conn.toNodeId, [])
        }
        graph.get(conn.toNodeId)!.push(conn.fromNodeId)
      }
    }
    
    // BFS로 경로 찾기
    const queue: Array<{ nodeId: string; path: string[] }> = [
      { nodeId: fromNodeId, path: [fromNodeId] }
    ]
    const visited = new Set<string>([fromNodeId])
    
    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!
      
      if (path.length > maxDepth + 1) {
        continue
      }
      
      if (nodeId === toNodeId) {
        return path
      }
      
      const neighbors = graph.get(nodeId) || []
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push({
            nodeId: neighbor,
            path: [...path, neighbor]
          })
        }
      }
    }
    
    return null
  }
  
  /**
   * 노드의 연결 수 업데이트
   */
  private async updateNodeConnectionCounts(fromNodeId: string, toNodeId: string): Promise<void> {
    const fromConnections = await this.connectionRepo.findByNodeId(fromNodeId)
    const toConnections = await this.connectionRepo.findByNodeId(toNodeId)
    
    await this.networkNodeRepo.updateConnectionCount(fromNodeId, fromConnections.length)
    await this.networkNodeRepo.updateConnectionCount(toNodeId, toConnections.length)
  }
}

