<?php
/**
 * Controller Profile — gestion du profil utilisateur
 */

require_once __DIR__ . '/../services/supabase.php';
require_once __DIR__ . '/../routes/api.php';

function get_profile(): void {
    $user = require_auth();
    $profile = supabase_get("profiles?id=eq.{$user['id']}&select=*");

    if (empty($profile)) {
        json_response(null, ['code' => 'NOT_FOUND', 'message' => 'Profil introuvable'], null, 404);
        return;
    }

    json_response($profile[0]);
}

function update_profile(): void {
    $user = require_auth();
    $body = get_json_body();

    // Champs modifiables
    $allowed = ['full_name', 'sector', 'job_role', 'onboarding_completed'];
    $data = array_intersect_key($body, array_flip($allowed));
    $data['updated_at'] = date('c');

    // Sanitization
    foreach ($data as $key => $value) {
        if (is_string($value)) {
            $data[$key] = htmlspecialchars(strip_tags($value), ENT_QUOTES, 'UTF-8');
        }
    }

    $result = supabase_patch("profiles?id=eq.{$user['id']}", $data);
    json_response($result[0] ?? $data);
}

function delete_profile(): void {
    $user = require_auth();

    // Supprimer le profil (cascade supprime executions, notifications, etc.)
    supabase_delete("profiles?id=eq.{$user['id']}");

    json_response(['deleted' => true]);
}
