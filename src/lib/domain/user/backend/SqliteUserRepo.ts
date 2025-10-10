import type { Database } from 'better-sqlite3'
import { v4 as uuidv4 } from 'uuid'
import type { User, CreateUserInput, UpdateUserInput } from '../types'
import type { IUserRepo } from './UserRepo.interface'
import { encrypt, hashPhoneNumber, generateSalt } from '@/lib/security/crypto'

/**
 * SQLite User Repository 구현
 */
export class SqliteUserRepo implements IUserRepo {
  constructor(private db: Database) {}
  
  /**
   * DB 행을 User 객체로 변환
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToUser(row: any): User {
    return {
      id: row.id,
      clerkUserId: row.clerk_user_id || undefined,
      phoneNumber: row.phone_number,
      phoneHash: row.phone_hash,
      name: row.name,
      company: row.company || undefined,
      school: row.school || undefined,
      interests: row.interests ? JSON.parse(row.interests) : [],
      profileVisibility: row.profile_visibility as 'public' | 'connections_only' | 'ghost_mode',
      userSalt: row.user_salt,
      isVerified: Boolean(row.is_verified),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      lastSyncAt: row.last_sync_at ? new Date(row.last_sync_at) : undefined,
    }
  }
  
  async create(input: CreateUserInput): Promise<User> {
    const id = uuidv4()
    const userSalt = generateSalt()
    const phoneHash = await hashPhoneNumber(input.phoneNumber)
    const encryptedPhone = encrypt(input.phoneNumber, userSalt)
    
    const stmt = this.db.prepare(`
      INSERT INTO users (
        id, clerk_user_id, phone_number, phone_hash, name, 
        company, school, interests, user_salt, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      id,
      input.clerkUserId || null,
      encryptedPhone,
      phoneHash,
      input.name,
      input.company || null,
      input.school || null,
      JSON.stringify(input.interests || []),
      userSalt,
      0 // false
    )
    
    const user = await this.findById(id)
    if (!user) {
      throw new Error('Failed to create user')
    }
    
    return user
  }
  
  async findById(id: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?')
    const row = stmt.get(id)
    
    return row ? this.rowToUser(row) : null
  }
  
  async findByClerkUserId(clerkUserId: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE clerk_user_id = ?')
    const row = stmt.get(clerkUserId)
    
    return row ? this.rowToUser(row) : null
  }
  
  async findByPhoneHash(phoneHash: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE phone_hash = ?')
    const row = stmt.get(phoneHash)
    
    return row ? this.rowToUser(row) : null
  }
  
  async findByPhoneHashes(phoneHashes: string[]): Promise<User[]> {
    if (phoneHashes.length === 0) {
      return []
    }
    
    const placeholders = phoneHashes.map(() => '?').join(',')
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE phone_hash IN (${placeholders})
    `)
    
    const rows = stmt.all(...phoneHashes)
    return rows.map(row => this.rowToUser(row))
  }
  
  async update(id: string, input: UpdateUserInput): Promise<User> {
    const updates: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = []
    
    if (input.name !== undefined) {
      updates.push('name = ?')
      values.push(input.name)
    }
    
    if (input.company !== undefined) {
      updates.push('company = ?')
      values.push(input.company)
    }
    
    if (input.school !== undefined) {
      updates.push('school = ?')
      values.push(input.school)
    }
    
    if (input.interests !== undefined) {
      updates.push('interests = ?')
      values.push(JSON.stringify(input.interests))
    }
    
    if (input.profileVisibility !== undefined) {
      updates.push('profile_visibility = ?')
      values.push(input.profileVisibility)
    }
    
    if (updates.length === 0) {
      const user = await this.findById(id)
      if (!user) {
        throw new Error('User not found')
      }
      return user
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    const stmt = this.db.prepare(`
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    
    stmt.run(...values)
    
    const user = await this.findById(id)
    if (!user) {
      throw new Error('User not found after update')
    }
    
    return user
  }
  
  async updateVerificationStatus(id: string, isVerified: boolean): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE users 
      SET is_verified = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(isVerified ? 1 : 0, id)
  }
  
  async updateLastSyncAt(id: string): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE users 
      SET last_sync_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(id)
  }
  
  async delete(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?')
    stmt.run(id)
  }
  
  async exists(id: string): Promise<boolean> {
    const stmt = this.db.prepare('SELECT 1 FROM users WHERE id = ? LIMIT 1')
    const row = stmt.get(id)
    return !!row
  }
}

