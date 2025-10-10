-- Contacts table: 사용자가 동기화한 연락처
CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  phone_hash TEXT NOT NULL,
  encrypted_phone TEXT NOT NULL,
  encrypted_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  matched_user_id TEXT,
  tags TEXT,  -- JSON array
  synced_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (matched_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_phone_hash ON contacts(phone_hash);
CREATE INDEX idx_contacts_matched_user_id ON contacts(matched_user_id);
CREATE UNIQUE INDEX idx_contacts_user_phone ON contacts(user_id, phone_hash);

