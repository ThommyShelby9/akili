<?php
/**
 * Middleware CORS — gère les headers et les requêtes preflight OPTIONS
 */

require_once __DIR__ . '/../config/cors.php';

function handle_cors(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    // En développement, accepter localhost sur n'importe quel port
    $is_allowed = in_array($origin, CORS_ALLOWED_ORIGINS)
        || preg_match('/^http:\/\/localhost:\d+$/', $origin);

    if ($is_allowed && $origin) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    }

    header("Access-Control-Allow-Methods: " . CORS_ALLOWED_METHODS);
    header("Access-Control-Allow-Headers: " . CORS_ALLOWED_HEADERS);
    header("Access-Control-Max-Age: " . CORS_MAX_AGE);

    // Preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
