---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
status: 'complete'
completedAt: '2026-04-30'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
---

# akili-react - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for akili-react, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: Un visiteur peut créer un compte via email et mot de passe
- FR2: Un visiteur peut créer un compte via OAuth Google
- FR3: Un visiteur peut créer un compte via OAuth GitHub
- FR4: Un utilisateur peut se connecter avec ses identifiants existants
- FR5: Un utilisateur peut réinitialiser son mot de passe par email
- FR6: Un utilisateur peut maintenir sa session active entre les visites
- FR7: Un utilisateur peut se déconnecter
- FR8: Un nouvel utilisateur est redirigé vers un wizard d'onboarding après inscription
- FR9: L'utilisateur peut renseigner son profil (prénom, rôle, secteur d'activité)
- FR10: L'utilisateur peut sélectionner ce qu'il souhaite automatiser parmi des catégories prédéfinies
- FR11: L'utilisateur peut connecter ses outils tiers pendant l'onboarding (optionnel, skip possible)
- FR12: L'utilisateur peut exécuter un premier script guidé pendant l'onboarding
- FR13: L'utilisateur peut passer n'importe quelle étape de l'onboarding
- FR14: Un utilisateur peut parcourir la bibliothèque de scripts disponibles
- FR15: Un utilisateur peut filtrer les scripts par catégorie (facturation, fichiers, emails, rapports, stockage)
- FR16: Un utilisateur peut voir le détail d'un script (description, paramètres requis, catégorie)
- FR17: Un utilisateur peut configurer les paramètres d'un script avant exécution
- FR18: Un utilisateur peut lancer l'exécution manuelle d'un script
- FR19: Un utilisateur peut voir le résultat d'une exécution (succès/échec, durée, output)
- FR20: Un utilisateur peut voir ses statistiques personnelles (tâches exécutées, heures économisées, scripts actifs)
- FR21: Un utilisateur peut voir la liste de ses scripts récemment exécutés
- FR22: Un utilisateur peut accéder rapidement à l'exécution d'un script depuis le dashboard
- FR23: Un utilisateur peut consulter l'historique complet de ses exécutions (logs)
- FR24: Un utilisateur peut filtrer ses logs par script, statut et date
- FR25: Un utilisateur peut rechercher dans l'application via une command bar universelle (Phase 2)
- FR26: Un utilisateur peut voir et modifier ses informations de profil
- FR27: Un utilisateur peut voir son plan actuel et son usage (quota)
- FR28: Un utilisateur peut upgrader son plan (Gratuit → Pro)
- FR29: Un utilisateur peut supprimer son compte
- FR30: Un visiteur peut comprendre la proposition de valeur d'Akili en moins de 5 secondes sur la landing page
- FR31: Un visiteur peut voir les cas d'usage et témoignages sur la landing page
- FR32: Un visiteur peut comparer les plans tarifaires sur la page pricing
- FR33: Un visiteur peut consulter la documentation produit sur la page docs
- FR34: Un visiteur peut naviguer entre les sections de documentation via une sidebar
- FR35: Un visiteur peut rechercher dans la documentation
- FR36: Un visiteur peut envoyer un message via le formulaire de contact
- FR37: Le système envoie une notification email à l'équipe quand un formulaire de contact est soumis
- FR38: Un utilisateur reçoit une notification email après chaque exécution de script (succès ou échec)
- FR39: Un utilisateur peut configurer ses préférences de notification
- FR40: Le système limite le nombre d'exécutions par jour selon le plan de l'utilisateur
- FR41: Le système notifie l'utilisateur quand il atteint 80% de son quota
- FR42: Le système bloque les exécutions quand le quota est dépassé avec un message clair
- FR43: Un admin peut voir les statistiques globales de la plateforme (utilisateurs, exécutions, revenus)
- FR44: Un admin peut lister, rechercher et filtrer les utilisateurs
- FR45: Un admin peut suspendre ou réactiver un compte utilisateur
- FR46: Un admin peut voir les logs système et les erreurs
- FR47: Un admin peut configurer des alertes automatiques (uptime, erreurs, quotas)

### NonFunctional Requirements

- NFR1: Pages publiques FCP < 1.5s sur 3G
- NFR2: Actions dashboard réponse < 300ms
- NFR3: Exécution script résultat visible < 5s
- NFR4: Bundle JS initial gzipped < 100KB
- NFR5: Images WebP + lazy loading
- NFR6: Landing Lighthouse Performance ≥ 85
- NFR7: HTTPS (TLS 1.2+) toutes communications
- NFR8: Mots de passe hashés bcrypt (cost ≥ 10)
- NFR9: Tokens OAuth stockés côté serveur uniquement
- NFR10: Prepared statements toutes requêtes backend
- NFR11: Tokens CSRF sur tous les formulaires
- NFR12: Sanitization côté serveur (anti-XSS)
- NFR13: Secrets jamais en clair dans le code
- NFR14: Sessions expirent après 7 jours d'inactivité
- NFR15: Conformité RGPD (consentement, droit à l'oubli, export)
- NFR16: 500 utilisateurs concurrents sans dégradation
- NFR17: Backend PHP stateless (scaling horizontal)
- NFR18: Supabase supporte 10 000 utilisateurs sans changement
- NFR19: 1 000 exécutions scripts/heure
- NFR20: WCAG 2.1 niveau AA toutes pages
- NFR21: Contraste texte/fond ≥ 4.5:1
- NFR22: Navigation clavier complète + focus visible
- NFR23: prefers-reduced-motion respecté
- NFR24: Labels accessibles + aria-describedby
- NFR25: OAuth Google/GitHub en < 3 clics
- NFR26: Refresh automatique tokens tiers
- NFR27: Graceful degradation intégrations tierces
- NFR28: Retry auto API tierces (3 tentatives, backoff)
- NFR29: Uptime 99.5%
- NFR30: Zero data loss
- NFR31: Scripts interrompus repris automatiquement
- NFR32: Backups BDD quotidiens

### Additional Requirements

- Architecture spécifie un projet existant (React 18 + Vite), pas de starter template à initialiser
- Ajouter `@supabase/supabase-js` au frontend
- Créer la structure backend PHP : `api/{config,middleware,routes,controllers,services}`
- Créer les migrations Supabase : 7 tables (profiles, scripts, executions, integrations, contacts, notifications, notification_preferences)
- Seed data : 10-15 scripts prêts à l'emploi dans la bibliothèque
- Routeur PHP minimaliste avec middleware auth (JWT Supabase) et CORS
- Format réponse API uniforme : `{ data, error, meta }`
- Exécution de scripts synchrone avec timeout 30s
- Service mailer PHP pour notifications email
- Déploiement sur Render (Static Site frontend + Web Service backend)
- Variables d'environnement séparées frontend/backend

### UX Design Requirements

Pas de document UX Design formel. Direction artistique "Cotonou Digital" définie dans le PRD et le brainstorming — dark mode first, motifs géométriques, palette bleu/cyan, coins arrondis généreux.

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1-7 | Epic 1 | Authentification complète |
| FR8-13 | Epic 3 | Onboarding wizard |
| FR14-19 | Epic 4 | Scripts & exécution |
| FR20-24 | Epic 5 | Dashboard & logs |
| FR25 | Epic 7 | Command bar (Phase 2) |
| FR26-29 | Epic 6 | Gestion compte |
| FR30-37 | Epic 2 | Pages publiques |
| FR38-39 | Epic 6 | Notifications |
| FR40-42 | Epic 4 | Quotas & rate limiting |
| FR43-47 | Epic 7 | Admin |

## Epic List

### Epic 1 : Fondation & Authentification
Les utilisateurs peuvent créer un compte, se connecter et accéder à la plateforme de manière sécurisée. Inclut le setup technique (Supabase, backend PHP, lib frontend).
**FRs couverts :** FR1, FR2, FR3, FR4, FR5, FR6, FR7
**Additional Reqs :** Setup Supabase (7 tables), structure backend PHP, lib/api.js, AuthContext, ProtectedRoute

### Epic 2 : Pages Publiques & Contact
Les visiteurs peuvent découvrir Akili, comprendre sa proposition de valeur, consulter la documentation et contacter l'équipe.
**FRs couverts :** FR30, FR31, FR32, FR33, FR34, FR35, FR36, FR37
**Note :** Landing, Services, Pricing, Docs existent déjà — adapter dark mode. Contact à créer.

### Epic 3 : Onboarding
Les nouveaux utilisateurs sont guidés pas-à-pas vers leur première automatisation en moins de 5 minutes.
**FRs couverts :** FR8, FR9, FR10, FR11, FR12, FR13

### Epic 4 : Scripts & Exécution
Les utilisateurs peuvent parcourir la bibliothèque de scripts, configurer et exécuter des automatisations, et voir les résultats. Inclut le rate limiting.
**FRs couverts :** FR14, FR15, FR16, FR17, FR18, FR19, FR40, FR41, FR42

### Epic 5 : Dashboard & Historique
Les utilisateurs peuvent visualiser leurs statistiques, suivre leur activité récente et consulter l'historique détaillé de leurs exécutions.
**FRs couverts :** FR20, FR21, FR22, FR23, FR24

### Epic 6 : Compte & Notifications
Les utilisateurs gèrent leur profil, leur plan d'abonnement et reçoivent des notifications email sur leurs automatisations.
**FRs couverts :** FR26, FR27, FR28, FR29, FR38, FR39

### Epic 7 : Administration (Phase 2)
Les administrateurs peuvent monitorer la plateforme, gérer les utilisateurs et configurer des alertes.
**FRs couverts :** FR43, FR44, FR45, FR46, FR47, FR25

## Epic 1 : Fondation & Authentification

Les utilisateurs peuvent créer un compte, se connecter et accéder à la plateforme de manière sécurisée.

### Story 1.1 : Setup Supabase & Backend PHP

As a développeur,
I want la structure technique de base en place (tables Supabase, routeur PHP, CORS, middleware auth),
So that toutes les stories suivantes peuvent s'appuyer sur une fondation fonctionnelle.

**Acceptance Criteria:**

**Given** un projet vierge côté backend
**When** le setup est terminé
**Then** les 7 tables existent dans Supabase (profiles, scripts, executions, integrations, contacts, notifications, notification_preferences)
**And** le routeur PHP répond sur `/api/health` avec `{ "data": { "status": "ok" }, "error": null, "meta": null }`
**And** le middleware CORS autorise le frontend
**And** `@supabase/supabase-js` est installé côté frontend
**And** `lib/supabase.js` exporte un client initialisé
**And** `lib/api.js` exporte un wrapper fetch avec auth header

### Story 1.2 : Inscription par email

As a visiteur,
I want créer un compte avec mon email et un mot de passe,
So that je puisse accéder à la plateforme.

**Acceptance Criteria:**

**Given** un visiteur sur la page `/login` (onglet Inscription)
**When** il remplit email + mot de passe et soumet le formulaire
**Then** un compte est créé dans Supabase Auth
**And** un profil est créé dans la table `profiles` (role: 'user', plan: 'free')
**And** l'utilisateur est redirigé vers `/onboarding`
**And** les champs sont validés côté React (email format, mot de passe ≥ 8 chars)
**And** les erreurs sont affichées sous le champ concerné

### Story 1.3 : Inscription OAuth Google & GitHub

As a visiteur,
I want créer un compte via Google ou GitHub en un clic,
So that je n'ai pas besoin de retenir un mot de passe supplémentaire.

**Acceptance Criteria:**

**Given** un visiteur sur la page `/login`
**When** il clique "Google" ou "GitHub"
**Then** le flow OAuth Supabase se lance (redirect → consentement → callback)
**And** un profil `profiles` est créé automatiquement
**And** l'utilisateur est redirigé vers `/onboarding` si nouveau, `/dashboard` si existant
**And** l'opération complète en < 3 clics

### Story 1.4 : Connexion & Session

As a utilisateur existant,
I want me connecter et rester connecté entre les visites,
So that je n'ai pas besoin de me reconnecter à chaque fois.

**Acceptance Criteria:**

**Given** un utilisateur avec un compte existant
**When** il se connecte (email/mdp ou OAuth)
**Then** il est redirigé vers `/dashboard`
**And** sa session reste active 7 jours sans activité
**And** le token est rafraîchi automatiquement par le PHP si expiré
**And** un bouton "Déconnexion" est disponible et fonctionnel

### Story 1.5 : Réinitialisation mot de passe

As a utilisateur,
I want réinitialiser mon mot de passe par email,
So that je puisse récupérer l'accès à mon compte.

**Acceptance Criteria:**

**Given** un utilisateur sur la page login
**When** il clique "oublié ?" et entre son email
**Then** Supabase envoie un email de réinitialisation
**And** le lien permet de définir un nouveau mot de passe
**And** après reset, l'utilisateur peut se connecter avec le nouveau mot de passe
**And** un message de confirmation est affiché à chaque étape

### Story 1.6 : Routes protégées & AuthContext

As a utilisateur non connecté,
I want être redirigé vers /login si j'essaie d'accéder au dashboard,
So that les pages protégées ne soient accessibles qu'aux utilisateurs authentifiés.

**Acceptance Criteria:**

**Given** un visiteur non authentifié
**When** il accède à `/dashboard`, `/onboarding`, ou toute route protégée
**Then** il est redirigé vers `/login`
**And** après connexion, il est redirigé vers la page initialement demandée
**And** le composant `<ProtectedRoute>` gère cette logique
**And** un `AuthContext` expose `user`, `loading`, `login()`, `logout()`

## Epic 2 : Pages Publiques & Contact

Les visiteurs peuvent découvrir Akili, comprendre sa proposition de valeur, et contacter l'équipe.

### Story 2.1 : Page Contact

As a visiteur,
I want envoyer un message à l'équipe Akili via un formulaire,
So that je puisse poser des questions ou demander de l'aide.

**Acceptance Criteria:**

**Given** un visiteur sur `/contact`
**When** il remplit le formulaire (nom, email, sujet, message) et soumet
**Then** le message est enregistré dans la table `contacts` via l'API PHP
**And** un email de notification est envoyé à l'équipe via le service mailer PHP
**And** un message de confirmation est affiché
**And** les champs sont validés côté React ET côté PHP
**And** la page suit la DA dark mode "Cotonou Digital"
**And** la page inclut infos de contact, localisation (Cotonou), FAQ rapide

### Story 2.2 : Polish Pages Existantes (Dark Mode)

As a visiteur,
I want une expérience visuelle cohérente sur toutes les pages publiques,
So that la plateforme inspire confiance et professionnalisme.

**Acceptance Criteria:**

**Given** les pages Landing, Services, Pricing, Docs existantes
**When** un visiteur navigue entre elles
**Then** toutes utilisent le dark mode first (`--bg: #0F172A`)
**And** les transitions entre pages sont fluides (pas de flash blanc)
**And** Nav et Footer sont cohérents partout
**And** score Lighthouse Performance landing ≥ 85
**And** toutes les pages sont responsive
**And** `prefers-reduced-motion` est respecté

### Story 2.3 : SEO & Meta Tags

As a visiteur venant de Google ou d'un partage social,
I want voir un aperçu pertinent de la page,
So that je comprenne ce qu'est Akili avant de cliquer.

**Acceptance Criteria:**

**Given** les pages publiques
**When** elles sont indexées ou partagées
**Then** chaque page a un `<title>` et `<meta description>` uniques
**And** Open Graph tags (og:title, og:description, og:image) sont présents
**And** pages protégées ont `noindex, nofollow`
**And** un sitemap.xml est généré

### Story 2.4 : Documentation interactive

As a visiteur,
I want naviguer facilement dans la documentation et y chercher des informations,
So that je trouve rapidement les réponses à mes questions.

**Acceptance Criteria:**

**Given** un visiteur sur `/docs`
**When** il utilise la sidebar
**Then** il peut naviguer entre les 14 sections
**And** la recherche filtre les sections en temps réel
**And** les boutons Précédent/Suivant fonctionnent
**And** le breadcrumb indique la position
**And** le code a coloration syntaxique et bouton "Copier"

## Epic 3 : Onboarding

Les nouveaux utilisateurs sont guidés vers leur première automatisation en < 5 minutes.

### Story 3.1 : Wizard Onboarding (structure et navigation)

As a nouvel utilisateur,
I want être guidé pas-à-pas dans un wizard plein écran,
So that je configure mon premier workflow sans être perdu.

**Acceptance Criteria:**

**Given** un utilisateur vient de s'inscrire
**When** il est redirigé vers `/onboarding`
**Then** un wizard plein écran s'affiche avec 5 étapes et barre de progression
**And** il peut naviguer (Suivant, Retour)
**And** il peut passer n'importe quelle étape
**And** les transitions sont des slides horizontaux fluides
**And** la barre de progression utilise les blocs géométriques Akili

### Story 3.2 : Étapes Profil & Objectifs

As a nouvel utilisateur,
I want renseigner mon profil et mes objectifs d'automatisation,
So that Akili me propose des scripts adaptés à mon métier.

**Acceptance Criteria:**

**Given** l'utilisateur est à l'étape 1 du wizard
**When** il remplit prénom, rôle, secteur d'activité
**Then** les données sont sauvegardées dans `profiles` via l'API
**And** à l'étape 2, il sélectionne visuellement ce qu'il veut automatiser
**And** la sélection est sauvegardée et utilisée pour recommander un script
**And** les deux étapes sont skippables

### Story 3.3 : Premier script guidé & Confirmation

As a nouvel utilisateur,
I want exécuter mon premier script pendant l'onboarding,
So that je vois immédiatement la valeur d'Akili.

**Acceptance Criteria:**

**Given** l'utilisateur atteint l'étape 4
**When** un script recommandé est proposé
**Then** il peut le configurer avec paramètres pré-remplis
**And** il peut l'exécuter et voir le résultat
**And** l'étape 5 affiche récap + animation de célébration + bouton "Entrer dans Akili"
**And** `profiles.onboarding_completed` passe à `true`
**And** l'étape 3 (connecter outils) est optionnelle et skippable

## Epic 4 : Scripts & Exécution

Les utilisateurs peuvent parcourir, configurer, exécuter des scripts et voir les résultats.

### Story 4.1 : Bibliothèque de scripts

As a utilisateur,
I want parcourir et filtrer les scripts disponibles,
So that je trouve rapidement l'automatisation dont j'ai besoin.

**Acceptance Criteria:**

**Given** un utilisateur connecté
**When** il accède à la bibliothèque
**Then** les scripts sont chargés depuis `GET /api/scripts`
**And** il peut filtrer par catégorie
**And** chaque script affiche nom, description, catégorie, icône
**And** cache localStorage (refresh 30 min)
**And** skeleton loader pendant le chargement

### Story 4.2 : Détail et configuration d'un script

As a utilisateur,
I want voir le détail d'un script et configurer ses paramètres,
So that je le personnalise avant exécution.

**Acceptance Criteria:**

**Given** un utilisateur clique sur un script
**When** la page détail s'affiche
**Then** il voit description complète, paramètres requis/optionnels, catégorie
**And** un formulaire dynamique basé sur `params_schema` (JSONB)
**And** validation React (champs requis, formats)
**And** bouton "Lancer" visible

### Story 4.3 : Exécution de script & résultats

As a utilisateur,
I want exécuter un script et voir le résultat immédiatement,
So that ma tâche est automatisée sans attente.

**Acceptance Criteria:**

**Given** un utilisateur a configuré un script
**When** il clique "Lancer"
**Then** `POST /api/scripts/:slug/run` est appelé
**And** loading state (bouton disabled + spinner)
**And** résultat affiché (succès/échec, durée, output)
**And** entrée créée dans `executions`
**And** `profiles.quota_used` incrémenté
**And** si timeout 30s → message d'erreur clair

### Story 4.4 : Rate limiting & quotas

As a utilisateur plan gratuit,
I want comprendre mes limites d'utilisation,
So that je sache quand upgrader.

**Acceptance Criteria:**

**Given** un utilisateur avec quota défini
**When** il atteint 80%
**Then** notification "Tu approches de ta limite"
**And** à 100%, bouton "Lancer" désactivé
**And** message "Quota atteint — upgrade ou reviens demain"
**And** lien vers pricing
**And** PHP renvoie `{ error: { code: "QUOTA_EXCEEDED" } }`

## Epic 5 : Dashboard & Historique

Les utilisateurs visualisent leurs stats et suivent leur activité.

### Story 5.1 : Dashboard vue d'ensemble

As a utilisateur,
I want voir mes statistiques et scripts récents d'un coup d'œil,
So that je comprenne ma productivité.

**Acceptance Criteria:**

**Given** un utilisateur accède à `/dashboard`
**When** la page charge
**Then** stats affichées (tâches exécutées, heures économisées, scripts actifs)
**And** 5 derniers scripts exécutés
**And** bouton "Quick Run"
**And** données depuis `GET /api/stats`, cache localStorage 2 min
**And** skeleton loader
**And** layout avec sidebar (DashboardLayout)

### Story 5.2 : Historique des exécutions (Logs)

As a utilisateur,
I want consulter l'historique complet de mes exécutions avec filtres,
So that je puisse diagnostiquer les erreurs.

**Acceptance Criteria:**

**Given** un utilisateur accède aux Logs
**When** la page charge
**Then** liste paginée des exécutions (`GET /api/executions?page=1`)
**And** chaque entrée : script, statut, durée, date
**And** filtres par script, statut, plage de dates
**And** clic → détail (paramètres, résultat, erreur)
**And** pagination 20 items/page

## Epic 6 : Compte & Notifications

Les utilisateurs gèrent leur profil, plan, et reçoivent des notifications.

### Story 6.1 : Gestion du profil et du plan

As a utilisateur,
I want voir et modifier mes informations et mon plan,
So that je garde mon compte à jour.

**Acceptance Criteria:**

**Given** un utilisateur accède aux Paramètres
**When** il consulte son profil
**Then** il voit nom, email, rôle, secteur, plan, usage quota
**And** il peut modifier nom, rôle, secteur (`PUT /api/profile`)
**And** bouton "Upgrader" si plan gratuit
**And** suppression compte avec confirmation (`DELETE /api/profile`)
**And** suppression efface toutes les données (RGPD)

### Story 6.2 : Notifications email & préférences

As a utilisateur,
I want recevoir un email après chaque exécution et configurer mes préférences,
So that je suis informé sans vérifier manuellement.

**Acceptance Criteria:**

**Given** un utilisateur exécute un script
**When** l'exécution se termine
**Then** email envoyé via mailer PHP (si préférence activée)
**And** email contient : script, statut, durée, résumé
**And** préférences configurables (email on success, email on error)
**And** sauvegardées dans `notification_preferences`
**And** notification in-app créée dans `notifications`

## Epic 7 : Administration (Phase 2)

Les admins gèrent la plateforme.

### Story 7.1 : Dashboard Admin & Stats globales

As a admin,
I want voir les statistiques globales de la plateforme,
So that je comprenne la santé et la croissance d'Akili.

**Acceptance Criteria:**

**Given** un admin accède à `/admin`
**When** le dashboard charge
**Then** il voit : utilisateurs total/actifs, exécutions, MRR, uptime
**And** stats via Supabase Realtime
**And** layout admin séparé du dashboard utilisateur
**And** seuls `role: 'admin'` peuvent accéder (sinon redirect `/dashboard`)

### Story 7.2 : Gestion des utilisateurs

As a admin,
I want lister, rechercher et gérer les utilisateurs,
So that je puisse supporter et modérer la plateforme.

**Acceptance Criteria:**

**Given** un admin sur la page gestion utilisateurs
**When** il consulte la liste
**Then** tous les utilisateurs avec nom, email, plan, quota, date inscription
**And** recherche par nom ou email
**And** filtres par plan et statut
**And** suspendre ou réactiver un compte
**And** voir les logs d'un utilisateur spécifique

### Story 7.3 : Logs système & Alertes

As a admin,
I want voir les logs système et configurer des alertes,
So that je suis prévenu des problèmes.

**Acceptance Criteria:**

**Given** un admin accède aux logs système
**When** la page charge
**Then** erreurs récentes (scripts en échec, erreurs API)
**And** filtres par type
**And** configuration alertes : uptime < 99%, > 5 erreurs/h, user atteint quota
**And** alertes envoyées par email
