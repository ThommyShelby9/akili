import { Check, Minus } from 'lucide-react'

const PLANS = [
  {
    name: 'Gratuit',
    description: 'Pour découvrir Akili',
    features: [
      { text: '5 automatisations / mois', included: true },
      { text: 'Scripts de base (fichiers, PDF)', included: true },
      { text: 'Historique 7 jours', included: true },
      { text: 'Support communauté', included: true },
      { text: '1 membre', included: true },
      { text: 'Planification cron', included: false },
      { text: 'Intégrations avancées', included: false },
      { text: 'Notifications email', included: false },
    ],
  },
  {
    name: 'Pro',
    featured: true,
    description: 'Pour les indépendants et pros',
    features: [
      { text: 'Automatisations illimitées', included: true },
      { text: 'Tous les scripts + personnalisés', included: true },
      { text: 'Planification cron & triggers', included: true },
      { text: 'Google Drive, Gmail, Slack, Notion', included: true },
      { text: 'API REST & webhooks', included: true },
      { text: 'Historique 90 jours', included: true },
      { text: 'Notifications email', included: true },
      { text: 'Support prioritaire', included: true },
      { text: 'Export CSV / JSON', included: true },
    ],
  },
  {
    name: 'Équipe',
    description: 'Pour les PME et équipes',
    features: [
      { text: 'Tout ce qui est dans Pro', included: true },
      { text: "Jusqu'à 10 membres", included: true },
      { text: 'Rôles & permissions', included: true },
      { text: 'Tableau de bord partagé', included: true },
      { text: 'Audit centralisé', included: true },
      { text: 'Historique 1 an', included: true },
      { text: 'Support dédié SLA 24h', included: true },
      { text: 'Onboarding guidé', included: true },
    ],
  },
]

export default function PricingCompare() {
  return (
    <section className="compare-section">
      <div className="container">
        <div className="eyebrow eyebrow--center">Comparatif</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Tout ce qui est inclus.</h2>

        <div className="compare-cards">
          {PLANS.map(plan => (
            <div key={plan.name} className={`compare-card ${plan.featured ? 'featured' : ''}`}>
              <div className="compare-card-header">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>
              <ul className="compare-card-list">
                {plan.features.map((feat, i) => (
                  <li key={i} className={feat.included ? 'included' : 'excluded'}>
                    {feat.included
                      ? <Check size={15} className="compare-check" />
                      : <Minus size={15} className="compare-minus" />
                    }
                    <span>{feat.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
