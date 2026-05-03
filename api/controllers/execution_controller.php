<?php
/**
 * Controller Execution — historique des exécutions
 */

require_once __DIR__ . '/../services/supabase.php';
require_once __DIR__ . '/../routes/api.php';

function list_executions(): void {
    $user = require_auth();

    $page = max(1, (int)($_GET['page'] ?? 1));
    $per_page = min(PER_PAGE_MAX, max(1, (int)($_GET['per_page'] ?? PER_PAGE_DEFAULT)));
    $offset = ($page - 1) * $per_page;

    $query = "executions?user_id=eq.{$user['id']}&select=id,script_id,status,duration_ms,created_at,scripts(name,slug)&order=created_at.desc&limit=$per_page&offset=$offset";

    // Filtres optionnels
    if (!empty($_GET['status'])) {
        $query .= "&status=eq." . urlencode($_GET['status']);
    }
    if (!empty($_GET['script_id'])) {
        $query .= "&script_id=eq." . urlencode($_GET['script_id']);
    }

    $executions = supabase_get($query);

    json_response($executions, null, [
        'page' => $page,
        'per_page' => $per_page,
        'total' => count($executions), // approximation pour MVP
    ]);
}

function get_execution(string $id): void {
    $user = require_auth();

    $executions = supabase_get("executions?id=eq.$id&user_id=eq.{$user['id']}&select=*,scripts(name,slug,category)");

    if (empty($executions)) {
        json_response(null, ['code' => 'NOT_FOUND', 'message' => 'Exécution introuvable'], null, 404);
        return;
    }

    json_response($executions[0]);
}
