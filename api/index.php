<?php
/**
 * Akili API — Point d'entrée
 * PHP natif, routage manuel, réponse JSON uniforme
 */

// Désactiver l'affichage HTML des erreurs — on retourne toujours du JSON
ini_set('display_errors', '0');
ini_set('html_errors', '0');
error_reporting(E_ALL);

// Autoload config
require_once __DIR__ . '/config/constants.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/services/logger.php';
require_once __DIR__ . '/routes/api.php';

// Error handlers (après le chargement du logger)
set_error_handler(function($severity, $message, $file, $line) {
    log_error("PHP Error: $message", ['file' => $file, 'line' => $line]);
    return true;
});
set_exception_handler(function($e) {
    log_error("Uncaught Exception: " . $e->getMessage(), ['file' => $e->getFile(), 'line' => $e->getLine()]);
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['data' => null, 'error' => ['code' => 'SERVER_ERROR', 'message' => 'Erreur interne du serveur'], 'meta' => null]);
});

// Appliquer CORS en premier
handle_cors();

// Parser la requête
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Retirer le préfixe /api si présent
$uri = preg_replace('#^/api#', '', $uri);
if ($uri === '') $uri = '/';

// Logger la requête
log_request();

// Router la requête
route_request($method, $uri);
