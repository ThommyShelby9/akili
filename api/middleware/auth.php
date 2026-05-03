<?php
/**
 * Middleware Auth — valide le JWT via Supabase Auth API
 */

require_once __DIR__ . '/../config/database.php';

/**
 * Vérifie le token JWT via l'API Supabase (auth.getUser)
 * Plus fiable que la vérification locale — pas besoin du JWT secret
 * @return array{id: string, email: string, role: string} | null
 */
function authenticate(): ?array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (!preg_match('/^Bearer\s+(.+)$/', $header, $matches)) {
        return null;
    }

    $token = $matches[1];

    // Vérifier le token via Supabase Auth API
    $url = get_supabase_url() . '/auth/v1/user';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . get_supabase_key(),
        'Authorization: Bearer ' . $token,
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    // Debug log
    if ($curl_error || $http_code !== 200) {
        log_error("Auth validation failed", [
            'url' => $url,
            'http_code' => $http_code,
            'curl_error' => $curl_error,
            'response' => substr($response ?: '', 0, 200),
            'token_prefix' => substr($token, 0, 20) . '...',
        ]);
    }

    if ($http_code !== 200 || !$response) {
        return null;
    }

    $user = json_decode($response, true);
    if (!$user || !isset($user['id'])) {
        return null;
    }

    return [
        'id' => $user['id'],
        'email' => $user['email'] ?? '',
        'role' => $user['user_metadata']['role'] ?? 'user',
    ];
}

/**
 * Exige l'authentification — renvoie 401 si pas de token valide
 */
function require_auth(): array {
    $user = authenticate();

    if (!$user) {
        log_auth('UNAUTHORIZED', $_SERVER['REQUEST_URI'] ?? '');
        json_response(null, ['code' => 'UNAUTHORIZED', 'message' => 'Token manquant ou invalide'], null, 401);
        exit;
    }

    return $user;
}

/**
 * Exige le rôle admin — renvoie 403 si pas admin
 */
function require_admin(): array {
    $user = require_auth();

    if ($user['role'] !== 'admin') {
        json_response(null, ['code' => 'FORBIDDEN', 'message' => 'Accès réservé aux administrateurs'], null, 403);
        exit;
    }

    return $user;
}
