# Akili

**L'automatisation sans le mode d'emploi.**

Akili est une plateforme SaaS d'automatisation de tâches répétitives conçue pour les professionnels africains — freelances, PME et développeurs. Automatise ta facturation, tes fichiers, tes déploiements et tes rapports sans écrire une seule ligne de code.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + React Router v6 |
| Styling | CSS vanilla + Design Tokens (Dark Mode First) |
| Icons | Lucide React |
| Backend | PHP 8 natif (pas de framework) |
| Base de données | Supabase (PostgreSQL + Auth + Realtime) |
| Déploiement | Render (Static Site + Web Service) |

---

## Structure du projet

```
akili-react/
├── src/                        # Frontend React
│   ├── features/               # Modules par fonctionnalité
│   │   ├── auth/               # AuthContext, ProtectedRoute, Login
│   │   ├── onboarding/         # Wizard 5 étapes
│   │   ├── dashboard/          # Dashboard utilisateur + widgets
│   │   ├── scripts/            # Bibliothèque + exécution
│   │   ├── logs/               # Historique exécutions
│   │   ├── account/            # Paramètres compte
│   │   └── admin/              # Dashboard admin (Phase 2)
│   ├── pages/                  # Pages publiques
│   │   ├── Landing.jsx
│   │   ├── Services.jsx
│   │   ├── Pricing.jsx
│   │   ├── Docs.jsx
│   │   ├── Contact.jsx
│   │   ├── About.jsx
│   │   ├── Login.jsx
│   │   └── AdminLogin.jsx
│   ├── components/             # Composants partagés
│   │   ├── AkiliLogo.jsx       # Logo hexagone animé
│   │   ├── Nav.jsx
│   │   ├── Footer.jsx
│   │   ├── Seo.jsx
│   │   ├── RevealOnScroll.jsx
│   │   ├── PageTransition.jsx
│   │   └── ScrollToTop.jsx
│   ├── lib/                    # Utilitaires
│   │   ├── api.js              # Client API centralisé
│   │   ├── supabase.js         # Client Supabase
│   │   └── storage.js          # Helpers localStorage
│   └── styles/                 # CSS par page/feature
│       ├── tokens.css          # Design tokens
│       ├── global.css
│       ├── landing.css
│       ├── login.css
│       ├── dashboard.css
│       ├── admin.css
│       └── ...
├── api/                        # Backend PHP natif
│   ├── index.php               # Point d'entrée + routeur
│   ├── config/                 # Database, CORS, constantes
│   ├── middleware/             # Auth JWT, CORS, Rate limiting
│   ├── controllers/            # Profile, Scripts, Executions, Contact...
│   ├── services/               # Supabase REST, JWT, Mailer, Script Runner, Logger
│   └── logs/                   # Fichiers de logs (gitignored)
├── supabase/                   # Migrations + Seeds
│   ├── migrations/             # 001 à 009 (tables, RLS, realtime)
│   ├── seeds/                  # Scripts bibliothèque (12 scripts)
│   └── full-migration.sql      # Script complet pour SQL Editor
└── _bmad-output/               # Artefacts de planification
    └── planning-artifacts/
        ├── prd.md              # Product Requirements Document
        ├── architecture.md     # Architecture Decision Document
        └── epics.md            # Epics & Stories (24 stories)
```

---

## Installation

### Prérequis

- Node.js >= 18
- PHP >= 8.0 (avec curl activé)
- Un projet Supabase

### 1. Cloner et installer

```bash
git clone <repo-url>
cd akili-react
npm install
```

### 2. Configuration

Copier le fichier d'environnement :

```bash
cp .env.example .env
```

Remplir les variables :

```env
# Frontend
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key
VITE_API_URL=http://localhost:8000/api

# Backend
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=votre-service-role-key
FRONTEND_URL=http://localhost:5173
```

### 3. Base de données

Exécuter `supabase/full-migration.sql` dans le SQL Editor de Supabase. Cela crée :

- 7 tables (profiles, scripts, executions, integrations, contacts, notifications, notification_preferences)
- Trigger de création automatique de profil à l'inscription
- RLS policies
- Fonction RPC `increment_quota`
- 12 scripts prêts à l'emploi (seed)

### 4. Lancer le projet

**Terminal 1 — API PHP :**

```bash
php -S localhost:8000 -t api/ api/index.php
```

**Terminal 2 — Frontend :**

```bash
npm run dev
```

Ouvrir `http://localhost:5173`

---

## Pages

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Landing page | Non |
| `/services` | Page services (9 offres) | Non |
| `/pricing` | Plans tarifaires | Non |
| `/docs` | Documentation (14 sections) | Non |
| `/contact` | Formulaire de contact | Non |
| `/about` | À propos | Non |
| `/login` | Connexion / Inscription | Non |
| `/admin/login` | Connexion admin | Non |
| `/onboarding` | Wizard 5 étapes | Oui |
| `/dashboard` | Dashboard utilisateur | Oui |
| `/dashboard/scripts` | Bibliothèque scripts | Oui |
| `/dashboard/scripts/:slug` | Détail + exécution | Oui |
| `/dashboard/logs` | Historique exécutions | Oui |
| `/dashboard/settings` | Paramètres compte | Oui |
| `/admin` | Dashboard admin | Admin |
| `/admin/users` | Gestion utilisateurs | Admin |
| `/admin/logs` | Logs système | Admin |
| `/admin/alerts` | Alertes configurables | Admin |

---

## API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/profile` | Profil utilisateur |
| PUT | `/api/profile` | Modifier profil |
| DELETE | `/api/profile` | Supprimer compte |
| GET | `/api/scripts` | Liste scripts |
| GET | `/api/scripts/:slug` | Détail script |
| POST | `/api/scripts/:slug/run` | Exécuter un script |
| GET | `/api/executions` | Historique (paginé) |
| GET | `/api/executions/:id` | Détail exécution |
| GET | `/api/stats` | Stats dashboard |
| POST | `/api/contact` | Envoyer message |
| GET | `/api/notifications` | Notifications |
| PUT | `/api/notifications/:id/read` | Marquer lue |

Format de réponse uniforme :

```json
{ "data": { ... }, "error": null, "meta": { "page": 1, "total": 42 } }
```

---

## Design System

### Direction artistique : "Cotonou Digital"

- **Dark mode first** — fond `#0F172A`
- **Palette** : Bleu `#2563EB`, Cyan `#06B6D4`, Bleu logo `#29ABE2`
- **Surfaces** : `#0F172A` → `#1E293B` → `#334155`
- **Typographie** : Space Grotesk (titres), Inter (body), JetBrains Mono (code)
- **Rayons** : 6px / 12px / 16px / 24px (généreux, chaleureux)
- **Animations** : Reveal on scroll, page transitions, hover glow

### Principes

| Pilier | Description |
|--------|-------------|
| Chaleur | Dark mais vivant, coins arrondis, espaces aérés |
| Géométrie | Motifs basés sur les blocs du logo Akili |
| Humanité | Ton conversationnel, illustrations stylisées |
| Rythme | Asymétrie maîtrisée, animations avec sens |

---

## Scripts disponibles

| Catégorie | Scripts |
|-----------|---------|
| Facturation | facture-pdf, facture-relance, devis-auto |
| Fichiers | renommage-lot, compression-images, tri-dossiers |
| Emails | email-campagne, email-reponse-auto |
| Rapports | rapport-csv, rapport-hebdo |
| Stockage | backup-drive, sync-dossiers |

---

## Commandes

```bash
npm run dev       # Serveur de développement (Vite)
npm run build     # Build production
npm run preview   # Preview du build
```

---

## Architecture

```
[Navigateur] → [React SPA] → [API PHP] → [Supabase PostgreSQL]
                    ↕                            ↕
            [Supabase Auth]              [Supabase Realtime]
```

- **Frontend** : SPA React, routing client-side, state via Context
- **Backend** : PHP stateless, validation JWT via Supabase Auth API, réponses JSON uniformes
- **BDD** : Supabase PostgreSQL avec RLS, triggers, et Realtime
- **Auth** : Supabase Auth (email/password), JWT validé côté PHP

---

## Déploiement

### Render

- **Frontend** : Static Site — Build `npm run build`, Publish `dist/`
- **Backend** : Web Service — PHP natif, port 80

### Variables d'environnement production

Remplacer les URLs localhost par les URLs Render dans `.env`.

---

## Roadmap

- [x] **Phase 1 (MVP)** — Landing, Auth, Onboarding, Scripts, Dashboard, Contact
- [x] **Phase 2** — Dashboard Admin, Gestion utilisateurs, Logs système, Alertes
- [ ] **Phase 3** — Planification cron, Intégrations (Drive, Gmail, Slack), API REST publique
- [ ] **Phase 4** — IA (langage naturel → script), Marketplace, Mobile app

---

## Auteurs

- **TheSoulReaper** — Fondateur & Lead Dev

---

## Licence

Propriétaire — Tous droits réservés.
