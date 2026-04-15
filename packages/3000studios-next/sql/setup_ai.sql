-- SQL setup for AI features: pgvector, memory, usage, cost limits, and trigger

-- If you rely on gen_random_uuid() ensure `pgcrypto` is available.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- AI memory (vector store)
CREATE TABLE IF NOT EXISTS ai_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  access_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_memory_user_idx ON ai_memory (user_id);
CREATE INDEX IF NOT EXISTS ai_memory_embedding_idx ON ai_memory USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- AI usage logging (cost tracking)
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens INT NOT NULL,
  cost_usd NUMERIC(10,6),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_usage_user_idx ON ai_usage (user_id);
CREATE INDEX IF NOT EXISTS ai_usage_date_idx ON ai_usage (created_at);

-- User cost limits (hard stop)
CREATE TABLE IF NOT EXISTS ai_cost_limits (
  user_id TEXT PRIMARY KEY,
  monthly_token_limit INT NOT NULL
);

INSERT INTO ai_cost_limits (user_id, monthly_token_limit)
VALUES ('default', 200000)
ON CONFLICT (user_id) DO NOTHING;

-- Optional: bump access counter trigger
CREATE OR REPLACE FUNCTION bump_access_count() RETURNS TRIGGER AS $$
BEGIN
  UPDATE ai_memory
  SET access_count = access_count + 1
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Final verification queries (run after applying this file):
-- SELECT * FROM ai_memory LIMIT 1;
-- SELECT * FROM ai_usage LIMIT 1;
-- SELECT * FROM ai_cost_limits;
