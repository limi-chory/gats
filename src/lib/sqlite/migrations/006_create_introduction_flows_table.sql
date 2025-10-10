-- Introduction Flows table: 소개 요청 진행 상태
CREATE TABLE introduction_flows (
  id TEXT PRIMARY KEY,
  path_request_id TEXT NOT NULL,
  requester_id TEXT NOT NULL,
  target_node_id TEXT NOT NULL,
  
  -- Path info
  path TEXT NOT NULL,  -- JSON array of user IDs
  path_details TEXT NOT NULL,  -- JSON array of IntroductionNode
  
  -- State management
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',  -- 'draft', 'pending', 'in_progress', 'completed', 'failed', 'expired', 'cancelled'
  
  -- Steps (JSON array)
  steps TEXT NOT NULL,
  
  -- Message template (JSON)
  message_template TEXT,
  
  -- Completion info (JSON)
  completion_info TEXT,
  
  -- Metadata
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (path_request_id) REFERENCES path_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_node_id) REFERENCES network_nodes(id) ON DELETE CASCADE
);

CREATE INDEX idx_introduction_flows_path_request ON introduction_flows(path_request_id);
CREATE INDEX idx_introduction_flows_requester ON introduction_flows(requester_id);
CREATE INDEX idx_introduction_flows_status ON introduction_flows(status);
CREATE INDEX idx_introduction_flows_expires_at ON introduction_flows(expires_at);

