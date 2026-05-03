<?php
/**
 * Controller Notification — notifications in-app
 */

require_once __DIR__ . '/../services/supabase.php';
require_once __DIR__ . '/../routes/api.php';

function list_notifications(): void {
    $user = require_auth();

    $notifications = supabase_get("notifications?user_id=eq.{$user['id']}&select=*&order=created_at.desc&limit=20");

    json_response($notifications, null, ['total' => count($notifications)]);
}

function mark_notification_read(string $id): void {
    $user = require_auth();

    $result = supabase_patch("notifications?id=eq.$id&user_id=eq.{$user['id']}", [
        'is_read' => true,
    ]);

    if (empty($result)) {
        json_response(null, ['code' => 'NOT_FOUND', 'message' => 'Notification introuvable'], null, 404);
        return;
    }

    json_response(['read' => true]);
}
