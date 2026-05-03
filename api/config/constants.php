<?php
/**
 * Configuration et constantes de l'application
 */

// Quotas par plan
define('QUOTA_FREE', 10);    // exécutions par jour
define('QUOTA_PRO', 100);
define('QUOTA_TEAM', 500);

// Timeout exécution script
define('SCRIPT_TIMEOUT', 30); // secondes

// Pagination
define('PER_PAGE_DEFAULT', 20);
define('PER_PAGE_MAX', 100);
