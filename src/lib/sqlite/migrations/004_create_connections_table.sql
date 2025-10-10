-- Connections table: 노드 간 연결 관계
CREATE TABLE connections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  from_node_id TEXT NOT NULL,
  to_node_id TEXT NOT NULL,
  
  -- Relationship info
  strength INTEGER NOT NULL,  -- 0-100
  type TEXT NOT NULL,  -- 'friend', 'colleague', etc.
  is_mutual BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Context (JSON)
  context TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (from_node_id) REFERENCES network_nodes(id) ON DELETE CASCADE,
  FOREIGN KEY (to_node_id) REFERENCES network_nodes(id) ON DELETE CASCADE
);

CREATE INDEX idx_connections_user_id ON connections(user_id);
CREATE INDEX idx_connections_from_node ON connections(from_node_id);
CREATE INDEX idx_connections_to_node ON connections(to_node_id);
CREATE INDEX idx_connections_strength ON connections(strength);
CREATE UNIQUE INDEX idx_connections_user_nodes ON connections(user_id, from_node_id, to_node_id);

