<?php
/**
 * Routeur API — définition des routes
 */

require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/rate_limit.php';

/**
 * Réponse JSON uniforme
 */
function json_response($data, $error = null, $meta = null, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'data' => $data,
        'error' => $error,
        'meta' => $meta,
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * Récupère le body JSON de la requête
 */
function get_json_body(): array {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?: [];
}

/**
 * Router principal
 */
function route_request(string $method, string $uri): void {
    // Health check + debug env
    if ($uri === '/health' && $method === 'GET') {
        json_response([
            'status' => 'ok',
            'version' => '0.1.0',
            'supabase_url' => get_supabase_url() ? 'set (' . strlen(get_supabase_url()) . ' chars)' : 'MISSING',
            'service_key' => get_supabase_key() ? 'set (' . strlen(get_supabase_key()) . ' chars)' : 'MISSING',
            'env_file_api' => file_exists(__DIR__ . '/../.env') ? 'exists' : 'not found',
            'env_file_root' => file_exists(__DIR__ . '/../../.env') ? 'exists' : 'not found',
        ]);
        return;
    }

    // Profile
    if ($uri === '/profile' && $method === 'GET') {
        require_once __DIR__ . '/../controllers/profile_controller.php';
        get_profile();
        return;
    }
    if ($uri === '/profile' && $method === 'PUT') {
        require_once __DIR__ . '/../controllers/profile_controller.php';
        update_profile();
        return;
    }
    if ($uri === '/profile' && $method === 'DELETE') {
        require_once __DIR__ . '/../controllers/profile_controller.php';
        delete_profile();
        return;
    }

    // Scripts
    if ($uri === '/scripts' && $method === 'GET') {
        require_once __DIR__ . '/../controllers/script_controller.php';
        list_scripts();
        return;
    }
    if (preg_match('#^/scripts/([a-z0-9-]+)$#', $uri, $m) && $method === 'GET') {
        require_once __DIR__ . '/../controllers/script_controller.php';
        get_script($m[1]);
        return;
    }
    if (preg_match('#^/scripts/([a-z0-9-]+)/run$#', $uri, $m) && $method === 'POST') {
        require_once __DIR__ . '/../controllers/script_controller.php';
        run_script($m[1]);
        return;
    }

    // Executions
    if ($uri === '/executions' && $method === 'GET') {
        require_once __DIR__ . '/../controllers/execution_controller.php';
        list_executions();
        return;
    }
    if (preg_match('#^/executions/([a-f0-9-]+)$#', $uri, $m) && $method === 'GET') {
        require_once __DIR__ . '/../controllers/execution_controller.php';
        get_execution($m[1]);
        return;
    }

    // Stats
    if ($uri === '/stats' && $method === 'GET') {
        require_once __DIR__ . '/../controllers/stats_controller.php';
        get_user_stats();
        return;
    }

    // Contact
    if ($uri === '/contact' && $method === 'POST') {
        require_once __DIR__ . '/../controllers/contact_controller.php';
        submit_contact();
        return;
    }

    // Notifications
    if ($uri === '/notifications' && $method === 'GET') {
        require_once __DIR__ . '/../controllers/notification_controller.php';
        list_notifications();
        return;
    }
    if (preg_match('#^/notifications/([a-f0-9-]+)/read$#', $uri, $m) && $method === 'PUT') {
        require_once __DIR__ . '/../controllers/notification_controller.php';
        mark_notification_read($m[1]);
        return;
    }

    // 404
    json_response(null, ['code' => 'NOT_FOUND', 'message' => 'Endpoint introuvable'], null, 404);
}
