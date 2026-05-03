import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import {
  Search, Workflow, BrainCircuit, GitMerge,
  TrendingUp, Code2, Cloud, BarChart2, GraduationCap,
  Target, Rocket, Settings, Users,
} from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import RevealOnScroll from '../components/RevealOnScroll'

const SERVICES = [
  {
    Icon: Search,
    num: '01',
    title: 'Analyse & conseil',
    slug: 'conseil',
    pitch: 'Avant d\'automatiser, on comprend.',
    desc: 'Nous auditons tes processus existants pour identifier précisément ce qui mérite d\'être automatisé — et ce qui ne l\'est pas encore.',
    bullets: [
      'Audit des processus RH, finance, marketing',
      'Cartographie des tâches répétitives à fort impact',
      'Élaboration d\'une stratégie de transformation digitale',
      'Priorisation par ROI estimé',
    ],
    cta: 'Savoir quoi automatiser et comment le faire efficacement.',
  },
  {
    Icon: Workflow,
    num: '02',
    title: 'Automatisation des processus métier',
    slug: 'bpa',
    pitch: 'Tes robots travaillent. Toi, tu décides.',
    desc: 'On remplace les tâches manuelles et répétitives par des workflows automatisés — de la saisie de données à la validation interne.',
    bullets: [
      'Automatisation administrative (facturation, saisie…)',
      'Robots logiciels RPA sur mesure',
      'Workflows de validation et d\'approbation',
      'Traitement automatique des factures et onboarding client',
    ],
    cta: 'Zéro saisie manuelle. Zéro oubli.',
  },
  {
    Icon: BrainCircuit,
    num: '03',
    title: 'Automatisation intelligente',
    slug: 'ia',
    pitch: 'L\'IA au service de tes opérations.',
    desc: 'Pour les tâches complexes, on combine intelligence artificielle et automatisation — analyse de documents, chatbots, décision assistée.',
    bullets: [
      'Intégration de chatbots et NLP',
      'Analyse automatique de PDF et emails',
      'Machine learning pour la prise de décision',
      'Extraction et structuration de données non-structurées',
    ],
    cta: 'Gérer l\'exception, pas seulement la règle.',
  },
  {
    Icon: GitMerge,
    num: '04',
    title: 'Intégration de systèmes',
    slug: 'integration',
    pitch: 'Tous tes outils, enfin connectés.',
    desc: 'On synchronise tes logiciels entre eux pour que les données circulent automatiquement — sans copier-coller, sans ressaisie.',
    bullets: [
      'Connexion CRM, ERP et outils SaaS via API',
      'Synchronisation des données multi-plateformes',
      'Automatisation entre CRM, marketing et support',
      'Connecteurs Drive, Gmail, Notion, Slack, S3…',
    ],
    cta: 'Un écosystème qui se parle tout seul.',
  },
  {
    Icon: TrendingUp,
    num: '05',
    title: 'Automatisation des ventes & marketing',
    slug: 'marketing',
    pitch: 'Un pipeline de vente en pilote automatique.',
    desc: 'Génère des leads, nourris tes prospects et relance tes clients sans lever le petit doigt.',
    bullets: [
      'Génération de leads automatisée',
      'Campagnes email et séquences de nurturing',
      'Suivi client et relances automatiques',
      'Scoring et qualification de leads',
    ],
    cta: 'Vendre plus en travaillant moins.',
  },
  {
    Icon: Code2,
    num: '06',
    title: 'Solutions sur mesure',
    slug: 'custom',
    pitch: 'Quand le standard ne suffit pas.',
    desc: 'Ton métier est unique. Tes automatisations aussi. On développe des outils adaptés à ton secteur et à tes contraintes spécifiques.',
    bullets: [
      'Workflows 100% personnalisés',
      'Développement d\'outils internes spécifiques',
      'Adapté à la santé, la finance, la logistique…',
      'Intégration dans ton infrastructure existante',
    ],
    cta: 'Une solution qui colle à ta réalité.',
  },
  {
    Icon: Cloud,
    num: '07',
    title: 'Automation as a Service',
    slug: 'aaas',
    pitch: 'On gère tout. Tu profites des résultats.',
    desc: 'Pas d\'équipe interne ? Pas de problème. On prend en charge la conception, le déploiement et la maintenance de tes automatisations.',
    bullets: [
      'Gestion complète par notre équipe',
      'Maintenance, monitoring et amélioration continue',
      'Abonnement mensuel prévisible',
      'SLA garanti et support réactif',
    ],
    cta: 'Conception + déploiement + support. Tout compris.',
  },
  {
    Icon: BarChart2,
    num: '08',
    title: 'Suivi & optimisation',
    slug: 'reporting',
    pitch: 'Ce qui se mesure s\'améliore.',
    desc: 'Des tableaux de bord clairs pour suivre tes automatisations, mesurer leur impact et les optimiser en continu.',
    bullets: [
      'Analyse des performances en temps réel',
      'Optimisation continue des processus',
      'KPIs personnalisés (ROI, temps gagné, coût évité)',
      'Rapports mensuels et recommandations',
    ],
    cta: 'Chaque automatisation justifie son existence.',
  },
  {
    Icon: GraduationCap,
    num: '09',
    title: 'Formation & accompagnement',
    slug: 'formation',
    pitch: 'Tes équipes maîtrisent les outils.',
    desc: 'On ne livre pas juste une solution — on s\'assure que tes équipes savent s\'en servir et en tirer le maximum.',
    bullets: [
      'Formation aux outils et workflows automatisés',
      'Support technique dédié',
      'Conduite du changement et adoption interne',
      'Documentation et guides sur mesure',
    ],
    cta: 'L\'autonomie, pas la dépendance.',
  },
]

const PILLARS = [
  { Icon: Target,    label: 'Audit & stratégie' },
  { Icon: Settings,  label: 'Déploiement' },
  { Icon: BarChart2, label: 'Optimisation' },
  { Icon: Rocket,    label: 'Autonomie' },
]

export default function Services() {
  return (
    <div className="akili">
      <Seo title="Services" description="De l'audit au déploiement. Automatisation des processus, IA, intégration de systèmes — accompagnement complet pour votre entreprise." />
      <Nav />

      {/* HERO */}
      <section className="feat-hero">
        <div className="container">
          <div className="eyebrow eyebrow--center">Services</div>
          <h1>De l'audit au déploiement.<br /><span className="c-cyan">On s'occupe de tout.</span></h1>
          <p>Akili ne vend pas seulement des outils — nous proposons un accompagnement complet pour rendre ton entreprise plus rapide, plus efficace et scalable.</p>
          <div className="cta-row cta-row--center">
            <Link to="/login" className="btn-primary">Démarrer maintenant <span className="arrow">→</span></Link>
            <Link to="/pricing" className="btn-ghost">Voir les tarifs</Link>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <div className="stats-band">
        <div className="container">
          <div className="stats-band-inner">
            <div className="stat"><div className="num">9</div><div className="lbl">services spécialisés</div></div>
            <div className="stat"><div className="num">12h</div><div className="lbl">économisées / semaine</div></div>
            <div className="stat"><div className="num">−70%</div><div className="lbl">de tâches manuelles</div></div>
            <div className="stat"><div className="num">3×</div><div className="lbl">plus de productivité</div></div>
          </div>
        </div>
      </div>

      {/* SERVICES GRID */}
      <section className="services-section">
        <div className="container">
          <div className="eyebrow eyebrow--center">Ce qu'on fait</div>
          <h2 className="section-title">Une offre complète,<br />de bout en bout.</h2>
          <div className="services-grid">
            {SERVICES.map(({ Icon, num, slug, title, pitch, desc, bullets, cta }, i) => (
              <RevealOnScroll key={slug} delay={(i % 3) * 100}>
                <div className="service-card">
                  <div className="service-card-top">
                    <div className="service-icon-wrap">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <span className="service-num">{num}</span>
                  </div>
                  <h3 className="service-title">{title}</h3>
                  <p className="service-pitch">{pitch}</p>
                  <p className="service-desc">{desc}</p>
                  <ul className="service-bullets">
                    {bullets.map((b, j) => (
                      <li key={j}><span className="ck">✓</span> {b}</li>
                    ))}
                  </ul>
                  <div className="service-cta-line">{cta}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHT — BPA */}
      <section className="feat-block" id="bpa">
        <div className="container">
          <div className="feat-inner">
            <div className="feat-content">
              <div className="step-tag">02 · BPA / RPA</div>
              <h2>Tes processus tournent.<br /><em>Sans toi.</em></h2>
              <p>On configure des robots logiciels qui exécutent tes tâches répétitives 24h/24 — validation de documents, onboarding client, traitement de factures — avec une précision que l'humain ne peut pas tenir.</p>
              <ul className="feat-bullets">
                <li>Traitement automatique des factures entrantes</li>
                <li>Onboarding client de A à Z sans intervention</li>
                <li>Validation et approbation de workflows internes</li>
                <li>Synchronisation automatique entre services</li>
              </ul>
            </div>
            <div className="feat-visual">
              <div className="terminal">
                <div className="term-bar">
                  <span className="dot r"></span><span className="dot y"></span><span className="dot g"></span>
                  <span className="title">akili — workflow RPA</span>
                </div>
                <div className="term-body">
                  <div className="term-line l1"><span className="prompt">akili ›</span><span className="cmd">run onboarding-client --email client@pme.bj</span></div>
                  <div className="term-line l2"><span className="arr">↳</span><span className="dim"> Création compte CRM</span><span className="ok">✓</span></div>
                  <div className="term-line l3"><span className="arr">↳</span><span className="dim"> Email de bienvenue envoyé</span><span className="ok">✓</span></div>
                  <div className="term-line l4"><span className="arr">↳</span><span className="dim"> Dossier Drive créé</span><span className="ok">✓</span></div>
                  <div className="term-line l5"><span className="arr">↳</span><span className="dim"> Notification équipe Slack</span><span className="ok">✓</span></div>
                  <div className="term-line l6"><span className="ok">✓ Onboarding terminé en 3.2s</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHT — AaaS */}
      <section className="feat-block" id="aaas">
        <div className="container">
          <div className="feat-inner rev">
            <div className="feat-content">
              <div className="step-tag">07 · AaaS</div>
              <h2>Pas d'équipe interne ?<br /><em>On est la tienne.</em></h2>
              <p>Automation as a Service : on prend en charge la conception, le déploiement, la maintenance et l'optimisation de tes automatisations. Tu profites des résultats sans gérer la technique.</p>
              <ul className="feat-bullets">
                <li>Audit initial et roadmap d'automatisation</li>
                <li>Développement et mise en production</li>
                <li>Monitoring 24/7 et relance automatique</li>
                <li>Rapport mensuel de performance et ROI</li>
                <li>Support prioritaire avec SLA garanti</li>
              </ul>
              <Link to="/pricing" className="btn-ghost" style={{ marginTop: 'var(--s-6)', display: 'inline-flex' }}>Voir les plans →</Link>
            </div>
            <div className="feat-visual">
              <div className="terminal">
                <div className="term-bar">
                  <span className="dot r"></span><span className="dot y"></span><span className="dot g"></span>
                  <span className="title">akili — monitoring AaaS</span>
                </div>
                <div className="term-body">
                  <div className="term-line l1"><span className="prompt">akili ›</span><span className="cmd">status --all</span></div>
                  <div className="term-line l2"><span className="ok">✓</span><span className="dim"> facture-auto     </span><span className="arr">actif</span></div>
                  <div className="term-line l3"><span className="ok">✓</span><span className="dim"> lead-scoring     </span><span className="arr">actif</span></div>
                  <div className="term-line l4"><span className="ok">✓</span><span className="dim"> backup-quotidien </span><span className="arr">actif</span></div>
                  <div className="term-line l5"><span className="ok">✓</span><span className="dim"> rapport-hebdo    </span><span className="arr">actif</span></div>
                  <div className="term-line l6"><span className="dim"> 4/4 workflows opérationnels · uptime </span><span className="ok">99.9%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RÉSUMÉ */}
      <section className="summary-section">
        <div className="container">
          <div className="eyebrow eyebrow--center">En résumé</div>
          <h2 className="section-title">Plus rapide. Plus efficace.<br />Scalable.</h2>
          <p className="summary-sub">
            Akili ne se limite pas aux outils — nous proposons un accompagnement complet pour automatiser tes opérations de bout en bout, réduire tes coûts et libérer ton équipe des tâches sans valeur ajoutée.
          </p>
          <div className="summary-pillars">
            {PILLARS.map(({ Icon, label }, i) => (
              <>
                <div className="pillar" key={label}>
                  <div className="pillar-icon"><Icon size={22} strokeWidth={1.5} /></div>
                  <div className="pillar-label">{label}</div>
                </div>
                {i < PILLARS.length - 1 && <div className="pillar-arrow" key={`arrow-${i}`}>→</div>}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <div className="container">
          <div className="eyebrow eyebrow--center">Prêt à déléguer ?</div>
          <h2>Dis-nous ce que tu fais à la main.<br /><em>On s'en occupe.</em></h2>
          <p>Premier audit offert. Sans engagement.</p>
          <div className="cta-row cta-row--center">
            <Link to="/login" className="btn-primary">Commencer gratuitement <span className="arrow">→</span></Link>
            <Link to="/pricing" className="btn-ghost">Voir les tarifs</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
