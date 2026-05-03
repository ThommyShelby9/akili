import { useState, useEffect } from 'react'
import { Palette, Building2, Code2, Sparkles } from 'lucide-react'
import { api } from '../../../lib/api'
import { useAuth } from '../../auth/AuthContext'

const ROLES = [
  { id: 'freelance', label: 'Freelance', Icon: Palette },
  { id: 'pme', label: 'PME / Équipe', Icon: Building2 },
  { id: 'dev', label: 'Développeur', Icon: Code2 },
  { id: 'other', label: 'Autre', Icon: Sparkles },
]

const SECTORS = [
  'Design & Créatif', 'Tech & Développement', 'Finance & Comptabilité',
  'Marketing & Communication', 'Administration', 'Commerce & Vente', 'Autre',
]

export default function StepProfile({ data, updateData, next }) {
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()

  // Pré-remplir avec le nom de l'inscription
  useEffect(() => {
    const nameFromAuth = user?.user_metadata?.full_name || ''
    if (nameFromAuth && !data.fullName) {
      updateData({ fullName: nameFromAuth })
    }
  }, [user])

  async function handleContinue() {
    if (!data.jobRole) return
    setSaving(true)
    try {
      await api.profile.update({
        full_name: data.fullName,
        job_role: data.jobRole,
        sector: data.sector,
      })
    } catch {
      // Non-bloquant
    }
    setSaving(false)
    next()
  }

  return (
    <div className="step-content">
      <h2>Bienvenue{data.fullName ? `, ${data.fullName}` : ''} !</h2>
      <p className="step-desc">Dis-nous en plus sur toi pour personnaliser ton expérience.</p>

      <div className="step-field">
        <label>Ton rôle</label>
        <div className="step-options-grid">
          {ROLES.map(role => (
            <button
              key={role.id}
              className={`step-option ${data.jobRole === role.id ? 'active' : ''}`}
              onClick={() => updateData({ jobRole: role.id })}
            >
              <role.Icon size={20} className="step-option-icon" />
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
        disabled={!data.jobRole || saving}
      >
        {saving ? 'Enregistrement...' : 'Continuer →'}
      </button>
    </div>
  )
}
