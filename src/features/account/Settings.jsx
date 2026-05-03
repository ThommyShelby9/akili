import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Shield, Bell, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import { useAuth } from '../auth/AuthContext'

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [prefs, setPrefs] = useState({ email_on_success: true, email_on_error: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    api.profile.get()
      .then(res => {
        setProfile(res.data)
        // Charger les préférences notifications
        return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/notifications/preferences`, {
          headers: { 'Authorization': `Bearer ${user?.access_token}` }
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.profile.update({
        full_name: profile.full_name,
        job_role: profile.job_role,
        sector: profile.sector,
      })
      setSuccess('Profil mis à jour')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    try {
      await api.profile.delete()
      await logout()
      navigate('/')
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="dash-page">
        <h1>Paramètres</h1>
        <div className="settings-skeleton">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton-line w100"></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Paramètres</h1>
      </div>

      {success && <div className="settings-toast success">{success}</div>}
      {error && <div className="settings-toast error">{error}</div>}

      {/* Section Profil */}
      <section className="settings-section">
        <div className="settings-section-header">
          <User size={18} />
          <h3>Profil</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="settings-form">
          <div className="settings-field">
            <label>Nom complet</label>
            <input
              type="text"
              value={profile?.full_name || ''}
              onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
            />
          </div>

          <div className="settings-field">
            <label>Email</label>
            <input type="email" value={user?.email || ''} disabled />
            <span className="settings-hint">L'email ne peut pas être modifié</span>
          </div>

          <div className="settings-field">
            <label>Rôle</label>
            <select
              value={profile?.job_role || ''}
              onChange={e => setProfile(p => ({ ...p, job_role: e.target.value }))}
            >
              <option value="">Non défini</option>
              <option value="freelance">Freelance</option>
              <option value="pme">PME / Équipe</option>
              <option value="dev">Développeur</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="settings-field">
            <label>Secteur</label>
            <input
              type="text"
              value={profile?.sector || ''}
              onChange={e => setProfile(p => ({ ...p, sector: e.target.value }))}
              placeholder="Ex: Design & Créatif"
            />
          </div>

          <button className="settings-save" type="submit" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </section>

      {/* Section Plan */}
      <section className="settings-section">
        <div className="settings-section-header">
          <Shield size={18} />
          <h3>Plan & Quota</h3>
        </div>

        <div className="settings-plan-info">
          <div className="settings-plan-badge">
            {profile?.plan === 'pro' ? 'Pro' : 'Gratuit'}
          </div>
          <div className="settings-quota">
            <div className="settings-quota-bar">
              <div
                className="settings-quota-fill"
                style={{ width: `${Math.min(100, ((profile?.quota_used || 0) / (profile?.quota_limit || 10)) * 100)}%` }}
              ></div>
            </div>
            <span>{profile?.quota_used || 0} / {profile?.quota_limit || 10} exécutions aujourd'hui</span>
          </div>
          {profile?.plan !== 'pro' && (
            <Link to="/pricing" className="settings-upgrade">Upgrader vers Pro →</Link>
          )}
        </div>
      </section>

      {/* Section Notifications */}
      <section className="settings-section">
        <div className="settings-section-header">
          <Bell size={18} />
          <h3>Notifications email</h3>
        </div>

        <div className="settings-notif-list">
          <label className="settings-notif-item">
            <span>Email quand un script réussit</span>
            <input
              type="checkbox"
              checked={prefs.email_on_success}
              onChange={e => setPrefs(p => ({ ...p, email_on_success: e.target.checked }))}
            />
          </label>
          <label className="settings-notif-item">
            <span>Email quand un script échoue</span>
            <input
              type="checkbox"
              checked={prefs.email_on_error}
              onChange={e => setPrefs(p => ({ ...p, email_on_error: e.target.checked }))}
            />
          </label>
        </div>
      </section>

      {/* Section Danger */}
      <section className="settings-section danger">
        <div className="settings-section-header">
          <Trash2 size={18} />
          <h3>Zone de danger</h3>
        </div>

        {!showDelete ? (
          <button className="settings-delete-btn" onClick={() => setShowDelete(true)}>
            Supprimer mon compte
          </button>
        ) : (
          <div className="settings-delete-confirm">
            <p>Cette action est irréversible. Toutes tes données seront supprimées.</p>
            <div className="settings-delete-actions">
              <button className="settings-delete-cancel" onClick={() => setShowDelete(false)}>Annuler</button>
              <button className="settings-delete-final" onClick={handleDeleteAccount}>Confirmer la suppression</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
