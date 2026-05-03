#!/bin/bash
# Écrire le .env pour PHP depuis les variables d'environnement Docker/Render

cat > /var/www/html/api/.env <<EOF
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
FRONTEND_URL=${FRONTEND_URL}
SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
SMTP_FROM=${SMTP_FROM:-noreply@akili.dev}
TEAM_EMAIL=${TEAM_EMAIL:-contact@akili.dev}
EOF

# Lancer Apache
exec apache2-foreground
