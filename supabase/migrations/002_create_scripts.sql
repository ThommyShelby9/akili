-- Scripts: bibliothèque de scripts disponibles
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  params_schema JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: lecture publique
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scripts are viewable by authenticated users"
  ON scripts FOR SELECT
  TO authenticated
  USING (is_active = TRUE);
