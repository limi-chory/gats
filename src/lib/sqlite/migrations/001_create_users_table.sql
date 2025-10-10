-- Users table: 사용자 기본 정보
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT UNIQUE,
  phone_number TEXT NOT NULL,  -- encrypted
  phone_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company TEXT,
  school TEXT,
  interests TEXT,  -- JSON array
  profile_visibility TEXT DEFAULT 'public',
  user_salt TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_sync_at DATETIME
);

CREATE INDEX idx_users_phone_hash ON users(phone_hash);
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_created_at ON users(created_at);

