<?php
/**
 * Controller Script — bibliothèque et exécution de scripts
 */

require_once __DIR__ . '/../services/supabase.php';
require_once __DIR__ . '/../services/script_runner.php';
require_once __DIR__ . '/../services/mailer.php';
require_once __DIR__ . '/../routes/api.php';

function list_scripts(): void {
    $user = require_auth();
    $category = $_GET['category'] ?? null;

    $query = "scripts?is_active=eq.true&select=slug,name,description,category,params_schema&order=category,name";
    if ($category) {
        $query .= "&category=eq." . urlencode($category);
    }

    $scripts = supabase_get($query);
    json_response($scripts, null, ['total' => count($scripts)]);
}

function get_script(string $slug): void {
    $user = require_auth();
    $scripts = supabase_get("scripts?slug=eq.$slug&is_active=eq.true&select=*");

    if (empty($scripts)) {
        json_response(null, ['code' => 'NOT_FOUND', 'message' => 'Script introuvable'], null, 404);
        return;
    }

    json_response($scripts[0]);
}

function run_script(string $slug): void {
    $user = require_auth();

    // Vérifier le quota
    require_quota($user['id']);

    // Vérifier que le script existe
    $scripts = supabase_get("scripts?slug=eq.$slug&is_active=eq.true&select=id,name,params_schema");
    if (empty($scripts)) {
        json_response(null, ['code' => 'NOT_FOUND', 'message' => 'Script introuvable'], null, 404);
        return;
    }
    $script = $scripts[0];

    // Récupérer les paramètres
    $body = get_json_body();
    $params = $body['params'] ?? $body;

    // Exécuter le script (synchrone, timeout 30s)
    set_time_limit(SCRIPT_TIMEOUT);
    $result = execute_script($slug, $params, $user['id']);

    // Sauvegarder l'exécution
    $execution = [
        'user_id' => $user['id'],
        'script_id' => $script['id'],
        'params' => json_encode($params),
        'status' => $result['status'],
        'result' => json_encode($result['result']),
        'duration_ms' => $result['duration_ms'],
        'error_message' => $result['error_message'],
    ];
    supabase_post('executions', $execution);

    // Incrémenter le quota
    increment_quota($user['id']);

    // Envoyer notification email (async serait mieux, mais MVP = sync)
    $prefs = supabase_get("notification_preferences?user_id=eq.{$user['id']}&select=*");
    $send_email = true;
    if (!empty($prefs)) {
        $send_email = ($result['status'] === 'success' && $prefs[0]['email_on_success'])
                   || ($result['status'] === 'error' && $prefs[0]['email_on_error']);
    }
    if ($send_email && $user['email']) {
        $email_body = execution_email_body($script['name'], $result['status'], $result['duration_ms'], $result['result']);
        send_email($user['email'], "Akili — {$script['name']} ({$result['status']})", $email_body);
    }

    json_response([
        'status' => $result['status'],
        'duration_ms' => $result['duration_ms'],
        'result' => $result['result'],
        'error_message' => $result['error_message'],
    ]);
}
