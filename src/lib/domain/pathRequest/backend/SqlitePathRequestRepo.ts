import type { Database } from 'better-sqlite3'
import { v4 as uuidv4 } from 'uuid'
import type { PathRequest } from '../types'
import type { IPathRequestRepo } from './PathRequestRepo.interface'

/**
 * SQLite Path Request Repository 구현
 */
export class SqlitePathRequestRepo implements IPathRequestRepo {
  constructor(private db: Database) {}
  
  /**
   * DB 행을 PathRequest 객체로 변환
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToPathRequest(row: any): PathRequest {
    return {
      id: row.id,
      userId: row.user_id,
      query: row.query,
      queryType: row.query_type as 'natural' | 'structured',
      parsedCriteria: JSON.parse(row.parsed_criteria),
      searchConfig: JSON.parse(row.search_config),
      results: row.results ? JSON.parse(row.results) : [],
      status: row.status,
      processedAt: row.processed_at ? new Date(row.processed_at) : undefined,
      createdAt: new Date(row.created_at),
    }
  }
  
  async create(request: Omit<PathRequest, 'id' | 'createdAt'>): Promise<PathRequest> {
    const id = uuidv4()
    
    const stmt = this.db.prepare(`
      INSERT INTO path_requests (
        id, user_id, query, query_type, parsed_criteria,
        search_config, results, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      id,
      request.userId,
      request.query,
      request.queryType,
      JSON.stringify(request.parsedCriteria),
      JSON.stringify(request.searchConfig),
      JSON.stringify(request.results),
      request.status
    )
    
    const created = await this.findById(id)
    if (!created) {
      throw new Error('Failed to create path request')
    }
    
    return created
  }
  
  async findById(id: string): Promise<PathRequest | null> {
    const stmt = this.db.prepare('SELECT * FROM path_requests WHERE id = ?')
    const row = stmt.get(id)
    
    return row ? this.rowToPathRequest(row) : null
  }
  
  async findByUserId(userId: string, limit: number = 50): Promise<PathRequest[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM path_requests 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `)
    const rows = stmt.all(userId, limit)
    
    return rows.map(row => this.rowToPathRequest(row))
  }
  
  async update(id: string, data: Partial<PathRequest>): Promise<PathRequest> {
    const updates: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = []
    
    if (data.parsedCriteria !== undefined) {
      updates.push('parsed_criteria = ?')
      values.push(JSON.stringify(data.parsedCriteria))
    }
    
    if (data.searchConfig !== undefined) {
      updates.push('search_config = ?')
      values.push(JSON.stringify(data.searchConfig))
    }
    
    if (data.results !== undefined) {
      updates.push('results = ?')
      values.push(JSON.stringify(data.results))
    }
    
    if (data.status !== undefined) {
      updates.push('status = ?')
      values.push(data.status)
    }
    
    if (data.processedAt !== undefined) {
      updates.push('processed_at = ?')
      values.push(data.processedAt.toISOString())
    }
    
    if (updates.length === 0) {
      const request = await this.findById(id)
      if (!request) {
        throw new Error('Path request not found')
      }
      return request
    }
    
    values.push(id)
    
    const stmt = this.db.prepare(`
      UPDATE path_requests 
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    
    stmt.run(...values)
    
    const request = await this.findById(id)
    if (!request) {
      throw new Error('Path request not found after update')
    }
    
    return request
  }
  
  async updateResults(id: string, results: PathRequest['results']): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE path_requests 
      SET results = ?
      WHERE id = ?
    `)
    
    stmt.run(JSON.stringify(results), id)
  }
  
  async updateStatus(
    id: string,
    status: PathRequest['status'],
    processedAt?: Date
  ): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE path_requests 
      SET status = ?, processed_at = ?
      WHERE id = ?
    `)
    
    stmt.run(status, processedAt?.toISOString() || null, id)
  }
  
  async delete(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM path_requests WHERE id = ?')
    stmt.run(id)
  }
  
  async deleteByUserId(userId: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM path_requests WHERE user_id = ?')
    stmt.run(userId)
  }
}

