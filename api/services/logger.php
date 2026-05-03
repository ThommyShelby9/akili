<?php
/**
 * Service Logger — logs des requêtes et erreurs API
 */

define('LOG_DIR', __DIR__ . '/../logs');

/**
 * Log une requête API
 */
function log_request(): void {
    $log = sprintf(
        "[%s] %s %s %s\n",
        date('Y-m-d H:i:s'),
        $_SERVER['REQUEST_METHOD'],
        $_SERVER['REQUEST_URI'],
        $_SERVER['HTTP_ORIGIN'] ?? '-'
    );
    write_log('access.log', $log);
}

/**
 * Log une erreur
 */
function log_error(string $message, array $context = []): void {
    $log = sprintf(
        "[%s] ERROR: %s %s\n",
        date('Y-m-d H:i:s'),
        $message,
        $context ? json_encode($context) : ''
    );
    write_log('error.log', $log);
}

/**
 * Log une exécution de script
 */
function log_execution(string $user_id, string $script_slug, string $status, int $duration_ms): void {
    $log = sprintf(
        "[%s] EXEC: user=%s script=%s status=%s duration=%dms\n",
        date('Y-m-d H:i:s'),
        substr($user_id, 0, 8),
        $script_slug,
        $status,
        $duration_ms
    );
    write_log('executions.log', $log);
}

/**
 * Log un événement d'auth
 */
function log_auth(string $event, string $detail = ''): void {
    $log = sprintf(
        "[%s] AUTH: %s %s\n",
        date('Y-m-d H:i:s'),
        $event,
        $detail
    );
    write_log('auth.log', $log);
}

/**
 * Écriture dans un fichier de log
 */
function write_log(string $filename, string $content): void {
    if (!is_dir(LOG_DIR)) {
        mkdir(LOG_DIR, 0755, true);
    }
    file_put_contents(LOG_DIR . '/' . $filename, $content, FILE_APPEND | LOCK_EX);
}
