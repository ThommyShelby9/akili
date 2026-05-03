<?php
/**
 * Middleware Rate Limit — vérifie le quota utilisateur
 */

require_once __DIR__ . '/../services/supabase.php';

/**
 * Vérifie si l'utilisateur a encore du quota pour exécuter un script
 * @param string $user_id
 * @return bool true si OK, false si quota dépassé
 */
function check_quota(string $user_id): bool {
    $profile = supabase_get("profiles?id=eq.$user_id&select=quota_used,quota_limit");

    if (empty($profile)) {
        return false;
    }

    $quota_used = $profile[0]['quota_used'] ?? 0;
    $quota_limit = $profile[0]['quota_limit'] ?? QUOTA_FREE;

    return $quota_used < $quota_limit;
}

/**
 * Incrémente le compteur de quota
 */
function increment_quota(string $user_id): void {
    supabase_rpc('increment_quota', ['user_id_input' => $user_id]);
}

/**
 * Exige du quota disponible — renvoie 429 si dépassé
 */
function require_quota(string $user_id): void {
    if (!check_quota($user_id)) {
        json_response(null, [
            'code' => 'QUOTA_EXCEEDED',
            'message' => 'Quota journalier atteint. Upgrade ton plan ou reviens demain.'
        ], null, 429);
        exit;
    }
}
