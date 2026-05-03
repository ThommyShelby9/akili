-- Contacts: messages du formulaire de contact
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pas de RLS strict: l'insertion est gérée par le backend PHP
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent lire
CREATE POLICY "Only service role can insert contacts"
  ON contacts FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

CREATE POLICY "Only service role can read contacts"
  ON contacts FOR SELECT
  TO service_role
  USING (TRUE);
