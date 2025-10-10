-- Network Nodes table: 사용자 네트워크 맵의 노드들
CREATE TABLE network_nodes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  node_type TEXT NOT NULL,  -- 'user' or 'contact'
  target_user_id TEXT,
  contact_id TEXT,
  display_name TEXT NOT NULL,
  initials TEXT NOT NULL,
  avatar_url TEXT,
  
  -- AI estimated info (JSON)
  estimated_info TEXT,
  
  -- Visualization (JSON)
  visualization TEXT NOT NULL,
  
  -- Metadata
  connection_count INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

CREATE INDEX idx_network_nodes_user_id ON network_nodes(user_id);
CREATE INDEX idx_network_nodes_target_user_id ON network_nodes(target_user_id);
CREATE INDEX idx_network_nodes_contact_id ON network_nodes(contact_id);
CREATE INDEX idx_network_nodes_type ON network_nodes(node_type);
CREATE UNIQUE INDEX idx_network_nodes_user_target ON network_nodes(user_id, target_user_id) WHERE target_user_id IS NOT NULL;
CREATE UNIQUE INDEX idx_network_nodes_user_contact ON network_nodes(user_id, contact_id) WHERE contact_id IS NOT NULL;

