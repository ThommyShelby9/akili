<?php
/**
 * Service Mailer — envoi d'emails via SMTP ou mail() natif
 */

/**
 * Envoie un email
 */
function send_email(string $to, string $subject, string $body): bool {
    $smtp_host = getenv('SMTP_HOST');

    // Si SMTP configuré, utiliser une connexion SMTP
    if ($smtp_host) {
        return send_smtp_email($to, $subject, $body);
    }

    // Fallback: mail() natif PHP
    $headers = implode("\r\n", [
        'From: Akili <noreply@akili.dev>',
        'Content-Type: text/html; charset=UTF-8',
        'MIME-Version: 1.0',
    ]);

    return mail($to, $subject, $body, $headers);
}

/**
 * Envoi via SMTP (simplifié)
 */
function send_smtp_email(string $to, string $subject, string $body): bool {
    $host = getenv('SMTP_HOST');
    $port = getenv('SMTP_PORT') ?: 587;
    $user = getenv('SMTP_USER');
    $pass = getenv('SMTP_PASS');
    $from = getenv('SMTP_FROM') ?: 'noreply@akili.dev';

    // Pour MVP: utiliser mail() comme fallback
    // En production: intégrer PHPMailer ou similaire
    $headers = implode("\r\n", [
        "From: Akili <$from>",
        'Content-Type: text/html; charset=UTF-8',
        'MIME-Version: 1.0',
    ]);

    return mail($to, $subject, $body, $headers);
}

/**
 * Template email d'exécution de script
 */
function execution_email_body(string $script_name, string $status, int $duration_ms, $result): string {
    $status_label = $status === 'success' ? 'Succès' : 'Erreur';
    $status_color = $status === 'success' ? '#3DD68C' : '#F87171';
    $duration = round($duration_ms / 1000, 1);

    return "
    <div style='font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0F172A; color: #F8FAFC; border-radius: 16px;'>
        <h2 style='margin: 0 0 16px;'>Akili — Exécution terminée</h2>
        <p><strong>Script :</strong> $script_name</p>
        <p><strong>Statut :</strong> <span style='color: $status_color;'>$status_label</span></p>
        <p><strong>Durée :</strong> {$duration}s</p>
        <hr style='border: none; border-top: 1px solid rgba(248,250,252,0.1); margin: 16px 0;'>
        <p style='color: #94A3B8; font-size: 12px;'>Cet email a été envoyé automatiquement par Akili.</p>
    </div>";
}

/**
 * Template email notification contact
 */
function contact_email_body(string $name, string $email, string $subject, string $message): string {
    return "
    <div style='font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0F172A; color: #F8FAFC; border-radius: 16px;'>
        <h2 style='margin: 0 0 16px;'>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> $name</p>
        <p><strong>Email :</strong> $email</p>
        <p><strong>Sujet :</strong> $subject</p>
        <hr style='border: none; border-top: 1px solid rgba(248,250,252,0.1); margin: 16px 0;'>
        <p>$message</p>
    </div>";
}
