import type { Database } from 'better-sqlite3'
import { v4 as uuidv4 } from 'uuid'
import type { NetworkNode } from '../types'
import type { INetworkNodeRepo } from './NetworkNodeRepo.interface'

/**
 * SQLite Network Node Repository 구현
 */
export class SqliteNetworkNodeRepo implements INetworkNodeRepo {
  constructor(private db: Database) {}
  
  /**
   * DB 행을 NetworkNode 객체로 변환
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToNode(row: any): NetworkNode {
    return {
      id: row.id,
      userId: row.user_id,
      nodeType: row.node_type as 'user' | 'contact',
      targetUserId: row.target_user_id || undefined,
      contactId: row.contact_id || undefined,
      displayName: row.display_name,
      initials: row.initials,
      avatarUrl: row.avatar_url || undefined,
      estimatedInfo: row.estimated_info ? JSON.parse(row.estimated_info) : undefined,
      visualization: JSON.parse(row.visualization),
      connectionCount: row.connection_count,
      isHidden: Boolean(row.is_hidden),
      isPinned: Boolean(row.is_pinned),
      updatedAt: new Date(row.updated_at),
      createdAt: new Date(row.created_at),
    }
  }
  
  async create(node: Omit<NetworkNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<NetworkNode> {
    const id = uuidv4()
    
    const stmt = this.db.prepare(`
      INSERT INTO network_nodes (
        id, user_id, node_type, target_user_id, contact_id,
        display_name, initials, avatar_url, estimated_info,
        visualization, connection_count, is_hidden, is_pinned
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      id,
      node.userId,
      node.nodeType,
      node.targetUserId || null,
      node.contactId || null,
      node.displayName,
      node.initials,
      node.avatarUrl || null,
      node.estimatedInfo ? JSON.stringify(node.estimatedInfo) : null,
      JSON.stringify(node.visualization),
      node.connectionCount,
      node.isHidden ? 1 : 0,
      node.isPinned ? 1 : 0
    )
    
    const created = await this.findById(id)
    if (!created) {
      throw new Error('Failed to create network node')
    }
    
    return created
  }
  
  async findById(id: string): Promise<NetworkNode | null> {
    const stmt = this.db.prepare('SELECT * FROM network_nodes WHERE id = ?')
    const row = stmt.get(id)
    
    return row ? this.rowToNode(row) : null
  }
  
  async findByUserId(userId: string): Promise<NetworkNode[]> {
    const stmt = this.db.prepare('SELECT * FROM network_nodes WHERE user_id = ? ORDER BY created_at DESC')
    const rows = stmt.all(userId)
    
    return rows.map(row => this.rowToNode(row))
  }
  
  async findByTargetUserId(userId: string, targetUserId: string): Promise<NetworkNode | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM network_nodes 
      WHERE user_id = ? AND target_user_id = ?
    `)
    const row = stmt.get(userId, targetUserId)
    
    return row ? this.rowToNode(row) : null
  }
  
  async findByContactId(userId: string, contactId: string): Promise<NetworkNode | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM network_nodes 
      WHERE user_id = ? AND contact_id = ?
    `)
    const row = stmt.get(userId, contactId)
    
    return row ? this.rowToNode(row) : null
  }
  
  async update(id: string, data: Partial<NetworkNode>): Promise<NetworkNode> {
    const updates: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = []
    
    if (data.displayName !== undefined) {
      updates.push('display_name = ?')
      values.push(data.displayName)
    }
    
    if (data.initials !== undefined) {
      updates.push('initials = ?')
      values.push(data.initials)
    }
    
    if (data.avatarUrl !== undefined) {
      updates.push('avatar_url = ?')
      values.push(data.avatarUrl)
    }
    
    if (data.estimatedInfo !== undefined) {
      updates.push('estimated_info = ?')
      values.push(JSON.stringify(data.estimatedInfo))
    }
    
    if (data.visualization !== undefined) {
      updates.push('visualization = ?')
      values.push(JSON.stringify(data.visualization))
    }
    
    if (data.connectionCount !== undefined) {
      updates.push('connection_count = ?')
      values.push(data.connectionCount)
    }
    
    if (data.isHidden !== undefined) {
      updates.push('is_hidden = ?')
      values.push(data.isHidden ? 1 : 0)
    }
    
    if (data.isPinned !== undefined) {
      updates.push('is_pinned = ?')
      values.push(data.isPinned ? 1 : 0)
    }
    
    if (updates.length === 0) {
      const node = await this.findById(id)
      if (!node) {
        throw new Error('Network node not found')
      }
      return node
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    const stmt = this.db.prepare(`
      UPDATE network_nodes 
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    
    stmt.run(...values)
    
    const node = await this.findById(id)
    if (!node) {
      throw new Error('Network node not found after update')
    }
    
    return node
  }
  
  async delete(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM network_nodes WHERE id = ?')
    stmt.run(id)
  }
  
  async deleteByUserId(userId: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM network_nodes WHERE user_id = ?')
    stmt.run(userId)
  }
  
  async updateConnectionCount(nodeId: string, count: number): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE network_nodes 
      SET connection_count = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(count, nodeId)
  }
  
  async updatePosition(nodeId: string, x: number, y: number): Promise<void> {
    const node = await this.findById(nodeId)
    if (!node) {
      throw new Error('Network node not found')
    }
    
    const updatedVisualization = {
      ...node.visualization,
      position: { x, y },
    }
    
    const stmt = this.db.prepare(`
      UPDATE network_nodes 
      SET visualization = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(JSON.stringify(updatedVisualization), nodeId)
  }
}

