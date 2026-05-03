<?php
/**
 * Service Supabase — client REST pour interagir avec la base de données
 */

require_once __DIR__ . '/../config/database.php';

/**
 * Requête GET vers Supabase REST API
 */
function supabase_get(string $endpoint): array {
    $url = get_supabase_url() . '/rest/v1/' . $endpoint;
    return supabase_request('GET', $url);
}

/**
 * Requête POST vers Supabase REST API
 */
function supabase_post(string $endpoint, array $data): array {
    $url = get_supabase_url() . '/rest/v1/' . $endpoint;
    return supabase_request('POST', $url, $data);
}

/**
 * Requête PATCH vers Supabase REST API
 */
function supabase_patch(string $endpoint, array $data): array {
    $url = get_supabase_url() . '/rest/v1/' . $endpoint;
    return supabase_request('PATCH', $url, $data);
}

/**
 * Requête DELETE vers Supabase REST API
 */
function supabase_delete(string $endpoint): array {
    $url = get_supabase_url() . '/rest/v1/' . $endpoint;
    return supabase_request('DELETE', $url);
}

/**
 * Appel RPC Supabase
 */
function supabase_rpc(string $function_name, array $params = []): array {
    $url = get_supabase_url() . '/rest/v1/rpc/' . $function_name;
    return supabase_request('POST', $url, $params);
}

/**
 * Requête HTTP générique vers Supabase
 */
function supabase_request(string $method, string $url, ?array $data = null): array {
    $headers = [
        'apikey: ' . get_supabase_key(),
        'Authorization: Bearer ' . get_supabase_key(),
        'Content-Type: application/json',
        'Prefer: return=representation',
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'PATCH') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'DELETE') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    }

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code >= 400) {
        return [];
    }

    return json_decode($response, true) ?: [];
}
