---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
completedAt: '2026-04-30'
releaseMode: phased
inputDocuments:
  - _bmad-output/brainstorming/brainstorming-session-2026-04-30.md
  - brief_creatif_akili (Graphisme, UX, Dev Cotonou).docx
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 0
  projectContext: 0
classification:
  projectType: web_app
  domain: general
  complexity: medium
  projectContext: greenfield
workflowType: 'prd'
---

# Product Requirements Document — Akili

**Auteur :** TheSoulReaper
**Date :** 2026-04-30

## Executive Summary

Akili est une plateforme SaaS d'automatisation de tâches répétitives conçue pour les professionnels africains — freelances, PME et développeurs — qui perdent des heures chaque semaine sur des opérations manuelles (facturation, gestion de fichiers, déploiements, rapports). Contrairement aux alternatives existantes (Zapier, Make, n8n) qui sont puissantes mais complexes, Akili permet d'automatiser en langage naturel, sans écrire une seule ligne de code, avec un pricing adapté aux marchés africains.

L'ambition est de devenir la couche invisible de productivité pour les entreprises africaines : une technologie simple qui réduit la friction du travail quotidien et démocratise l'automatisation dans des marchés historiquement ignorés par les grandes plateformes SaaS.

### Ce qui rend Akili spécial

- **Le moment "2h gagnées en 5 minutes"** — L'utilisateur configure une automatisation en quelques clics et récupère immédiatement des heures de travail hebdomadaire
- **Accessible, pas puissant-mais-complexe** — 0 ligne de code, 3 étapes max, langage humain. Un entrepreneur automatise sans dépendre d'un développeur
- **Contextualisé pour l'Afrique** — Conçu à Cotonou pour les réalités locales : connexions instables, devices variés, prix juste (FCFA), support francophone
- **Couche invisible** — Akili tourne en arrière-plan et ne sollicite l'utilisateur que quand son attention est nécessaire

## Project Classification

| Attribut | Valeur |
|----------|--------|
| Type de projet | Web App (SaaS) |
| Domaine | Productivité & Automatisation |
| Complexité | Medium |
| Contexte | Greenfield |
| Stack | React 18 + Vite (frontend), PHP natif + Supabase (backend) |
| Cible | Freelances, PME, développeurs — Afrique francophone |

## Success Criteria

### Succès Utilisateur

- **Time-to-first-automation :** ≤ 5 minutes après inscription (grâce à l'onboarding wizard)
- **Seuil d'indispensabilité :** 4h+ économisées par semaine
- **Moment "aha!" :** Premier script exécuté avec succès — l'utilisateur réalise qu'il n'a plus à faire cette tâche
- **Rétention :** 60%+ reviennent la semaine suivante

### Succès Business

- **3 mois :** 500 utilisateurs actifs
- **6 mois :** 2 000 utilisateurs actifs, 100 abonnés payants
- **Conversion free → pro :** 5-8%
- **Premier jalon MRR :** 500 000 FCFA (~750€) à 6 mois
- **Churn mensuel :** < 5%

### Succès Technique

- **Uptime :** 99.5%
- **Exécution script :** < 5s
- **Chargement pages :** < 2s (connexions africaines)
- **Mobile responsive :** 100% des pages
- **Zero data loss**

### Résultats Mesurables

| Métrique | Cible MVP | Cible 6 mois |
|----------|-----------|--------------|
| Utilisateurs actifs | 500 | 2 000 |
| Scripts exécutés/mois | 5 000 | 50 000 |
| Temps moyen gagné/user/semaine | 4h | 6h |
| NPS | > 40 | > 50 |
| Taux de complétion onboarding | > 70% | > 80% |

## Design Direction — "Cotonou Digital"

> Akili vient de la nuit digitale de Cotonou — là où les écrans brillent dans les ateliers, où la tech se mélange à la vie. Pas de froideur Silicon Valley. Ici le design respire, les formes dansent, et la géométrie raconte une histoire.

### Principes directeurs

| Pilier | Principe | Traduction UX |
|--------|----------|---------------|
| Chaleur | Le dark n'est pas froid | Coins arrondis généreux (12-16px), espacements aérés, illustrations humaines |
| Géométrie vivante | Les motifs ne décorent pas, ils vivent | Patterns animés subtilement, blocs qui se composent/décomposent |
| Humanité | La tech sert les gens | Avatars, personnages stylisés, ton conversationnel dans l'UI |
| Rythme | L'énergie de Cotonou | Asymétrie maîtrisée, layouts décalés, éléments qui pulsent |

### Dark Mode First

- **Palette :** `--blue: #29ABE2`, `--accent: #2563EB`, `--accent-2: #06B6D4`, `--dark: #0F172A`, `--light: #F8FAFC`
- **Surfaces :** Niveau 0 `#0F172A` → Niveau 1 `#1E293B` → Niveau 2 `#334155` → Niveau 3 (modals) `#1E293B + border`
- **Texte :** Principal `#F8FAFC`, secondaire `#94A3B8`, tertiaire `#475569`
- **Bordures :** `rgba(248,250,252, 0.06/0.10/0.16)` selon l'état (repos/hover/focus)
- **Glow :** Boutons actifs `box-shadow: 0 0 20px rgba(37,99,235,0.3)`, workflows actifs en cyan pulsant

### Motifs géométriques

Basés sur les blocs rectangulaires du logo Akili :
- **Fond de sections :** grille de blocs à 3-5% opacité
- **Transitions entre sections :** composition de 3-5 rectangles en bleu/cyan — signature visuelle unique par page
- **Loader / onboarding :** blocs animés qui se composent à 100% en couleur accent
- **Décor cartes :** coin supérieur droit à 8% opacité

### Illustrations

- **Style :** Silhouettes géométriques (tête = cercle, corps = rectangles), trait fin 1.5px en `#F8FAFC`, remplissage `#1E293B`, accent bleu sur un élément
- **Mouvement :** Animation idle (respiration, clignotement d'écran)
- **Scènes :** Freelance devant son écran, équipe autour d'un tableau, café pendant qu'Akili travaille

### Animations

| Élément | Animation | Sens |
|---------|-----------|------|
| Hero formes géométriques | Float lent | Vie, respiration |
| Cartes / widgets | Scale 1.02 + glow on hover | Réactivité |
| Bouton primary | Ripple + glow expansion au clic | Confirmation |
| Sidebar nav | Indicator slide | Fluidité |
| Terminal lines | Apparition séquentielle (typing) | Démonstration |
| Compteurs | Ease-out counting | Impact |
| Page transitions | Fade + slide 200ms | Continuité |
| Onboarding steps | Slide horizontal | Progression |

### Ce qu'on veut vs ce qu'on évite

| Oui | Non |
|-----|-----|
| Chaleureux, vivant | Froid, corporate |
| Géométrie qui bouge | Motifs statiques plaqués |
| Illustrations stylisées | Stock photos, 3D renders |
| Asymétrie maîtrisée | Grilles rigides symétriques |
| Espaces généreux | Interface dense/compacte |
| Animations avec sens | Animations gratuites |
| Personnalité africaine | Clichés visuels africains |
| Dark confortable | Dark oppressant |

## User Journeys

### 1. Fatou Koné — Freelance Graphiste, Cotonou

**Situation :** Fatou gère 8 clients en parallèle. Chaque livraison implique : renommer 20-30 fichiers, redimensionner, exporter, uploader sur le Drive client, notifier via Slack. Elle perd 6h par semaine.

**Opening Scene :** Vendredi soir, 22h. 45 fichiers à renommer, redimensionner et livrer. Elle soupire.

**Rising Action :** Une amie lui parle d'Akili. Landing page → "mes tâches répétitives, automatisées" → inscription → onboarding → "Livraison de fichiers" → configuration : dossier source, règle de renommage, Drive client, Slack.

**Climax :** Clic "Lancer". 3 secondes : 45 fichiers renommés, redimensionnés, uploadés, client notifié. Ce qui prenait 45 minutes.

**Resolution :** Workflow planifié chaque vendredi. 6h récupérées par semaine. 9ème client accepté.

---

### 2. Aminata Maïga — Assistante PME, Lomé

**Situation :** Facturation de 35 clients. Chaque mois : créer manuellement chaque facture, exporter en PDF, envoyer par email. Factures oubliées ou en retard.

**Opening Scene :** Le 1er du mois. 2 jours de travail devant elle.

**Rising Action :** Découvre Akili via Facebook → inscription → onboarding "facturation" → connecte Google Sheets → configure le template.

**Climax :** `akili run facturation --month=mai` — 12 secondes, 35 factures générées, envoyées, archivées. Deux jours en 12 secondes.

**Resolution :** Exécution automatique le 1er de chaque mois. 100% des échéances respectées. 12h récupérées.

---

### 3. Samuel Koffi — Développeur, Abidjan

**Situation :** Maintient 4 apps. Déploiements manuels 3-4 fois par semaine. Oublis fréquents → déploiements cassés.

**Opening Scene :** Push un fix critique, oublie de lancer les tests. 23h, client appelle : app cassée.

**Rising Action :** Tombe sur Akili → "Pipeline fiabilisé" → CLI → pipeline en 5 min : pull → test → build → deploy → notify.

**Climax :** Push code → Akili détecte, teste, build, déploie. Test échoue ? Deploy annulé + notification Slack avec log d'erreur.

**Resolution :** 0 déploiements ratés en 3 mois. 4h/semaine gagnées. Nouveau projet freelance.

---

### 4. Kofi Mensah — Admin Plateforme Akili

**Situation :** Technical lead. Surveille la santé plateforme, gère les utilisateurs, suit la croissance.

**Opening Scene :** Lundi matin, dashboard admin. Nouveaux utilisateurs ? Scripts en erreur ? Uptime ?

**Rising Action :** Vue d'un coup d'œil : 23 nouveaux users, 2 scripts en erreur, uptime 99.7%, 1 utilisateur proche du quota.

**Climax :** Clic sur l'user en erreur → log détaillé → email d'aide. User proche du quota → email de suggestion upgrade. 10 minutes.

**Resolution :** Alertes automatiques configurées. Monitoring proactif.

---

### 5. Diane Adeyemi — Nouvelle Visiteuse, Lagos

**Situation :** Content manager, 5 réseaux sociaux pour 3 clients. Copie-colle partout. Sceptique — Zapier était trop compliqué.

**Opening Scene :** Arrive sur la landing page. "Sans une ligne de code." Intéressée mais méfiante.

**Rising Action :** Scrolle → "Comment ça marche" rassure → témoignages convainquent → plan gratuit → clic "Commencer".

**Climax :** Onboarding → "Publication multicanale" → 4 minutes → premier workflow configuré.

**Resolution :** Configuré toute seule. Upgrade Pro la semaine suivante. Recommande à toute l'agence.

---

### Journey Requirements Summary

| Journey | Capacités révélées |
|---------|-------------------|
| **Fatou (Freelance)** | Bibliothèque scripts fichiers, connexion Drive/Slack, planification, onboarding par métier |
| **Aminata (PME)** | Script facturation, connexion Google Sheets, planification cron, archivage, email auto |
| **Samuel (Dev)** | CLI, déclencheurs événementiels (git push), tests auto, notifications, logs détaillés |
| **Kofi (Admin)** | Dashboard admin, monitoring, gestion utilisateurs, alertes, logs système, actions bulk |
| **Diane (Visiteuse)** | Landing convaincante, onboarding rapide, UX zéro-friction, plan gratuit, upgrade fluide |

## Domain-Specific Requirements

### Compliance & Réglementaire

- **RGPD** — traitement conforme des données personnelles (zone francophone + liens EU)
- **Politique Supabase** — hébergement, localisation serveurs
- **CGU** — stockage et exécution de scripts accédant aux données tiers (Drive, Gmail)
- **OAuth scopes** — transparence sur les permissions demandées

### Contraintes Techniques

- **Réseaux instables** — UI optimisée faible bande passante, requêtes légères, retry automatique
- **Devices variés** — smartphones bas de gamme, écrans petits, navigateurs anciens
- **Latence** — serveurs proches de l'Afrique de l'Ouest (Europe via Supabase)
- **Offline-tolerant** — dashboard affiche un état même si la connexion tombe
- **Budget page** — < 300KB initial par page

### Contraintes d'Intégration

- **OAuth Google/GitHub** — authentification principale
- **Google Drive / Sheets / Gmail** — intégrations prioritaires
- **Slack** — notifications pour profils tech/agences
- **Supabase Auth + Realtime** — sessions et temps réel
- **PHP natif** — routage manuel, sécurité manuelle (CSRF, XSS, prepared statements)

## Innovation & Novel Patterns

### Zones d'innovation

| Innovation | Type | Impact |
|-----------|------|--------|
| Automatisation contextualisée pour l'Afrique | Marché | Premier outil pensé nativement pour les contraintes africaines |
| Simplification UX radicale (3 étapes, langage naturel) | Expérience | Supprime la barrière technique excluant 90% des utilisateurs potentiels |
| Pricing adapté (FCFA, plans accessibles) | Business model | Automatisation économiquement viable pour freelances et PME africaines |
| Onboarding par métier (pas par fonctionnalité) | Produit | L'utilisateur pense "je suis graphiste" pas "je veux un workflow trigger" |

### Paysage concurrentiel

| Concurrent | Forces | Faiblesses pour notre cible |
|-----------|--------|---------------------------|
| Zapier | 5000+ intégrations | Complexe, pricing USD élevé, pas de contextualisation |
| Make | Visuel, puissant | Courbe d'apprentissage, pas de support francophone natif |
| n8n | Open-source, flexible | Auto-hébergement requis, très technique |
| IFTTT | Simple | Limité, pas pro, pas de pricing africain |

**Espace libre :** Aucun acteur ne combine simplicité + contextualisation africaine + pricing local + support francophone natif.

### Validation par phases

- **Phase 1 (MVP)** — Taux de complétion onboarding > 70%
- **Phase 2** — Rétention semaine 1 > 60%
- **Phase 3** — Conversion free → pro 5-8%

## Web App Specific Requirements

### Vue d'ensemble technique

SPA React 18 + Vite + React Router. Backend PHP natif + Supabase (PostgreSQL + Auth + Realtime). Pages publiques (SEO) séparées des pages protégées (dashboard, admin).

### Matrice navigateurs

| Navigateur | Version minimum | Priorité |
|-----------|----------------|----------|
| Chrome (Desktop + Android) | 2 dernières versions | Critique |
| Firefox | 2 dernières versions | Haute |
| Safari (iOS + macOS) | 2 dernières versions | Haute |
| Edge | 2 dernières versions | Moyenne |
| UC Browser (Android) | Dernière version | Haute (marché africain) |
| Samsung Internet | 2 dernières versions | Moyenne |

### Design responsive

| Breakpoint | Cible | Approche |
|-----------|-------|----------|
| < 480px | Smartphones petits | Mobile first, navigation simplifiée |
| 480-768px | Smartphones / tablettes | Grilles 1-2 colonnes |
| 768-1024px | Tablettes / laptops | Sidebar rétractable, grilles adaptatives |
| > 1024px | Desktop | Layout complet, sidebar déployée |

- Mobile first CSS, touch targets ≥ 44px
- Sidebar dashboard : icônes sur tablette, hamburger sur mobile
- Tableaux : scroll horizontal sur mobile

### Cibles de performance

| Métrique | Cible | Justification |
|---------|-------|---------------|
| First Contentful Paint | < 1.5s | Connexions 3G/4G instables |
| Largest Contentful Paint | < 2.5s | Seuil Google "Good" |
| Total Blocking Time | < 200ms | Devices bas de gamme |
| Bundle initial (gzipped) | < 100KB | Budget réseau serré |
| Images | WebP + lazy loading | Bande passante |
| Fonts | `display: swap` + subset | Éviter le FOIT |

### Stratégie SEO

| Page | SEO | Approche |
|------|-----|----------|
| Landing `/` | Critique | Meta tags, Open Graph, structured data |
| Services `/services` | Important | Meta par service, schema.org |
| Détail service `/services/:slug` | Important | Titre/description dynamiques (Supabase) |
| Pricing `/pricing` | Important | Structured data pricing |
| Docs `/docs` | Important | Indexation par section, sitemap |
| Contact `/contact` | Moyen | Meta tags basiques |
| Login, Dashboard, Admin, Onboarding | Non | `noindex, nofollow` |

MVP : Meta tags statiques + Open Graph. SSR reporté post-MVP.

### Accessibilité (WCAG AA)

- Contraste ≥ 4.5:1 texte, ≥ 3:1 UI
- Navigation clavier avec focus visible
- ARIA labels sur inputs, boutons, éléments interactifs
- Landmarks (`nav`, `main`, `aside`), headings hiérarchiques
- `prefers-reduced-motion` respecté
- Erreurs formulaires claires via `aria-describedby`

### Temps réel

| Fonctionnalité | Canal | Technologie |
|---------------|-------|-------------|
| Statut workflows | `workflows:{user_id}` | Supabase Realtime |
| Notifications exécution | `notifications:{user_id}` | Supabase Realtime |
| Stats admin | `admin:stats` | Supabase Realtime |

### Implémentation

- **Code splitting :** Routes lazy-loaded (`React.lazy` + `Suspense`)
- **Auth guard :** Composant wrapper, redirect `/login`
- **State :** React Context (pas de Redux)
- **API :** Fetch natif + wrapper PHP (pas d'Axios)
- **Images :** WebP, compression, `loading="lazy"`
- **Caching :** Service Worker post-MVP

## Project Scoping & Phased Development

### MVP Strategy

**Approche :** Problem-solving MVP — prouver que l'automatisation sans code fonctionne pour la cible africaine.
**Ressources :** 1 dev fullstack (React + PHP) + 1 designer.
**Journeys MVP :** Diane (visiteuse → inscription), Aminata (facturation), Fatou (fichiers).

### Phase 1 — MVP

| Fonctionnalité | Justification |
|---------------|---------------|
| Landing page (dark mode, 10 sections) | Convaincre en 5s |
| Login/Inscription (OAuth + email) | Porte d'entrée |
| Onboarding wizard (5 étapes, plein écran) | Time-to-first-automation ≤ 5 min |
| Dashboard utilisateur (stats, scripts récents) | Voir ses automatisations |
| Bibliothèque de scripts (10-15) | Valeur immédiate |
| Exécution manuelle | Cœur du produit |
| Logs d'exécution | Traçabilité |
| Page Pricing (Gratuit + Pro) | Monétisation jour 1 |
| Page Docs | Support self-service |
| Page Contact (formulaire + email PHP) | Canal support minimum |

### Phase 2 — Growth

| Fonctionnalité | Dépendance Phase 1 |
|---------------|-------------------|
| Planification cron/événements | Scripts fonctionnels |
| Dashboard widgets modulables (drag & drop) | Dashboard de base |
| Intégrations complètes (Drive, Gmail, Slack, Notion) | Auth OAuth |
| Dashboard admin | Users en base |
| Scripts personnalisés | Bibliothèque existante |
| Plan Équipe (multi-users, rôles) | Auth + billing |
| API REST + Webhooks | Backend stable |
| Page Services + Détail service dynamique | Supabase content |
| Command bar (Cmd+K) | Dashboard |

### Phase 3 — Vision

| Fonctionnalité | Horizon |
|---------------|---------|
| IA : langage naturel → script auto-généré | 12-18 mois |
| Marketplace de scripts | Communauté établie |
| Mobile app | Base users solide |
| Expansion anglophone (Nigeria, Ghana, Kenya) | Product-market fit confirmé |
| Automation-as-a-Service managé | Équipe support en place |
| Paiements locaux (Mobile Money, Wave) | Partenariats locaux |

### Risques & Mitigations

| Catégorie | Risque | Mitigation |
|-----------|--------|-----------|
| Technique | PHP natif sans framework | Architecture modulaire, classes séparées, tests rigoureux |
| Technique | Supabase dependency | Abstraction layer, pas de lock-in |
| Technique | Performance réseaux lents | Bundle < 100KB, lazy loading, WebP |
| Technique | Sécurité PHP natif | Prepared statements, sanitization, CSRF |
| Technique | Tokens OAuth expirés | Refresh automatique + notification |
| Technique | Perte connexion pendant exécution | Queue de jobs, retry, status persistant |
| Marché | Adoption lente | 3 cas d'usage ultra-concrets, mesurer rétention semaine 1 |
| Marché | Pricing inadapté | Plan gratuit généreux, ajuster Pro selon retours |
| Marché | Marché pas prêt pour l'automatisation | Commencer par concret (facturation, fichiers), pas abstrait |
| Marché | Concurrents s'adaptent | First-mover + compréhension native + communauté locale |
| Ressources | Équipe réduite (1 dev) | Scope MVP minimal |
| Ressources | Encore moins de ressources | Ultra-MVP : Landing + Login + 5 scripts + exécution |
| Domaine | Abus plan gratuit | Rate limiting strict, quota exécutions/jour |
| Domaine | Données sensibles dans scripts | Variables d'environnement chiffrées |

## Functional Requirements

### Identité & Authentification

- **FR1 :** Un visiteur peut créer un compte via email et mot de passe
- **FR2 :** Un visiteur peut créer un compte via OAuth Google
- **FR3 :** Un visiteur peut créer un compte via OAuth GitHub
- **FR4 :** Un utilisateur peut se connecter avec ses identifiants existants
- **FR5 :** Un utilisateur peut réinitialiser son mot de passe par email
- **FR6 :** Un utilisateur peut maintenir sa session active entre les visites
- **FR7 :** Un utilisateur peut se déconnecter

### Onboarding

- **FR8 :** Un nouvel utilisateur est redirigé vers un wizard d'onboarding après inscription
- **FR9 :** L'utilisateur peut renseigner son profil (prénom, rôle, secteur d'activité)
- **FR10 :** L'utilisateur peut sélectionner ce qu'il souhaite automatiser parmi des catégories prédéfinies
- **FR11 :** L'utilisateur peut connecter ses outils tiers pendant l'onboarding (optionnel, skip possible)
- **FR12 :** L'utilisateur peut exécuter un premier script guidé pendant l'onboarding
- **FR13 :** L'utilisateur peut passer n'importe quelle étape de l'onboarding

### Gestion des Scripts

- **FR14 :** Un utilisateur peut parcourir la bibliothèque de scripts disponibles
- **FR15 :** Un utilisateur peut filtrer les scripts par catégorie (facturation, fichiers, emails, rapports, stockage)
- **FR16 :** Un utilisateur peut voir le détail d'un script (description, paramètres requis, catégorie)
- **FR17 :** Un utilisateur peut configurer les paramètres d'un script avant exécution
- **FR18 :** Un utilisateur peut lancer l'exécution manuelle d'un script
- **FR19 :** Un utilisateur peut voir le résultat d'une exécution (succès/échec, durée, output)

### Dashboard Utilisateur

- **FR20 :** Un utilisateur peut voir ses statistiques personnelles (tâches exécutées, heures économisées, scripts actifs)
- **FR21 :** Un utilisateur peut voir la liste de ses scripts récemment exécutés
- **FR22 :** Un utilisateur peut accéder rapidement à l'exécution d'un script depuis le dashboard
- **FR23 :** Un utilisateur peut consulter l'historique complet de ses exécutions (logs)
- **FR24 :** Un utilisateur peut filtrer ses logs par script, statut et date
- **FR25 :** Un utilisateur peut rechercher dans l'application via une command bar universelle (Phase 2)

### Gestion du Compte

- **FR26 :** Un utilisateur peut voir et modifier ses informations de profil
- **FR27 :** Un utilisateur peut voir son plan actuel et son usage (quota)
- **FR28 :** Un utilisateur peut upgrader son plan (Gratuit → Pro)
- **FR29 :** Un utilisateur peut supprimer son compte

### Pages Publiques

- **FR30 :** Un visiteur peut comprendre la proposition de valeur d'Akili en moins de 5 secondes sur la landing page
- **FR31 :** Un visiteur peut voir les cas d'usage et témoignages sur la landing page
- **FR32 :** Un visiteur peut comparer les plans tarifaires sur la page pricing
- **FR33 :** Un visiteur peut consulter la documentation produit sur la page docs
- **FR34 :** Un visiteur peut naviguer entre les sections de documentation via une sidebar
- **FR35 :** Un visiteur peut rechercher dans la documentation
- **FR36 :** Un visiteur peut envoyer un message via le formulaire de contact
- **FR37 :** Le système envoie une notification email à l'équipe quand un formulaire de contact est soumis

### Notifications

- **FR38 :** Un utilisateur reçoit une notification email après chaque exécution de script (succès ou échec)
- **FR39 :** Un utilisateur peut configurer ses préférences de notification

### Sécurité & Quotas

- **FR40 :** Le système limite le nombre d'exécutions par jour selon le plan de l'utilisateur
- **FR41 :** Le système notifie l'utilisateur quand il atteint 80% de son quota
- **FR42 :** Le système bloque les exécutions quand le quota est dépassé avec un message clair

### Administration (Phase 2)

- **FR43 :** Un admin peut voir les statistiques globales de la plateforme (utilisateurs, exécutions, revenus)
- **FR44 :** Un admin peut lister, rechercher et filtrer les utilisateurs
- **FR45 :** Un admin peut suspendre ou réactiver un compte utilisateur
- **FR46 :** Un admin peut voir les logs système et les erreurs
- **FR47 :** Un admin peut configurer des alertes automatiques (uptime, erreurs, quotas)

## Non-Functional Requirements

### Performance

- **NFR1 :** Pages publiques : First Contentful Paint < 1.5s sur 3G
- **NFR2 :** Actions dashboard : réponse < 300ms
- **NFR3 :** Exécution script : résultat visible < 5s
- **NFR4 :** Bundle JS initial gzipped < 100KB
- **NFR5 :** Images en WebP avec lazy loading
- **NFR6 :** Landing page Lighthouse Performance ≥ 85

### Sécurité

- **NFR7 :** HTTPS (TLS 1.2+) sur toutes les communications
- **NFR8 :** Mots de passe hashés bcrypt (cost ≥ 10)
- **NFR9 :** Tokens OAuth stockés côté serveur uniquement
- **NFR10 :** Prepared statements sur toutes les requêtes backend
- **NFR11 :** Tokens CSRF sur tous les formulaires
- **NFR12 :** Sanitization côté serveur (anti-XSS)
- **NFR13 :** Secrets jamais en clair dans le code
- **NFR14 :** Sessions expirent après 7 jours d'inactivité
- **NFR15 :** Conformité RGPD (consentement, droit à l'oubli, export données)

### Scalabilité

- **NFR16 :** 500 utilisateurs concurrents au lancement sans dégradation
- **NFR17 :** Backend PHP stateless (scaling horizontal possible)
- **NFR18 :** Supabase supporte 10 000 utilisateurs sans changement d'architecture
- **NFR19 :** 1 000 exécutions de scripts par heure

### Accessibilité

- **NFR20 :** WCAG 2.1 niveau AA sur toutes les pages
- **NFR21 :** Contraste texte/fond ≥ 4.5:1
- **NFR22 :** Navigation clavier complète avec focus visible
- **NFR23 :** `prefers-reduced-motion` respecté
- **NFR24 :** Labels accessibles et erreurs via `aria-describedby`

### Intégrations

- **NFR25 :** OAuth Google/GitHub en < 3 clics
- **NFR26 :** Refresh automatique des tokens tiers avant expiration
- **NFR27 :** Graceful degradation si intégration tierce échoue
- **NFR28 :** Retry automatique API tierces (3 tentatives, backoff exponentiel)

### Fiabilité

- **NFR29 :** Uptime 99.5% (< 3.6h indisponibilité/mois)
- **NFR30 :** Zero data loss en cas de crash
- **NFR31 :** Scripts interrompus par perte de connexion repris automatiquement
- **NFR32 :** Backups base de données quotidiens
