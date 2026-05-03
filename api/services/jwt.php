<?php
/**
 * Service JWT — validation des tokens Supabase
 */

/**
 * Vérifie et décode un JWT
 * @return array|null Le payload si valide, null sinon
 */
function verify_jwt(string $token, string $secret): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$header_b64, $payload_b64, $signature_b64] = $parts;

    // Vérifier la signature HMAC-SHA256
    $expected_sig = base64url_encode(
        hash_hmac('sha256', "$header_b64.$payload_b64", $secret, true)
    );

    if (!hash_equals($expected_sig, $signature_b64)) {
        return null;
    }

    // Décoder le payload
    $payload = json_decode(base64url_decode($payload_b64), true);
    if (!$payload) {
        return null;
    }

    // Vérifier l'expiration
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null;
    }

    return $payload;
}

/**
 * Encode en base64url (sans padding)
 */
function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Décode du base64url
 */
function base64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}
