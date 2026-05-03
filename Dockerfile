# Akili — Dockerfile monolithique (Frontend + API PHP)
# Déploiement sur Render comme Web Service unique

# Étape 1 : Build du frontend React
FROM node:20-alpine AS frontend-build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
COPY docker/.env.production .env
RUN npm run build

# Étape 2 : Serveur PHP avec le frontend buildé
FROM php:8.3-apache

# Activer mod_rewrite pour le routage
RUN a2enmod rewrite headers

# Passer les variables d'environnement à PHP via Apache
RUN echo "PassEnv SUPABASE_URL SUPABASE_SERVICE_KEY FRONTEND_URL SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS SMTP_FROM TEAM_EMAIL" >> /etc/apache2/conf-available/environment.conf \
    && a2enconf environment

# Config Apache — servir le frontend + router l'API
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Copier le frontend buildé
COPY --from=frontend-build /app/dist /var/www/html

# Copier l'API PHP
COPY api /var/www/html/api

# Copier le .htaccess racine pour le SPA routing
COPY docker/.htaccess /var/www/html/.htaccess

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && mkdir -p /var/www/html/api/logs \
    && chown -R www-data:www-data /var/www/html/api/logs

# Port
EXPOSE 80

# Script de démarrage — écrit le .env depuis les variables Docker avant de lancer Apache
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
