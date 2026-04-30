import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Download, Zap, FileCode, Calendar, Plug,
  Users, Terminal, Globe, Webhook, Settings2, Layers,
  HelpCircle, List, Search, Copy, Check, ChevronRight, ChevronLeft,
} from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

/* ── Sections ─────────────────────────────────────────── */
const SECTIONS = [
  { id: 'introduction',  label: 'Introduction',             Icon: BookOpen,   group: 'Démarrage'  },
  { id: 'installation',  label: 'Installation',             Icon: Download,   group: 'Démarrage'  },
  { id: 'quickstart',    label: 'Démarrage rapide',         Icon: Zap,        group: 'Démarrage'  },
  { id: 'scripts',       label: 'Scripts & bibliothèque',   Icon: FileCode,   group: 'Guides'     },
  { id: 'planification', label: 'Planification',            Icon: Calendar,   group: 'Guides'     },
  { id: 'integrations',  label: 'Intégrations',             Icon: Plug,       group: 'Guides'     },
  { id: 'equipe',        label: 'Équipe & collaboration',   Icon: Users,      group: 'Guides'     },
  { id: 'cli',           label: 'CLI — Commandes',          Icon: Terminal,   group: 'Référence'  },
  { id: 'api',           label: 'API REST',                 Icon: Globe,      group: 'Référence'  },
  { id: 'webhooks',      label: 'Webhooks',                 Icon: Webhook,    group: 'Référence'  },
  { id: 'env',           label: 'Variables d\'environnement', Icon: Settings2, group: 'Référence' },
  { id: 'exemples',      label: 'Exemples de workflows',    Icon: Layers,     group: 'Ressources' },
  { id: 'faq',           label: 'FAQ & dépannage',          Icon: HelpCircle, group: 'Ressources' },
  { id: 'changelog',     label: 'Changelog',                Icon: List,       group: 'Ressources' },
]

/* ── Copy button ──────────────────────────────────────── */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button className="copy-btn" onClick={handle} title="Copier">
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copié !' : 'Copier'}
    </button>
  )
}

/* ── Code block ───────────────────────────────────────── */
function Code({ lang, children }) {
  return (
    <div className="docs-code">
      <div className="docs-code-bar">
        <span>{lang}</span>
        <CopyBtn text={children} />
      </div>
      <pre><code>{children}</code></pre>
    </div>
  )
}

/* ── Callout ──────────────────────────────────────────── */
function Callout({ type = 'info', children }) {
  const styles = {
    info:    { bg: 'var(--accent)',  label: 'Note' },
    warning: { bg: '#F59E0B',       label: 'Attention' },
    tip:     { bg: '#10B981',       label: 'Astuce' },
  }
  const s = styles[type]
  return (
    <div className="docs-callout" style={{ '--callout-color': s.bg }}>
      <strong>{s.label} —</strong> {children}
    </div>
  )
}

/* ── Table ────────────────────────────────────────────── */
function Table({ heads, rows }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead><tr>{heads.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  )
}

/* ── Article wrapper ──────────────────────────────────── */
function Article({ id, title, lead, children }) {
  const idx = SECTIONS.findIndex(s => s.id === id)
  const prev = SECTIONS[idx - 1]
  const next = SECTIONS[idx + 1]

  return (
    <article className="docs-article">
      <div className="docs-breadcrumb">
        <span>Akili</span>
        <ChevronRight size={13} />
        <span>{SECTIONS[idx]?.group}</span>
        <ChevronRight size={13} />
        <span>{title}</span>
      </div>
      <h1>{title}</h1>
      {lead && <p className="docs-lead">{lead}</p>}
      {children}
      <div className="docs-pagination">
        {prev
          ? <button className="docs-page-btn" data-dir="prev" onClick={() => document.dispatchEvent(new CustomEvent('docs-nav', { detail: prev.id }))}>
              <ChevronLeft size={15} /> {prev.label}
            </button>
          : <span />
        }
        {next &&
          <button className="docs-page-btn" data-dir="next" onClick={() => document.dispatchEvent(new CustomEvent('docs-nav', { detail: next.id }))}>
            {next.label} <ChevronRight size={15} />
          </button>
        }
      </div>
    </article>
  )
}

/* ── Content map ──────────────────────────────────────── */
const CONTENT = {

  introduction: (
    <Article id="introduction" title="Bienvenue sur Akili"
      lead="Akili est une plateforme d'automatisation de tâches répétitives. Elle te permet d'exécuter des scripts, planifier des workflows et connecter tes outils — sans écrire une seule ligne de code.">
      <h2>Qu'est-ce qu'Akili ?</h2>
      <p>Akili se compose de trois éléments principaux :</p>
      <ul>
        <li><strong>La bibliothèque</strong> — plus de 50 scripts prêts à l'emploi (facturation, fichiers, emails, rapports…)</li>
        <li><strong>Le CLI</strong> — une interface terminal pour exécuter et planifier des scripts</li>
        <li><strong>Les intégrations</strong> — connecteurs natifs vers Drive, Gmail, Notion, Slack, S3 et plus</li>
      </ul>
      <h2>Architecture</h2>
      <p>Quand tu lances un script avec Akili, voici ce qui se passe :</p>
      <Code lang="texte">{`Ton terminal / API
       ↓
  CLI Akili
       ↓
  Moteur d'exécution (cloud)
       ↓
  Intégrations tierces  →  Résultat (fichier, email, log…)`}</Code>
      <h2>Pour qui ?</h2>
      <div className="docs-cards">
        <div className="docs-card"><div className="docs-card-title">Freelances</div><p>Automatise la facturation, les relances clients et les sauvegardes de projets.</p></div>
        <div className="docs-card"><div className="docs-card-title">PME & équipes</div><p>Standardise les workflows : onboarding, rapports hebdomadaires, exports comptables.</p></div>
        <div className="docs-card"><div className="docs-card-title">Développeurs</div><p>Intègre Akili dans tes pipelines CI/CD via l'API REST ou les webhooks.</p></div>
      </div>
      <Callout type="tip">Nouveau sur Akili ? Commence par le <strong>Démarrage rapide</strong> — ton premier workflow sera opérationnel en 5 minutes.</Callout>
    </Article>
  ),

  installation: (
    <Article id="installation" title="Installation"
      lead="Le CLI Akili s'installe en une commande. Compatible Linux, macOS et Windows (via WSL ou PowerShell).">
      <h2>Prérequis</h2>
      <ul>
        <li>Node.js ≥ 18 (<a href="https://nodejs.org" target="_blank" rel="noreferrer">nodejs.org</a>)</li>
        <li>npm ≥ 9 ou yarn ≥ 1.22</li>
        <li>Un compte Akili — <Link to="/login">créer un compte gratuit</Link></li>
      </ul>
      <h2>Installation globale</h2>
      <Code lang="bash">{`npm install -g @akili/cli`}</Code>
      <Code lang="bash">{`# Ou avec yarn
yarn global add @akili/cli`}</Code>
      <h2>Vérifier l'installation</h2>
      <Code lang="bash">{`akili --version
# → akili/1.0.0 linux-x64 node-v20.11.0

akili --help
# → Liste toutes les commandes disponibles`}</Code>
      <h2>Authentification</h2>
      <p>Connecte ton CLI à ton compte Akili :</p>
      <Code lang="bash">{`akili login
# → Ouvre le navigateur pour l'authentification OAuth
# → ✓ Connecté en tant que toi@example.com`}</Code>
      <p>Pour te déconnecter :</p>
      <Code lang="bash">{`akili logout`}</Code>
      <Callout>Ton token est stocké dans <code>~/.akili/config.json</code>. Ne le partage jamais et ne le commite pas dans un dépôt Git.</Callout>
      <h2>Mise à jour</h2>
      <Code lang="bash">{`npm update -g @akili/cli`}</Code>
    </Article>
  ),

  quickstart: (
    <Article id="quickstart" title="Démarrage rapide"
      lead="Suis ce tutoriel pas-à-pas pour exécuter ton premier script automatisé en moins de 5 minutes.">
      <h2>Étape 1 — Installe le CLI</h2>
      <Code lang="bash">{`npm install -g @akili/cli && akili login`}</Code>
      <h2>Étape 2 — Explore la bibliothèque</h2>
      <Code lang="bash">{`akili list
# ┌─────────────────────┬──────────────┬──────────┐
# │ Script              │ Catégorie    │ Statut   │
# ├─────────────────────┼──────────────┼──────────┤
# │ facture-pdf         │ Facturation  │ stable   │
# │ renommage-lot       │ Fichiers     │ stable   │
# │ backup-drive        │ Stockage     │ stable   │
# │ rapport-csv         │ Rapports     │ stable   │
# └─────────────────────┴──────────────┴──────────┘`}</Code>
      <h2>Étape 3 — Lance ton premier script</h2>
      <Code lang="bash">{`akili run facture-pdf \\
  --client "Acme Corp" \\
  --montant 150000 \\
  --devise FCFA

# → ✓ facture_acme_corp_mai_2026.pdf généré en 1.4s
# → Fichier disponible dans ~/akili-output/`}</Code>
      <h2>Étape 4 — Consulte les journaux</h2>
      <Code lang="bash">{`akili logs --last 5
# ✓ facture-pdf     1.4s   il y a 1 min
# ✓ backup-drive    12s    hier 00:00`}</Code>
      <h2>Étape 5 — Planifie l'exécution</h2>
      <Code lang="bash">{`# Exécuter automatiquement le 1er de chaque mois
akili plan facture-pdf \\
  --cron "0 8 1 * *" \\
  --client "Acme Corp" \\
  --montant 150000

# → ✓ Planification enregistrée
# → Prochaine exécution : 01/06/2026 à 08:00`}</Code>
      <Callout type="tip">Tu peux aussi connecter Google Drive pour envoyer les fichiers générés directement dans un dossier. Voir la section <strong>Intégrations</strong>.</Callout>
    </Article>
  ),

  scripts: (
    <Article id="scripts" title="Scripts & bibliothèque"
      lead="La bibliothèque Akili contient plus de 50 scripts prêts à l'emploi. Tu peux aussi créer les tiens.">
      <h2>Lister et rechercher</h2>
      <Code lang="bash">{`# Tous les scripts
akili list

# Filtrer par catégorie
akili list --category facturation
akili list --category fichiers
akili list --category emails

# Recherche par mot-clé
akili search "pdf"
akili search "backup"`}</Code>
      <h2>Détail d'un script</h2>
      <Code lang="bash">{`akili info facture-pdf

# → Nom        : facture-pdf
# → Catégorie  : Facturation
# → Version    : 2.1.0
# → Paramètres : --client (requis), --montant (requis), --devise (défaut: FCFA)
# → Description: Génère une facture PDF professionnelle`}</Code>
      <h2>Exécuter avec options</h2>
      <Code lang="bash">{`# Paramètres requis
akili run facture-pdf --client "Nom Client" --montant 75000

# Avec options avancées
akili run facture-pdf \\
  --client "Nom Client" \\
  --montant 75000 \\
  --devise EUR \\
  --output ~/Documents/Factures \\
  --no-open`}</Code>
      <h2>Créer un script personnalisé</h2>
      <Code lang="bash">{`# Initialiser un nouveau script
akili script:new mon-script

# Structure générée :
# mon-script/
# ├── index.js      ← logique principale
# ├── schema.json   ← définition des paramètres
# └── akili.config.json`}</Code>
      <Code lang="javascript">{`// index.js — exemple minimal
export default async function run({ params, integrations }) {
  const { client, montant } = params
  const drive = integrations.googleDrive

  // Ta logique ici
  const fichier = await genererFichier(client, montant)
  await drive.upload(fichier, '/Factures')

  return { success: true, path: fichier }
}`}</Code>
      <Code lang="bash">{`# Publier dans ta bibliothèque privée
akili script:publish mon-script`}</Code>
      <Table
        heads={['Catégorie', 'Scripts disponibles']}
        rows={[
          ['Facturation', 'facture-pdf, facture-relance, devis-auto, export-compta'],
          ['Fichiers', 'renommage-lot, compression-images, conversion-pdf, tri-dossiers'],
          ['Emails', 'reponse-auto, campagne-relance, digest-hebdo'],
          ['Rapports', 'rapport-csv, rapport-sheets, synthese-activite'],
          ['Stockage', 'backup-drive, backup-s3, sync-dossiers'],
        ]}
      />
    </Article>
  ),

  planification: (
    <Article id="planification" title="Planification"
      lead="Planifie tes scripts pour qu'ils s'exécutent automatiquement selon un calendrier ou un déclencheur événementiel.">
      <h2>Planification par fréquence</h2>
      <Code lang="bash">{`# Chaque jour à 08h00
akili plan rapport-quotidien --every "day at 08:00"

# Chaque lundi matin
akili plan rapport-hebdo --every "monday at 09:00"

# Toutes les 2 heures
akili plan backup-drive --every "2h"

# Chaque 1er du mois
akili plan facture-mensuelle --every "1st of month at 08:00"`}</Code>
      <h2>Expressions cron</h2>
      <p>Pour un contrôle précis, utilise des expressions cron standard :</p>
      <Code lang="bash">{`# Format : minute heure jour-du-mois mois jour-de-semaine
akili plan facture-mensuelle --cron "0 8 1 * *"
#                                    │ │ │ │ └─ tous les jours de semaine
#                                    │ │ │ └─── tous les mois
#                                    │ │ └───── le 1er du mois
#                                    │ └─────── à 08h
#                                    └───────── à 0 minute`}</Code>
      <Table
        heads={['Expression', 'Signification']}
        rows={[
          ['0 8 * * 1', 'Chaque lundi à 08h00'],
          ['0 0 * * *', 'Chaque jour à minuit'],
          ['0 8 1 * *', 'Le 1er de chaque mois à 08h'],
          ['*/30 * * * *', 'Toutes les 30 minutes'],
          ['0 9 * * 1-5', 'Du lundi au vendredi à 09h'],
        ]}
      />
      <h2>Déclencheurs sur événement</h2>
      <Code lang="bash">{`# Nouveau fichier dans un dossier Drive
akili plan traitement-pdf \\
  --on "drive:new-file" \\
  --folder "/Factures entrants"

# Réception d'un email
akili plan reponse-auto \\
  --on "gmail:new-email" \\
  --from "client@example.com" \\
  --subject-contains "devis"

# Webhook entrant (voir section Webhooks)
akili plan mon-script --on "webhook:received" --endpoint /trigger`}</Code>
      <h2>Gestion des erreurs et relances</h2>
      <Code lang="bash">{`# Configurer les relances automatiques
akili plan mon-script \\
  --cron "0 8 * * *" \\
  --retry 3 \\
  --retry-delay 5m \\
  --notify-on-failure email`}</Code>
      <h2>Gérer les workflows actifs</h2>
      <Code lang="bash">{`akili status --all          # Voir tous les workflows
akili pause rapport-hebdo   # Suspendre
akili resume rapport-hebdo  # Reprendre
akili stop rapport-hebdo    # Supprimer définitivement`}</Code>
      <Callout type="warning">La planification est disponible à partir du plan <strong>Pro</strong>. Le plan Gratuit permet uniquement l'exécution manuelle.</Callout>
    </Article>
  ),

  integrations: (
    <Article id="integrations" title="Intégrations"
      lead="Connecte Akili à tes outils existants. Chaque intégration s'authentifie une seule fois et est ensuite disponible dans tous tes scripts.">
      <h2>Google Drive</h2>
      <Code lang="bash">{`akili connect google-drive
# → Ouvre l'authentification OAuth2 dans le navigateur
# → ✓ Google Drive connecté : toi@gmail.com`}</Code>
      <Code lang="bash">{`# Utilisation dans un script
akili run backup-drive --source ~/Documents --dest "/Sauvegardes/2026"`}</Code>
      <h2>Gmail</h2>
      <Code lang="bash">{`akili connect gmail
# → ✓ Gmail connecté : toi@gmail.com`}</Code>
      <Code lang="bash">{`# Envoyer un email depuis un script
akili run envoyer-rapport \\
  --destinataire equipe@pme.bj \\
  --sujet "Rapport hebdomadaire" \\
  --piece-jointe rapport.pdf`}</Code>
      <h2>Notion</h2>
      <Code lang="bash">{`# Crée une intégration sur notion.so/my-integrations
akili connect notion --token secret_xxxxxxxxxxxxxxxx`}</Code>
      <h2>Slack</h2>
      <Code lang="bash">{`akili connect slack
# → Autorise l'application Akili dans ton workspace
# → ✓ Slack connecté : workspace "MonEntreprise"`}</Code>
      <h2>Amazon S3</h2>
      <Code lang="bash">{`akili connect s3 \\
  --access-key AKIAXXXXXXXXXXXXXXXX \\
  --secret-key xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \\
  --region eu-west-1 \\
  --bucket mon-bucket`}</Code>
      <h2>Toutes les intégrations</h2>
      <Table
        heads={['Intégration', 'Commande', 'Événements', 'Plan']}
        rows={[
          ['Google Drive', 'akili connect google-drive', 'new-file, new-folder', 'Pro+'],
          ['Gmail', 'akili connect gmail', 'new-email', 'Pro+'],
          ['Slack', 'akili connect slack', '—', 'Pro+'],
          ['Notion', 'akili connect notion --token ...', '—', 'Pro+'],
          ['Amazon S3', 'akili connect s3 ...', 'new-object', 'Pro+'],
          ['Google Sheets', 'akili connect google-sheets', 'new-row', 'Pro+'],
          ['Webhook', 'akili connect webhook --url ...', 'received', 'Pro+'],
          ['Dropbox', 'akili connect dropbox', 'new-file', 'Pro+'],
        ]}
      />
      <Callout type="tip">Vérifier tes intégrations actives : <code>akili connections --list</code></Callout>
    </Article>
  ),

  equipe: (
    <Article id="equipe" title="Équipe & collaboration"
      lead="Le plan Équipe permet d'inviter des membres, de définir des rôles et de partager un tableau de bord centralisé.">
      <h2>Inviter des membres</h2>
      <Code lang="bash">{`# Inviter par email
akili team:invite alice@pme.bj --role editor
akili team:invite bob@pme.bj --role viewer

# Lister les membres
akili team:list`}</Code>
      <h2>Rôles disponibles</h2>
      <Table
        heads={['Rôle', 'Exécuter', 'Planifier', 'Gérer scripts', 'Gérer équipe']}
        rows={[
          ['owner', '✓', '✓', '✓', '✓'],
          ['admin', '✓', '✓', '✓', '—'],
          ['editor', '✓', '✓', '—', '—'],
          ['viewer', '—', '—', '—', '—'],
        ]}
      />
      <h2>Partager un script</h2>
      <Code lang="bash">{`# Partager avec toute l'équipe
akili script:share mon-script --team

# Partager avec un membre spécifique
akili script:share mon-script --user alice@pme.bj`}</Code>
      <h2>Tableau de bord partagé</h2>
      <p>Depuis l'interface web, le tableau de bord équipe affiche :</p>
      <ul>
        <li>Tous les workflows actifs de l'équipe</li>
        <li>Les journaux d'exécution centralisés (1 an d'historique)</li>
        <li>Les métriques de productivité par membre</li>
        <li>Les alertes et erreurs en temps réel</li>
      </ul>
      <h2>Supprimer un membre</h2>
      <Code lang="bash">{`akili team:remove alice@pme.bj`}</Code>
      <Callout type="warning">La collaboration est disponible uniquement sur le plan <strong>Équipe</strong> (jusqu'à 10 membres).</Callout>
    </Article>
  ),

  cli: (
    <Article id="cli" title="CLI — Référence complète"
      lead="Liste exhaustive de toutes les commandes Akili avec leurs options et exemples.">
      <h2>Commandes globales</h2>
      <Table
        heads={['Commande', 'Description']}
        rows={[
          ['akili --version', 'Affiche la version installée'],
          ['akili --help', 'Affiche l\'aide générale'],
          ['akili login', 'Authentifie le CLI'],
          ['akili logout', 'Déconnecte le CLI'],
          ['akili whoami', 'Affiche le compte connecté'],
          ['akili update', 'Met à jour le CLI'],
        ]}
      />
      <h2>akili list</h2>
      <Code lang="bash">{`akili list [options]

Options :
  --category <cat>    Filtrer par catégorie
  --status <status>   Filtrer par statut (stable, beta)
  --json              Sortie en JSON
  --no-color          Désactiver les couleurs`}</Code>
      <h2>akili run</h2>
      <Code lang="bash">{`akili run <script> [params] [options]

Options :
  --output <dir>      Répertoire de sortie
  --no-open           Ne pas ouvrir le fichier après génération
  --env <env>         Environnement (dev, staging, prod)
  --verbose           Logs détaillés
  --dry-run           Simuler sans exécuter`}</Code>
      <h2>akili plan</h2>
      <Code lang="bash">{`akili plan <script> [params] [options]

Options :
  --cron <expr>         Expression cron
  --every <freq>        Fréquence humaine ("day at 08:00")
  --on <event>          Déclencheur événementiel
  --retry <n>           Nombre de relances (défaut: 0)
  --retry-delay <dur>   Délai entre relances (ex: 5m, 1h)
  --notify-on-failure   Email de notification en cas d'erreur
  --name <nom>          Nom personnalisé du workflow`}</Code>
      <h2>akili logs</h2>
      <Code lang="bash">{`akili logs [options]

Options :
  --last <n>          Dernières N entrées (défaut: 20)
  --script <nom>      Filtrer par script
  --status <status>   Filtrer par statut (success, error)
  --since <date>      Depuis une date (ex: "2026-01-01")
  --export csv        Exporter en CSV
  --export json       Exporter en JSON`}</Code>
      <h2>akili status</h2>
      <Code lang="bash">{`akili status [workflow] [options]

Options :
  --all               Tous les workflows
  --json              Sortie JSON`}</Code>
      <h2>akili connect</h2>
      <Code lang="bash">{`akili connect <integration> [options]
akili connections --list       # Lister les connexions actives
akili connections --remove <i> # Supprimer une connexion`}</Code>
    </Article>
  ),

  api: (
    <Article id="api" title="API REST"
      lead="L'API REST Akili te permet d'intégrer l'exécution de scripts dans tes propres applications et pipelines.">
      <h2>Base URL</h2>
      <Code lang="texte">{`https://api.akili.dev/v1`}</Code>
      <h2>Authentification</h2>
      <p>Toutes les requêtes nécessitent un token Bearer :</p>
      <Code lang="bash">{`Authorization: Bearer <ton-api-key>`}</Code>
      <p>Génère ta clé API :</p>
      <Code lang="bash">{`akili api-key generate
# → ak_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</Code>
      <Callout>Ne stocke jamais ta clé API dans le code source. Utilise des variables d'environnement.</Callout>
      <h2>Exécuter un script</h2>
      <Code lang="bash">{`POST /v1/run

curl -X POST https://api.akili.dev/v1/run \\
  -H "Authorization: Bearer <api-key>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "script": "facture-pdf",
    "params": {
      "client": "Acme Corp",
      "montant": 150000,
      "devise": "FCFA"
    }
  }'

# Réponse
{
  "id": "run_abc123",
  "status": "success",
  "duration_ms": 1402,
  "output": { "file": "facture_acme_corp.pdf" }
}`}</Code>
      <h2>Lister les scripts</h2>
      <Code lang="bash">{`GET /v1/scripts?category=facturation&limit=20

# Réponse
{
  "data": [
    { "id": "facture-pdf", "category": "facturation", "status": "stable" }
  ],
  "total": 12
}`}</Code>
      <h2>Journaux</h2>
      <Code lang="bash">{`GET /v1/logs?limit=10&status=success`}</Code>
      <h2>Référence des endpoints</h2>
      <Table
        heads={['Méthode', 'Endpoint', 'Description']}
        rows={[
          [<span className="method post">POST</span>, '/v1/run', 'Exécuter un script'],
          [<span className="method get">GET</span>, '/v1/scripts', 'Lister les scripts'],
          [<span className="method get">GET</span>, '/v1/scripts/:id', 'Détail d\'un script'],
          [<span className="method get">GET</span>, '/v1/logs', 'Journaux d\'exécution'],
          [<span className="method get">GET</span>, '/v1/logs/:id', 'Détail d\'une exécution'],
          [<span className="method post">POST</span>, '/v1/plan', 'Planifier un script'],
          [<span className="method get">GET</span>, '/v1/plan', 'Lister les workflows'],
          [<span className="method delete">DELETE</span>, '/v1/plan/:id', 'Supprimer un workflow'],
          [<span className="method get">GET</span>, '/v1/status', 'État des workflows actifs'],
        ]}
      />
      <h2>Codes d'erreur</h2>
      <Table
        heads={['Code', 'Signification']}
        rows={[
          ['400', 'Paramètres manquants ou invalides'],
          ['401', 'Token manquant ou expiré'],
          ['403', 'Permissions insuffisantes (plan trop bas)'],
          ['404', 'Script ou ressource introuvable'],
          ['429', 'Rate limit dépassé'],
          ['500', 'Erreur serveur interne'],
        ]}
      />
      <h2>Rate limiting</h2>
      <Table
        heads={['Plan', 'Limite']}
        rows={[
          ['Gratuit', 'API non disponible'],
          ['Pro', '60 requêtes / minute'],
          ['Équipe', '300 requêtes / minute'],
        ]}
      />
    </Article>
  ),

  webhooks: (
    <Article id="webhooks" title="Webhooks"
      lead="Les webhooks permettent à Akili d'envoyer des notifications vers tes systèmes, ou de recevoir des déclencheurs depuis des services externes.">
      <h2>Webhooks sortants</h2>
      <p>Notifie un endpoint externe à chaque exécution de script :</p>
      <Code lang="bash">{`akili connect webhook \\
  --url https://monapp.com/akili-hook \\
  --on success \\
  --on error`}</Code>
      <p>Payload envoyé à ton endpoint :</p>
      <Code lang="json">{`{
  "event": "run.success",
  "timestamp": "2026-05-01T08:00:00Z",
  "run": {
    "id": "run_abc123",
    "script": "facture-pdf",
    "duration_ms": 1402,
    "params": { "client": "Acme Corp" },
    "output": { "file": "facture_acme_corp.pdf" }
  }
}`}</Code>
      <h2>Sécuriser le webhook</h2>
      <p>Akili signe chaque requête avec un secret HMAC-SHA256 :</p>
      <Code lang="bash">{`akili connect webhook \\
  --url https://monapp.com/akili-hook \\
  --secret mon-secret-prive`}</Code>
      <Code lang="javascript">{`// Vérifier la signature côté serveur (Node.js)
import crypto from 'crypto'

function verifierSignature(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')
  return hash === signature
}

// Dans ton handler Express :
app.post('/akili-hook', (req, res) => {
  const sig = req.headers['x-akili-signature']
  if (!verifierSignature(req.body, sig, process.env.AKILI_SECRET)) {
    return res.status(401).json({ error: 'Signature invalide' })
  }
  // Traiter l'événement...
})`}</Code>
      <h2>Webhooks entrants (déclencheurs)</h2>
      <p>Déclenche un script Akili depuis un service externe :</p>
      <Code lang="bash">{`# Créer un endpoint de déclenchement
akili plan mon-script --on webhook:received
# → Endpoint créé : https://hooks.akili.dev/t/tok_xxxxxxxxx`}</Code>
      <Code lang="bash">{`# Tester le déclencheur
curl -X POST https://hooks.akili.dev/t/tok_xxxxxxxxx \\
  -H "Content-Type: application/json" \\
  -d '{"client": "Acme", "montant": 75000}'`}</Code>
      <Callout type="tip">Les webhooks entrants acceptent des paramètres JSON qui sont transmis directement au script déclenché.</Callout>
    </Article>
  ),

  env: (
    <Article id="env" title="Variables d'environnement"
      lead="Gère tes secrets et configurations selon les environnements (dev, staging, prod) sans les exposer dans ton code.">
      <h2>Fichier de configuration local</h2>
      <Code lang="bash">{`# Créer un fichier .akili.env
akili env:init

# Contenu généré : .akili.env
AKILI_API_KEY=ak_live_xxxxx
GOOGLE_DRIVE_TOKEN=xxxxx
SLACK_BOT_TOKEN=xoxb-xxxxx`}</Code>
      <Callout type="warning">Ajoute <code>.akili.env</code> à ton <code>.gitignore</code> immédiatement.</Callout>
      <h2>Définir une variable</h2>
      <Code lang="bash">{`akili env:set MON_SECRET "valeur-secrete"
akili env:set MON_SECRET "valeur-secrete" --env prod`}</Code>
      <h2>Lire et supprimer</h2>
      <Code lang="bash">{`akili env:list                    # Toutes les variables (valeurs masquées)
akili env:get MON_SECRET          # Valeur d'une variable
akili env:delete MON_SECRET       # Supprimer`}</Code>
      <h2>Utiliser dans un script personnalisé</h2>
      <Code lang="javascript">{`export default async function run({ params, env }) {
  const apiKey = env.MON_SECRET  // Injecté automatiquement
  // ...
}`}</Code>
      <h2>Profils d'environnement</h2>
      <Code lang="bash">{`# Exécuter en mode production
akili run mon-script --env prod

# Exécuter en mode développement (défaut)
akili run mon-script --env dev`}</Code>
      <Table
        heads={['Profil', 'Usage']}
        rows={[
          ['dev', 'Développement local, logs verbeux, dry-run possible'],
          ['staging', 'Tests d\'intégration, données de test'],
          ['prod', 'Production, rate limiting strict, alertes actives'],
        ]}
      />
    </Article>
  ),

  exemples: (
    <Article id="exemples" title="Exemples de workflows"
      lead="Des workflows complets et copiables, prêts à adapter à ton activité.">
      <h2>1. Facturation mensuelle automatique</h2>
      <p>Génère et envoie les factures PDF le 1er de chaque mois :</p>
      <Code lang="bash">{`akili plan facture-pdf \\
  --cron "0 8 1 * *" \\
  --client "Acme Corp" \\
  --montant 150000 \\
  --devise FCFA \\
  --output drive:/Factures/2026`}</Code>
      <h2>2. Backup quotidien vers S3</h2>
      <Code lang="bash">{`akili plan backup-drive \\
  --every "day at 00:00" \\
  --source /home/user/projets \\
  --dest s3://mon-bucket/backups \\
  --compress \\
  --notify-on-failure email`}</Code>
      <h2>3. Onboarding client automatisé</h2>
      <Code lang="bash">{`akili plan onboarding-client \\
  --on "gmail:new-email" \\
  --from "nouveaux-clients@pme.bj" \\
  --actions crm,drive-folder,slack-notif,email-bienvenue`}</Code>
      <h2>4. Rapport hebdomadaire par email</h2>
      <Code lang="bash">{`akili plan rapport-hebdo \\
  --every "friday at 17:00" \\
  --source sheets:/Données/Activité \\
  --destinataires equipe@pme.bj,direction@pme.bj`}</Code>
      <h2>5. Traitement automatique de factures reçues</h2>
      <Code lang="bash">{`# Dès qu'une facture arrive dans Drive → extraction + comptabilité
akili plan traitement-facture-entrant \\
  --on "drive:new-file" \\
  --folder "/Factures entrants" \\
  --actions extract-data,export-compta,archive`}</Code>
      <h2>6. Redimensionnement d'images en masse</h2>
      <Code lang="bash">{`akili run compression-images \\
  --source ~/Photos/Produits \\
  --width 800 \\
  --quality 85 \\
  --output ~/Photos/Produits-web \\
  --format webp`}</Code>
      <h2>7. Alerte de dépassement de quota</h2>
      <Code lang="bash">{`akili plan alerte-quota \\
  --every "1h" \\
  --check storage \\
  --threshold 80 \\
  --notify slack:#alerts`}</Code>
    </Article>
  ),

  faq: (
    <Article id="faq" title="FAQ & dépannage"
      lead="Réponses aux questions fréquentes et solutions aux problèmes courants.">
      <h2>Le CLI ne reconnaît pas la commande akili</h2>
      <Code lang="bash">{`# Vérifie que npm global est dans ton PATH
npm config get prefix
# Ajoute le résultat/bin à ton PATH si nécessaire

# Réinstalle si nécessaire
npm uninstall -g @akili/cli && npm install -g @akili/cli`}</Code>
      <h2>Erreur d'authentification (401)</h2>
      <Code lang="bash">{`akili logout && akili login
# Si le problème persiste, régénère ta clé API depuis le tableau de bord`}</Code>
      <h2>Un script échoue silencieusement</h2>
      <Code lang="bash">{`# Relancer en mode verbose
akili run mon-script --verbose

# Consulter les logs détaillés
akili logs --script mon-script --last 1 --verbose`}</Code>
      <h2>L'intégration Google Drive ne fonctionne plus</h2>
      <Code lang="bash">{`# Vérifier le statut de la connexion
akili connections --list

# Reconnecter
akili connections --remove google-drive
akili connect google-drive`}</Code>
      <h2>Comment réinitialiser la configuration ?</h2>
      <Code lang="bash">{`rm -rf ~/.akili
akili login`}</Code>
      <h2>Rate limit atteint (429)</h2>
      <p>Si tu reçois une erreur 429, attends 60 secondes avant de réessayer. Pour augmenter ta limite, passe au plan Équipe.</p>
      <h2>Contacter le support</h2>
      <p>Si ton problème persiste :</p>
      <ul>
        <li>Email : <a href="mailto:support@akili.dev">support@akili.dev</a></li>
        <li>Inclure la sortie de <code>akili logs --last 5 --verbose</code></li>
        <li>Préciser ton système d'exploitation et la version du CLI (<code>akili --version</code>)</li>
      </ul>
    </Article>
  ),

  changelog: (
    <Article id="changelog" title="Changelog"
      lead="Historique des versions du CLI et de l'API Akili.">
      <h2>v1.2.0 — 28 avril 2026</h2>
      <ul>
        <li><strong>Nouveau</strong> — Déclencheurs sur événement Gmail (<code>gmail:new-email</code>)</li>
        <li><strong>Nouveau</strong> — Intégration Google Sheets</li>
        <li><strong>Amélioration</strong> — Vitesse d'exécution des scripts PDF +40%</li>
        <li><strong>Correction</strong> — Plantage sur les noms de fichiers avec caractères spéciaux</li>
      </ul>
      <h2>v1.1.0 — 10 mars 2026</h2>
      <ul>
        <li><strong>Nouveau</strong> — Webhooks entrants (déclencheurs externes)</li>
        <li><strong>Nouveau</strong> — Commande <code>akili env:*</code> pour la gestion des secrets</li>
        <li><strong>Nouveau</strong> — Option <code>--dry-run</code> sur toutes les commandes <code>run</code></li>
        <li><strong>Amélioration</strong> — Messages d'erreur plus clairs avec suggestions de correction</li>
        <li><strong>Correction</strong> — La commande <code>akili status</code> affichait parfois des workflows supprimés</li>
      </ul>
      <h2>v1.0.0 — 15 janvier 2026</h2>
      <ul>
        <li><strong>Nouveau</strong> — Sortie officielle d'Akili CLI</li>
        <li><strong>Nouveau</strong> — Bibliothèque de 50 scripts (facturation, fichiers, emails, rapports, stockage)</li>
        <li><strong>Nouveau</strong> — Planification cron et par fréquence</li>
        <li><strong>Nouveau</strong> — Intégrations : Google Drive, Gmail, Slack, Notion, Amazon S3</li>
        <li><strong>Nouveau</strong> — API REST v1 avec authentification Bearer</li>
        <li><strong>Nouveau</strong> — Gestion d'équipe (plan Équipe, jusqu'à 10 membres)</li>
      </ul>
      <Callout type="tip">Mets à jour le CLI pour bénéficier des dernières fonctionnalités : <code>npm update -g @akili/cli</code></Callout>
    </Article>
  ),
}

/* ── Composant principal ──────────────────────────────── */
export default function Docs() {
  const [active, setActive] = useState('introduction')
  const [query, setQuery] = useState('')

  // Navigation via les boutons Précédent/Suivant
  useState(() => {
    const handler = (e) => setActive(e.detail)
    document.addEventListener('docs-nav', handler)
    return () => document.removeEventListener('docs-nav', handler)
  })

  const groups = [...new Set(SECTIONS.map(s => s.group))]
  const filtered = SECTIONS.filter(s =>
    s.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="akili">
      <Nav />
      <div className="docs-layout">

        {/* SIDEBAR */}
        <aside className="docs-sidebar">
          <div className="docs-sidebar-inner">
            <div className="docs-search-wrap">
              <Search size={14} className="docs-search-icon" />
              <input
                className="docs-search"
                type="text"
                placeholder="Rechercher…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            {query
              ? <nav className="docs-nav">
                  {filtered.map(({ id, label, Icon }) => (
                    <button key={id} className={`docs-nav-item${active === id ? ' active' : ''}`} onClick={() => { setActive(id); setQuery('') }}>
                      <Icon size={15} strokeWidth={1.75} />{label}
                    </button>
                  ))}
                  {filtered.length === 0 && <p className="docs-no-result">Aucun résultat</p>}
                </nav>
              : groups.map(group => (
                  <div key={group} className="docs-nav-group">
                    <div className="docs-nav-group-title">{group}</div>
                    <nav className="docs-nav">
                      {SECTIONS.filter(s => s.group === group).map(({ id, label, Icon }) => (
                        <button key={id} className={`docs-nav-item${active === id ? ' active' : ''}`} onClick={() => setActive(id)}>
                          <Icon size={15} strokeWidth={1.75} />{label}
                        </button>
                      ))}
                    </nav>
                  </div>
                ))
            }

            <div className="docs-sidebar-sep" />
            <div className="docs-sidebar-links">
              <a href="mailto:support@akili.dev">Support</a>
              <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
              <Link to="/pricing">Tarifs</Link>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="docs-content" key={active}>
          {CONTENT[active]}
        </main>
      </div>
      <Footer />
    </div>
  )
}
