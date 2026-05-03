const INTEGRATIONS = [
  { id: 'google-drive', label: 'Google Drive', icon: 'https://cdn.simpleicons.org/googledrive/F8FAFC' },
  { id: 'gmail', label: 'Gmail', icon: 'https://cdn.simpleicons.org/gmail/F8FAFC' },
  { id: 'slack', label: 'Slack', icon: 'https://cdn.simpleicons.org/slack/F8FAFC' },
  { id: 'notion', label: 'Notion', icon: 'https://cdn.simpleicons.org/notion/F8FAFC' },
  { id: 'github', label: 'GitHub', icon: 'https://cdn.simpleicons.org/github/F8FAFC' },
]

export default function StepIntegrations({ next, skip }) {
  return (
    <div className="step-content">
      <h2>Connecte tes outils</h2>
      <p className="step-desc">Optionnel — tu pourras toujours les connecter plus tard.</p>

      <div className="step-integrations-list">
        {INTEGRATIONS.map(int => (
          <div key={int.id} className="step-integration-item">
            <div className="step-integration-left">
              <img src={int.icon} alt="" className="step-integration-icon" />
              <span>{int.label}</span>
            </div>
            <button className="step-integration-btn" disabled>
              Bientôt
            </button>
          </div>
        ))}
      </div>

      <p className="step-hint">Les intégrations seront disponibles dans une prochaine version.</p>

      <div className="step-actions">
        <button className="onboarding-btn-primary" onClick={next}>
          Continuer sans connecter →
        </button>
      </div>
    </div>
  )
}
