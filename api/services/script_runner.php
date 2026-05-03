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

// ── Script implementations (simulation réaliste avec délais) ──

function run_facture_pdf(array $params): array {
    $client = $params['client'] ?? 'Client';
    $montant = $params['montant'] ?? 0;
    $devise = $params['devise'] ?? 'FCFA';
    $email = $params['email'] ?? null;

    // Simule le traitement
    usleep(rand(800000, 1500000)); // 0.8-1.5s

    $filename = "facture_" . strtolower(str_replace(' ', '_', $client)) . "_" . date('Y-m') . ".pdf";

    return [
        'file' => $filename,
        'file_size' => rand(45, 120) . ' KB',
        'montant_formatte' => number_format($montant, 0, ',', ' ') . " $devise",
        'client' => $client,
        'numero_facture' => 'AK-' . date('Ym') . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT),
        'email_envoye' => $email ? true : false,
        'destinataire' => $email ?: 'Non spécifié',
        'message' => "Facture de " . number_format($montant, 0, ',', ' ') . " $devise générée pour $client",
    ];
}

function run_facture_relance(array $params): array {
    $client = $params['client'] ?? 'Client';
    $email = $params['email'] ?? 'client@email.com';
    $montant = $params['montant'] ?? 0;
    $date_echeance = $params['date_echeance'] ?? date('Y-m-d');

    usleep(rand(600000, 1200000));

    $jours_retard = max(0, (int)((time() - strtotime($date_echeance)) / 86400));

    return [
        'email_envoye' => true,
        'destinataire' => $email,
        'client' => $client,
        'montant_du' => number_format($montant, 0, ',', ' ') . ' FCFA',
        'jours_retard' => $jours_retard,
        'type_relance' => $jours_retard > 30 ? 'mise en demeure' : ($jours_retard > 14 ? 'relance ferme' : 'rappel courtois'),
        'message' => "Relance envoyée à $email — $jours_retard jours de retard",
    ];
}

function run_devis_auto(array $params): array {
    $client = $params['client'] ?? 'Client';
    $prestations = $params['prestations'] ?? 'Prestation standard';
    $remise = $params['remise'] ?? 0;

    usleep(rand(700000, 1300000));

    $montant_ht = rand(50000, 500000);
    $montant_remise = $montant_ht * (1 - $remise / 100);

    return [
        'file' => "devis_" . strtolower(str_replace(' ', '_', $client)) . "_" . date('Ymd') . ".pdf",
        'file_size' => rand(35, 85) . ' KB',
        'numero_devis' => 'DV-' . date('Ym') . '-' . str_pad(rand(1, 99), 2, '0', STR_PAD_LEFT),
        'client' => $client,
        'prestations' => $prestations,
        'montant_ht' => number_format($montant_ht, 0, ',', ' ') . ' FCFA',
        'remise_appliquee' => $remise . '%',
        'montant_final' => number_format($montant_remise, 0, ',', ' ') . ' FCFA',
        'validite' => '30 jours',
        'message' => "Devis de " . number_format($montant_remise, 0, ',', ' ') . " FCFA généré pour $client",
    ];
}

function run_renommage_lot(array $params): array {
    $dossier = $params['dossier'] ?? '~/Documents';
    $pattern = $params['pattern'] ?? '{date}_{n}';

    usleep(rand(500000, 1000000));

    $count = rand(8, 45);
    $exemples = [];
    for ($i = 0; $i < min(3, $count); $i++) {
        $exemples[] = str_replace(['{date}', '{n}', '{client}'], [date('Y-m-d'), str_pad($i + 1, 3, '0', STR_PAD_LEFT), 'acme'], $pattern) . '.jpg';
    }

    return [
        'fichiers_renommes' => $count,
        'dossier' => $dossier,
        'pattern_applique' => $pattern,
        'exemples' => $exemples,
        'extensions_traitees' => ['jpg' => rand(5, 20), 'png' => rand(3, 15), 'pdf' => rand(0, 10)],
        'message' => "$count fichiers renommés avec le pattern '$pattern'",
    ];
}

function run_compression_images(array $params): array {
    $dossier = $params['dossier'] ?? '~/Images';
    $qualite = $params['qualite'] ?? 85;
    $largeur_max = $params['largeur_max'] ?? 1200;
    $format = $params['format'] ?? 'webp';

    usleep(rand(1000000, 2500000)); // 1-2.5s (plus long)

    $count = rand(5, 30);
    $taille_avant = rand(15, 80);
    $taille_apres = (int)($taille_avant * ($qualite / 100) * 0.6);

    return [
        'images_compressees' => $count,
        'format_sortie' => $format,
        'qualite' => $qualite . '%',
        'largeur_max' => $largeur_max . 'px',
        'taille_avant' => $taille_avant . ' MB',
        'taille_apres' => $taille_apres . ' MB',
        'economie' => ($taille_avant - $taille_apres) . ' MB (' . round((1 - $taille_apres / $taille_avant) * 100) . '% réduit)',
        'dossier_sortie' => $dossier . '-' . $format,
        'message' => "$count images compressées — " . ($taille_avant - $taille_apres) . " MB économisés",
    ];
}

function run_tri_dossiers(array $params): array {
    $dossier = $params['dossier'] ?? '~/Downloads';

    usleep(rand(400000, 900000));

    $categories = [
        'images' => rand(5, 25),
        'documents' => rand(3, 15),
        'videos' => rand(0, 8),
        'audio' => rand(0, 5),
        'archives' => rand(0, 4),
        'autres' => rand(0, 3),
    ];
    $total = array_sum($categories);

    return [
        'fichiers_tries' => $total,
        'dossier_source' => $dossier,
        'categories_creees' => array_filter($categories, fn($n) => $n > 0),
        'sous_dossiers' => array_keys(array_filter($categories, fn($n) => $n > 0)),
        'message' => "$total fichiers triés dans " . count(array_filter($categories, fn($n) => $n > 0)) . " catégories",
    ];
}

function run_email_campagne(array $params): array {
    $sujet = $params['sujet'] ?? 'Newsletter';
    $template = $params['template'] ?? 'Bonjour {nom}';
    $liste = $params['liste'] ?? 'contacts.csv';

    usleep(rand(1500000, 3000000)); // 1.5-3s

    $total = rand(15, 120);
    $envoyes = $total - rand(0, 3);
    $echecs = $total - $envoyes;

    return [
        'emails_envoyes' => $envoyes,
        'emails_echoues' => $echecs,
        'total_destinataires' => $total,
        'taux_envoi' => round(($envoyes / $total) * 100, 1) . '%',
        'sujet' => $sujet,
        'source' => $liste,
        'apercu_message' => substr($template, 0, 80) . '...',
        'message' => "$envoyes emails envoyés sur $total destinataires",
    ];
}

function run_email_reponse_auto(array $params): array {
    $mots_cles = $params['mots_cles'] ?? 'info, devis';
    $reponse = $params['reponse'] ?? 'Merci pour votre message.';

    usleep(rand(300000, 600000));

    return [
        'configure' => true,
        'mots_cles_actifs' => array_map('trim', explode(',', $mots_cles)),
        'nombre_mots_cles' => count(explode(',', $mots_cles)),
        'reponse_configuree' => substr($reponse, 0, 100),
        'statut' => 'actif',
        'message' => "Réponse automatique configurée pour " . count(explode(',', $mots_cles)) . " mots-clés",
    ];
}

function run_rapport_csv(array $params): array {
    $periode = $params['periode'] ?? date('F-Y');
    $format = $params['format'] ?? 'csv';

    usleep(rand(800000, 1500000));

    $rows = rand(50, 500);
    $colonnes = ['date', 'script', 'statut', 'duree_ms', 'utilisateur'];

    return [
        'file' => "rapport_" . str_replace(' ', '_', $periode) . ".$format",
        'file_size' => rand(12, 85) . ' KB',
        'lignes' => $rows,
        'colonnes' => $colonnes,
        'periode' => $periode,
        'resume' => [
            'executions_totales' => $rows,
            'taux_succes' => rand(85, 99) . '%',
            'temps_moyen' => rand(500, 3000) . 'ms',
        ],
        'message' => "Rapport $periode exporté — $rows lignes, " . count($colonnes) . " colonnes",
    ];
}

function run_rapport_hebdo(array $params): array {
    $email = $params['email'] ?? 'equipe@akili.dev';
    $inclure_stats = $params['inclure_stats'] ?? true;

    usleep(rand(1000000, 2000000));

    return [
        'email_envoye' => true,
        'destinataire' => $email,
        'semaine' => 'Semaine ' . date('W') . ' — ' . date('Y'),
        'contenu' => [
            'scripts_executes' => rand(10, 80),
            'taux_succes' => rand(90, 100) . '%',
            'heures_economisees' => rand(2, 12) . 'h',
            'top_script' => 'facture-pdf',
        ],
        'stats_incluses' => $inclure_stats,
        'message' => "Rapport hebdomadaire envoyé à $email",
    ];
}

function run_backup_drive(array $params): array {
    $source = $params['source'] ?? '~/Projets';
    $destination = $params['destination'] ?? '/Backups';
    $compression = $params['compression'] ?? false;

    usleep(rand(1500000, 3500000)); // 1.5-3.5s

    $fichiers = rand(10, 80);
    $taille = rand(20, 250);

    return [
        'fichiers_sauvegardes' => $fichiers,
        'taille_totale' => $taille . ' MB',
        'taille_uploadee' => $compression ? round($taille * 0.6) . ' MB (compressé)' : $taille . ' MB',
        'source' => $source,
        'destination_drive' => $destination . '/' . date('Y-m-d'),
        'compression' => $compression ? 'zip' : 'aucune',
        'duree_upload' => rand(3, 15) . 's',
        'version' => 'v' . date('Ymd-His'),
        'message' => "$fichiers fichiers sauvegardés ($taille MB) vers $destination",
    ];
}

function run_sync_dossiers(array $params): array {
    $source = $params['source'] ?? '~/Documents';
    $destination = $params['destination'] ?? '~/Backup';
    $bidirectionnel = $params['bidirectionnel'] ?? false;

    usleep(rand(600000, 1500000));

    $ajoutes = rand(2, 15);
    $modifies = rand(0, 8);
    $supprimes = rand(0, 3);
    $total = $ajoutes + $modifies + $supprimes;

    return [
        'fichiers_synchronises' => $total,
        'ajoutes' => $ajoutes,
        'modifies' => $modifies,
        'supprimes' => $supprimes,
        'inchanges' => rand(20, 100),
        'source' => $source,
        'destination' => $destination,
        'mode' => $bidirectionnel ? 'bidirectionnel' : 'unidirectionnel (source → dest)',
        'derniere_sync' => date('Y-m-d H:i:s'),
        'message' => "$total fichiers synchronisés ($ajoutes ajoutés, $modifies modifiés, $supprimes supprimés)",
    ];
}
