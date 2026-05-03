<?php
/**
 * Configuration CORS
 */

define('CORS_ALLOWED_ORIGINS', [
    getenv('FRONTEND_URL') ?: 'http://localhost:5173',
]);

define('CORS_ALLOWED_METHODS', 'GET, POST, PUT, DELETE, OPTIONS');
define('CORS_ALLOWED_HEADERS', 'Content-Type, Authorization, X-Requested-With');
define('CORS_MAX_AGE', 86400); // 24h
