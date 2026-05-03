<?php
/**
 * Middleware Auth — valide le JWT Supabase
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/jwt.php';

/**
 * Vérifie le token JWT et retourne les données utilisateur
 * @return array{id: string, email: string, role: string} | null
 */
function authenticate(): ?array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (!preg_match('/^Bearer\s+(.+)$/', $header, $matches)) {
        return null;
    }

    $token = $matches[1];
    $payload = verify_jwt($token, get_jwt_secret());

    if (!$payload) {
        return null;
    }

    return [
        'id' => $payload['sub'] ?? '',
        'email' => $payload['email'] ?? '',
        'role' => $payload['user_metadata']['role'] ?? 'user',
    ];
}

/**
 * Exige l'authentification — renvoie 401 si pas de token valide
 */
function require_auth(): array {
    $user = authenticate();

    if (!$user) {
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
