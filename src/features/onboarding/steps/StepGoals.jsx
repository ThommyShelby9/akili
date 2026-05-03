import { Receipt, FolderOpen, Mail, Rocket, BarChart2, Cloud } from 'lucide-react'

const GOALS = [
  { id: 'facturation', label: 'Facturation', desc: 'Générer et envoyer des factures', Icon: Receipt },
  { id: 'fichiers', label: 'Gestion de fichiers', desc: 'Renommer, trier, compresser', Icon: FolderOpen },
  { id: 'emails', label: 'Emails', desc: 'Campagnes et réponses auto', Icon: Mail },
  { id: 'deploiements', label: 'Déploiements', desc: 'Pipelines CI/CD automatisés', Icon: Rocket },
  { id: 'rapports', label: 'Rapports', desc: 'Exports CSV et résumés', Icon: BarChart2 },
  { id: 'stockage', label: 'Sauvegarde', desc: 'Backup et synchronisation', Icon: Cloud },
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
            <goal.Icon size={24} className="step-goal-icon" />
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
