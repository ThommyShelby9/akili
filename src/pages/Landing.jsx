import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Landing() {
  const location = useLocation()

  // Compteur animé
  useEffect(() => {
    function animateCounter(el) {
      const target = parseInt(el.dataset.target)
      const duration = 1800
      const start = performance.now()
      ;(function step(now) {
        const p = Math.min((now - start) / duration, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        el.textContent = Math.floor(ease * target).toLocaleString('fr-FR')
        if (p < 1) requestAnimationFrame(step)
        else el.textContent = target.toLocaleString('fr-FR')
      })(start)
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); observer.unobserve(e.target) }
      })
    }, { threshold: 0.5 })
    document.querySelectorAll('.counter-num').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Scroll vers l'ancre lors de la navigation depuis une autre page
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [location.hash])

  return (
    <div className="akili" data-screen-label="Landing">
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
          <div className="hero-blob hero-blob-3"></div>
        </div>
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="headline">
              Tes tâches répétitives,<br />
              <span className="accent">automatisées.</span><br />
              Sans une ligne de code.
            </h1>
            <p className="lede">
              Upload, facturation, déploiements, rapports —
              Akili les exécute en arrière-plan pendant que tu fais ce qui compte vraiment.
            </p>
            <div className="cta-row">
              <Link to="/login" className="btn-primary">Commencer gratuitement <span className="arrow">→</span></Link>
              <button className="btn-ghost" style={{ color: 'rgba(248,250,252,0.7)', borderColor: 'rgba(248,250,252,0.2)' }}>Voir une démo</button>
            </div>
            <div className="trust-strip">
              <div className="trust-label">Ils automatisent avec Akili</div>
              <div className="trust-logos">
                <span className="trust-logo">OrangeBJ</span>
                <span className="trust-logo">Ecobank</span>
                <span className="trust-logo">Jumia BJ</span>
                <span className="trust-logo">MTN Bénin</span>
                <span className="trust-logo">GIZ Afrique</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-terminal">
              <div className="ht-bar">
                <span className="ht-dot r"></span>
                <span className="ht-dot y"></span>
                <span className="ht-dot g"></span>
                <span className="ht-title">akili — terminal</span>
              </div>
              <div className="ht-body">
                <div className="ht-line l1"><span className="ht-prompt">~</span><span className="ht-cmd"> akili run facturation --client=acme --month=avril</span></div>
                <div className="ht-line l2"><span className="ht-info">›</span><span className="ht-dim"> Chargement du template…</span><span className="ht-ok">ok</span></div>
                <div className="ht-line l3"><span className="ht-info">›</span><span className="ht-dim"> Récupération des données (12 lignes)</span><span className="ht-ok">ok</span></div>
                <div className="ht-line l4">
                  <span className="ht-info">›</span><span className="ht-dim"> Génération du PDF</span>
                  <span className="ht-bar-wrap"><span className="ht-progress"></span></span>
                  <span className="ht-ok">100%</span>
                </div>
                <div className="ht-line l5"><span className="ht-info">›</span><span className="ht-dim"> Envoi à acme@client.com</span><span className="ht-ok">ok</span></div>
                <div className="ht-line l6"><span className="ht-info">›</span><span className="ht-dim"> Archivage dans /factures/2026</span><span className="ht-ok">ok</span></div>
                <div className="ht-line l7 ht-success"><span className="ht-check">✓</span><span> Terminé en 1.4s — 0 intervention manuelle</span></div>
                <div className="ht-line l8"><span className="ht-prompt">~</span><span className="ht-cursor"></span></div>
              </div>
              <div className="ht-badge"><span className="ht-badge-dot"></span>En cours d'exécution</div>
            </div>
          </div>
        </div>
        <div className="hero-feats">
          <div className="hero-feats-inner">
            <div className="hero-feat"><span className="hero-feat-dot" style={{ color: '#2563EB' }}>●</span><span className="hero-feat-text">Automatise sans effort</span></div>
            <div className="hero-feat"><span className="hero-feat-dot" style={{ color: '#06B6D4' }}>●</span><span className="hero-feat-text">0 ligne de code requise</span></div>
            <div className="hero-feat"><span className="hero-feat-dot" style={{ color: '#2563EB' }}>●</span><span className="hero-feat-text">Plans personnalisés</span></div>
            <div className="hero-feat"><span className="hero-feat-dot" style={{ color: '#06B6D4' }}>●</span><span className="hero-feat-text">Résultats prouvés</span></div>
            <div className="hero-feat"><span className="hero-feat-dot" style={{ color: '#2563EB' }}>●</span><span className="hero-feat-text">Made in Cotonou</span></div>
          </div>
        </div>
      </section>

      {/* MANIFESTE */}
      <section className="manifesto">
        <div className="manifesto-inner">
          <div className="manifesto-quote-mark">"</div>
          <p className="manifesto-text">
            Les tâches répétitives,<br />
            c'est pour <em>les machines</em>.<br />
            Pas pour toi.
          </p>
          <p className="manifesto-sub">
            Ton cerveau est fait pour créer, décider, construire.
            Pas pour renommer 80 fichiers ou générer la même facture chaque mois.
            Akili s'en charge — sans que tu écrives une seule ligne de code.
          </p>
        </div>
      </section>

      {/* COMPTEUR LIVE */}
      <section className="live-counter">
        <div className="container">
          <div className="counter-grid">
            <div className="counter-item">
              <div className="counter-num" data-target="142847">0</div>
              <div className="counter-lbl">Tâches automatisées ce mois</div>
            </div>
            <div className="counter-sep"></div>
            <div className="counter-item">
              <div className="counter-num" data-target="3621">0</div>
              <div className="counter-lbl">Heures économisées</div>
            </div>
            <div className="counter-sep"></div>
            <div className="counter-item">
              <div className="counter-num" data-target="847">0</div>
              <div className="counter-lbl">Utilisateurs actifs</div>
            </div>
          </div>
        </div>
      </section>

      {/* AVANT / APRÈS */}
      <section className="compare">
        <div className="container">
          <div className="compare-head">
            <div className="eyebrow eyebrow--center">La différence</div>
            <h2 className="section-title">Ce que ça change,<br />concrètement.</h2>
          </div>
          <table className="cmp-table">
            <thead>
              <tr>
                <th className="th-crit">Critère</th>
                <th className="th-before">Sans Akili</th>
                <th className="th-after">Avec Akili</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cmp-crit">Temps passé sur des tâches manuelles</td>
                <td className="cmp-before"><span className="cmp-x">✗</span><br />12h / semaine</td>
                <td className="cmp-after"><span className="cmp-ok">✓</span>Automatique</td>
              </tr>
              <tr>
                <td className="cmp-crit">Organisation des fichiers</td>
                <td className="cmp-before"><span className="cmp-x">✗</span><br />Un par un, à la main</td>
                <td className="cmp-after"><span className="cmp-ok">✓</span>En un clic selon tes règles</td>
              </tr>
              <tr>
                <td className="cmp-crit">Facturation client</td>
                <td className="cmp-before"><span className="cmp-x">✗</span><br />Oubliée ou en retard</td>
                <td className="cmp-after"><span className="cmp-ok">✓</span>Générée et envoyée à date</td>
              </tr>
              <tr>
                <td className="cmp-crit">Déploiements</td>
                <td className="cmp-before"><span className="cmp-x">✗</span><br />Ratés si une étape saute</td>
                <td className="cmp-after"><span className="cmp-ok">✓</span>Scriptés, vérifiés, tracés</td>
              </tr>
              <tr>
                <td className="cmp-crit">Vue d'ensemble des outils</td>
                <td className="cmp-before"><span className="cmp-x">✗</span><br />5 outils, aucune cohérence</td>
                <td className="cmp-after"><span className="cmp-ok">✓</span>Un seul tableau de bord</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="testimonials">
        <div className="container">
          <div className="eyebrow eyebrow--center">Ce qu'ils en disent</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Résultats réels.<br />Pas des promesses.</h2>
          <div className="testi-grid">
            <div className="testi-card">
              <div className="testi-metric">6h</div>
              <div className="testi-metric-lbl">récupérées par semaine</div>
              <blockquote>"Akili gère mes uploads et renommages automatiquement. Je livre plus vite, sans le stress des tâches répétitives."</blockquote>
              <div className="testi-author">
                <div className="testi-av">FK</div>
                <div className="testi-info">
                  <strong>Fatou Koné</strong>
                  <span>Graphiste freelance · Cotonou</span>
                </div>
              </div>
            </div>
            <div className="testi-card testi-featured">
              <div className="testi-metric">12h</div>
              <div className="testi-metric-lbl">économisées par semaine</div>
              <blockquote>"Les factures sont générées et envoyées sans que je touche à quoi que ce soit. C'est exactement ce dont j'avais besoin."</blockquote>
              <div className="testi-author">
                <div className="testi-av">AM</div>
                <div className="testi-info">
                  <strong>Aminata Maïga</strong>
                  <span>Assistante PME · Lomé</span>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="testi-metric">100%</div>
              <div className="testi-metric-lbl">de déploiements réussis</div>
              <blockquote>"Mon pipeline est scripté une fois. Depuis, je n'y pense plus — Akili s'en charge à chaque push."</blockquote>
              <div className="testi-author">
                <div className="testi-av">SK</div>
                <div className="testi-info">
                  <strong>Samuel Koffi</strong>
                  <span>Développeur · Abidjan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TROIS PILIERS */}
      <section className="pillars" id="fonctionnalites">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Ce qui nous différencie</div>
              <h2 className="section-title">Conçu pour ceux<br />qui n'ont pas le temps.</h2>
            </div>
            <p>Akili — du swahili "intelligence, sagesse, savoir-faire" — c'est un outil qui pense pour toi, sans te remplacer.</p>
          </div>
          <div className="pillar-grid">
            <div className="pillar">
              <div className="pillar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>
              <h3>Intelligent</h3>
              <p>Akili comprend ce que tu veux faire. Une commande, un bouton, et la machine s'occupe du reste — sans config exotique.</p>
              <div className="tag">Automatise sans effort</div>
            </div>
            <div className="pillar">
              <div className="pillar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
              </div>
              <h3>Accessible</h3>
              <p>Tu n'as pas besoin de savoir coder. Si tu sais écrire un mot, tu sais utiliser Akili. Le reste, on s'en charge.</p>
              <div className="tag">0 ligne de code requise</div>
            </div>
            <div className="pillar">
              <div className="pillar-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </div>
              <h3>Africain</h3>
              <p>Pensé à Cotonou, pour le monde. Conçu pour les contraintes réelles : connexions changeantes, devices variés, prix juste.</p>
              <div className="tag">Ancré dans la culture</div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="how">
        <div className="container">
          <div className="eyebrow">Comment ça marche</div>
          <h2 className="section-title">Trois étapes.<br />Pas une de plus.</h2>
          <div className="steps">
            <div className="step">
              <div className="step-badge">01</div>
              <h4>Choisis ta tâche</h4>
              <p>Pioche dans la bibliothèque ou décris ce que tu veux faire en français simple.</p>
              <div className="demo">› "envoyer un rapport hebdo"</div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-badge">02</div>
              <h4>Configure une fois</h4>
              <p>Akili te pose les questions utiles. Tu réponds en langage humain. Pas de YAML, pas de regex.</p>
              <div className="demo">tous les vendredis <span className="arr">→</span> équipe@</div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-badge">03</div>
              <h4>Oublie. Akili gère.</h4>
              <p>Akili tourne en arrière-plan et te prévient uniquement si quelque chose mérite ton attention.</p>
              <div className="demo">✓ 142 tâches exécutées ce mois</div>
            </div>
          </div>
        </div>
      </section>

      {/* CAS D'USAGE */}
      <section className="uses" id="usages">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Pour qui</div>
              <h2 className="section-title">Akili parle ta langue.<br />Quel que soit ton métier.</h2>
            </div>
          </div>
          <div className="use-list">
            <div className="use-row">
              <div className="use-body">
                <div className="use-role">Freelance · Design</div>
                <h4>Livraison de fichiers automatisée</h4>
                <p>Renommage, redimensionnement, dépôt sur le drive client et notification Slack — le tout déclenché en un clic. Fini les fins de journée perdues à organiser des exports.</p>
              </div>
              <div className="use-meta">
                <div className="use-metric">6h</div>
                <div className="use-metric-lbl">économisées par semaine</div>
              </div>
            </div>
            <div className="use-row rev">
              <div className="use-body">
                <div className="use-role">Administration · PME</div>
                <h4>Facturation sans intervention manuelle</h4>
                <p>Génération, envoi et relance des factures selon un calendrier défini. Akili gère l'intégralité du cycle de facturation — vous validez, c'est tout.</p>
              </div>
              <div className="use-meta">
                <div className="use-metric">100%</div>
                <div className="use-metric-lbl">des échéances respectées</div>
              </div>
            </div>
            <div className="use-row">
              <div className="use-body">
                <div className="use-role">Développement · Tech</div>
                <h4>Pipelines de déploiement fiabilisés</h4>
                <p>Scriptez une fois, déployez à chaque push. Tests, build, mise en production — chaque étape est exécutée, vérifiée et journalisée sans intervention.</p>
              </div>
              <div className="use-meta">
                <div className="use-metric">0</div>
                <div className="use-metric-lbl">déploiements ratés</div>
              </div>
            </div>
            <div className="use-row rev">
              <div className="use-body">
                <div className="use-role">Finance · Comptabilité</div>
                <h4>Rapprochements bancaires en continu</h4>
                <p>Akili lit les relevés, classe les opérations et signale les anomalies. Vous intervenez uniquement pour valider les exceptions — pas pour traiter chaque ligne.</p>
              </div>
              <div className="use-meta">
                <div className="use-metric">3×</div>
                <div className="use-metric-lbl">plus rapide qu'à la main</div>
              </div>
            </div>
            <div className="use-row">
              <div className="use-body">
                <div className="use-role">Communication · Marketing</div>
                <h4>Publication multicanale planifiée</h4>
                <p>Un contenu, cinq plateformes, zéro copier-coller. Programmez vos publications à l'avance et laissez Akili gérer la diffusion selon vos règles.</p>
              </div>
              <div className="use-meta">
                <div className="use-metric">5×</div>
                <div className="use-metric-lbl">de portée, même effort</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTÉGRATIONS */}
      <section className="integrations" id="integrations">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Écosystème</div>
              <h2 className="section-title">Plug & automate.</h2>
            </div>
            <p>Akili s'intègre nativement avec les outils que tu utilises déjà. Pas besoin de tout migrer.</p>
          </div>
          <div className="eco-grid">
            <div className="eco-cat">
              <div className="eco-cat-title">Stockage & Fichiers</div>
              <div className="eco-tools">
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/googledrive/475569" alt="" />Google Drive</span></div>
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/dropbox/475569" alt="" />Dropbox</span></div>
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/notion/475569" alt="" />Notion</span></div>
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/airtable/475569" alt="" />Airtable</span></div>
                <div className="eco-tool soon"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/microsoftonedrive/94A3B8" alt="" />OneDrive</span></div>
              </div>
            </div>
            <div className="eco-cat">
              <div className="eco-cat-title">Communication</div>
              <div className="eco-tools">
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/slack/475569" alt="" />Slack</span></div>
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/gmail/475569" alt="" />Gmail</span></div>
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/discord/475569" alt="" />Discord</span></div>
                <div className="eco-tool soon"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/whatsapp/94A3B8" alt="" />WhatsApp</span></div>
                <div className="eco-tool soon"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/telegram/94A3B8" alt="" />Telegram</span></div>
              </div>
            </div>
            <div className="eco-cat">
              <div className="eco-cat-title">Finance & Gestion</div>
              <div className="eco-tools">
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/stripe/475569" alt="" />Stripe</span></div>
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/googlesheets/475569" alt="" />Google Sheets</span></div>
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/trello/475569" alt="" />Trello</span></div>
                <div className="eco-tool soon"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/notion/94A3B8" alt="" />Wave</span></div>
                <div className="eco-tool soon"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/quickbooks/94A3B8" alt="" />QuickBooks</span></div>
              </div>
            </div>
            <div className="eco-cat">
              <div className="eco-cat-title">Dev & Automatisation</div>
              <div className="eco-tools">
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/github/475569" alt="" />GitHub</span></div>
                <div className="eco-tool"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/zapier/475569" alt="" />Zapier</span></div>
                <div className="eco-tool soon"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/linear/94A3B8" alt="" />Linear</span></div>
                <div className="eco-tool soon"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/figma/94A3B8" alt="" />Figma</span></div>
                <div className="eco-tool soon"><span className="eco-tool-left"><img className="eco-icon" src="https://cdn.simpleicons.org/webhooks/94A3B8" alt="" />Webhooks</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final" id="cta">
        <div className="container">
          <div className="eyebrow eyebrow--center">Prêt à démarrer ?</div>
          <h2>Récupère <em>6 heures</em><br />par semaine.</h2>
          <p>Rejoins des centaines d'équipes africaines qui travaillent plus intelligemment. Gratuit pour commencer, sans carte bancaire.</p>
          <div className="cta-row cta-row--center">
            <Link to="/login" className="btn-primary">Créer mon compte gratuit <span className="arrow">→</span></Link>
            <Link to="/pricing" className="btn-ghost">Voir les tarifs</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
