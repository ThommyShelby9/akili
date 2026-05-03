<?php
/**
 * Connexion Supabase via REST API
 * Charge le .env puis expose les getters
 */

// Charger le .env à la racine du projet
load_env(__DIR__ . '/../../.env');

function load_env(string $path): void {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        if (!getenv($key)) {
            putenv("$key=$value");
        }
    }
}

function env(string $key, string $default = ''): string {
    return getenv($key) ?: ($_ENV[$key] ?? ($_SERVER[$key] ?? $default));
}

function get_supabase_url(): string {
    return env('SUPABASE_URL');
}

function get_supabase_key(): string {
    return env('SUPABASE_SERVICE_KEY');
}

function get_jwt_secret(): string {
    return env('SUPABASE_JWT_SECRET');
}

function get_frontend_url(): string {
    return env('FRONTEND_URL', 'http://localhost:5173');
}
