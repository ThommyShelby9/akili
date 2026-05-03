-- Permettre aux admins de lire tous les profils
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Supprimer l'ancienne policy trop restrictive
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Permettre aux admins de modifier tous les profils (suspend/delete)
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Supprimer l'ancienne policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Permettre aux admins de supprimer des profils
CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
