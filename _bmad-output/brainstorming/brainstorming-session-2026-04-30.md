---
stepsCompleted: [1, 2]
inputDocuments: [brief_creatif_akili.docx]
session_topic: 'Direction artistique + architecture des pages Akili'
session_goals: 'Fixer la DA dark mode et cartographier toutes les pages/sections'
selected_approach: 'Progressive flow'
techniques_used: [cartographie, moodboard, contraintes créatives]
ideas_generated: [structure 10 pages, direction Cotonou Digital, système motifs géométriques]
---

# Session Brainstorming — Akili Platform

**Date :** 2026-04-30
**Participant :** TheSoulReaper
**Facilitateur :** Claude

---

## 1. Décisions techniques

| Décision | Choix |
|----------|-------|
| Theme | Dark mode first |
| Dashboard user | Widgets modulables (drag & drop) |
| Détail service | Données depuis Supabase (template dynamique) |
| Contact | Formulaire + notification email via PHP |
| Onboarding | Plein écran, 5 étapes, transitions slide |
| Backend | PHP natif + Supabase (BDD) |
| Frontend | React 18 + Vite + React Router |

---

## 2. Palette définitive

```css
--blue:     #29ABE2;   /* Bleu logo */
--accent:   #2563EB;   /* Primary */
--accent-2: #06B6D4;   /* Accent secondaire (cyan) */
--dark:     #0F172A;   /* Fond principal */
--light:    #F8FAFC;   /* Texte / éléments clairs */
```

**Pas de rose, pas de jaune.** Uniquement bleu/cyan sur fond sombre.

---

## 3. Architecture des pages (10 pages)

### Pages publiques (sans auth)

| Page | Route | Sections |
|------|-------|----------|
| Landing | `/` | Hero, Manifeste, Compteur live, Avant/Après, Témoignages, 3 Piliers, Comment ça marche, Cas d'usage, Intégrations, CTA final |
| Services | `/services` | Hero, Stats band, Grille 9 services, Highlights, Résumé, CTA |
| Détail Service | `/services/:slug` | Hero service, Problème/Solution, Fonctionnalités, Cas concret, Terminal démo, Tarif associé, CTA |
| Pricing | `/pricing` | Hero + toggle, Comparaison plans, FAQ, CTA |
| Docs | `/docs` | Sidebar + 14 articles |
| Contact | `/contact` | Hero, Formulaire enrichi, Infos contact, Map/Localisation, FAQ rapide, Réseaux sociaux |
| Login | `/login` | Brand side + Formulaire OAuth |

### Pages protégées (post-auth)

| Page | Route | Layout |
|------|-------|--------|
| Onboarding Wizard | `/onboarding` | Plein écran, 5 étapes |
| Dashboard Utilisateur | `/dashboard` | Sidebar premium + widgets modulables |
| Dashboard Admin | `/admin` | Layout séparé, gestion complète |

### Routes dashboard utilisateur

```
/dashboard
/dashboard/scripts
/dashboard/planifications
/dashboard/integrations
/dashboard/logs
/dashboard/parametres
```

### Routes dashboard admin

```
/admin
/admin/utilisateurs
/admin/abonnements
/admin/scripts
/admin/logs
/admin/contenu
/admin/parametres
```

---

## 4. Direction artistique : "Cotonou Digital"

### Manifeste visuel

> Akili vient de la nuit digitale de Cotonou — là où les écrans brillent dans les ateliers, où la tech se mélange à la vie. Pas de froideur Silicon Valley. Ici le design respire, les formes dansent, et la géométrie raconte une histoire.

### Piliers

| Pilier | Principe | Traduction |
|--------|----------|-----------|
| Chaleur | Le dark n'est pas froid | Coins arrondis généreux (12-16px), espacements aérés, illustrations humaines |
| Géométrie vivante | Les motifs ne décorent pas, ils vivent | Patterns animés subtilement, blocs qui se composent/décomposent |
| Humanité | La tech sert les gens | Avatars, personnages stylisés, ton conversationnel |
| Rythme | L'énergie de Cotonou | Asymétrie maîtrisée, layouts décalés, éléments qui pulsent |

### Motifs géométriques

Basés sur les blocs rectangulaires du logo Akili :
- Grille de blocs (fond sections) : 3-5% opacité
- Compositions animées (loader, transitions) : 100% en accent
- Séparateurs entre sections : 10-15% opacité
- Décor coins de cartes : 8% opacité
- Pattern sidebar : 3% opacité

### Surfaces et profondeur

```css
Niveau 0 (fond)    : #0F172A
Niveau 1 (cartes)  : #1E293B
Niveau 2 (hover)   : #334155
Niveau 3 (modals)  : #1E293B + border rgba(255,255,255,0.06)
```

### Typographie dark mode

```css
--text:   #F8FAFC   /* 100% — titres, texte principal */
--text-2: #94A3B8   /* 60% — sous-titres, descriptions */
--text-3: #475569   /* 40% — labels, placeholders */
```

- Space Grotesk : titres
- Inter : body
- JetBrains Mono : code/terminaux (en cyan #06B6D4)

### Coins et espaces

```css
--r-sm: 6px;    /* inputs, badges */
--r-md: 12px;   /* boutons, petites cartes */
--r-lg: 16px;   /* cartes, widgets */
--r-xl: 24px;   /* modals, conteneurs principaux */
```

Sections : 96-120px de padding vertical
Cartes : 24-32px de padding interne

### Bordures

```css
border: 1px solid rgba(248,250,252,0.06);  /* repos */
border: 1px solid rgba(41,171,226,0.2);    /* hover */
border: 1px solid #29ABE2;                 /* focus/actif */
```

### Effets lumineux

| Effet | Usage |
|-------|-------|
| Glow bleu | Boutons primary, éléments actifs : `box-shadow: 0 0 20px rgba(37,99,235,0.3)` |
| Ligne cyan pulsante | Workflows actifs, connexion réussie |
| Gradient mesh | Hero backgrounds (formes géométriques angulaires) |
| Dot grid | Fond de sections (3% opacité) |
| Accent underline | Links hover, nav active (2px en #29ABE2) |

### Composants

```css
/* Boutons */
Primary  : bg #2563EB, text white, glow hover, border-radius 12px
Secondary: bg transparent, border 1px #29ABE2, text #29ABE2
Ghost    : bg rgba(255,255,255,0.05), text #F8FAFC

/* Inputs */
bg: #1E293B
border: 1px solid rgba(248,250,252,0.1)
focus: border #29ABE2 + glow subtil
text: #F8FAFC
placeholder: #475569

/* Cartes */
bg: #1E293B
border: 1px solid rgba(248,250,252,0.06)
hover: border rgba(37,99,235,0.3) + translate-y -2px
```

### Animations

| Élément | Animation | Sens |
|---------|-----------|------|
| Hero formes géométriques | Float lent | Vie, respiration |
| Cartes widgets | Scale 1.02 + glow on hover | Réactivité |
| Bouton primary | Ripple + glow expansion au clic | Confirmation |
| Sidebar nav | Indicator slide | Fluidité |
| Terminal lines | Apparition séquentielle (typing) | Démonstration |
| Compteurs | Ease-out counting | Impact |
| Page transitions | Fade + slide (200ms) | Continuité |
| Onboarding steps | Slide horizontal | Progression |

### Illustrations

- Personnages : silhouettes géométriques (tête = cercle, corps = rectangles)
- Style : trait fin (1.5px) en #F8FAFC, remplissage #1E293B, accent bleu sur un élément
- Mouvement : animation idle (respiration, clignotement d'écran)
- Scènes : freelance devant son écran, équipe autour d'un tableau, café pendant qu'Akili travaille

### Signature Akili — Blocs de transition

Entre chaque section, composition de 3-5 petits rectangles en bleu/cyan à différentes opacités.
Chaque page a sa propre composition unique.

---

## 5. Dashboard Utilisateur — Widgets

| Widget | Contenu | Taille |
|--------|---------|--------|
| Stats perso | Tâches exécutées, heures économisées, scripts actifs | 1×1 |
| Workflows actifs | Cartes avec pulse animé (statut temps réel) | 2×1 |
| Activité récente | Timeline visuelle des exécutions | 1×2 |
| Quick run | Lancer un script en 1 clic | 1×1 |
| Intégrations | État des connexions (vert/rouge) | 1×1 |
| Prochaines exécutions | Calendrier des planifications à venir | 2×1 |
| Command bar (Cmd+K) | Recherche universelle | Global |

---

## 6. Onboarding Wizard — 5 étapes

| Étape | Titre | Contenu |
|-------|-------|---------|
| 1 | Qui es-tu ? | Prénom, rôle, secteur d'activité |
| 2 | Ton objectif | Sélection visuelle de ce qu'on veut automatiser |
| 3 | Connecte tes outils | Grille d'intégrations (optionnel, skip possible) |
| 4 | Ton premier script | Script recommandé + mini-démo interactive |
| 5 | C'est parti ! | Récap + animation de célébration + accès dashboard |

---

## 7. Ce qu'on veut vs ce qu'on évite

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
