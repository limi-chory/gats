import type { Database } from 'better-sqlite3'
import { v4 as uuidv4 } from 'uuid'
import type { Contact } from '../types'
import type { IContactRepo } from './ContactRepo.interface'

/**
 * SQLite Contact Repository 구현
 */
export class SqliteContactRepo implements IContactRepo {
  constructor(private db: Database) {}
  
  /**
   * DB 행을 Contact 객체로 변환
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToContact(row: any): Contact {
    return {
      id: row.id,
      userId: row.user_id,
      phoneHash: row.phone_hash,
      encryptedPhone: row.encrypted_phone,
      encryptedName: row.encrypted_name,
      originalName: row.original_name,
      matchedUserId: row.matched_user_id || undefined,
      tags: row.tags ? JSON.parse(row.tags) : [],
      syncedAt: new Date(row.synced_at),
      createdAt: new Date(row.created_at),
    }
  }
  
  async create(contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
    const id = uuidv4()
    
    const stmt = this.db.prepare(`
      INSERT INTO contacts (
        id, user_id, phone_hash, encrypted_phone, encrypted_name,
        original_name, matched_user_id, tags, synced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      id,
      contact.userId,
      contact.phoneHash,
      contact.encryptedPhone,
      contact.encryptedName,
      contact.originalName,
      contact.matchedUserId || null,
      JSON.stringify(contact.tags),
      contact.syncedAt.toISOString()
    )
    
    const created = await this.findById(id)
    if (!created) {
      throw new Error('Failed to create contact')
    }
    
    return created
  }
  
  async findById(id: string): Promise<Contact | null> {
    const stmt = this.db.prepare('SELECT * FROM contacts WHERE id = ?')
    const row = stmt.get(id)
    
    return row ? this.rowToContact(row) : null
  }
  
  async findByUserId(userId: string): Promise<Contact[]> {
    const stmt = this.db.prepare('SELECT * FROM contacts WHERE user_id = ? ORDER BY created_at DESC')
    const rows = stmt.all(userId)
    
    return rows.map(row => this.rowToContact(row))
  }
  
  async findByUserAndPhoneHash(userId: string, phoneHash: string): Promise<Contact | null> {
    const stmt = this.db.prepare('SELECT * FROM contacts WHERE user_id = ? AND phone_hash = ?')
    const row = stmt.get(userId, phoneHash)
    
    return row ? this.rowToContact(row) : null
  }
  
  async findByMatchedUserId(matchedUserId: string): Promise<Contact[]> {
    const stmt = this.db.prepare('SELECT * FROM contacts WHERE matched_user_id = ?')
    const rows = stmt.all(matchedUserId)
    
    return rows.map(row => this.rowToContact(row))
  }
  
  async update(id: string, data: Partial<Contact>): Promise<Contact> {
    const updates: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = []
    
    if (data.encryptedName !== undefined) {
      updates.push('encrypted_name = ?')
      values.push(data.encryptedName)
    }
    
    if (data.originalName !== undefined) {
      updates.push('original_name = ?')
      values.push(data.originalName)
    }
    
    if (data.matchedUserId !== undefined) {
      updates.push('matched_user_id = ?')
      values.push(data.matchedUserId)
    }
    
    if (data.tags !== undefined) {
      updates.push('tags = ?')
      values.push(JSON.stringify(data.tags))
    }
    
    if (data.syncedAt !== undefined) {
      updates.push('synced_at = ?')
      values.push(data.syncedAt.toISOString())
    }
    
    if (updates.length === 0) {
      const contact = await this.findById(id)
      if (!contact) {
        throw new Error('Contact not found')
      }
      return contact
    }
    
    values.push(id)
    
    const stmt = this.db.prepare(`
      UPDATE contacts 
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    
    stmt.run(...values)
    
    const contact = await this.findById(id)
    if (!contact) {
      throw new Error('Contact not found after update')
    }
    
    return contact
  }
  
  async delete(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM contacts WHERE id = ?')
    stmt.run(id)
  }
  
  async deleteByUserId(userId: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM contacts WHERE user_id = ?')
    stmt.run(userId)
  }
  
  async updateMatch(contactId: string, matchedUserId: string): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE contacts 
      SET matched_user_id = ?
      WHERE id = ?
    `)
    
    stmt.run(matchedUserId, contactId)
  }
  
  async findByPhoneHashes(userId: string, phoneHashes: string[]): Promise<Contact[]> {
    if (phoneHashes.length === 0) {
      return []
    }
    
    const placeholders = phoneHashes.map(() => '?').join(',')
    const stmt = this.db.prepare(`
      SELECT * FROM contacts 
      WHERE user_id = ? AND phone_hash IN (${placeholders})
    `)
    
    const rows = stmt.all(userId, ...phoneHashes)
    return rows.map(row => this.rowToContact(row))
  }
}

