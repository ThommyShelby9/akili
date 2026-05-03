<?php
/**
 * Connexion Supabase via REST API
 * Utilise le service_role key pour les opérations backend
 */

function get_supabase_url(): string {
    return getenv('SUPABASE_URL') ?: '';
}

function get_supabase_key(): string {
    return getenv('SUPABASE_SERVICE_KEY') ?: '';
}

function get_jwt_secret(): string {
    return getenv('SUPABASE_JWT_SECRET') ?: '';
}

function get_frontend_url(): string {
    return getenv('FRONTEND_URL') ?: 'http://localhost:5173';
}
