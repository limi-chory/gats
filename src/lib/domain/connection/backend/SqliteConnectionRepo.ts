import type { Database } from 'better-sqlite3'
import { v4 as uuidv4 } from 'uuid'
import type { Connection } from '../types'
import type { IConnectionRepo } from './ConnectionRepo.interface'

/**
 * SQLite Connection Repository 구현
 */
export class SqliteConnectionRepo implements IConnectionRepo {
  constructor(private db: Database) {}
  
  /**
   * DB 행을 Connection 객체로 변환
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToConnection(row: any): Connection {
    return {
      id: row.id,
      userId: row.user_id,
      fromNodeId: row.from_node_id,
      toNodeId: row.to_node_id,
      strength: row.strength,
      type: row.type,
      isMutual: Boolean(row.is_mutual),
      isActive: Boolean(row.is_active),
      context: row.context ? JSON.parse(row.context) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }
  
  async create(connection: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Connection> {
    const id = uuidv4()
    
    const stmt = this.db.prepare(`
      INSERT INTO connections (
        id, user_id, from_node_id, to_node_id, strength,
        type, is_mutual, is_active, context
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      id,
      connection.userId,
      connection.fromNodeId,
      connection.toNodeId,
      connection.strength,
      connection.type,
      connection.isMutual ? 1 : 0,
      connection.isActive ? 1 : 0,
      connection.context ? JSON.stringify(connection.context) : null
    )
    
    const created = await this.findById(id)
    if (!created) {
      throw new Error('Failed to create connection')
    }
    
    return created
  }
  
  async findById(id: string): Promise<Connection | null> {
    const stmt = this.db.prepare('SELECT * FROM connections WHERE id = ?')
    const row = stmt.get(id)
    
    return row ? this.rowToConnection(row) : null
  }
  
  async findByUserId(userId: string): Promise<Connection[]> {
    const stmt = this.db.prepare('SELECT * FROM connections WHERE user_id = ? ORDER BY created_at DESC')
    const rows = stmt.all(userId)
    
    return rows.map(row => this.rowToConnection(row))
  }
  
  async findByNodeId(nodeId: string): Promise<Connection[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM connections 
      WHERE from_node_id = ? OR to_node_id = ?
    `)
    const rows = stmt.all(nodeId, nodeId)
    
    return rows.map(row => this.rowToConnection(row))
  }
  
  async findByNodes(userId: string, fromNodeId: string, toNodeId: string): Promise<Connection | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM connections 
      WHERE user_id = ? AND from_node_id = ? AND to_node_id = ?
    `)
    const row = stmt.get(userId, fromNodeId, toNodeId)
    
    return row ? this.rowToConnection(row) : null
  }
  
  async update(id: string, data: Partial<Connection>): Promise<Connection> {
    const updates: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = []
    
    if (data.strength !== undefined) {
      updates.push('strength = ?')
      values.push(data.strength)
    }
    
    if (data.type !== undefined) {
      updates.push('type = ?')
      values.push(data.type)
    }
    
    if (data.isMutual !== undefined) {
      updates.push('is_mutual = ?')
      values.push(data.isMutual ? 1 : 0)
    }
    
    if (data.isActive !== undefined) {
      updates.push('is_active = ?')
      values.push(data.isActive ? 1 : 0)
    }
    
    if (data.context !== undefined) {
      updates.push('context = ?')
      values.push(JSON.stringify(data.context))
    }
    
    if (updates.length === 0) {
      const connection = await this.findById(id)
      if (!connection) {
        throw new Error('Connection not found')
      }
      return connection
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    const stmt = this.db.prepare(`
      UPDATE connections 
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    
    stmt.run(...values)
    
    const connection = await this.findById(id)
    if (!connection) {
      throw new Error('Connection not found after update')
    }
    
    return connection
  }
  
  async updateStrength(connectionId: string, strength: number): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE connections 
      SET strength = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(strength, connectionId)
  }
  
  async delete(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM connections WHERE id = ?')
    stmt.run(id)
  }
  
  async deleteByUserId(userId: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM connections WHERE user_id = ?')
    stmt.run(userId)
  }
  
  async deleteByNodeId(nodeId: string): Promise<void> {
    const stmt = this.db.prepare(`
      DELETE FROM connections 
      WHERE from_node_id = ? OR to_node_id = ?
    `)
    stmt.run(nodeId, nodeId)
  }
}

