import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'

const GOAL_TO_SCRIPT = {
  facturation: 'facture-pdf',
  fichiers: 'renommage-lot',
  emails: 'email-campagne',
  deploiements: 'backup-drive',
  rapports: 'rapport-csv',
  stockage: 'backup-drive',
}

export default function StepFirstScript({ data, next }) {
  const [script, setScript] = useState(null)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Déterminer le script recommandé
  const recommendedSlug = GOAL_TO_SCRIPT[data.goals[0]] || 'facture-pdf'

  useEffect(() => {
    api.scripts.get(recommendedSlug)
      .then(res => setScript(res.data))
      .catch(() => {})
  }, [recommendedSlug])

  async function handleRun() {
    setRunning(true)
    setError('')
    try {
      // Paramètres démo pré-remplis
      const demoParams = {
        'facture-pdf': { client: data.fullName || 'Acme Corp', montant: 75000, devise: 'FCFA' },
        'renommage-lot': { dossier: '~/Documents', pattern: '{date}_{n}' },
        'email-campagne': { sujet: 'Test Akili', template: 'Bonjour {nom}!', liste: 'contacts.csv' },
        'rapport-csv': { periode: 'mai-2026' },
        'backup-drive': { source: '~/Projets', destination: '/Backups/2026' },
      }

      const res = await api.scripts.run(recommendedSlug, demoParams[recommendedSlug] || {})
      setResult(res.data)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'exécution')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="step-content">
      <h2>Ton premier script</h2>
      <p className="step-desc">
        Basé sur tes objectifs, on te recommande <strong>{script?.name || 'un script'}</strong>.
        Essaie-le maintenant !
      </p>

      {script && (
        <div className="step-script-card">
          <div className="step-script-header">
            <strong>{script.name}</strong>
            <span className="step-script-cat">{script.category}</span>
          </div>
          <p>{script.description}</p>

          {!result && !error && (
            <button
              className="onboarding-btn-primary"
              onClick={handleRun}
              disabled={running}
            >
              {running ? (
                <>
                  <span className="onboarding-spinner"></span>
                  Exécution en cours...
                </>
              ) : (
                'Lancer le script →'
              )}
            </button>
          )}

          {result && (
            <div className="step-script-result success">
              <span className="step-script-result-icon">✓</span>
              <div>
                <strong>Succès !</strong>
                <p>Durée : {result.duration_ms}ms</p>
              </div>
            </div>
          )}

          {error && (
            <div className="step-script-result error">
              <span className="step-script-result-icon">✗</span>
              <div>
                <strong>Erreur</strong>
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {(result || error) && (
        <button className="onboarding-btn-primary" onClick={next}>
          Continuer →
        </button>
      )}

      {!result && !error && !running && (
        <button className="onboarding-btn-skip" onClick={next}>
          Passer et aller au dashboard
        </button>
      )}
    </div>
  )
}
