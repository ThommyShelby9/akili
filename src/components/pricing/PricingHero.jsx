import { Link } from 'react-router-dom'

const PRICES = {
  monthly: { pro: '4 900', team: '14 900' },
  yearly:  { pro: '3 300', team: '9 990'  },
}
const PERIODS = {
  monthly: { pro: 'par mois · facturé mensuellement', team: "par mois · jusqu'à 10 membres" },
  yearly:  { pro: 'par mois · facturé annuellement',  team: 'par mois · facturé annuellement' },
}

export default function PricingHero({ billing, setBilling }) {
  const price = PRICES[billing]
  const period = PERIODS[billing]

  return (
    <section className="pricing-hero">
      <div className="container">
        <div className="eyebrow eyebrow--center">Tarifs</div>
        <h1>Commence gratuitement.<br />Évolue quand tu es prêt.</h1>
        <p>Zéro carte bancaire pour démarrer. Des plans simples, sans surprise, en FCFA.</p>

        <div className="billing-toggle">
          <button className={billing === 'monthly' ? 'active' : ''} onClick={() => setBilling('monthly')}>Mensuel</button>
          <button className={billing === 'yearly' ? 'active' : ''} onClick={() => setBilling('yearly')}>
            Annuel <span className="save-badge">−33%</span>
          </button>
        </div>

        <div className="plans-grid">

          {/* Gratuit */}
          <div className="plan-card">
            <div className="plan-name">Gratuit</div>
            <div className="plan-price-wrap">
              <span className="plan-price">0</span>
            </div>
            <div className="plan-period">FCFA · pour toujours</div>
            <div className="plan-desc">Pour découvrir Akili et automatiser tes premières tâches sans aucun engagement.</div>
            <ul className="plan-features">
              <li><span className="ck">✓</span> 5 automatisations par mois</li>
              <li><span className="ck">✓</span> Bibliothèque de scripts de base</li>
              <li><span className="ck">✓</span> CLI inclus</li>
              <li><span className="ck">✓</span> Journaux d'exécution (7 jours)</li>
              <li><span className="ck">✓</span> Support communauté</li>
              <li className="off"><span className="dk">—</span> Planification automatique</li>
              <li className="off"><span className="dk">—</span> Intégrations avancées</li>
              <li className="off"><span className="dk">—</span> Notifications webhook</li>
            </ul>
            <Link to="/login" className="plan-cta plan-cta-ghost">Commencer gratuitement</Link>
          </div>

          {/* Pro */}
          <div className="plan-card featured">
            <div className="plan-popular">Le plus populaire</div>
            <div className="plan-name">Pro</div>
            <div className="plan-price-wrap">
              <span className="plan-currency">FCFA</span><span className="plan-price">{price.pro}</span>
            </div>
            <div className="plan-period">{period.pro}</div>
            <div className="plan-desc">Pour les freelances et indépendants qui veulent aller vite et automatiser sans limites.</div>
            <ul className="plan-features">
              <li><span className="ck">✓</span> Automatisations illimitées</li>
              <li><span className="ck">✓</span> Bibliothèque complète + scripts perso</li>
              <li><span className="ck">✓</span> Planification (cron, déclencheurs)</li>
              <li><span className="ck">✓</span> Intégrations : Drive, S3, Gmail, Notion…</li>
              <li><span className="ck">✓</span> Notifications email & webhook</li>
              <li><span className="ck">✓</span> Journaux d'exécution (90 jours)</li>
              <li><span className="ck">✓</span> API d'accès</li>
              <li><span className="ck">✓</span> Support prioritaire</li>
            </ul>
            <Link to="/login" className="plan-cta plan-cta-solid">Essai 14 jours gratuit →</Link>
          </div>

          {/* Équipe */}
          <div className="plan-card">
            <div className="plan-name">Équipe</div>
            <div className="plan-price-wrap">
              <span className="plan-currency">FCFA</span><span className="plan-price">{price.team}</span>
            </div>
            <div className="plan-period">{period.team}</div>
            <div className="plan-desc">Pour les PME et équipes qui automatisent à grande échelle avec contrôle total.</div>
            <ul className="plan-features">
              <li><span className="ck">✓</span> Tout le plan Pro</li>
              <li><span className="ck">✓</span> Jusqu'à 10 membres</li>
              <li><span className="ck">✓</span> Tableau de bord équipe centralisé</li>
              <li><span className="ck">✓</span> Logs & audit complets (1 an)</li>
              <li><span className="ck">✓</span> API dédiée + webhooks avancés</li>
              <li><span className="ck">✓</span> Rôles & permissions</li>
              <li><span className="ck">✓</span> Onboarding guidé</li>
              <li><span className="ck">✓</span> Support dédié (SLA 24h)</li>
            </ul>
            <Link to="/login" className="plan-cta plan-cta-ghost">Contacter l'équipe</Link>
          </div>

        </div>
      </div>
    </section>
  )
}
