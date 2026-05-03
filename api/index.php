<?php
/**
 * Akili API — Point d'entrée
 * PHP natif, routage manuel, réponse JSON uniforme
 */

// Autoload config
require_once __DIR__ . '/config/constants.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/services/logger.php';
require_once __DIR__ . '/routes/api.php';

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
