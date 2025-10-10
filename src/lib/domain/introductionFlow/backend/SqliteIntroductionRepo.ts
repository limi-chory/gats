import type { Database } from 'better-sqlite3'
import { v4 as uuidv4 } from 'uuid'
import type { IntroductionFlow } from '../types'
import type { IIntroductionRepo } from './IntroductionRepo.interface'

/**
 * SQLite Introduction Flow Repository 구현
 */
export class SqliteIntroductionRepo implements IIntroductionRepo {
  constructor(private db: Database) {}
  
  /**
   * DB 행을 IntroductionFlow 객체로 변환
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToFlow(row: any): IntroductionFlow {
    return {
      id: row.id,
      pathRequestId: row.path_request_id,
      requesterId: row.requester_id,
      targetNodeId: row.target_node_id,
      path: JSON.parse(row.path),
      pathDetails: JSON.parse(row.path_details),
      currentStep: row.current_step,
      status: row.status,
      steps: JSON.parse(row.steps),
      messageTemplate: row.message_template ? JSON.parse(row.message_template) : undefined,
      completionInfo: row.completion_info ? JSON.parse(row.completion_info) : undefined,
      expiresAt: new Date(row.expires_at),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }
  
  async create(flow: Omit<IntroductionFlow, 'id' | 'createdAt' | 'updatedAt'>): Promise<IntroductionFlow> {
    const id = uuidv4()
    
    const stmt = this.db.prepare(`
      INSERT INTO introduction_flows (
        id, path_request_id, requester_id, target_node_id,
        path, path_details, current_step, status, steps,
        message_template, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      id,
      flow.pathRequestId,
      flow.requesterId,
      flow.targetNodeId,
      JSON.stringify(flow.path),
      JSON.stringify(flow.pathDetails),
      flow.currentStep,
      flow.status,
      JSON.stringify(flow.steps),
      flow.messageTemplate ? JSON.stringify(flow.messageTemplate) : null,
      flow.expiresAt.toISOString()
    )
    
    const created = await this.findById(id)
    if (!created) {
      throw new Error('Failed to create introduction flow')
    }
    
    return created
  }
  
  async findById(id: string): Promise<IntroductionFlow | null> {
    const stmt = this.db.prepare('SELECT * FROM introduction_flows WHERE id = ?')
    const row = stmt.get(id)
    
    return row ? this.rowToFlow(row) : null
  }
  
  async findByRequesterId(requesterId: string): Promise<IntroductionFlow[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM introduction_flows 
      WHERE requester_id = ? 
      ORDER BY created_at DESC
    `)
    const rows = stmt.all(requesterId)
    
    return rows.map(row => this.rowToFlow(row))
  }
  
  async findByUserId(userId: string): Promise<IntroductionFlow[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM introduction_flows 
      WHERE requester_id = ? 
         OR path LIKE ?
      ORDER BY created_at DESC
    `)
    const rows = stmt.all(userId, `%"${userId}"%`)
    
    return rows.map(row => this.rowToFlow(row))
  }
  
  async update(id: string, data: Partial<IntroductionFlow>): Promise<IntroductionFlow> {
    const updates: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = []
    
    if (data.currentStep !== undefined) {
      updates.push('current_step = ?')
      values.push(data.currentStep)
    }
    
    if (data.status !== undefined) {
      updates.push('status = ?')
      values.push(data.status)
    }
    
    if (data.steps !== undefined) {
      updates.push('steps = ?')
      values.push(JSON.stringify(data.steps))
    }
    
    if (data.messageTemplate !== undefined) {
      updates.push('message_template = ?')
      values.push(JSON.stringify(data.messageTemplate))
    }
    
    if (data.completionInfo !== undefined) {
      updates.push('completion_info = ?')
      values.push(JSON.stringify(data.completionInfo))
    }
    
    if (updates.length === 0) {
      const flow = await this.findById(id)
      if (!flow) {
        throw new Error('Introduction flow not found')
      }
      return flow
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    const stmt = this.db.prepare(`
      UPDATE introduction_flows 
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    
    stmt.run(...values)
    
    const flow = await this.findById(id)
    if (!flow) {
      throw new Error('Introduction flow not found after update')
    }
    
    return flow
  }
  
  async updateStatus(id: string, status: IntroductionFlow['status']): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE introduction_flows 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(status, id)
  }
  
  async updateCurrentStep(id: string, step: number): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE introduction_flows 
      SET current_step = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(step, id)
  }
  
  async updateSteps(id: string, steps: IntroductionFlow['steps']): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE introduction_flows 
      SET steps = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(JSON.stringify(steps), id)
  }
  
  async updateCompletionInfo(
    id: string,
    completionInfo: IntroductionFlow['completionInfo']
  ): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE introduction_flows 
      SET completion_info = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(JSON.stringify(completionInfo), id)
  }
  
  async delete(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM introduction_flows WHERE id = ?')
    stmt.run(id)
  }
  
  async findExpired(): Promise<IntroductionFlow[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM introduction_flows 
      WHERE expires_at < datetime('now') 
        AND status NOT IN ('completed', 'failed', 'expired', 'cancelled')
    `)
    const rows = stmt.all()
    
    return rows.map(row => this.rowToFlow(row))
  }
}

