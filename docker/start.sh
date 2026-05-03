#!/bin/bash
# Écrire le .env pour PHP depuis les variables d'environnement Docker/Render
# Utiliser printf pour éviter les problèmes d'échappement

ENV_FILE="/var/www/html/api/.env"

printf "SUPABASE_URL=%s\n" "$SUPABASE_URL" > "$ENV_FILE"
printf "SUPABASE_SERVICE_KEY=%s\n" "$SUPABASE_SERVICE_KEY" >> "$ENV_FILE"
printf "FRONTEND_URL=%s\n" "$FRONTEND_URL" >> "$ENV_FILE"
printf "SMTP_HOST=%s\n" "$SMTP_HOST" >> "$ENV_FILE"
printf "SMTP_PORT=%s\n" "${SMTP_PORT:-587}" >> "$ENV_FILE"
printf "SMTP_USER=%s\n" "$SMTP_USER" >> "$ENV_FILE"
printf "SMTP_PASS=%s\n" "$SMTP_PASS" >> "$ENV_FILE"
printf "SMTP_FROM=%s\n" "${SMTP_FROM:-noreply@akili.dev}" >> "$ENV_FILE"
printf "TEAM_EMAIL=%s\n" "${TEAM_EMAIL:-contact@akili.dev}" >> "$ENV_FILE"

# Lancer Apache
exec apache2-foreground
