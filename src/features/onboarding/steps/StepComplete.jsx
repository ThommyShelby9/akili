import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

export default function StepComplete({ data, finish }) {
  const [animating, setAnimating] = useState(true)

  useEffect(() => {
    // Marquer l'onboarding comme terminé
    api.profile.update({ onboarding_completed: true }).catch(() => {})

    // Animation de célébration
    const timer = setTimeout(() => setAnimating(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="step-content step-complete">
      <div className={`step-complete-celebration ${animating ? 'animating' : ''}`}>
        <div className="step-complete-icon">🎉</div>
      </div>

      <h2>C'est parti, {data.fullName || 'champion'} !</h2>
      <p className="step-desc">
        Ton compte est configuré. Tu es prêt à automatiser tes tâches et récupérer des heures chaque semaine.
      </p>

      <div className="step-complete-recap">
        <div className="step-complete-recap-title">Récapitulatif</div>
        <div className="step-complete-recap-items">
          <div className="step-complete-recap-item">
            <span className="step-complete-check">✓</span>
            <span>Profil : {data.fullName} — {data.jobRole}</span>
          </div>
          {data.sector && (
            <div className="step-complete-recap-item">
              <span className="step-complete-check">✓</span>
              <span>Secteur : {data.sector}</span>
            </div>
          )}
          {data.goals.length > 0 && (
            <div className="step-complete-recap-item">
              <span className="step-complete-check">✓</span>
              <span>Objectifs : {data.goals.join(', ')}</span>
            </div>
          )}
          <div className="step-complete-recap-item">
            <span className="step-complete-check">✓</span>
            <span>Compte gratuit activé (10 exécutions/jour)</span>
          </div>
        </div>
      </div>

      <button className="onboarding-btn-primary large" onClick={finish}>
        Entrer dans Akili →
      </button>
    </div>
  )
}
