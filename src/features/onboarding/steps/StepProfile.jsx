import { useState } from 'react'
import { api } from '../../../lib/api'

const ROLES = [
  { id: 'freelance', label: 'Freelance', icon: '🎨' },
  { id: 'pme', label: 'PME / Équipe', icon: '🏢' },
  { id: 'dev', label: 'Développeur', icon: '💻' },
  { id: 'other', label: 'Autre', icon: '✨' },
]

const SECTORS = [
  'Design & Créatif', 'Tech & Développement', 'Finance & Comptabilité',
  'Marketing & Communication', 'Administration', 'Commerce & Vente', 'Autre',
]

export default function StepProfile({ data, updateData, next }) {
  const [saving, setSaving] = useState(false)

  async function handleContinue() {
    if (!data.fullName || !data.jobRole) return
    setSaving(true)
    try {
      await api.profile.update({
        full_name: data.fullName,
        job_role: data.jobRole,
        sector: data.sector,
      })
    } catch {
      // Non-bloquant — on continue même si la sauvegarde échoue
    }
    setSaving(false)
    next()
  }

  return (
    <div className="step-content">
      <h2>Qui es-tu ?</h2>
      <p className="step-desc">Aide-nous à personnaliser ton expérience.</p>

      <div className="step-field">
        <label>Ton prénom</label>
        <input
          type="text"
          placeholder="Comment on t'appelle ?"
          value={data.fullName}
          onChange={e => updateData({ fullName: e.target.value })}
        />
      </div>

      <div className="step-field">
        <label>Ton rôle</label>
        <div className="step-options-grid">
          {ROLES.map(role => (
            <button
              key={role.id}
              className={`step-option ${data.jobRole === role.id ? 'active' : ''}`}
              onClick={() => updateData({ jobRole: role.id })}
            >
              <span className="step-option-icon">{role.icon}</span>
              <span>{role.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="step-field">
        <label>Ton secteur</label>
        <select
          value={data.sector}
          onChange={e => updateData({ sector: e.target.value })}
        >
          <option value="">Choisis ton secteur</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <button
        className="onboarding-btn-primary"
        onClick={handleContinue}
        disabled={!data.fullName || !data.jobRole || saving}
      >
        {saving ? 'Enregistrement...' : 'Continuer →'}
      </button>
    </div>
  )
}
