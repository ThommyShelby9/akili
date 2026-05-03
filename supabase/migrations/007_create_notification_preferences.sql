-- Notification Preferences: préférences email par utilisateur
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_on_success BOOLEAN DEFAULT TRUE,
  email_on_error BOOLEAN DEFAULT TRUE
);

-- RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id);
