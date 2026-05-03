-- ============================================
-- AKILI — Full Migration Script
-- Coller dans le SQL Editor de Supabase
-- ============================================

-- 001: Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  sector TEXT,
  job_role TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  quota_used INTEGER DEFAULT 0,
  quota_limit INTEGER DEFAULT 10,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 002: Scripts
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

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Scripts are viewable by authenticated users" ON scripts FOR SELECT TO authenticated USING (is_active = TRUE);

-- 003: Executions
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

CREATE INDEX idx_executions_user_id ON executions(user_id);
CREATE INDEX idx_executions_created_at ON executions(created_at DESC);
CREATE INDEX idx_executions_status ON executions(status);

ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own executions" ON executions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own executions" ON executions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 004: Integrations
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own integrations" ON integrations FOR ALL USING (auth.uid() = user_id);

-- 005: Contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only service role can insert contacts" ON contacts FOR INSERT TO service_role WITH CHECK (TRUE);
CREATE POLICY "Only service role can read contacts" ON contacts FOR SELECT TO service_role USING (TRUE);

-- 006: Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- 007: Notification Preferences
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_on_success BOOLEAN DEFAULT TRUE,
  email_on_error BOOLEAN DEFAULT TRUE
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON notification_preferences FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- SEED: Scripts Library
-- ============================================

INSERT INTO scripts (slug, name, description, category, params_schema) VALUES
('facture-pdf', 'Génération de facture PDF', 'Génère une facture PDF professionnelle à partir des paramètres fournis.', 'facturation', '{"required": ["client", "montant"], "properties": {"client": {"type": "string", "label": "Nom du client"}, "montant": {"type": "number", "label": "Montant (FCFA)"}, "devise": {"type": "string", "label": "Devise", "default": "FCFA"}, "email": {"type": "string", "label": "Email client"}}}'),
('facture-relance', 'Relance de facture impayée', 'Envoie un email de relance pour les factures en retard.', 'facturation', '{"required": ["client", "email", "montant", "date_echeance"], "properties": {"client": {"type": "string", "label": "Nom du client"}, "email": {"type": "string", "label": "Email client"}, "montant": {"type": "number", "label": "Montant dû"}, "date_echeance": {"type": "string", "label": "Date échéance"}}}'),
('devis-auto', 'Génération de devis', 'Crée un devis personnalisé en PDF.', 'facturation', '{"required": ["client", "prestations"], "properties": {"client": {"type": "string", "label": "Nom du client"}, "prestations": {"type": "string", "label": "Prestations"}, "remise": {"type": "number", "label": "Remise (%)", "default": 0}}}'),
('renommage-lot', 'Renommage de fichiers en lot', 'Renomme tous les fichiers selon une convention.', 'fichiers', '{"required": ["dossier", "pattern"], "properties": {"dossier": {"type": "string", "label": "Dossier source"}, "pattern": {"type": "string", "label": "Pattern (ex: {client}_{date}_{n})"}}}'),
('compression-images', 'Compression d''images', 'Compresse et redimensionne les images.', 'fichiers', '{"required": ["dossier"], "properties": {"dossier": {"type": "string", "label": "Dossier source"}, "qualite": {"type": "number", "label": "Qualité (%)", "default": 85}, "largeur_max": {"type": "number", "label": "Largeur max (px)", "default": 1200}, "format": {"type": "string", "label": "Format", "default": "webp"}}}'),
('tri-dossiers', 'Tri automatique de fichiers', 'Organise les fichiers par type.', 'fichiers', '{"required": ["dossier"], "properties": {"dossier": {"type": "string", "label": "Dossier à trier"}}}'),
('email-campagne', 'Campagne email', 'Envoie un email personnalisé à une liste CSV.', 'emails', '{"required": ["sujet", "template", "liste"], "properties": {"sujet": {"type": "string", "label": "Sujet"}, "template": {"type": "string", "label": "Corps du message"}, "liste": {"type": "string", "label": "Fichier CSV"}}}'),
('email-reponse-auto', 'Réponse automatique', 'Configure une réponse auto par mots-clés.', 'emails', '{"required": ["mots_cles", "reponse"], "properties": {"mots_cles": {"type": "string", "label": "Mots-clés"}, "reponse": {"type": "string", "label": "Message de réponse"}}}'),
('rapport-csv', 'Export rapport CSV', 'Génère un rapport CSV d''activité.', 'rapports', '{"required": ["periode"], "properties": {"periode": {"type": "string", "label": "Période"}, "format": {"type": "string", "label": "Format", "default": "csv"}}}'),
('rapport-hebdo', 'Rapport hebdomadaire', 'Résumé d''activité envoyé par email.', 'rapports', '{"required": ["email"], "properties": {"email": {"type": "string", "label": "Email"}, "inclure_stats": {"type": "boolean", "label": "Inclure stats", "default": true}}}'),
('backup-drive', 'Sauvegarde Google Drive', 'Sauvegarde un dossier vers Drive.', 'stockage', '{"required": ["source", "destination"], "properties": {"source": {"type": "string", "label": "Dossier local"}, "destination": {"type": "string", "label": "Dossier Drive"}, "compression": {"type": "boolean", "label": "Compresser", "default": false}}}'),
('sync-dossiers', 'Synchronisation de dossiers', 'Synchronise deux dossiers.', 'stockage', '{"required": ["source", "destination"], "properties": {"source": {"type": "string", "label": "Source"}, "destination": {"type": "string", "label": "Destination"}, "bidirectionnel": {"type": "boolean", "label": "Bidirectionnel", "default": false}}}');

-- ============================================
-- Helper RPC pour le backend PHP (increment quota)
-- ============================================

CREATE OR REPLACE FUNCTION increment_quota(user_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET quota_used = quota_used + 1, updated_at = NOW() WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
