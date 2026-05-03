<?php
/**
 * Service Script Runner — exécute les scripts de la bibliothèque
 * Exécution synchrone avec timeout de 30s
 */

require_once __DIR__ . '/supabase.php';

/**
 * Exécute un script par son slug
 * @return array{status: string, result: mixed, duration_ms: int, error_message: string|null}
 */
function execute_script(string $slug, array $params, string $user_id): array {
    $start = microtime(true);

    try {
        // Simuler l'exécution du script selon le slug
        $result = match($slug) {
            'facture-pdf' => run_facture_pdf($params),
            'facture-relance' => run_facture_relance($params),
            'devis-auto' => run_devis_auto($params),
            'renommage-lot' => run_renommage_lot($params),
            'compression-images' => run_compression_images($params),
            'tri-dossiers' => run_tri_dossiers($params),
            'email-campagne' => run_email_campagne($params),
            'email-reponse-auto' => run_email_reponse_auto($params),
            'rapport-csv' => run_rapport_csv($params),
            'rapport-hebdo' => run_rapport_hebdo($params),
            'backup-drive' => run_backup_drive($params),
            'sync-dossiers' => run_sync_dossiers($params),
            default => ['error' => "Script '$slug' non implémenté"],
        };

        $duration_ms = (int)((microtime(true) - $start) * 1000);

        if (isset($result['error'])) {
            return [
                'status' => 'error',
                'result' => null,
                'duration_ms' => $duration_ms,
                'error_message' => $result['error'],
            ];
        }

        return [
            'status' => 'success',
            'result' => $result,
            'duration_ms' => $duration_ms,
            'error_message' => null,
        ];

    } catch (\Throwable $e) {
        $duration_ms = (int)((microtime(true) - $start) * 1000);
        return [
            'status' => 'error',
            'result' => null,
            'duration_ms' => $duration_ms,
            'error_message' => $e->getMessage(),
        ];
    }
}

// ── Script implementations (MVP: simulées) ──

function run_facture_pdf(array $params): array {
    $client = $params['client'] ?? 'Client';
    $montant = $params['montant'] ?? 0;
    $devise = $params['devise'] ?? 'FCFA';
    // MVP: simule la génération
    return [
        'file' => "facture_{$client}_" . date('Y-m') . ".pdf",
        'montant' => "$montant $devise",
        'message' => "Facture générée pour $client",
    ];
}

function run_facture_relance(array $params): array {
    return ['message' => "Relance envoyée à " . ($params['email'] ?? 'client')];
}

function run_devis_auto(array $params): array {
    return ['file' => "devis_" . ($params['client'] ?? 'client') . ".pdf"];
}

function run_renommage_lot(array $params): array {
    return ['renamed' => 12, 'pattern' => $params['pattern'] ?? ''];
}

function run_compression_images(array $params): array {
    return ['compressed' => 8, 'saved' => '2.4 MB'];
}

function run_tri_dossiers(array $params): array {
    return ['sorted' => 24, 'categories' => ['images' => 12, 'docs' => 8, 'other' => 4]];
}

function run_email_campagne(array $params): array {
    return ['sent' => 35, 'sujet' => $params['sujet'] ?? ''];
}

function run_email_reponse_auto(array $params): array {
    return ['configured' => true, 'mots_cles' => $params['mots_cles'] ?? ''];
}

function run_rapport_csv(array $params): array {
    return ['file' => "rapport_" . ($params['periode'] ?? 'current') . ".csv", 'rows' => 142];
}

function run_rapport_hebdo(array $params): array {
    return ['sent_to' => $params['email'] ?? '', 'message' => 'Rapport envoyé'];
}

function run_backup_drive(array $params): array {
    return ['files' => 18, 'size' => '45 MB', 'destination' => $params['destination'] ?? ''];
}

function run_sync_dossiers(array $params): array {
    return ['synced' => 7, 'source' => $params['source'] ?? '', 'destination' => $params['destination'] ?? ''];
}
