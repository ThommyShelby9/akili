<?php
/**
 * Controller Contact — formulaire de contact public
 */

require_once __DIR__ . '/../services/supabase.php';
require_once __DIR__ . '/../services/mailer.php';
require_once __DIR__ . '/../routes/api.php';

function submit_contact(): void {
    $body = get_json_body();

    // Validation
    $name = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $subject = trim($body['subject'] ?? '');
    $message = trim($body['message'] ?? '');

    $errors = [];
    if (empty($name)) $errors[] = 'Le nom est requis';
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email invalide';
    if (empty($message)) $errors[] = 'Le message est requis';

    if (!empty($errors)) {
        json_response(null, ['code' => 'VALIDATION_ERROR', 'message' => implode('. ', $errors)], null, 422);
        return;
    }

    // Sanitization
    $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    // Sauvegarder dans Supabase
    supabase_post('contacts', [
        'name' => $name,
        'email' => $email,
        'subject' => $subject,
        'message' => $message,
    ]);

    // Envoyer email à l'équipe
    $team_email = getenv('TEAM_EMAIL') ?: 'contact@akili.dev';
    $email_body = contact_email_body($name, $email, $subject, $message);
    send_email($team_email, "Contact Akili: $subject", $email_body);

    json_response(['sent' => true, 'message' => 'Message envoyé avec succès']);
}
