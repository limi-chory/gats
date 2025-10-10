import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

let db: Database.Database | null = null

/**
 * SQLite 데이터베이스 연결 초기화
 */
export function getDatabase(): Database.Database {
  if (db) {
    return db
  }

  const dbDir = path.join(process.cwd(), 'data')
  
  // data 디렉토리가 없으면 생성
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  const dbPath = path.join(dbDir, 'gats.db')
  
  db = new Database(dbPath, {
    verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
  })

  // WAL 모드 활성화 (성능 향상)
  db.pragma('journal_mode = WAL')
  
  // Foreign key constraints 활성화
  db.pragma('foreign_keys = ON')

  return db
}

/**
 * 데이터베이스 연결 종료
 */
export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}

/**
 * 마이그레이션 상태 테이블 생성
 */
function createMigrationTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

/**
 * 적용된 마이그레이션 목록 조회
 */
function getAppliedMigrations(db: Database.Database): string[] {
  const stmt = db.prepare('SELECT name FROM migrations ORDER BY id')
  const rows = stmt.all() as Array<{ name: string }>
  return rows.map(row => row.name)
}

/**
 * 마이그레이션 적용
 */
function applyMigration(db: Database.Database, name: string, sql: string): void {
  console.log(`Applying migration: ${name}`)
  
  const transaction = db.transaction(() => {
    db.exec(sql)
    db.prepare('INSERT INTO migrations (name) VALUES (?)').run(name)
  })
  
  transaction()
  console.log(`✓ Migration applied: ${name}`)
}

/**
 * 모든 마이그레이션 실행
 */
export function runMigrations(): void {
  const db = getDatabase()
  
  createMigrationTable(db)
  
  const appliedMigrations = getAppliedMigrations(db)
  
  const migrationsDir = path.join(process.cwd(), 'src', 'lib', 'sqlite', 'migrations')
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found')
    return
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
  
  let appliedCount = 0
  
  for (const file of migrationFiles) {
    if (appliedMigrations.includes(file)) {
      continue
    }
    
    const filePath = path.join(migrationsDir, file)
    const sql = fs.readFileSync(filePath, 'utf-8')
    
    applyMigration(db, file, sql)
    appliedCount++
  }
  
  if (appliedCount === 0) {
    console.log('✓ All migrations are up to date')
  } else {
    console.log(`✓ Applied ${appliedCount} migration(s)`)
  }
}

/**
 * 마이그레이션 상태 확인
 */
export function checkMigrationStatus(): void {
  const db = getDatabase()
  
  createMigrationTable(db)
  
  const appliedMigrations = getAppliedMigrations(db)
  
  console.log('\n=== Migration Status ===')
  console.log(`Applied migrations: ${appliedMigrations.length}`)
  
  if (appliedMigrations.length > 0) {
    console.log('\nApplied:')
    appliedMigrations.forEach((name, index) => {
      console.log(`  ${index + 1}. ${name}`)
    })
  }
  
  const migrationsDir = path.join(process.cwd(), 'src', 'lib', 'sqlite', 'migrations')
  
  if (fs.existsSync(migrationsDir)) {
    const allMigrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()
    
    const pendingMigrations = allMigrationFiles.filter(
      file => !appliedMigrations.includes(file)
    )
    
    if (pendingMigrations.length > 0) {
      console.log('\nPending:')
      pendingMigrations.forEach((name, index) => {
        console.log(`  ${index + 1}. ${name}`)
      })
    }
  }
  
  console.log('========================\n')
}

