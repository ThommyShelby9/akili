import { Link } from 'react-router-dom'

export default function PricingCta() {
  return (
    <section className="cta-final">
      <div className="container">
        <div className="eyebrow eyebrow--center">Prêt à démarrer ?</div>
        <h2>Ton premier mois de Pro,<br /><em>offert.</em></h2>
        <p>Crée ton compte en 30 secondes. Zéro carte bancaire.</p>
        <div className="cta-row cta-row--center">
          <Link to="/login" className="btn-primary">Créer mon compte gratuit <span className="arrow">→</span></Link>
          <Link to="/services" className="btn-ghost">Voir les services</Link>
        </div>
      </div>
    </section>
  )
}
