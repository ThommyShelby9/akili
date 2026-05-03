const GOALS = [
  { id: 'facturation', label: 'Facturation', desc: 'Générer et envoyer des factures', icon: '📄' },
  { id: 'fichiers', label: 'Gestion de fichiers', desc: 'Renommer, trier, compresser', icon: '📁' },
  { id: 'emails', label: 'Emails', desc: 'Campagnes et réponses auto', icon: '📧' },
  { id: 'deploiements', label: 'Déploiements', desc: 'Pipelines CI/CD automatisés', icon: '🚀' },
  { id: 'rapports', label: 'Rapports', desc: 'Exports CSV et résumés', icon: '📊' },
  { id: 'stockage', label: 'Sauvegarde', desc: 'Backup et synchronisation', icon: '☁️' },
]

export default function StepGoals({ data, updateData, next }) {
  function toggleGoal(id) {
    const goals = data.goals.includes(id)
      ? data.goals.filter(g => g !== id)
      : [...data.goals, id]
    updateData({ goals })
  }

  return (
    <div className="step-content">
      <h2>Que veux-tu automatiser ?</h2>
      <p className="step-desc">Sélectionne ce qui te parle. On adaptera tes recommandations.</p>

      <div className="step-goals-grid">
        {GOALS.map(goal => (
          <button
            key={goal.id}
            className={`step-goal-card ${data.goals.includes(goal.id) ? 'active' : ''}`}
            onClick={() => toggleGoal(goal.id)}
          >
            <span className="step-goal-icon">{goal.icon}</span>
            <strong>{goal.label}</strong>
            <span className="step-goal-desc">{goal.desc}</span>
            {data.goals.includes(goal.id) && <span className="step-goal-check">✓</span>}
          </button>
        ))}
      </div>

      <button
        className="onboarding-btn-primary"
        onClick={next}
        disabled={data.goals.length === 0}
      >
        Continuer →
      </button>
    </div>
  )
}
