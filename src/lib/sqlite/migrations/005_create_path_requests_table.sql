-- Path Requests table: 사용자의 연결 경로 검색 요청
CREATE TABLE path_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  -- Query info
  query TEXT NOT NULL,
  query_type TEXT NOT NULL,  -- 'natural' or 'structured'
  
  -- Parsed criteria (JSON)
  parsed_criteria TEXT NOT NULL,
  
  -- Search config (JSON)
  search_config TEXT NOT NULL,
  
  -- Results (JSON)
  results TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending',  -- 'pending', 'processing', 'completed', 'failed'
  processed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_path_requests_user_id ON path_requests(user_id);
CREATE INDEX idx_path_requests_status ON path_requests(status);
CREATE INDEX idx_path_requests_created_at ON path_requests(created_at);

