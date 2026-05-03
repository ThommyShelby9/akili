---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-04-30'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/brainstorming/brainstorming-session-2026-04-30.md
workflowType: 'architecture'
project_name: 'akili-react'
user_name: 'TheSoulReaper'
date: '2026-04-30'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
47 FRs couvrant 9 domaines : Auth (7), Onboarding (6), Scripts (6), Dashboard (6), Compte (4), Pages Publiques (8), Notifications (2), Quotas (3), Admin Phase 2 (5). Le cœur architectural tourne autour de l'exécution de scripts et du dashboard utilisateur.

**Non-Functional Requirements:**
32 NFRs structurants pour l'architecture :
- Performance : FCP < 1.5s sur 3G, bundle < 100KB, exécution script < 5s
- Sécurité : HTTPS, bcrypt, CSRF, prepared statements, tokens serveur-side
- Scalabilité : 500 concurrents, 1000 exécutions/h, backend stateless
- Fiabilité : 99.5% uptime, zero data loss, retry automatique, backups quotidiens

**Scale & Complexity:**

- Domaine technique : Full-stack (SPA + API + BDD + Queue + Realtime)
- Complexité : Medium-High
- Composants architecturaux estimés : 8-10 (Frontend SPA, API Router, Auth Service, Script Engine, Job Queue, Notification Service, Integration Layer, Admin Service, Storage)

### Technical Constraints & Dependencies

- **PHP natif** — pas de framework, architecture modulaire manuelle (routeur, middleware, controllers)
- **Supabase** — PostgreSQL (BDD), Auth (OAuth + email), Realtime (WebSocket), Storage (fichiers)
- **React 18 + Vite** — SPA avec code splitting, lazy routes
- **Dark mode first** — tokens CSS déjà en place
- **Budget réseau** — < 100KB bundle, optimisation connexions 3G africaines
- **Stateless backend** — pas de sessions serveur (JWT via Supabase Auth)

### Cross-Cutting Concerns Identified

- **Authentification & autorisation** — traverse toutes les routes (public vs user vs admin)
- **Rate limiting & quotas** — contrôle d'accès basé sur le plan (Gratuit vs Pro)
- **Error handling & retry** — pattern uniforme pour scripts, intégrations, API calls
- **Logging & monitoring** — chaque exécution tracée, erreurs agrégées pour admin
- **Offline tolerance** — UI doit fonctionner en mode dégradé
- **Notification dispatch** — email multi-canal déclenché par plusieurs événements

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application — SPA frontend + API backend séparés.

### Stack existant (déjà initialisé)

Le projet est déjà bootstrappé. Pas de changement de starter nécessaire.

**Frontend (en place) :**

| Package | Version |
|---------|---------|
| react | ^18.2.0 |
| react-dom | ^18.2.0 |
| react-router-dom | ^6.21.0 |
| lucide-react | ^1.14.0 |
| vite | ^5.0.10 |
| @vitejs/plugin-react | ^4.2.1 |

**Décisions techniques déjà prises :**

| Décision | Choix | Statut |
|----------|-------|--------|
| Language | JavaScript (pas TypeScript) | En place |
| Styling | CSS vanilla + design tokens | En place |
| Build | Vite 5 | En place |
| Routing | React Router v6 | En place |
| Icons | Lucide React | En place |
| State | React Context | Décidé |
| Backend | PHP natif | À créer |
| BDD | Supabase PostgreSQL | À connecter |
| Auth | Supabase Auth (OAuth + email) | À connecter |
| Realtime | Supabase Realtime | À connecter |

### À ajouter pour le MVP

**Frontend :**
- `@supabase/supabase-js` — client Supabase (auth, BDD, realtime)
- Structure de dossiers pour dashboard, onboarding, admin

**Backend PHP (à créer) :**
- Routeur HTTP minimaliste
- Middleware auth (validation JWT Supabase)
- Controllers (scripts, notifications, contact)
- Service d'exécution de scripts (job runner)
- Mailer (PHPMailer ou mail() natif)

**Initialisation backend :**

```bash
mkdir -p api/{routes,middleware,controllers,services,config}
```

**Note :** L'initialisation du backend PHP sera la première story d'implémentation.

## Core Architectural Decisions

### Decision Summary

| # | Décision | Choix |
|---|----------|-------|
| 1 | Schéma BDD | 7 tables Supabase (profiles, scripts, executions, integrations, contacts, notifications, notification_preferences) |
| 2 | Caching | localStorage stale-while-revalidate |
| 3 | Validation | Double (React UX + PHP autoritaire) |
| 4 | JWT refresh | PHP gère le refresh |
| 5 | Rôles | Colonne `role` dans profiles ('user' \| 'admin') |
| 6 | CORS | Domaines séparés, headers explicites |
| 7 | API design | RESTful |
| 8 | Format réponse | JSON `{ data, error, meta }` |
| 9 | Exécution scripts | Synchrone (timeout 30s) |
| 10 | Structure dossiers | Par feature |
| 11 | API layer | `/lib/api.js` centralisé |
| 12 | Routes protégées | Composant `<ProtectedRoute>` |
| 13 | Hébergement | Render (Static Site + Web Service) |
| 14 | Domaine | Non défini (URLs Render par défaut pour MVP) |

### Data Architecture

**Schéma Supabase PostgreSQL :**

```sql
-- Utilisateurs (extension de auth.users Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  sector TEXT,
  job_role TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  quota_used INTEGER DEFAULT 0,
  quota_limit INTEGER DEFAULT 10,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scripts (bibliothèque)
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  params_schema JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exécutions
CREATE TABLE executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  script_id UUID REFERENCES scripts(id),
  params JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'error')),
  result JSONB,
  duration_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intégrations utilisateur
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Messages contact
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Préférences notification
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_on_success BOOLEAN DEFAULT TRUE,
  email_on_error BOOLEAN DEFAULT TRUE
);
```

**Caching (localStorage) :**
- `akili_profile` — données profil (refresh 5 min)
- `akili_scripts` — bibliothèque scripts (refresh 30 min)
- `akili_stats` — stats dashboard (refresh 2 min)
- Pattern : stale-while-revalidate (lire local d'abord, fetch en background, mettre à jour si différent)

**Double validation :**
- React : validation UX instantanée (champs requis, format, longueur)
- PHP : validation autoritaire (sanitization, business rules, contraintes BDD)
- PHP est toujours la source de vérité

### Authentication & Security

**Flow JWT :**

```
1. User login → Supabase Auth émet access_token + refresh_token
2. React stocke via Supabase SDK (gestion automatique)
3. Requête API → header Authorization: Bearer {access_token}
4. PHP valide le JWT avec la clé publique Supabase
5. Si expiré → PHP refresh via Supabase, renvoie nouveau token
6. React met à jour le token reçu
```

**Rôles :**
- Colonne `role` dans `profiles` : `'user'` | `'admin'`
- PHP vérifie le rôle à chaque requête admin
- Pas de RLS complexe — logique métier dans PHP

**CORS (domaines séparés) :**
- `Access-Control-Allow-Origin: {FRONTEND_URL}`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- Handler OPTIONS dans le routeur PHP

### API & Communication Patterns

**Endpoints RESTful :**

```
POST   /api/auth/refresh            Refresh JWT
GET    /api/profile                 Profil utilisateur
PUT    /api/profile                 Modifier profil
DELETE /api/profile                 Supprimer compte

GET    /api/scripts                 Liste scripts (?category=)
GET    /api/scripts/:slug           Détail script
POST   /api/scripts/:slug/run       Exécuter (SYNCHRONE, timeout 30s)

GET    /api/executions              Historique (paginé)
GET    /api/executions/:id          Détail exécution

GET    /api/stats                   Stats dashboard

POST   /api/contact                 Message contact + email notification
GET    /api/notifications           Liste notifications
PUT    /api/notifications/:id/read  Marquer lue

-- Admin (Phase 2)
GET    /api/admin/users             Liste utilisateurs
PUT    /api/admin/users/:id         Modifier utilisateur
GET    /api/admin/stats             Stats globales
GET    /api/admin/logs              Logs système
```

**Format réponse uniforme :**

```json
{ "data": { ... }, "error": null, "meta": { "page": 1, "total": 42 } }
{ "data": null, "error": { "code": "QUOTA_EXCEEDED", "message": "..." }, "meta": null }
```

### Frontend Architecture

**Structure par feature :**

```
src/
├── features/
│   ├── auth/           (Login, ProtectedRoute, AuthContext)
│   ├── onboarding/     (Wizard, steps/, OnboardingContext)
│   ├── dashboard/      (Dashboard, widgets/, DashboardLayout)
│   ├── scripts/        (Library, Detail, Runner)
│   ├── logs/           (ExecutionLogs)
│   ├── account/        (Settings)
│   └── admin/          (Phase 2)
├── pages/              (publiques : Landing, Services, Pricing, Docs, Contact)
├── components/         (shared : Nav, Footer, ui/)
├── lib/
│   ├── api.js          (client API centralisé)
│   ├── supabase.js     (client Supabase)
│   └── storage.js      (localStorage helpers)
├── styles/
├── App.jsx
└── main.jsx
```

**ProtectedRoute :**

```jsx
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" />
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" />
  return children
}
```

### Infrastructure & Deployment

**Render :**

| Service | Type | Config |
|---------|------|--------|
| Frontend | Static Site | Build: `npm run build`, Publish: `dist/` |
| Backend | Web Service | Runtime: PHP natif, Port: 80 |
| Supabase | Externe | Projet cloud (plan gratuit MVP) |

**Variables d'environnement :**
- Frontend : `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Backend : `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_JWT_SECRET`, `SMTP_*`, `FRONTEND_URL`

### Implementation Sequence

1. Setup Supabase (tables, auth, triggers)
2. Backend PHP (routeur, auth middleware, premiers endpoints)
3. Frontend `lib/api.js` + `AuthContext` + `ProtectedRoute`
4. Pages publiques (landing OK, ajouter contact)
5. Onboarding wizard
6. Dashboard + scripts + exécution
7. Logs + notifications
8. Déploiement Render

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Base de données (snake_case) :**
- Tables : pluriel, snake_case → `profiles`, `executions`, `scripts`
- Colonnes : snake_case → `user_id`, `created_at`, `is_active`
- Pas de préfixes FK ��� `user_id` (pas `fk_user_id`)

**API (snake_case, pluriel) :**
- Endpoints : `/api/scripts`, `/api/executions` (pluriel)
- Paramètres route : `:slug`, `:id`
- Query params : `?category=fichiers&page=1`
- JSON : **snake_case** → `{ "user_id": "...", "created_at": "..." }`

**Code frontend (camelCase) :**
- Composants/fichiers composant : PascalCase → `ScriptLibrary.jsx`
- Fichiers utilitaires : camelCase → `api.js`, `storage.js`
- Variables/fonctions : camelCase → `userId`, `getScripts()`
- Constantes : UPPER_SNAKE → `API_URL`
- CSS classes : kebab-case → `hero-terminal`, `btn-primary`

**Code backend PHP (snake_case) :**
- Fichiers : snake_case → `auth_middleware.php`
- Fonctions : snake_case → `get_user_profile()`
- Variables : snake_case → `$user_id`
- Classes : PascalCase → `Router`, `AuthMiddleware`

### Structure Patterns

**Feature frontend :**

```
src/features/{feature}/
├─�� {Feature}.jsx          ← composant page principal
├── components/            ← composants internes
├── hooks/                 ← hooks spécifiques (optionnel)
└── {Feature}Context.jsx   ← context si nécessaire
```

**Backend PHP :**

```
api/
├── index.php              ← point d'entrée
├── config/database.php
├── middleware/
│   ├── auth.php
│   ├── cors.php
│   └── rate_limit.php
├── routes/api.php
├── controllers/
│   ├── script_controller.php
│   ├── profile_controller.php
│   ├── execution_controller.php
│   ├── contact_controller.php
│   └── notification_controller.php
└── services/
    ├── script_runner.php
    ├── mailer.php
    └── supabase.php
```

**Tests :** co-localisés → `__tests__/` dans chaque feature

### Format Patterns

**Réponse API uniforme :**

```json
{ "data": { ... }, "error": null, "meta": { "page": 1, "per_page": 20, "total": 42 } }
{ "data": null, "error": { "code": "QUOTA_EXCEEDED", "message": "..." }, "meta": null }
```

**Codes d'erreur :**

| Code | HTTP | Signification |
|------|------|---------------|
| UNAUTHORIZED | 401 | Token manquant/invalide |
| FORBIDDEN | 403 | Rôle insuffisant |
| NOT_FOUND | 404 | Ressource inexistante |
| VALIDATION_ERROR | 422 | Données invalides |
| QUOTA_EXCEEDED | 429 | Quota dépassé |
| EXECUTION_TIMEOUT | 504 | Script timeout 30s |
| SERVER_ERROR | 500 | Erreur interne |

**Dates :** ISO 8601 → `"2026-04-30T08:00:00Z"`
**Booleans :** `true`/`false` (jamais 0/1)
**Null :** explicite (pas d'omission de clé)

### Communication Patterns

**React Context :**
- `AuthContext` → user, login(), logout(), loading
- States locaux préférés aux contexts globaux
- Pattern fetch : `useState` avec `loading`, `error`, `data`

```jsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  api.scripts.list()
    .then(res => setData(res.data))
    .catch(err => setError(err))
    .finally(() => setLoading(false))
}, [])
```

### Process Patterns

**Error handling frontend :**
- Réseau → toast "Connexion perdue"
- 401 ��� redirect `/login`
- 422 → message sous le champ
- 429 → "Quota atteint" + lien upgrade
- 500 → message générique

**Error handling PHP :**
- `try/catch` dans tous les controllers
- Logger technique (fichier ou Supabase)
- Renvoyer message user-friendly (jamais de stack trace en prod)

**Loading states :**
- Boutons : `disabled` + spinner
- Pages/listes : skeleton loader
- Variable : `loading` (pas `isLoading`)

**Retry (intégrations tierces) :**
- Max 3 tentatives, backoff 1s → 2s → 4s
- 3 échecs → erreur `INTEGRATION_FAILED`

### Enforcement Guidelines

**Obligatoire :**
- Conventions de nommage sans exception
- Format réponse API uniforme
- Double validation (React + PHP)
- Pattern fetch standard (loading/error/data)
- Tokens CSS + variables d'environnement (jamais de valeurs hardcodées)

**Interdit :**
- `userId` dans JSON API (doit être `user_id`)
- `axios` ou lib HTTP (utiliser `lib/api.js`)
- `console.log` en production
- Inline styles React (utiliser classes CSS + tokens)
- Valeurs magiques (couleurs, tailles, espacements en dur)

## Project Structure & Boundaries

### Complete Project Directory Structure

```
akili-react/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── 2.png                     ← logo Akili
│   └── favicon.ico
├── src/
│   ├── main.jsx
│   ├── App.jsx                   ← routeur principal
│   ├── lib/
│   │   ├── api.js                ← client API centralisé
│   │   ├── supabase.js           ← client Supabase
│   │   └── storage.js            ← helpers localStorage
│   ├── features/
│   │   ├── auth/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Login.jsx
│   │   │   └── __tests__/
│   │   ├── onboarding/
│   │   │   ├── Onboarding.jsx
│   │   │   ├── steps/
│   │   │   │   ├── StepProfile.jsx
│   │   │   │   ├── StepGoals.jsx
│   │   │   │   ├── StepIntegrations.jsx
│   │   │   │   ├── StepFirstScript.jsx
│   │   │   │   └── StepComplete.jsx
│   │   │   └── __tests__/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── widgets/
│   │   │   │   ├── StatsWidget.jsx
│   │   │   │   ├── RecentScripts.jsx
│   │   │   │   └── QuickRun.jsx
│   │   │   └── __tests__/
│   │   ├── scripts/
│   │   │   ├── ScriptLibrary.jsx
│   │   │   ├── ScriptDetail.jsx
│   │   │   ├── ScriptRunner.jsx
│   │   │   └── __tests__/
│   │   ├── logs/
│   │   │   ├── ExecutionLogs.jsx
│   │   │   └── __tests__/
│   │   ├── account/
│   │   │   ├── Settings.jsx
│   │   │   └── __tests__/
│   │   └── admin/                ← Phase 2
│   │       ├── AdminLayout.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── UserManagement.jsx
│   │       └── SystemLogs.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetail.jsx     ← Phase 2
│   │   ├── Pricing.jsx
│   │   ├── Docs.jsx
│   │   └── Contact.jsx
│   ├── components/
│   │   ├── Nav.jsx
│   │   ├── Footer.jsx
│   │   ├── RevealOnScroll.jsx
│   │   ├── ui/
│   │   │   ├── Loader.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Modal.jsx
│   │   └── pricing/
│   │       ├── PricingHero.jsx
│   │       ├── PricingCompare.jsx
│   │       ├── PricingFaq.jsx
│   │       └── PricingCta.jsx
│   └── styles/
│       ├── tokens.css
│       ├── global.css
│       ├── landing.css
│       ├── login.css
│       ├── features.css
│       ├── pricing.css
│       ├── docs.css
│       ├── dashboard.css         ← à créer
│       ├── onboarding.css        ← à créer
│       └── contact.css           ← à créer
├── api/
│   ├── index.php
│   ├── .htaccess
│   ├── config/
│   │   ├── database.php
│   │   ├── constants.php
│   │   └── cors.php
│   ├── middleware/
│   │   ├── auth.php
│   │   ├── cors.php
│   │   └── rate_limit.php
│   ├── routes/api.php
│   ├── controllers/
│   │   ├── auth_controller.php
│   │   ├── profile_controller.php
│   │   ├── script_controller.php
│   │   ├── execution_controller.php
│   │   ├── contact_controller.php
│   │   ├── notification_controller.php
│   │   ├── stats_controller.php
│   │   └── admin_controller.php  ← Phase 2
│   ├── services/
│   │   ├── supabase.php
│   │   ├── script_runner.php
│   │   ├── mailer.php
│   │   └── jwt.php
│   └── tests/
│       ├── auth_test.php
│       ├── script_test.php
│       └── execution_test.php
└── supabase/
    ├── migrations/
    │   ├── 001_create_profiles.sql
    │   ├── 002_create_scripts.sql
    │   ├── 003_create_executions.sql
    │   ├── 004_create_integrations.sql
    │   ├── 005_create_contacts.sql
    │   ├── 006_create_notifications.sql
    │   └── 007_create_notification_preferences.sql
    └── seeds/
        └── scripts_library.sql
```

### Architectural Boundaries

**API Boundaries :**
- Frontend → Backend : HTTP REST via `lib/api.js`
- Backend → Supabase : REST API (pas de connexion PostgreSQL directe)
- Frontend → Supabase Auth : SDK direct (login/register/session)
- Frontend → Supabase Realtime : SDK direct (WebSocket dashboard)

**Component Boundaries :**
- `pages/` : pas d'auth requise, accès public
- `features/` : toujours wrappé par `<ProtectedRoute>`
- `components/` : jamais de logique métier, UI uniquement

**Data Flow :**

```
[User Action] → [Component] → [lib/api.js] → [PHP API] → [Supabase]
[UI Update]  ← [setState]  ← [JSON response] ←─────────────────┘
```

### Requirements to Structure Mapping

| FR Catégorie | Frontend | Backend | Table BDD |
|-------------|----------|---------|-----------|
| Auth (FR1-7) | features/auth/ | controllers/auth_controller.php | profiles |
| Onboarding (FR8-13) | features/onboarding/ | controllers/profile_controller.php | profiles |
| Scripts (FR14-19) | features/scripts/ | controllers/script_controller.php | scripts, executions |
| Dashboard (FR20-25) | features/dashboard/ | controllers/stats_controller.php | executions |
| Compte (FR26-29) | features/account/ | controllers/profile_controller.php | profiles |
| Pages (FR30-37) | pages/ | controllers/contact_controller.php | contacts |
| Notifications (FR38-39) | features/dashboard/ | controllers/notification_controller.php | notifications |
| Quotas (FR40-42) | features/scripts/ | middleware/rate_limit.php | profiles |
| Admin (FR43-47) | features/admin/ | controllers/admin_controller.php | toutes |

### External Integrations

| Service | Point d'intégration | Fichier |
|---------|-------------------|---------|
| Supabase Auth | Frontend SDK | lib/supabase.js |
| Supabase BDD | Backend REST | api/services/supabase.php |
| Supabase Realtime | Frontend SDK | lib/supabase.js |
| Google/GitHub OAuth | Via Supabase Auth | Config Supabase |
| SMTP | Backend PHP | api/services/mailer.php |

## Architecture Validation Results

### Coherence Validation ✅

- React 18 + Vite ↔ Supabase JS SDK : compatibles
- PHP natif ↔ Supabase REST API : compatible
- JWT Supabase ↔ PHP validation : compatible (clé publique)
- snake_case JSON ↔ snake_case BDD : alignés (pas de transformation)
- Structure par feature ↔ endpoints RESTful : 1:1 mapping cohérent
- CORS domaines séparés ↔ Render hosting : géré via middleware PHP

### Requirements Coverage ✅

- 47/47 FRs couverts architecturalement
- 32/32 NFRs adressés par les décisions techniques
- Toutes les FR catégories mappées à des fichiers/dossiers spécifiques

### Implementation Readiness ✅

- Décisions complètes et documentées
- Arbre projet complet avec rôle de chaque fichier
- Patterns prescriptifs (naming, format, process)
- Boundaries claires (public vs protégé, frontend vs backend)

### Gap Analysis

**Critical :** Aucun
**Important (non-bloquants, résolus story par story) :**
- Logique interne de chaque script (définie lors de l'implémentation)
- Email templates (définis lors de la story notifications)
- Rate limiting via compteur `quota_used` (suffisant MVP)

### Completeness Checklist

- [x] Project context analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped
- [x] Critical decisions documented
- [x] Technology stack specified
- [x] Integration patterns defined
- [x] Performance addressed
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented
- [x] Directory structure complete
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements mapping complete

### Readiness Assessment

**Status :** READY FOR IMPLEMENTATION
**Confidence :** High

**Implementation Priority :**
1. Supabase setup (tables, auth, triggers)
2. Backend PHP (routeur, auth middleware, endpoints)
3. Frontend lib/api.js + AuthContext + ProtectedRoute
4. Pages publiques (contact à créer)
5. Onboarding wizard
6. Dashboard + scripts + exécution
7. Logs + notifications
8. Déploiement Render
