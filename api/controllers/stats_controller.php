<?php
/**
 * Controller Stats — statistiques dashboard utilisateur
 */

require_once __DIR__ . '/../services/supabase.php';
require_once __DIR__ . '/../routes/api.php';

function get_user_stats(): void {
    $user = require_auth();

    // Profil (quota)
    $profile = supabase_get("profiles?id=eq.{$user['id']}&select=quota_used,quota_limit,plan");

    // Nombre total d'exécutions
    $executions = supabase_get("executions?user_id=eq.{$user['id']}&select=id,status,duration_ms");

    $total = count($executions);
    $success = count(array_filter($executions, fn($e) => $e['status'] === 'success'));
    $total_duration_ms = array_sum(array_column($executions, 'duration_ms'));

    // Estimer les heures économisées (chaque script économise ~10 min en moyenne)
    $hours_saved = round(($success * 10) / 60, 1);

    // 5 dernières exécutions
    $recent = supabase_get("executions?user_id=eq.{$user['id']}&select=id,status,duration_ms,created_at,scripts(name,slug)&order=created_at.desc&limit=5");

    json_response([
        'total_executions' => $total,
        'successful_executions' => $success,
        'hours_saved' => $hours_saved,
        'quota_used' => $profile[0]['quota_used'] ?? 0,
        'quota_limit' => $profile[0]['quota_limit'] ?? QUOTA_FREE,
        'plan' => $profile[0]['plan'] ?? 'free',
        'recent_executions' => $recent,
    ]);
}
