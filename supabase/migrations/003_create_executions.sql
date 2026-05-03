-- Executions: historique des exécutions de scripts
CREATE TABLE executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  script_id UUID REFERENCES scripts(id),
  params JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'error')),
  result JSONB,
  duration_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_executions_user_id ON executions(user_id);
CREATE INDEX idx_executions_created_at ON executions(created_at DESC);
CREATE INDEX idx_executions_status ON executions(status);

-- RLS
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own executions"
  ON executions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own executions"
  ON executions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
