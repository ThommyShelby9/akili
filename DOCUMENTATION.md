# Akili — Documentation Technique Détaillée

Ce document explique en détail comment chaque fonctionnalité, animation et composant du projet a été implémenté.

---

## Table des matières

1. [Design System & Tokens CSS](#1-design-system--tokens-css)
2. [Animations CSS](#2-animations-css)
3. [Composants React](#3-composants-react)
4. [Authentification](#4-authentification)
5. [Routing & Protection des routes](#5-routing--protection-des-routes)
6. [API PHP Backend](#6-api-php-backend)
7. [Base de données Supabase](#7-base-de-données-supabase)
8. [Pages publiques](#8-pages-publiques)
9. [Dashboard utilisateur](#9-dashboard-utilisateur)
10. [Dashboard admin](#10-dashboard-admin)
11. [Onboarding Wizard](#11-onboarding-wizard)
12. [Scripts & Exécution](#12-scripts--exécution)
13. [Responsive Design](#13-responsive-design)
14. [SEO](#14-seo)
15. [Performance](#15-performance)

---

## 1. Design System & Tokens CSS

### Fichier : `src/styles/tokens.css`

Toute l'identité visuelle repose sur des **CSS Custom Properties** (variables). Le dark mode est appliqué par défaut dans `:root` — pas de toggle light/dark.

```css
:root {
  /* Fond — du plus sombre au plus clair */
  --bg:   #0F172A;   /* Fond principal */
  --bg-1: #1E293B;   /* Cartes, surfaces élevées */
  --bg-2: #334155;   /* Hover, éléments actifs */
  --bg-3: #475569;   /* Éléments tertiaires */

  /* Texte — du plus visible au moins visible */
  --text:   #F8FAFC;  /* Titres, texte principal */
  --text-2: #94A3B8;  /* Sous-titres, descriptions */
  --text-3: #475569;  /* Labels, placeholders */

  /* Couleurs d'accent */
  --accent:   #2563EB;  /* Primary bleu */
  --accent-2: #06B6D4;  /* Cyan */
  --blue:     #29ABE2;  /* Bleu logo */

  /* Glow effects — utilisés dans les box-shadow */
  --glow-accent: rgba(37,99,235,0.3);
  --glow-blue:   rgba(41,171,226,0.2);
}
```

**Pourquoi cette approche :**
- Changer une couleur = changer 1 variable, tout le site se met à jour
- Pas de valeurs "magiques" dispersées dans le code
- Facilite un futur mode clair si nécessaire

### Typographie

3 polices chargées depuis Google Fonts :
- **Space Grotesk** (`--font-display`) : titres — géométrique, moderne, forte personnalité
- **Inter** (`--font`) : body text — excellente lisibilité, neutre
- **JetBrains Mono** (`--font-mono`) : code, labels techniques — monospace élégant

### Espacement

Système base 4px :
```css
--s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px;
--s-5: 20px; --s-6: 24px; --s-8: 32px; --s-10: 40px;
```

Utilisation : `padding: var(--s-6)` au lieu de `padding: 24px`. Cohérence garantie.

### Rayons de bordure

```css
--r-sm: 6px;   /* Inputs, badges */
--r-md: 12px;  /* Boutons, petites cartes */
--r-lg: 16px;  /* Cartes, widgets */
--r-xl: 24px;  /* Modals, conteneurs */
--r-pill: 999px; /* Chips, pills */
```

Choix "Cotonou Digital" : rayons généreux pour une sensation chaleureuse.

---

## 2. Animations CSS

### 2.1 Reveal on Scroll

**Fichier :** `src/components/RevealOnScroll.jsx` + `src/styles/features.css`

**Comment ça marche :**

1. Le composant `RevealOnScroll` crée un `IntersectionObserver` qui surveille quand l'élément entre dans le viewport
2. Au départ, l'élément a la classe `reveal-hidden` (invisible + décalé)
3. Quand il entre dans le viewport (seuil 10%), la classe `reveal-visible` est ajoutée
4. Le CSS fait la transition avec `transition: opacity 0.6s, transform 0.6s`

```jsx
// Le composant observe l'élément
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      el.classList.add('reveal-visible') // Déclenche l'animation
      observer.unobserve(el)             // Ne le refait plus
    }
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
)
```

```css
/* État initial — invisible et décalé */
.reveal-hidden { opacity: 0; }
.reveal-hidden.reveal-up { transform: translateY(32px); }
.reveal-hidden.reveal-left { transform: translateX(-32px); }
.reveal-hidden.reveal-scale { transform: scale(0.92); }

/* État final — visible et en place */
.reveal-hidden.reveal-visible {
  opacity: 1;
  transform: translateY(0) translateX(0) scale(1);
}
```

**Directions disponibles :** `up`, `down`, `left`, `right`, `scale`

### 2.2 Page Transitions

**Fichier :** `src/components/PageTransition.jsx` + `src/styles/global.css`

Le composant wraps tout le contenu des routes. Quand la route change :

1. L'ancien contenu joue l'animation `pageExit` (fade out + slide up)
2. Une fois terminé (`onAnimationEnd`), le nouveau contenu remplace l'ancien
3. Le nouveau contenu joue `pageEnter` (fade in + slide depuis le bas)

```css
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pageExit {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-8px); }
}
```

### 2.3 Terminal typing animation (Hero)

**Fichier :** `src/styles/landing.css`

Les lignes du terminal hero apparaissent séquentiellement avec des délais CSS :

```css
.ht-line {
  opacity: 0;
  transform: translateY(5px);
  animation: htReveal .3s ease forwards;
}
.ht-line.l1 { animation-delay: .4s; }
.ht-line.l2 { animation-delay: 1.2s; }
.ht-line.l3 { animation-delay: 1.9s; }
/* etc. */

@keyframes htReveal {
  to { opacity: 1; transform: none; }
}
```

La barre de progression se remplit aussi avec un délai :
```css
.ht-progress {
  width: 0;
  animation: htProgress 1s ease forwards;
  animation-delay: 2.8s;
}
@keyframes htProgress { to { width: 100%; } }
```

### 2.4 Compteurs animés

**Fichier :** `src/pages/Landing.jsx`

Les compteurs utilisent `IntersectionObserver` + `requestAnimationFrame` :

```javascript
function animateCounter(el) {
  const target = parseInt(el.dataset.target)
  const duration = 1800
  const start = performance.now()
  ;(function step(now) {
    const p = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - p, 3)  // ease-out cubic
    el.textContent = Math.floor(ease * target).toLocaleString('fr-FR')
    if (p < 1) requestAnimationFrame(step)
  })(start)
}
```

Le compteur ne démarre que quand il est visible (threshold 50%).

### 2.5 Hover effects

**Boutons primary :**
```css
.btn-primary:hover {
  background: #3B82F6;
  box-shadow: 0 0 20px var(--glow-accent); /* Glow bleu */
  transform: translateY(-1px);              /* Léger soulèvement */
}
```

**Cartes :**
```css
.script-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px); /* Flotte légèrement */
}
```

### 2.6 Logo animé (Hexagone)

**Fichier :** `src/components/AkiliLogo.jsx`

Le logo est un SVG avec :
- Un hexagone dessiné via `stroke-dasharray` animation
- 6 branches + nœuds qui apparaissent séquentiellement
- Animation `hexFloat` sur la variante "hero"

```css
@keyframes hexFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-4px) rotate(2deg); }
}
@keyframes nodeAppear {
  from { opacity: 0; transform: scale(0); }
  to   { opacity: 1; transform: scale(1); }
}
```

### 2.7 Pulse animation

Utilisée pour les indicateurs de statut (dot vert actif) :
```css
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
  70%  { box-shadow: 0 0 0 7px rgba(37,99,235,0); }
  100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
}
```

### 2.8 Onboarding slide transition

Les étapes du wizard glissent horizontalement :
```css
.onboarding-slider {
  display: flex;
  transition: transform 0.4s var(--ease-out);
}
```

En JS, on change le `transform: translateX(-${step * 100}%)` selon l'étape courante.

---

## 3. Composants React

### 3.1 AkiliLogo

```jsx
<AkiliLogo variant="nav" light />
```

- `variant` : `"nav"` (32px), `"auth"` (48px), `"hero"` (180px)
- `light` : texte blanc (pour fond sombre)
- SVG inline avec animations CSS

### 3.2 RevealOnScroll

```jsx
<RevealOnScroll direction="up" delay={200}>
  <div>Contenu qui apparaît au scroll</div>
</RevealOnScroll>
```

- `direction` : `up`, `down`, `left`, `right`, `scale`
- `delay` : délai en ms avant l'animation

### 3.3 Seo

```jsx
<Seo title="Contact" description="..." noindex />
```

Modifie dynamiquement les meta tags `<head>` via `document.querySelector` :
- `<title>`
- `<meta name="description">`
- Open Graph tags (og:title, og:description, og:image)
- `<meta name="robots">` si `noindex`

### 3.4 PageTransition

Wraps les `<Routes>` dans App.jsx. Utilise `key={location.pathname}` pour détecter les changements de route et jouer les animations enter/exit.

### 3.5 ScrollToTop

Composant invisible qui force `window.scrollTo(0, 0)` à chaque changement de `pathname`.

---

## 4. Authentification

### Fichier : `src/features/auth/AuthContext.jsx`

**Architecture :** React Context qui expose `user`, `profile`, `loading` et les méthodes auth.

**Flow au démarrage :**

```
1. App monte → AuthProvider monte
2. supabase.auth.getSession() → récupère la session stockée
3. Si session existe → setUser + loadProfile() → setLoading(false)
4. Si pas de session → setLoading(false)
5. onAuthStateChange écoute les futurs événements (login, logout, refresh)
```

**Flow de connexion :**

```
1. User tape email/password → signIn()
2. supabase.auth.signInWithPassword() → retourne { user, session }
3. setUser(data.user) immédiatement (pas d'attente)
4. loadProfile(user.id) en arrière-plan
5. navigate('/dashboard') dans Login.jsx
```

**Sécurité :**
- Timeout de 3s — si le loading ne se résout pas, on force `setLoading(false)`
- Fallback profil — si la requête profiles échoue, un profil par défaut est utilisé
- Le `signIn` met à jour le state directement sans attendre `onAuthStateChange`

### Fichier : `src/lib/supabase.js`

```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,      // Session stockée dans localStorage
    autoRefreshToken: true,    // Token refreshé automatiquement
    storageKey: 'akili-auth',  // Clé unique pour éviter conflits
  }
})
```

---

## 5. Routing & Protection des routes

### Fichier : `src/features/auth/ProtectedRoute.jsx`

```jsx
<ProtectedRoute>           {/* Exige juste d'être connecté */}
<ProtectedRoute requiredRole="admin">  {/* Exige le rôle admin */}
```

**Logique :**

```
1. loading=true → afficher spinner
2. pas de user → redirect /login (ou /admin/login si requiredRole=admin)
3. requiredRole demandé mais profile pas chargé → spinner
4. requiredRole demandé et profile.role !== requiredRole → redirect
5. Sinon → afficher children
```

### Routes dans App.jsx

```jsx
// Pages publiques — pas de protection
<Route path="/" element={<Landing />} />

// Pages user — ProtectedRoute sans rôle
<Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
  <Route index element={<Dashboard />} />
  <Route path="scripts" element={<ScriptLibrary />} />
</Route>

// Pages admin — ProtectedRoute avec requiredRole="admin"
<Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
  <Route index element={<AdminDashboard />} />
</Route>
```

---

## 6. API PHP Backend

### Architecture

```
api/
├── index.php              ← Point d'entrée unique
├── config/database.php    ← Charge le .env + getters Supabase
├── middleware/
│   ├── auth.php           ← Valide JWT via Supabase Auth API
│   ├── cors.php           ← Headers CORS
│   └── rate_limit.php     ← Vérifie quotas
├── routes/api.php         ← Routeur + json_response()
├── controllers/           ← Logique métier
└── services/              ← Supabase REST, JWT, Mailer, Logger
```

### Point d'entrée (`index.php`)

```php
// Désactiver les erreurs HTML
ini_set('display_errors', '0');

// Charger les dépendances
require_once __DIR__ . '/config/database.php';  // Charge .env
require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/services/logger.php';
require_once __DIR__ . '/routes/api.php';

// CORS en premier (gère OPTIONS preflight)
handle_cors();

// Parser l'URI
$uri = preg_replace('#^/api#', '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Logger + Router
log_request();
route_request($method, $uri);
```

### Authentification (`middleware/auth.php`)

Au lieu de vérifier le JWT localement (nécessite le secret), on appelle l'API Supabase :

```php
function authenticate(): ?array {
    // Extraire le token du header Authorization
    $token = /* ... */;

    // Appeler Supabase Auth pour valider
    $ch = curl_init(get_supabase_url() . '/auth/v1/user');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . get_supabase_key(),
        'Authorization: Bearer ' . $token,
    ]);
    // Si 200 → token valide, retourner user info
    // Sinon → retourner null
}
```

### Format de réponse uniforme

Toutes les réponses suivent ce format :

```php
function json_response($data, $error = null, $meta = null, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['data' => $data, 'error' => $error, 'meta' => $meta]);
}
```

### Chargement du .env

PHP natif ne lit pas les fichiers `.env`. On a créé un loader :

```php
function load_env(string $path): void {
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$key, $value] = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($value));
    }
}
```

### Script Runner (`services/script_runner.php`)

Chaque script est une fonction PHP qui simule un traitement réaliste :

```php
function execute_script(string $slug, array $params, string $user_id): array {
    $start = microtime(true);
    $result = match($slug) {
        'facture-pdf' => run_facture_pdf($params),
        'renommage-lot' => run_renommage_lot($params),
        // ...
    };
    $duration_ms = (int)((microtime(true) - $start) * 1000);
    return ['status' => 'success', 'result' => $result, 'duration_ms' => $duration_ms];
}
```

Chaque fonction simule avec `usleep(rand(...))` pour un délai réaliste et retourne des données crédibles.

---

## 7. Base de données Supabase

### Tables (7)

| Table | Rôle |
|-------|------|
| `profiles` | Extension de auth.users (role, plan, quota, sector) |
| `scripts` | Bibliothèque de scripts disponibles |
| `executions` | Historique des exécutions (user, script, status, result) |
| `integrations` | Tokens OAuth tiers par utilisateur |
| `contacts` | Messages du formulaire de contact |
| `notifications` | Notifications in-app |
| `notification_preferences` | Préférences email par user |

### Trigger auto-création de profil

Quand un user s'inscrit via Supabase Auth, un profil est créé automatiquement :

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

La fonction `handle_new_user()` insère dans `profiles` avec le `full_name` des metadata.

### RLS (Row Level Security)

Chaque table a des policies qui restreignent l'accès :
- Un user ne voit que **ses propres** données
- Le `service_role` (utilisé par le backend PHP) a accès à tout

### Realtime

Activé sur `profiles` et `executions` pour le dashboard admin :

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE executions;
```

Le frontend admin écoute avec :
```javascript
supabase.channel('admin-profiles')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, callback)
  .subscribe()
```

---

## 8. Pages publiques

### Landing (`src/pages/Landing.jsx`)

10 sections, chacune avec `RevealOnScroll` :

1. **Hero** — split layout (texte + terminal animé), blobs lumineux en arrière-plan
2. **Manifeste** — citation éditoriale avec gradient radial subtil
3. **Compteur live** — 3 métriques avec animation IntersectionObserver
4. **Avant/Après** — tableau comparatif
5. **Témoignages** — grille 3 cartes avec featured
6. **Trois Piliers** — icônes + descriptions
7. **Comment ça marche** — stepper horizontal 3 étapes
8. **Pour qui (Stories)** — storytelling scroll (chaque profil = 1 bloc full-width)
9. **Écosystème** — chips interactives (hover glow)
10. **CTA Final** — titre géant + boutons

### Stories section (Pour qui)

Design "storytelling scroll" — chaque profil occupe un bloc complet :
- Alternance fond `--bg` / `--bg-1`
- Ligne verticale au centre (gradient)
- Côté gauche : avatar, rôle, titre, "avant" vs "après" (bordures colorées)
- Côté droite : métrique géante (gradient text) + mini-terminal

### Contact (`src/pages/Contact.jsx`)

- Formulaire avec validation React + envoi via `api.contact()`
- Sidebar avec infos (email, localisation, réseaux)
- FAQ rapide (4 questions)
- État succès avec animation de confirmation

### Pricing

- Toggle mensuel/annuel
- 3 plans avec featured (border accent + glow)
- Comparatif en cartes (Option B — chaque plan liste ses features)
- FAQ accordéon

---

## 9. Dashboard utilisateur

### Layout (`DashboardLayout.jsx`)

Grille CSS `240px 1fr` avec sidebar sticky :

```css
.dash-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}
.dash-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
}
```

Utilise `<Outlet />` de React Router pour les sous-routes.

### Stats avec cache localStorage

```javascript
staleWhileRevalidate(
  'stats',                          // Clé cache
  () => api.stats().then(r => r.data), // Fetch function
  2 * 60 * 1000,                    // Max age: 2 min
  (fresh) => setStats(fresh)        // Callback quand données fraîches arrivent
)
```

Pattern stale-while-revalidate : retourne le cache immédiatement, fetch en background, met à jour si différent.

### Bibliothèque de scripts

- Chargement avec cache localStorage (30 min)
- Filtrage par catégorie (boutons chips)
- Recherche textuelle (client-side)
- Skeleton loader pendant le chargement
- Grille responsive `auto-fill, minmax(280px, 1fr)`

### Exécution de script

1. Formulaire dynamique généré depuis `params_schema` (JSONB en BDD)
2. Validation React (champs requis)
3. Appel API `POST /scripts/:slug/run`
4. Loading state (spinner dans le bouton)
5. Résultat affiché en format structuré (message + détails key/value)

---

## 10. Dashboard admin

### Accès séparé

- Route : `/admin/login` — page de connexion dédiée (design rouge/sombre)
- Après connexion, vérifie `profiles.role === 'admin'` avant d'autoriser
- Si pas admin → déconnexion + message "Accès refusé"

### Données réelles + Realtime

Le dashboard admin charge les données directement depuis Supabase et écoute les changements :

```javascript
// Écouter les nouveaux utilisateurs en temps réel
supabase.channel('admin-profiles')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, (payload) => {
    // Ajouter à la liste d'activité
    setActivity(prev => [{ type: 'new_user', text: '...' }, ...prev])
    // Incrémenter le compteur
    setStats(prev => ({ ...prev, total_users: prev.total_users + 1 }))
  })
  .subscribe()
```

### Gestion utilisateurs

- Table avec recherche + filtres (plan, statut)
- Actions : voir détails (modal), suspendre/réactiver, supprimer (avec confirmation)
- Suspension = `UPDATE profiles SET role = 'suspended'`
- Suppression = `DELETE FROM profiles` (cascade sur toutes les données)

---

## 11. Onboarding Wizard

### Fichier : `src/features/onboarding/Onboarding.jsx`

**Architecture :** État centralisé `data` + slider CSS.

```jsx
const [currentStep, setCurrentStep] = useState(0)
const [data, setData] = useState({
  fullName: '', jobRole: '', sector: '', goals: []
})
```

Le slider est un `display: flex` qui se déplace via `transform: translateX(-${step * 100}%)`.

### 5 étapes

1. **StepProfile** — Pré-remplit le nom depuis `user.user_metadata.full_name`, sélection rôle (icônes Lucide), secteur (select)
2. **StepGoals** — Grille de cartes cliquables (toggle selection), icônes par catégorie
3. **StepIntegrations** — Liste des intégrations (boutons "Bientôt" désactivés), skippable
4. **StepFirstScript** — Script recommandé basé sur `data.goals[0]`, exécution live
5. **StepComplete** — Animation célébration (CheckCircle bounce), récap, redirect dashboard

### Sauvegarde

L'étape 1 sauvegarde en BDD via l'API :
```javascript
await api.profile.update({ full_name: data.fullName, job_role: data.jobRole, sector: data.sector })
```

L'étape 5 marque l'onboarding comme terminé :
```javascript
api.profile.update({ onboarding_completed: true })
```

---

## 12. Scripts & Exécution

### Formulaire dynamique

Le champ `params_schema` en BDD est un JSONB qui décrit les paramètres :

```json
{
  "required": ["client", "montant"],
  "properties": {
    "client": { "type": "string", "label": "Nom du client" },
    "montant": { "type": "number", "label": "Montant (FCFA)" },
    "devise": { "type": "string", "label": "Devise", "default": "FCFA" }
  }
}
```

Le frontend génère le formulaire dynamiquement :
```jsx
{Object.entries(properties).map(([key, prop]) => (
  prop.type === 'boolean' ? <checkbox /> :
  prop.type === 'number' ? <input type="number" /> :
  <input type="text" />
))}
```

### Exécution côté PHP

```
1. Frontend: POST /api/scripts/:slug/run { params }
2. PHP: require_auth() → vérifier JWT
3. PHP: require_quota() → vérifier quota pas dépassé
4. PHP: execute_script() → appeler la fonction du script
5. PHP: supabase_post('executions', ...) → sauvegarder en BDD
6. PHP: increment_quota() → incrémenter le compteur
7. PHP: send_email() → notification (si préférence activée)
8. PHP: json_response() → retourner le résultat
```

### Affichage du résultat

Le résultat n'est pas affiché en JSON brut. Il est structuré :
- Message principal en gras
- Détails en tableau clé/valeur avec noms lisibles

```jsx
{result.result?.message && <div className="script-result-message">{result.result.message}</div>}
{Object.entries(result.result).filter(([key]) => key !== 'message').map(([key, value]) => (
  <div className="script-result-detail-row">
    <span>{key.replace(/_/g, ' ')}</span>
    <span>{String(value)}</span>
  </div>
))}
```

---

## 13. Responsive Design

### Breakpoints

| Breakpoint | Cible | Approche |
|-----------|-------|----------|
| > 1024px | Desktop | Layout complet |
| 768-1024px | Tablette | Sidebar réduite en icônes |
| < 768px | Mobile | Sidebar → bottom bar, grilles → 1 colonne |
| < 480px | Petit mobile | Tailles réduites, éléments masqués |

### Dashboard mobile

Sur mobile (< 768px), la sidebar devient une **bottom bar fixe** :

```css
@media (max-width: 768px) {
  .dash-sidebar {
    position: fixed;
    bottom: 0;
    left: 0; right: 0;
    flex-direction: row;
    height: auto;
    border-top: 1px solid var(--border);
  }
  .dash-nav { flex-direction: row; justify-content: space-around; }
  .dash-main { padding-bottom: 80px; } /* Espace pour la bottom bar */
}
```

### Landing page mobile

- Hero : terminal masqué, 1 colonne
- Stories : empilé verticalement, ligne centrale masquée
- Grilles : `repeat(2, 1fr)` → `1fr`
- Titres : `clamp()` pour scaling fluide

---

## 14. SEO

### Composant Seo

Chaque page appelle `<Seo title="..." description="..." />` qui modifie dynamiquement le `<head>` :

```javascript
function setMeta(name, content) {
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
```

### Pages protégées

Les pages auth/dashboard/admin ont `noindex` :
```jsx
<Seo title="Dashboard" noindex />
```

Cela ajoute `<meta name="robots" content="noindex, nofollow">`.

---

## 15. Performance

### Bundle optimization

- **Code splitting** : les routes sont dans un seul bundle pour le moment (à optimiser avec `React.lazy()` post-MVP)
- **Tree shaking** : Vite + ESM élimine le code mort
- **Lucide React** : imports nommés (pas d'import global)

### Images

- Format WebP recommandé
- `loading="lazy"` sur les images
- Logo = SVG inline (pas de requête réseau)

### Cache localStorage

Pattern stale-while-revalidate pour les données fréquentes :
- Scripts : cache 30 min
- Stats dashboard : cache 2 min
- Profil : cache 5 min

### CSS

- Pas de CSS-in-JS (pas de runtime overhead)
- CSS vanilla avec variables (parsing rapide)
- `will-change` évité (laissé au navigateur)
- `prefers-reduced-motion` respecté globalement

---

## Résumé des fichiers clés

| Fichier | Rôle |
|---------|------|
| `src/lib/supabase.js` | Client Supabase initialisé |
| `src/lib/api.js` | Wrapper fetch avec auth header automatique |
| `src/lib/storage.js` | Helpers cache localStorage |
| `src/features/auth/AuthContext.jsx` | State global auth + profil |
| `src/features/auth/ProtectedRoute.jsx` | Guard de routes |
| `src/components/AkiliLogo.jsx` | Logo SVG animé |
| `src/components/RevealOnScroll.jsx` | Animation au scroll |
| `src/styles/tokens.css` | Design tokens (source de vérité) |
| `api/index.php` | Routeur API PHP |
| `api/middleware/auth.php` | Validation JWT via Supabase |
| `api/services/script_runner.php` | Exécution simulée des scripts |
| `supabase/full-migration.sql` | Schéma complet BDD |
